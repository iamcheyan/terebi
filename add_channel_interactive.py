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
import re
import xml.etree.ElementTree as ET
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


def resolve_channel_id_via_html(url: str) -> Tuple[Optional[str], Optional[str]]:
    """在无API情况下，通过抓取频道页HTML提取 channelId 和标题。
    适配 @handle 与 /channel/UC... 链接。
    """
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
    except Exception as e:
        print(f"❌ HTML抓取失败: {e}")
        return None, None

    # 直接从HTML中匹配 channelId
    m = re.search(r'"channelId"\s*:\s*"(UC[\w-]{22})"', html)
    channel_id = m.group(1) if m else None

    # 抓取标题（优先 og:title，其次 <title>）
    title = None
    m_title = re.search(r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\']([^"\']+)["\']', html)
    if m_title:
        title = m_title.group(1).strip()
    else:
        m_title2 = re.search(r"<title>(.*?)</title>", html, re.S)
        if m_title2:
            title = re.sub(r"\s+\-\s+YouTube$", "", m_title2.group(1).strip())

    return channel_id, title


def fetch_channel_uploads_via_rss(channel_id: str, max_count: int = 200) -> List[dict]:
    """无需API，使用YouTube官方RSS获取视频列表。
    参考: https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}
    """
    if not channel_id:
        return []
    feed_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    try:
        req = urllib.request.Request(feed_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            xml_text = resp.read()
    except Exception as e:
        print(f"❌ RSS获取失败: {e}")
        return []

    try:
        root = ET.fromstring(xml_text)
    except Exception as e:
        print(f"❌ RSS解析失败: {e}")
        return []

    ns = {
        'atom': 'http://www.w3.org/2005/Atom',
        'media': 'http://search.yahoo.com/mrss/'
    }
    entries = root.findall('atom:entry', ns)

    videos: List[dict] = []
    for entry in entries[:max_count]:
        video_id = (entry.find('yt:videoId', {'yt': 'http://www.youtube.com/xml/schemas/2015'}) or {}).text if entry is not None else None
        if not video_id:
            # 备用：从 link href 中解析 v 参数
            link_el = entry.find('atom:link', ns)
            href = link_el.get('href') if link_el is not None else ''
            q = urllib.parse.urlparse(href).query
            qs = urllib.parse.parse_qs(q)
            video_id = (qs.get('v') or [''])[0]

        title_el = entry.find('atom:title', ns)
        published_el = entry.find('atom:published', ns)
        media_group = entry.find('media:group', ns)
        thumb_url = None
        if media_group is not None:
            thumb = media_group.find('media:thumbnail', ns)
            if thumb is not None:
                thumb_url = thumb.get('url')

        videos.append({
            "id": video_id or "",
            "title": (title_el.text if title_el is not None else ""),
            "description": "",
            "publishedAt": (published_el.text if published_el is not None else ""),
            "thumbnails": {"default": {"url": thumb_url}} if thumb_url else {},
            "url": f"https://www.youtube.com/watch?v={video_id}" if video_id else ""
        })

    return videos


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
        # 如果已存在但缺少数据文件，生成一个空的数据文件，避免前端404
        data_path = DATA_DIR / f"{name}.json"
        if not data_path.exists():
            try:
                empty = {
                    "channel_id": "",
                    "channel_name": name,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                    "videos": []
                }
                DATA_DIR.mkdir(exist_ok=True)
                with open(data_path, "w", encoding="utf-8") as f:
                    json.dump(empty, f, ensure_ascii=False, indent=2)
                print(f"🧩 已补齐空数据文件: {data_path}")
            except Exception:
                pass
        # 同时保证有占位头像
        placeholder = IMG_RESIZED_DIR / "placeholder.jpg"
        target_logo = IMG_RESIZED_DIR / f"{name}.jpg"
        try:
            IMG_RESIZED_DIR.mkdir(parents=True, exist_ok=True)
            if placeholder.exists() and not target_logo.exists():
                import shutil
                shutil.copyfile(placeholder, target_logo)
                print(f"🧩 已复制占位头像: {target_logo}")
        except Exception:
            pass
        return True

    # 添加到配置
    ok = upsert_channel(url=url, name=name, category=category, subcategory=subcategory)
    if not ok:
        print(f"❌ 添加失败: {name}")
        return False

    print(f"✅ 已添加到配置: {name}")

    # 抓取该URL对应频道并生成 data/{名称}.json
    print("=== 正在读取 API Key 并抓取该频道（带HTML/RSS回退） ===")
    keys = load_api_keys()
    # 先尝试无需API的HTML解析获取 channelId
    ch_id_html, ch_title_html = resolve_channel_id_via_html(url)
    if ch_id_html:
        # 无API：用RSS抓取视频
        videos = fetch_channel_uploads_via_rss(ch_id_html, max_count=200)
        out_path = save_data_file(name=name, channel_id=ch_id_html, channel_title=ch_title_html or name, videos=videos)
        # 头像：尝试从HTML提取 og:image
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=20) as resp:
                html = resp.read().decode("utf-8", errors="ignore")
            m_img = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html)
            if m_img and Image is not None:
                # 下载并生成缩略图
                try:
                    req2 = urllib.request.Request(m_img.group(1), headers={"User-Agent": "Mozilla/5.0"})
                    with urllib.request.urlopen(req2, timeout=20) as resp2:
                        content = resp2.read()
                    IMG_DIR.mkdir(parents=True, exist_ok=True)
                    IMG_RESIZED_DIR.mkdir(parents=True, exist_ok=True)
                    raw_path = IMG_DIR / f"{name}.jpg"
                    with open(raw_path, "wb") as f:
                        f.write(content)
                    with Image.open(BytesIO(content)) as im:
                        im = im.convert("RGB")
                        size = 128
                        ratio = max(size / im.width, size / im.height)
                        new_w, new_h = int(im.width * ratio), int(im.height * ratio)
                        im = im.resize((new_w, new_h), Image.LANCZOS)
                        left = (new_w - size) // 2
                        top = (new_h - size) // 2
                        im = im.crop((left, top, left + size, top + size))
                        im.save(IMG_RESIZED_DIR / f"{name}.jpg", format="JPEG", quality=88, optimize=True)
                except Exception:
                    pass
        except Exception:
            pass
        print(f"✅ 抓取完成（RSS）：{len(videos)} 条视频 → {out_path}")
        return True

    if not keys:
        print("❌ 未找到 API Key，且HTML解析失败。仅完成添加到配置并生成空数据。")
        out_path = save_data_file(name=name, channel_id="", channel_title=name, videos=[])
        print(f"🧩 已生成空数据文件：{out_path}")
        # 占位头像
        try:
            placeholder = IMG_RESIZED_DIR / "placeholder.jpg"
            target_logo = IMG_RESIZED_DIR / f"{name}.jpg"
            IMG_RESIZED_DIR.mkdir(parents=True, exist_ok=True)
            if placeholder.exists() and not target_logo.exists():
                import shutil
                shutil.copyfile(placeholder, target_logo)
        except Exception:
            pass
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
        # 再次尝试HTML解析 + RSS（API失败可能403/配额/限制）
        ch_id_html, ch_title_html = resolve_channel_id_via_html(url)
        if ch_id_html:
            videos = fetch_channel_uploads_via_rss(ch_id_html, max_count=200)
            out_path = save_data_file(name=name, channel_id=ch_id_html, channel_title=ch_title_html or name, videos=videos)
            print(f"✅ 抓取完成（RSS）：{len(videos)} 条视频 → {out_path}")
            return True
        print("❌ 无法解析频道ID，抓取终止。已完成添加到配置。")
        # 仍然生成空的数据文件，避免前端404
        out_path = save_data_file(name=name, channel_id="", channel_title=name, videos=[])
        print(f"🧩 已生成空数据文件：{out_path}")
        # 占位头像
        try:
            placeholder = IMG_RESIZED_DIR / "placeholder.jpg"
            target_logo = IMG_RESIZED_DIR / f"{name}.jpg"
            IMG_RESIZED_DIR.mkdir(parents=True, exist_ok=True)
            if placeholder.exists() and not target_logo.exists():
                import shutil
                shutil.copyfile(placeholder, target_logo)
        except Exception:
            pass
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