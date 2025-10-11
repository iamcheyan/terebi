#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path


def safe_filename(name):
    """将频道名称转换为安全的文件名"""
    return "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in name)


def mark_cached_status():
    """标记频道配置中的缓存状态"""
    PROJECT_ROOT = Path(__file__).resolve().parent
    CHANNELS_FILE = PROJECT_ROOT / "japan_tv_youtube_channels.json"
    DATA_DIR = PROJECT_ROOT / "data"
    
    # 读取频道配置文件
    with open(CHANNELS_FILE, 'r', encoding='utf-8') as f:
        channels_data = json.load(f)
    
    # 获取所有数据文件并统计视频数量
    data_files = set()
    total_videos = 0
    if DATA_DIR.exists():
        for file in DATA_DIR.glob("*.json"):
            data_files.add(file.stem)  # 文件名（不含扩展名）
            # 统计该文件的视频数量
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    videos = data.get('videos', [])
                    total_videos += len(videos)
            except Exception as e:
                print(f"读取文件 {file} 时出错: {e}")
    
    print(f"发现 {len(data_files)} 个数据文件，共 {total_videos} 个视频")
    
    def process_channels(channels_list, parent_key=None):
        """递归处理频道列表"""
        updated_count = 0
        
        for channel in channels_list:
            if isinstance(channel, dict) and 'name' in channel:
                channel_name = channel['name']
                safe_name = safe_filename(channel_name)
                
                # 检查是否存在对应的数据文件
                is_cached = safe_name in data_files
                old_cached = channel.get('cached', False)
                
                # 更新缓存状态
                channel['cached'] = is_cached
                
                if is_cached != old_cached:
                    status = "已缓存" if is_cached else "未缓存"
                    print(f"  {channel_name}: {status}")
                    updated_count += 1
                elif is_cached:
                    print(f"  {channel_name}: 已缓存")
        
        return updated_count
    
    # 处理所有频道
    total_updated = 0
    for category, subcategories in channels_data.items():
        if isinstance(subcategories, dict):
            for subcategory, channels in subcategories.items():
                if isinstance(channels, list):
                    print(f"\n处理 {category} - {subcategory}:")
                    updated = process_channels(channels, f"{category}-{subcategory}")
                    total_updated += updated
    
    # 保存更新后的配置
    if total_updated > 0:
        with open(CHANNELS_FILE, 'w', encoding='utf-8') as f:
            json.dump(channels_data, f, ensure_ascii=False, indent=4)
        print(f"\n已更新 {total_updated} 个频道的缓存状态")
    else:
        print("\n所有频道的缓存状态都是最新的")
    
    return total_videos


def git_commit(total_videos):
    """提交更改到 git"""
    try:
        # 添加所有更改
        subprocess.run(['git', 'add', '.'], check=True)
        
        # 生成提交信息（使用当前时间戳和视频数量）
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        commit_message = f"更新频道缓存标记 - {timestamp} (共 {total_videos} 个视频)"
        
        # 提交更改
        subprocess.run(['git', 'commit', '-m', commit_message], check=True)
        
        print(f"✅ 已提交到 git: {commit_message}")
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Git 提交失败: {e}")
        print("请检查 git 配置和网络连接")
    except FileNotFoundError:
        print("❌ 未找到 git 命令，请确保已安装 git")
    except Exception as e:
        print(f"❌ 提交过程中出现错误: {e}")


def main():
    print("=== 更新频道缓存标记 ===")
    total_videos = mark_cached_status()
    print("=== 缓存标记更新完成 ===")
    
    print("\n=== 提交到 Git ===")
    git_commit(total_videos)
    print("=== 所有操作完成 ===")


if __name__ == "__main__":
    main()
