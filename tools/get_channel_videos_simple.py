#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
简化的频道视频获取脚本 - 先去upload功能
"""

import json
import os
import urllib.request
import urllib.parse
import urllib.error
import xml.etree.ElementTree as ET
from datetime import datetime
import argparse
import time
import sys

# 项目根目录
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def fetch_channel_videos_via_rss(channel_id, max_count=200):
    """使用RSS方式获取频道视频列表"""
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

    videos = []
    for entry in entries[:max_count]:
        # 安全地获取video_id
        video_id = None
        try:
            video_id_el = entry.find('yt:videoId', {'yt': 'http://www.youtube.com/xml/schemas/2015'})
            if video_id_el is not None and hasattr(video_id_el, 'text'):
                video_id = video_id_el.text
        except Exception:
            pass
        
        if not video_id:
            # 备用：从 link href 中解析 v 参数
            try:
                link_el = entry.find('atom:link', ns)
                if link_el is not None:
                    href = link_el.get('href', '')
                    q = urllib.parse.urlparse(href).query
                    qs = urllib.parse.parse_qs(q)
                    video_id = (qs.get('v') or [''])[0]
            except Exception:
                pass

        # 安全地获取标题
        title = ""
        try:
            title_el = entry.find('atom:title', ns)
            if title_el is not None and hasattr(title_el, 'text'):
                title = title_el.text
        except Exception:
            pass

        # 安全地获取发布时间
        published_at = ""
        try:
            published_el = entry.find('atom:published', ns)
            if published_el is not None and hasattr(published_el, 'text'):
                published_at = published_el.text
        except Exception:
            pass

        # 安全地获取缩略图
        thumb_url = None
        try:
            media_group = entry.find('media:group', ns)
            if media_group is not None:
                thumb = media_group.find('media:thumbnail', ns)
                if thumb is not None:
                    thumb_url = thumb.get('url')
        except Exception:
            pass

        videos.append({
            "id": video_id or "",
            "title": title,
            "description": "",
            "publishedAt": published_at,
            "thumbnails": {"default": {"url": thumb_url}} if thumb_url else {},
            "url": f"https://www.youtube.com/watch?v={video_id}" if video_id else ""
        })

    return videos


def get_channel_id_from_url(url):
    """从YouTube URL获取频道ID"""
    if not url:
        return None
    
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
        
        # 尝试多种方式查找channelId
        patterns = [
            r'"channelId"\s*:\s*"(UC[\w-]{22})"',
            r'"externalId"\s*:\s*"(UC[\w-]{22})"',
            r'"ucid"\s*:\s*"(UC[\w-]{22})"',
            r'"channelId":"(UC[\w-]{22})"',
            r'channelId.*?"(UC[\w-]{22})"',
        ]
        
        import re
        for pattern in patterns:
            match = re.search(pattern, html)
            if match:
                return match.group(1)
    except Exception as e:
        print(f"❌ 无法从URL获取频道ID: {e}")
    
    return None


def process_channel_rss(info):
    """使用RSS方式处理频道，实现增量更新"""
    print(f'\n=== RSS方式处理频道: {info["name"]} ===')
    
    # 获取频道ID
    channel_id = None
    if info.get("url"):
        channel_id = get_channel_id_from_url(info["url"])
    
    # 如果从缓存文件获取频道ID
    safe_name = info.get("bakname", "").strip()
    if not safe_name:
        safe_name = "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in info["name"])
    
    data_filename = os.path.join(PROJECT_ROOT, 'data', f'{safe_name}.json')
    
    # 读取现有数据
    existing_data = None
    existing_videos = []
    existing_video_ids = set()
    
    if os.path.exists(data_filename):
        try:
            with open(data_filename, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
            existing_videos = existing_data.get('videos', [])
            existing_video_ids = {video.get('id', '') for video in existing_videos if video.get('id')}
            channel_id = existing_data.get('channel_id') or channel_id
            print(f"📁 找到现有数据文件，包含 {len(existing_videos)} 个视频")
        except Exception as e:
            print(f"⚠️ 读取现有数据失败: {e}")
    
    if not channel_id:
        print(f"⚠️ 无法获取频道ID，跳过: {info['name']}")
        return False
    
    print(f"✅ 找到频道ID: {channel_id}")
    
    # 使用RSS获取最新视频
    rss_videos = fetch_channel_videos_via_rss(channel_id, max_count=200)
    if rss_videos:
        print(f"✅ RSS获取到 {len(rss_videos)} 个视频")
        
        # 过滤出新的视频
        new_videos = []
        for video in rss_videos:
            video_id = video.get('id', '')
            if video_id and video_id not in existing_video_ids:
                new_videos.append(video)
        
        print(f"🆕 发现 {len(new_videos)} 个新视频")
        
        if new_videos:
            # 合并新旧视频，新视频在前
            all_videos = new_videos + existing_videos
            
            # 准备保存的数据
            rss_data = {
                "channel_id": channel_id,
                "channel_name": info["name"],
                "updated_at": datetime.now().isoformat(),
                "videos": all_videos,
            }
            
            with open(data_filename, 'w', encoding='utf-8') as f:
                json.dump(rss_data, f, ensure_ascii=False, indent=2)
            print(f"✅ 增量更新完成，总共 {len(all_videos)} 个视频，新增 {len(new_videos)} 个")
        else:
            print("ℹ️ 没有新视频，数据保持不变")
        
        return True
    else:
        print("⚠️ RSS未获取到视频数据")
        return False


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='使用RSS方式更新频道视频数据')
    parser.add_argument('--auto-task', action='store_true', help='自动任务模式')
    args = parser.parse_args()
    
    # 读取频道配置
    with open(os.path.join(PROJECT_ROOT, 'all_channels.json'), 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # 提取所有频道
    all_channels = []
    for category, subcategories in data.items():
        if isinstance(subcategories, dict):
            for subcategory, channels in subcategories.items():
                if isinstance(channels, list):
                    for channel in channels:
                        if isinstance(channel, dict) and channel.get("url") and not channel.get("skip"):
                            all_channels.append(channel)
    
    print(f"📊 找到 {len(all_channels)} 个频道")
    
    # 处理频道
    success_count = 0
    for i, channel in enumerate(all_channels, 1):
        print(f"\n[{i}/{len(all_channels)}] 处理频道: {channel['name']}")
        try:
            if process_channel_rss(channel):
                success_count += 1
        except Exception as e:
            print(f"❌ 处理频道 {channel['name']} 时出错: {e}")
            continue
    
    print(f"\n🎉 处理完成！成功处理 {success_count}/{len(all_channels)} 个频道")


if __name__ == "__main__":
    main()
