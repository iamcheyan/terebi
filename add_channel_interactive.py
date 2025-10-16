#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional, Tuple
import urllib.parse
import urllib.request
from io import BytesIO

try:
    from PIL import Image  # 头像缩放（可选）
except Exception:
    Image = None


PROJECT_ROOT = Path(__file__).resolve().parent
CHANNELS_FILE = PROJECT_ROOT / "japan_tv_youtube_channels.json"
CONFIG_FILE = PROJECT_ROOT / "WEB-INF" / "config.properties"
DATA_DIR = PROJECT_ROOT / "data"
IMG_DIR = PROJECT_ROOT / "img"
IMG_RESIZED_DIR = PROJECT_ROOT / "img" / "resized"


def normalize_url(url: str) -> str:
    url = (url or "").strip()
    if not url:
        return url
    if not url.startswith("http"):
        url = "https://" + url
    return url


def extract_handle_or_id(url: str) -> str:
    try:
        m = re.search(r"youtube\.com/(?:@|channel/|user/|c/)([^/?#]+)", url)
        if m:
            ident = m.group(1)
            return urllib.parse.unquote(ident)
        return url.rstrip("/").split("/")[-1]
    except Exception:
        return url


def ensure_category(channels_data: dict, category: str, subcategory: str) -> None:
    if category not in channels_data:
        channels_data[category] = {}
    if subcategory not in channels_data[category]:
        channels_data[category][subcategory] = []


def upsert_channel(url: str, name: str, category: str, subcategory: str) -> bool:
    if not CHANNELS_FILE.exists():
        print(f"❌ 未找到配置文件: {CHANNELS_FILE}")
        return False

    with open(CHANNELS_FILE, "r", encoding="utf-8") as f:
        channels_data = json.load(f)

    # 覆盖匹配URL的既有记录
    replaced = False
    for group in channels_data.values():
        if not isinstance(group, dict):
            continue
        for lst in group.values():
            if not isinstance(lst, list):
                continue
            for ch in lst:
                if ch.get("url") == url:
                    ch["name"] = name
                    ch["cached"] = False
                    replaced = True
                    break
            if replaced:
                break
        if replaced:
            break

    ensure_category(channels_data, category, subcategory)

    if not replaced:
        record = {"name": name, "url": url, "cached": False}
        channels_data[category][subcategory].append(record)

    with open(CHANNELS_FILE, "w", encoding="utf-8") as f:
        json.dump(channels_data, f, ensure_ascii=False, indent=4)

    if replaced:
        print(f"✅ 已覆盖频道: 名称='{name}', URL='{url}'（保持原位置）")
    else:
        print(f"✅ 已添加频道: 名称='{name}', URL='{url}', 分类='{category}', 子分类='{subcategory}'")
    return True


# ========================== 单频道抓取（无需依赖其他脚本） ==========================

def load_api_keys() -> List[str]:
    keys: List[str] = []
    if not CONFIG_FILE.exists():
        return keys
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if line.startswith("youtube.apikey"):
                    parts = line.split("=", 1)
                    if len(parts) == 2:
                        val = parts[1].strip()
                        if val:
                            keys.append(val)
    except Exception:
        pass
    return keys


