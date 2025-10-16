#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
YouTube频道添加工具 - 支持批量添加
用法：
- 交互模式：python add_channel_interactive.py
- 单个频道：python add_channel_interactive.py --url @handle
- 批量添加：python add_channel_interactive.py --url @handle1 @handle2 @handle3
"""

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional, Tuple

# 项目根目录
PROJECT_ROOT = Path(__file__).parent
CONFIG_FILE = PROJECT_ROOT / "japan_tv_youtube_channels.json"
DATA_DIR = PROJECT_ROOT / "data"
IMG_DIR = PROJECT_ROOT / "img"
IMG_RESIZED_DIR = IMG_DIR / "resized"

# 尝试导入 Pillow
try:
    from PIL import Image
    from io import BytesIO
except ImportError:
    Image = None
    BytesIO = None


def load_config() -> dict:
    """加载配置文件"""
    if not CONFIG_FILE.exists():
        print(f"❌ 配置文件不存在: {CONFIG_FILE}")
        sys.exit(1)
    
    with open(CONFIG_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def save_config(config: dict) -> bool:
    """保存配置文件"""
    try:
        with open(CONFIG_FILE, "w", encoding="utf-8") as f:
            json.dump(config, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"❌ 保存配置失败: {e}")
        return False


def load_api_keys() -> List[str]:
    """从 WEB-INF/config.properties 读取 YouTube API Key"""
    config_file = PROJECT_ROOT / "WEB-INF" / "config.properties"
    if not config_file.exists():
        return []
    
    keys = []
    try:
        with open(config_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line.startswith("youtube.apikey") and "=" in line:
                    key = line.split("=", 1)[1].strip()
                    if key:
                        keys.append(key)
    except Exception:
        pass
    
    return keys


def normalize_url(url: str) -> str:
    """标准化URL格式"""
    if not url:
        return ""
    
    # 如果只是handle（如 @handle），补充完整URL
    if url.startswith("@"):
        return f"https://www.youtube.com/{url}"
    
    # 确保是完整的YouTube URL
    if not url.startswith("http"):
        if url.startswith("www.youtube.com"):
            url = "https://" + url
        elif url.startswith("youtube.com"):
            url = "https://www." + url
        else:
            url = "https://www.youtube.com/" + url
    
    return url


def extract_handle_or_id(url: str) -> str:
    """从URL提取handle或ID"""
    if not url:
        return ""
    
    # 处理 @handle 格式
    if "/@" in url:
        return url.split("/@")[-1].split("?")[0].split("/")[0]
    
    # 处理 /channel/UC... 格式
    if "/channel/" in url:
        return url.split("/channel/")[-1].split("?")[0].split("/")[0]
    
    # 处理 /c/channel_name 格式
    if "/c/" in url:
        return url.split("/c/")[-1].split("?")[0].split("/")[0]
    
    return ""


def check_channel_exists(url: str) -> bool:
    """检查频道是否已存在"""
    config = load_config()
    
    for cat_data in config.values():
        if not isinstance(cat_data, dict):
            continue
        for subcat_data in cat_data.values():
            if not isinstance(subcat_data, list):
                continue
            for channel in subcat_data:
                if isinstance(channel, dict) and channel.get("url") == url:
                    return True
    return False


def upsert_channel(url: str, name: str, category: str, subcategory: str) -> bool:
    """添加或更新频道到配置"""
    config = load_config()
    
    # 查找现有频道
    for cat_data in config.values():
        if not isinstance(cat_data, dict):
            continue
        for subcat_data in cat_data.values():
            if not isinstance(subcat_data, list):
                continue
            for i, channel in enumerate(subcat_data):
                if isinstance(channel, dict) and channel.get("url") == url:
                    # 更新现有频道
                    subcat_data[i] = {
                        "name": name,
                        "url": url,
                        "bakname": "",
                        "cached": False,
                        "skip": False
                    }
                    print(f"✅ 已更新频道: {name}")
                    return save_config(config)
    
    # 添加新频道
    if category not in config:
        config[category] = {}
    if subcategory not in config[category]:
        config[category][subcategory] = []
    
    new_channel = {
        "name": name,
        "url": url,
        "bakname": "",
        "cached": False,
        "skip": False
    }
    
    config[category][subcategory].append(new_channel)
    print(f"✅ 已添加频道: {name}")
    return save_config(config)


def http_get_json(url: str, params: dict) -> dict:
    """发送HTTP GET请求并返回JSON"""
    if params:
        query = urllib.parse.urlencode(params)
        url = f"{url}?{query}"
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        print(f"❌ HTTP请求失败: {e}")
        return {}


def resolve_channel_id(url: str, api_key: str) -> Tuple[Optional[str], Optional[str]]:
    """解析频道ID和标题"""
    handle_or_id = extract_handle_or_id(url)
    if not handle_or_id:
        return None, None
    
    # 尝试作为handle查询
    if not handle_or_id.startswith("UC"):
        try:
            # 解码百分号编码
            decoded_handle = urllib.parse.unquote(handle_or_id)
            resp = http_get_json(
                "https://www.googleapis.com/youtube/v3/channels",
                {
                    "part": "snippet",
                    "forUsername": decoded_handle,
                    "key": api_key
                }
            )
            items = resp.get("items", [])
            if items:
                return items[0]["id"], items[0]["snippet"]["title"]
        except Exception:
            pass
    
    # 尝试作为ID查询
    try:
        resp = http_get_json(
            "https://www.googleapis.com/youtube/v3/channels",
            {
                "part": "snippet",
                "id": handle_or_id,
                "key": api_key
            }
        )
        items = resp.get("items", [])
        if items:
            return items[0]["id"], items[0]["snippet"]["title"]
    except Exception:
        pass
    
    return None, None


def fetch_channel_uploads(channel_id: str, api_key: str, max_count: int = 200) -> List[dict]:
    """获取频道上传的视频列表"""
    videos = []
    next_page_token = None
    
    while len(videos) < max_count:
        params = {
            "part": "snippet",
            "channelId": channel_id,
            "type": "video",
            "order": "date",
            "maxResults": min(50, max_count - len(videos)),
            "key": api_key
        }
        
        if next_page_token:
            params["pageToken"] = next_page_token
        
        resp = http_get_json("https://www.googleapis.com/youtube/v3/search", params)
        items = resp.get("items", [])
        
        if not items:
            break
        
        for item in items:
            snippet = item.get("snippet", {})
            video = {
                "id": item.get("id", {}).get("videoId", ""),
                "title": snippet.get("title", ""),
                "description": snippet.get("description", ""),
                "publishedAt": snippet.get("publishedAt", ""),
                "thumbnails": snippet.get("thumbnails", {}),
                "url": f"https://www.youtube.com/watch?v={item.get('id', {}).get('videoId', '')}"
            }
            videos.append(video)
        
        next_page_token = resp.get("nextPageToken")
        if not next_page_token:
            break
    
    return videos[:max_count]


def save_data_file(name: str, channel_id: str, channel_title: str, videos: List[dict]) -> Path:
    """保存视频数据到JSON文件"""
    DATA_DIR.mkdir(exist_ok=True)
    
    payload = {
        "channel_id": channel_id,
        "channel_name": channel_title or name,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "videos": videos,
    }
    
    out_path = DATA_DIR / f"{name}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    
    return out_path


def pick_best_thumbnail(snippet: dict) -> Optional[str]:
    """选择最佳缩略图URL"""
    thumbs = (snippet or {}).get("thumbnails", {})
    for key in ["maxres", "standard", "high", "medium", "default"]:
        url = (thumbs.get(key) or {}).get("url")
        if url:
            return url
    return None


def download_channel_avatar(channel_id: str, api_key: str, save_name: str) -> Tuple[Optional[Path], Optional[Path]]:
    """下载频道头像并生成缩略图，返回 (原图路径, 缩略图路径)"""
    # 拉取频道信息以获取缩略图
    ch = http_get_json(
        "https://www.googleapis.com/youtube/v3/channels",
        {"part": "snippet", "id": channel_id, "key": api_key}
    )
    try:
        snippet = ch.get("items", [])[0]["snippet"]
    except Exception:
        snippet = None
    img_url = pick_best_thumbnail(snippet) if snippet else None
    if not img_url:
        return None, None

    # 下载图片
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

    # 保存原图
    try:
        with open(raw_path, "wb") as f:
            f.write(content)
    except Exception:
        raw_path = None

    # 生成缩略图
    try:
        if Image is None:
            return raw_path, None
        with Image.open(BytesIO(content)) as im:
            # 转成RGB，等比缩放到 128x128 画布内，再居中铺满裁剪（方形）
            im = im.convert("RGB")
            size = 128
            # 先按短边等比放大，后居中裁剪
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


def process_single_channel(url: str, name: str, category: str, subcategory: str) -> bool:
    """处理单个频道：添加到配置并抓取数据"""
    url = normalize_url(url)
    if not url:
        print(f"❌ URL 无效: {url}")
        return False

    # 默认名称：从URL提取 handle/ID，并对百分号编码进行解码
    if not name:
        name = urllib.parse.unquote(extract_handle_or_id(url)).strip()
        if not name:
            print(f"❌ 无法确定频道名称: {url}")
            return False

    print(f"=== 处理频道: {name} ===")
    print(f"URL: {url}")
    print(f"分类/子分类: {category} / {subcategory}")

    # 检查频道是否已存在
    if check_channel_exists(url):
        print(f"⏭️ 频道已存在，跳过: {name}")
        return True

    # 添加到配置
    ok = upsert_channel(url=url, name=name, category=category, subcategory=subcategory)
    if not ok:
        print(f"❌ 添加失败: {name}")
        return False

    print(f"✅ 已添加到配置: {name}")

    # 抓取该URL对应频道并生成 data/{名称}.json
    print("=== 正在读取 API Key 并抓取该频道 ===")
    keys = load_api_keys()
    if not keys:
        print("❌ 未在 WEB-INF/config.properties 中找到 youtube.apikey，无法抓取。仅完成添加到配置。")
        return True

    # 轮换 API Key 解析频道ID
    ch_id, ch_title = None, None
    api_key = None
    for k in keys:
        api_key = k
        ch_id, ch_title = resolve_channel_id(url, k)
        if ch_id:
            break
    if not ch_id:
        print("❌ 无法解析频道ID，抓取终止。已完成添加到配置。")
        return True

    videos = fetch_channel_uploads(ch_id, api_key, max_count=200)
    out_path = save_data_file(name=name, channel_id=ch_id, channel_title=ch_title or name, videos=videos)

    # 下载并生成头像缩略图（不中断主流程）
    raw_img, resized_img = download_channel_avatar(channel_id=ch_id, api_key=api_key, save_name=name)

    print(f"✅ 抓取完成：{len(videos)} 条视频 → {out_path}")
    if raw_img:
        print(f"✅ 已下载头像：{raw_img}")
    if resized_img:
        print(f"✅ 已生成缩略图：{resized_img}")
    else:
        print("⚠️ 未生成缩略图（可能未安装 Pillow 或下载失败）")
    
    return True


def main():
    parser = argparse.ArgumentParser(description="添加YouTube频道到配置并抓取数据")
    parser.add_argument("--url", nargs="+", help="YouTube频道URL（支持多个，如 --url @handle1 @handle2）")
    parser.add_argument("--name", help="显示名称（默认用 handle/ID）")
    parser.add_argument("--category", default="その他", help="分类（默认: その他）")
    parser.add_argument("--subcategory", default="その他チャンネル", help="子分类（默认: その他チャンネル）")
    parser.add_argument("--yes", "-y", action="store_true", help="自动确认，不询问")
    args = parser.parse_args()

    if args.url:
        # 批量添加模式
        urls = args.url
        category = args.category
        subcategory = args.subcategory
        
        print(f"=== 批量添加模式 ===")
        print(f"频道数量: {len(urls)}")
        print(f"分类/子分类: {category} / {subcategory}")
        print(f"URL列表:")
        for i, url in enumerate(urls, 1):
            print(f"  {i}. {url}")
        
        if not args.yes:
            try:
                if input(f"\n确认批量添加 {len(urls)} 个频道？(y/N): ").lower() != 'y':
                    print("已取消")
                    return
            except EOFError:
                print("❌ 无法读取输入，请使用 --yes 参数自动确认")
                return
        
        success_count = 0
        for i, url in enumerate(urls, 1):
            print(f"\n=== 处理第 {i}/{len(urls)} 个频道 ===")
            try:
                if process_single_channel(url, args.name, category, subcategory):
                    success_count += 1
                    print(f"✅ 第 {i} 个频道处理完成")
                else:
                    print(f"❌ 第 {i} 个频道处理失败")
            except Exception as e:
                print(f"❌ 第 {i} 个频道处理失败: {e}")
                continue
        
        print(f"\n=== 批量处理完成 ===")
        print(f"成功: {success_count}/{len(urls)} 个频道")
        if success_count > 0:
            print("👉 请刷新网页查看新频道")
    else:
        # 交互模式
        try:
            url = input("请输入YouTube频道地址: ").strip()
        except EOFError:
            print("❌ 未提供URL")
            sys.exit(1)

        if not url:
            print("❌ 请输入有效的URL")
            return

        name = args.name
        if not name:
            name = urllib.parse.unquote(extract_handle_or_id(url)).strip()
            if not name:
                print("❌ 无法确定频道名称，请使用 --name 指定")
                sys.exit(1)

        print("=== 预览 ===")
        print(f"URL: {url}")
        print(f"名称: {name}")
        print(f"分类/子分类: {args.category} / {args.subcategory}")

        if input("\n确认添加？(y/N): ").lower() != 'y':
            print("已取消")
            return

        process_single_channel(url, name, args.category, args.subcategory)


if __name__ == "__main__":
    main()