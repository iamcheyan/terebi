#!/usr/bin/env python3
"""
使用RSS批量抓取所有频道数据的程序
遍历youtube_channels.json和japan_tv_youtube_channels.json中的所有频道
使用RSS方式抓取数据，有新的视频就添加
"""
import json
import re
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from pathlib import Path
from datetime import datetime, timezone
from typing import List, Dict, Optional

# 配置
DATA_DIR = Path("data")
CHANNELS_FILE = DATA_DIR / "youtube_channels.json"
JAPAN_CHANNELS_FILE = Path("all_channels.json")

def load_channels_from_file(file_path: Path) -> Dict:
    """加载频道配置文件"""
    if not file_path.exists():
        print(f"❌ 文件不存在: {file_path}")
        return {}
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ 读取文件失败 {file_path}: {e}")
        return {}

def extract_channel_id_from_url(url: str) -> Optional[str]:
    """从YouTube URL中提取频道ID"""
    if not url:
        return None
    
    # 处理不同的URL格式
    patterns = [
        r'@([\w-]+)',  # @username格式
        r'/channel/(UC[\w-]{22})',  # /channel/UC...格式
        r'/c/([\w-]+)',  # /c/username格式
        r'/user/([\w-]+)',  # /user/username格式
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None

def get_rss_url(channel_id: str) -> str:
    """根据频道ID生成RSS URL"""
    if channel_id.startswith('UC'):
        # 完整的频道ID
        return f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    else:
        # 用户名，需要先获取频道ID
        return f"https://www.youtube.com/@{channel_id}"

def fetch_channel_id_via_html(username: str) -> Optional[str]:
    """通过HTML页面获取频道ID"""
    try:
        url = f"https://www.youtube.com/@{username}"
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            
            # 尝试多种方式找到频道ID
            patterns = [
                r'"channelId"\s*:\s*"(UC[\w-]{22})"',
                r'"externalId"\s*:\s*"(UC[\w-]{22})"',
                r'"ucid"\s*:\s*"(UC[\w-]{22})"',
                r'"channelId":"(UC[\w-]{22})"',
                r'channelId.*?"(UC[\w-]{22})"',
            ]
            
            for pattern in patterns:
                match = re.search(pattern, html)
                if match:
                    return match.group(1)
            
            return None
            
    except Exception as e:
        print(f"❌ HTML抓取失败: {e}")
        return None

def fetch_videos_via_rss(rss_url: str) -> List[Dict]:
    """通过RSS抓取视频数据"""
    try:
        req = urllib.request.Request(rss_url, headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        
        with urllib.request.urlopen(req, timeout=15) as response:
            content = response.read().decode('utf-8')
            
            # 解析XML
            root = ET.fromstring(content)
            
            videos = []
            for item in root.findall('.//{http://www.w3.org/2005/Atom}entry'):
                try:
                    # 提取视频信息
                    video_id_elem = item.find('.//{http://www.youtube.com/xml/schemas/2015}videoId')
                    title_elem = item.find('.//{http://www.w3.org/2005/Atom}title')
                    link_elem = item.find('.//{http://www.w3.org/2005/Atom}link')
                    published_elem = item.find('.//{http://www.w3.org/2005/Atom}published')
                    
                    if video_id_elem is not None and title_elem is not None:
                        video_id = video_id_elem.text
                        title = title_elem.text
                        link = link_elem.get('href') if link_elem is not None else f"https://www.youtube.com/watch?v={video_id}"
                        published = published_elem.text if published_elem is not None else ""
                        
                        # 提取缩略图URL
                        thumbnail_url = f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg"
                        
                        video_data = {
                            "video_id": video_id,
                            "title": title,
                            "url": link,
                            "published": published,
                            "thumbnail_url": thumbnail_url
                        }
                        
                        videos.append(video_data)
                        
                except Exception as e:
                    print(f"⚠️ 解析视频条目失败: {e}")
                    continue
            
            return videos
            
    except Exception as e:
        print(f"❌ RSS抓取失败: {e}")
        return []

def load_existing_data(bakname: str) -> Dict:
    """加载现有数据文件"""
    data_file = DATA_DIR / f"{bakname}.json"
    if not data_file.exists():
        return {"videos": []}
    
    try:
        with open(data_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"⚠️ 读取现有数据失败: {e}")
        return {"videos": []}

def save_data_file(bakname: str, channel_name: str, videos: List[Dict]) -> Path:
    """保存数据到JSON文件"""
    DATA_DIR.mkdir(exist_ok=True)
    
    payload = {
        "channel_name": channel_name,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "videos": videos,
    }
    
    out_path = DATA_DIR / f"{bakname}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    
    return out_path

def process_channel(channel: Dict, category: str) -> bool:
    """处理单个频道"""
    name = channel.get("name", "")
    url = channel.get("url", "")
    bakname = channel.get("bakname", "")
    
    if not name or not url:
        print(f"⚠️ 跳过无效频道: {name}")
        return False
    
    if not bakname:
        print(f"⚠️ 跳过无bakname的频道: {name}")
        return False
    
    print(f"=== 处理频道: {name} ===")
    print(f"URL: {url}")
    print(f"分类: {category}")
    print(f"Bakname: {bakname}")
    
    # 提取频道ID
    channel_id = extract_channel_id_from_url(url)
    if not channel_id:
        print(f"❌ 无法提取频道ID: {name}")
        return False
    
    # 如果是用户名，尝试获取完整频道ID
    if not channel_id.startswith('UC'):
        print(f"🔍 尝试获取完整频道ID: {channel_id}")
        full_channel_id = fetch_channel_id_via_html(channel_id)
        if full_channel_id:
            channel_id = full_channel_id
            print(f"✅ 获取到完整频道ID: {channel_id}")
        else:
            print(f"⚠️ 无法获取完整频道ID，使用用户名: {channel_id}")
    
    # 生成RSS URL
    if channel_id.startswith('UC'):
        rss_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    else:
        rss_url = f"https://www.youtube.com/feeds/videos.xml?user={channel_id}"
    
    print(f"RSS URL: {rss_url}")
    
    # 抓取新数据
    print("📥 抓取RSS数据...")
    new_videos = fetch_videos_via_rss(rss_url)
    
    if not new_videos:
        print(f"❌ 未获取到视频数据: {name}")
        return False
    
    print(f"✅ 获取到 {len(new_videos)} 条视频")
    
    # 加载现有数据
    existing_data = load_existing_data(bakname)
    existing_videos = existing_data.get("videos", [])
    existing_video_ids = {video.get("video_id") for video in existing_videos}
    
    # 过滤新视频
    new_video_ids = {video.get("video_id") for video in new_videos}
    truly_new_videos = [video for video in new_videos if video.get("video_id") not in existing_video_ids]
    
    if truly_new_videos:
        print(f"🆕 发现 {len(truly_new_videos)} 条新视频")
        # 合并数据（新视频在前）
        all_videos = truly_new_videos + existing_videos
    else:
        print(f"ℹ️ 没有新视频，更新现有数据")
        all_videos = new_videos  # 使用最新的RSS数据
    
    # 保存数据
    out_path = save_data_file(bakname, name, all_videos)
    print(f"💾 数据已保存: {out_path}")
    
    return True

def collect_all_channels() -> List[tuple]:
    """收集所有频道信息"""
    all_channels = []
    
    # 加载youtube_channels.json
    youtube_data = load_channels_from_file(CHANNELS_FILE)
    for category, channels in youtube_data.items():
        if isinstance(channels, list):
            for channel in channels:
                if isinstance(channel, dict) and channel.get("bakname"):
                    all_channels.append((channel, category))
    
    # 加载japan_tv_youtube_channels.json
    japan_data = load_channels_from_file(JAPAN_CHANNELS_FILE)
    for category, channels in japan_data.items():
        if isinstance(channels, list):
            for channel in channels:
                if isinstance(channel, dict) and channel.get("bakname"):
                    all_channels.append((channel, category))
        elif isinstance(channels, dict):
            # 处理嵌套结构
            for sub_category, sub_channels in channels.items():
                if isinstance(sub_channels, list):
                    for channel in sub_channels:
                        if isinstance(channel, dict) and channel.get("bakname"):
                            all_channels.append((channel, f"{category}/{sub_category}"))
    
    return all_channels

def main():
    """主函数"""
    print("=== RSS批量抓取所有频道数据 ===")
    print(f"数据目录: {DATA_DIR}")
    
    # 收集所有频道
    all_channels = collect_all_channels()
    print(f"找到 {len(all_channels)} 个频道")
    
    if not all_channels:
        print("❌ 没有找到任何频道")
        return
    
    # 处理每个频道
    success_count = 0
    error_count = 0
    
    for i, (channel, category) in enumerate(all_channels, 1):
        print(f"\n--- 处理第 {i}/{len(all_channels)} 个频道 ---")
        
        try:
            if process_channel(channel, category):
                success_count += 1
                print(f"✅ 成功处理: {channel.get('name', 'Unknown')}")
            else:
                error_count += 1
                print(f"❌ 处理失败: {channel.get('name', 'Unknown')}")
        except Exception as e:
            error_count += 1
            print(f"❌ 处理异常: {channel.get('name', 'Unknown')} - {e}")
    
    print(f"\n=== 处理完成 ===")
    print(f"总频道数: {len(all_channels)}")
    print(f"成功处理: {success_count}")
    print(f"处理失败: {error_count}")
    print("👉 请刷新网页查看更新")

if __name__ == "__main__":
    main()