def http_get_json(url: str, params: dict) -> Optional[dict]:
    full = url + "?" + urllib.parse.urlencode(params)
    req = urllib.request.Request(full, headers={"User-Agent": "Mozilla/5.0 (compatible; TerebiBot/1.0)"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = resp.read()
        return json.loads(data.decode("utf-8"))


def resolve_channel_id(url: str, api_key: str) -> Tuple[Optional[str], Optional[str]]:
    # 直接包含 UC 开头
    m = re.search(r"youtube\.com/channel/(UC[\w-]{20,})", url)
    if m:
        channel_id = m.group(1)
        ch = http_get_json("https://www.googleapis.com/youtube/v3/channels", {"part": "snippet", "id": channel_id, "key": api_key})
        title = None
        try:
            title = ch.get("items", [])[0]["snippet"]["title"]
        except Exception:
            title = None
        return channel_id, title

    # 通过 handle / user / c 搜索
    identifier = extract_handle_or_id(url)
    sr = http_get_json("https://www.googleapis.com/youtube/v3/search", {"part": "snippet", "q": identifier, "type": "channel", "maxResults": 5, "key": api_key})
    if not sr or not sr.get("items"):
        return None, None
    item = sr["items"][0]
    channel_id = item.get("id", {}).get("channelId")
    channel_title = item.get("snippet", {}).get("title")
    return channel_id, channel_title


def fetch_channel_uploads(channel_id: str, api_key: str, max_count: int = 200) -> List[dict]:
    playlist_id = "UU" + channel_id[2:]
    url = "https://www.googleapis.com/youtube/v3/playlistItems"
    page_token = None
    results: List[dict] = []
    while True:
        params = {"part": "snippet", "playlistId": playlist_id, "maxResults": 50, "key": api_key}
        if page_token:
            params["pageToken"] = page_token
        data = http_get_json(url, params)
        if not data:
            break
        for it in data.get("items", []):
            sn = it.get("snippet", {})
            rid = sn.get("resourceId", {})
            vid = rid.get("videoId")
            title = sn.get("title", "")
            thumbs = sn.get("thumbnails", {})
            thumb_url = (
                (thumbs.get("maxres") or {}).get("url") or
                (thumbs.get("standard") or {}).get("url") or
                (thumbs.get("high") or {}).get("url") or
                (thumbs.get("medium") or {}).get("url") or
                (thumbs.get("default") or {}).get("url") or
                ""
            )
            if vid:
                results.append({"id": vid, "title": title, "thumbnail": thumb_url, "url": f"https://www.youtube.com/watch?v={vid}"})
                if len(results) >= max_count:
                    break
        if len(results) >= max_count:
            break
        page_token = data.get("nextPageToken")
        if not page_token:
            break
    return results


def save_data_file(name: str, channel_id: str, channel_title: str, videos: List[dict]) -> Path:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    path = DATA_DIR / f"{name}.json"
    payload = {"channel_id": channel_id, "channel_name": channel_title or name, "updated_at": datetime.now(timezone.utc).isoformat(), "videos": videos}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return path


def pick_best_thumbnail(snippet: dict) -> Optional[str]:
    thumbs = (snippet or {}).get("thumbnails", {})
    for key in ["maxres", "standard", "high", "medium", "default"]:
        url = (thumbs.get(key) or {}).get("url")
        if url:
            return url
    return None


def download_channel_avatar(channel_id: str, api_key: str, save_name: str) -> Tuple[Optional[Path], Optional[Path]]:
    ch = http_get_json("https://www.googleapis.com/youtube/v3/channels", {"part": "snippet", "id": channel_id, "key": api_key})
    try:
        snippet = ch.get("items", [])[0]["snippet"]
    except Exception:
        snippet = None
    img_url = pick_best_thumbnail(snippet) if snippet else None
    if not img_url:
        return None, None

    try:
        req = urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=20) as resp:
            content = resp.read()
    except Exception:
        return None, None

    IMG_DIR.mkdir(parents=True, exist_ok=True)
    IMG_RESIZED_DIR.mkdir(parents=True, exist_ok=True)
    raw_path = IMG_DIR / f"{save_name}.jpg"
    resized_path = IMG_RESIZED_DIR / f"{save_name}.jpg"

    try:
        with open(raw_path, "wb") as f:
            f.write(content)
    except Exception:
        raw_path = None

    try:
        if Image is None:
            return raw_path, None
        with Image.open(BytesIO(content)) as im:
            im = im.convert("RGB")
            size = 128
            ratio = max(size / im.width, size / im.height)
            new_w, new_h = int(im.width * ratio), int(im.height * ratio)
            im = im.resize((new_w, new_h), Image.LANCZOS)
            left = (new_w - size) // 2
            top = (new_h - size) // 2
            im = im.crop((left, top, left + size, top + size))
            im.save(resized_path, format="JPEG", quality=88, optimize=True)
    except Exception:
        resized_path = None

    return raw_path, resized_path


def main():
    parser = argparse.ArgumentParser(description="添加频道→抓取→头像→缩略图（单频道）")
    parser.add_argument("--url", help="YouTube频道URL（如 https://www.youtube.com/@handle）")
    parser.add_argument("--name", help="显示名称（默认自动解码 handle/ID）")
    parser.add_argument("--category", default="その他", help="分类（默认: その他）")
    parser.add_argument("--subcategory", default="その他チャンネル", help="子分类（默认: その他チャンネル）")
    args = parser.parse_args()

    url = args.url
    if not url:
        try:
            url = input("请输入YouTube频道地址: ").strip()
        except EOFError:
            print("❌ 未提供URL")
            sys.exit(1)

    url = normalize_url(url)
    if not url:
        print("❌ URL 为空")
        sys.exit(1)

    provided_name = (args.name or "").strip()
    name = (provided_name or urllib.parse.unquote(extract_handle_or_id(url))).strip()
    if not name:
        print("❌ 无法确定频道名称，请使用 --name 指定")
        sys.exit(1)

    print("=== 预览 ===")
    print(f"URL: {url}")
    print(f"名称: {name}")
    print(f"分类/子分类: {args.category} / {args.subcategory}")

    print("\n=== 正在读取 API Key 并解析频道ID ===")
    keys = load_api_keys()
    if not keys:
        print("❌ 未在 WEB-INF/config.properties 中找到 youtube.apikey，无法抓取。仅完成添加到配置。")
        upsert_channel(url=url, name=name, category=args.category, subcategory=args.subcategory)
        sys.exit(0)

    ch_id, ch_title, api_key = None, None, None
    for k in keys:
        api_key = k
        ch_id, ch_title = resolve_channel_id(url, k)
        if ch_id:
            break
    if not ch_id:
        print("❌ 无法解析频道ID，抓取终止。已完成添加到配置。")
        upsert_channel(url=url, name=name, category=args.category, subcategory=args.subcategory)
        sys.exit(0)

    if not provided_name and ch_title:
        pretty = re.sub(r"\s*-\s*YouTube\s*$", "", ch_title).strip()
        if pretty:
            name = pretty

    # 写入/覆盖配置
    if not upsert_channel(url=url, name=name, category=args.category, subcategory=args.subcategory):
        sys.exit(1)

    # 抓取与写入 data
    videos = fetch_channel_uploads(ch_id, api_key, max_count=200)
    out_path = save_data_file(name=name, channel_id=ch_id, channel_title=(ch_title or name), videos=videos)

    # 下载头像与缩略图
    raw_img, resized_img = download_channel_avatar(channel_id=ch_id, api_key=api_key, save_name=name)

    print(f"\n✅ 抓取完成：{len(videos)} 条视频 → {out_path}")
    if raw_img:
        print(f"✅ 已下载头像：{raw_img}")
    if resized_img:
        print(f"✅ 已生成缩略图：{resized_img}")
    else:
        print("⚠️ 未生成缩略图（可能未安装 Pillow 或下载失败）")
    print("👉 请刷新网页查看该频道视频与头像。")


if __name__ == "__main__":
    main()


