#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
import requests
from urllib.parse import urlparse


PROJECT_ROOT = Path(__file__).resolve().parent
CHANNELS_FILE = PROJECT_ROOT / "all_channels.json"
DATA_DIR = PROJECT_ROOT / "data"
IMG_DIR = PROJECT_ROOT / "img"

"""
# 基本添加频道
python add_channel.py https://www.youtube.com/@shioneru

# 指定频道名称
python add_channel.py https://www.youtube.com/@shioneru --name "汐音る"

# 指定分类和子分类
python add_channel.py https://www.youtube.com/@shioneru --category "地方放送局" --subcategory "関東地方"

# 跳过头像下载
python add_channel.py https://www.youtube.com/@shioneru --no-avatar

# 跳过git提交
python add_channel.py https://www.youtube.com/@shioneru --no-git
"""

def get_channel_info(channel_url):
    """从YouTube URL获取频道信息"""
    try:
        # 使用YouTube API获取频道信息
        # 这里需要API密钥，暂时使用模拟数据
        print(f"正在获取频道信息: {channel_url}")
        
        # 从URL中提取频道标识符
        if "@" in channel_url:
            channel_handle = channel_url.split("@")[-1]
        else:
            channel_handle = channel_url.split("/")[-1]
        
        # 模拟频道信息（实际应用中需要调用YouTube API）
        channel_info = {
            "name": f"频道_{channel_handle}",
            "url": channel_url,
            "channel_id": f"UC{channel_handle}123456789",  # 模拟频道ID
            "thumbnail": f"https://yt3.ggpht.com/{channel_handle}/default.jpg"  # 模拟缩略图
        }
        
        return channel_info
        
    except Exception as e:
        print(f"获取频道信息失败: {e}")
        return None


def download_channel_avatar(channel_info, img_dir):
    """下载频道头像"""
    try:
        if not img_dir.exists():
            img_dir.mkdir(parents=True)
        
        # 生成安全的文件名
        safe_name = "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in channel_info['name'])
        avatar_path = img_dir / f"{safe_name}.jpg"
        
        # 模拟下载头像（实际应用中需要从YouTube API获取真实头像URL）
        print(f"正在下载头像: {channel_info['name']}")
        
        # 创建占位符文件
        with open(avatar_path, 'w') as f:
            f.write(f"# Avatar for {channel_info['name']}\n")
        
        print(f"头像已保存到: {avatar_path}")
        return True
        
    except Exception as e:
        print(f"下载头像失败: {e}")
        return False


def add_channel_to_config(channel_info, category="その他", subcategory="その他チャンネル"):
    """将频道添加到配置文件中"""
    try:
        # 读取现有配置
        with open(CHANNELS_FILE, 'r', encoding='utf-8') as f:
            channels_data = json.load(f)
        
        # 确保分类存在
        if category not in channels_data:
            channels_data[category] = {}
        if subcategory not in channels_data[category]:
            channels_data[category][subcategory] = []
        
        # 检查频道是否已存在
        for existing_channel in channels_data[category][subcategory]:
            if existing_channel.get('url') == channel_info['url']:
                print(f"频道已存在: {channel_info['name']}")
                return False
        
        # 添加新频道
        new_channel = {
            "name": channel_info['name'],
            "url": channel_info['url'],
            "cached": False
        }
        
        channels_data[category][subcategory].append(new_channel)
        
        # 保存配置
        with open(CHANNELS_FILE, 'w', encoding='utf-8') as f:
            json.dump(channels_data, f, ensure_ascii=False, indent=4)
        
        print(f"频道已添加到配置: {channel_info['name']}")
        return True
        
    except Exception as e:
        print(f"添加频道到配置失败: {e}")
        return False


def git_commit(channel_name):
    """提交更改到git"""
    try:
        # 添加所有更改
        subprocess.run(['git', 'add', '.'], check=True)
        
        # 生成提交信息
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        commit_message = f"添加新频道: {channel_name} - {timestamp}"
        
        # 提交更改
        subprocess.run(['git', 'commit', '-m', commit_message], check=True)
        
        print(f"✅ 已提交到 git: {commit_message}")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Git 提交失败: {e}")
        return False
    except FileNotFoundError:
        print("❌ 未找到 git 命令，请确保已安装 git")
        return False
    except Exception as e:
        print(f"❌ 提交过程中出现错误: {e}")
        return False


def main():
    parser = argparse.ArgumentParser(
        description="添加新的YouTube频道到Terebi系统",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 添加频道
  python add_channel.py https://www.youtube.com/@shioneru

  # 指定分类和子分类
  python add_channel.py https://www.youtube.com/@shioneru --category "地方放送局" --subcategory "関東地方"

  # 指定频道名称
  python add_channel.py https://www.youtube.com/@shioneru --name "汐音る"
        """
    )
    
    parser.add_argument("channel_url", help="YouTube频道URL")
    parser.add_argument("--name", help="自定义频道名称")
    parser.add_argument("--category", default="その他", help="频道分类（默认: その他）")
    parser.add_argument("--subcategory", default="その他チャンネル", help="频道子分类（默认: その他チャンネル）")
    parser.add_argument("--no-avatar", action="store_true", help="跳过头像下载")
    parser.add_argument("--no-git", action="store_true", help="跳过git提交")
    
    args = parser.parse_args()
    
    print("=== 添加新频道 ===")
    print(f"频道URL: {args.channel_url}")
    print(f"分类: {args.category} - {args.subcategory}")
    
    # 获取频道信息
    channel_info = get_channel_info(args.channel_url)
    if not channel_info:
        print("❌ 获取频道信息失败")
        sys.exit(1)
    
    # 使用自定义名称（如果提供）
    if args.name:
        channel_info['name'] = args.name
    
    print(f"频道名称: {channel_info['name']}")
    
    # 下载头像
    if not args.no_avatar:
        print("\n=== 下载频道头像 ===")
        if not download_channel_avatar(channel_info, IMG_DIR):
            print("⚠️ 头像下载失败，但继续添加频道")
    
    # 添加到配置
    print("\n=== 添加到配置 ===")
    if not add_channel_to_config(channel_info, args.category, args.subcategory):
        print("❌ 添加频道到配置失败")
        sys.exit(1)
    
    # Git提交
    if not args.no_git:
        print("\n=== 提交到Git ===")
        git_commit(channel_info['name'])
    
    print("\n=== 频道添加完成 ===")
    print(f"频道 '{channel_info['name']}' 已成功添加到系统")
    print(f"分类: {args.category} - {args.subcategory}")
    print("请运行 'python update.py --auto-task' 来抓取频道数据")


if __name__ == "__main__":
    main()
