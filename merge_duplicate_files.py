#!/usr/bin/env python3
"""
合并重复的数据文件
将旧格式的文件合并到新格式的bakname文件中
"""
import json
from pathlib import Path
from datetime import datetime, timezone

DATA_DIR = Path("data")

def load_json_file(file_path: Path):
    """加载JSON文件"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ 读取文件失败 {file_path}: {e}")
        return None

def save_json_file(file_path: Path, data):
    """保存JSON文件"""
    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"❌ 保存文件失败 {file_path}: {e}")
        return False

def merge_videos(old_videos, new_videos):
    """合并视频数据，去重并保持最新数据在前"""
    # 创建视频ID到视频数据的映射
    video_map = {}
    
    # 先添加新数据（优先级更高）
    for video in new_videos:
        video_id = video.get('video_id') or video.get('id')
        if video_id:
            video_map[video_id] = video
    
    # 再添加旧数据（如果不存在的话）
    for video in old_videos:
        video_id = video.get('video_id') or video.get('id')
        if video_id and video_id not in video_map:
            video_map[video_id] = video
    
    # 转换为列表
    merged_videos = list(video_map.values())
    
    # 按发布时间排序（最新的在前）
    def get_published_time(video):
        published = video.get('published', '')
        if published:
            try:
                # 处理不同的时间格式
                if published.endswith('Z'):
                    published = published.replace('Z', '+00:00')
                elif '+' not in published and '-' not in published[-6:]:
                    # 如果没有时区信息，假设为UTC
                    published = published + '+00:00'
                return datetime.fromisoformat(published)
            except:
                pass
        return datetime.min.replace(tzinfo=timezone.utc)
    
    merged_videos.sort(key=get_published_time, reverse=True)
    
    return merged_videos

def find_duplicate_files():
    """查找重复的文件"""
    duplicates = []
    
    # 获取所有JSON文件
    json_files = list(DATA_DIR.glob("*.json"))
    
    for file_path in json_files:
        if file_path.name == "youtube_channels.json":
            continue
            
        # 检查是否有对应的channel_UC文件
        if file_path.name.startswith("channel_UC"):
            continue
            
        # 尝试找到对应的channel_UC文件
        data = load_json_file(file_path)
        if not data:
            continue
            
        channel_name = data.get('channel_name', '')
        if not channel_name:
            continue
            
        # 查找可能的channel_UC文件
        for uc_file in DATA_DIR.glob("channel_UC*.json"):
            uc_data = load_json_file(uc_file)
            if uc_data and uc_data.get('channel_name') == channel_name:
                duplicates.append((file_path, uc_file, channel_name))
                break
    
    return duplicates

def merge_duplicate_files():
    """合并重复文件"""
    print("=== 查找重复文件 ===")
    duplicates = find_duplicate_files()
    
    if not duplicates:
        print("✅ 没有找到重复文件")
        return
    
    print(f"找到 {len(duplicates)} 对重复文件")
    
    merged_count = 0
    
    for old_file, new_file, channel_name in duplicates:
        print(f"\n=== 处理: {channel_name} ===")
        print(f"旧文件: {old_file.name}")
        print(f"新文件: {new_file.name}")
        
        # 加载数据
        old_data = load_json_file(old_file)
        new_data = load_json_file(new_file)
        
        if not old_data or not new_data:
            print(f"❌ 无法加载数据，跳过")
            continue
        
        # 合并视频数据
        old_videos = old_data.get('videos', [])
        new_videos = new_data.get('videos', [])
        
        print(f"旧文件视频数: {len(old_videos)}")
        print(f"新文件视频数: {len(new_videos)}")
        
        merged_videos = merge_videos(old_videos, new_videos)
        print(f"合并后视频数: {len(merged_videos)}")
        
        # 创建合并后的数据
        merged_data = {
            "channel_name": channel_name,
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "videos": merged_videos
        }
        
        # 保存到新文件
        if save_json_file(new_file, merged_data):
            print(f"✅ 已合并到: {new_file.name}")
            
            # 删除旧文件
            try:
                old_file.unlink()
                print(f"🗑️ 已删除旧文件: {old_file.name}")
                merged_count += 1
            except Exception as e:
                print(f"⚠️ 删除旧文件失败: {e}")
        else:
            print(f"❌ 合并失败")
    
    print(f"\n=== 合并完成 ===")
    print(f"成功合并: {merged_count} 个文件")

if __name__ == "__main__":
    merge_duplicate_files()
