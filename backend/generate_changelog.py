#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
生成最近30天的更新日志
"""

import json
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
import re


def get_git_log_last_30_days():
    """获取最近30天的Git提交记录"""
    try:
        # 计算30天前的日期
        since_date = (datetime.now() - timedelta(days=30)).strftime('%Y-%m-%d')
        
        # 获取Git日志（只要Actions机器人的提交）
        cmd = [
            'git', 'log',
            f'--since={since_date}',
            '--author=github-actions',
            '--pretty=format:%H|%at|%s',  # hash|timestamp|subject
            '--name-status',  # 显示文件变更状态
            '--'
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        return result.stdout
        
    except subprocess.CalledProcessError as e:
        print(f"错误：获取Git日志失败: {e}")
        return ""


def parse_git_log(log_text):
    """解析Git日志"""
    commits = []
    current_commit = None
    
    lines = log_text.strip().split('\n')
    
    for line in lines:
        if not line:
            continue
            
        # 提交行格式：hash|timestamp|subject
        if '|' in line and not line.startswith(('M\t', 'A\t', 'D\t')):
            if current_commit:
                commits.append(current_commit)
            
            parts = line.split('|')
            if len(parts) >= 3:
                commit_hash = parts[0]
                timestamp = int(parts[1])
                subject = '|'.join(parts[2:])  # 处理subject中可能包含|的情况
                
                current_commit = {
                    'hash': commit_hash[:7],  # 短hash
                    'date': datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M:%S'),
                    'timestamp': timestamp,
                    'message': subject,
                    'files': []
                }
        
        # 文件变更行
        elif current_commit and line.startswith(('M\t', 'A\t', 'D\t')):
            parts = line.split('\t')
            if len(parts) == 2:
                status = parts[0]  # M=修改, A=添加, D=删除
                filepath = parts[1]
                
                # 只关注data目录下的JSON文件
                if filepath.startswith('data/') and filepath.endswith('.json'):
                    channel_name = Path(filepath).stem
                    current_commit['files'].append({
                        'status': status,
                        'path': filepath,
                        'channel': channel_name
                    })
    
    # 添加最后一个commit
    if current_commit:
        commits.append(current_commit)
    
    return commits


def load_channels_info():
    """加载频道信息"""
    channels_file = Path(__file__).parent.parent / 'all_channels.json'
    
    try:
        with open(channels_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # 创建频道名称到信息的映射（同时支持 name 和 bakname）
        channel_map = {}
        
        # 遍历所有分类（如：全国放送局、地方放送局等）
        for category_name, subcategories in data.items():
            # 遍历子分类（如：日本テレビ系、TBS系等）
            for subcategory_name, channels in subcategories.items():
                # 遍历频道列表
                for channel in channels:
                    info = {
                        'display_name': channel.get('displayName', channel['name']),
                        'type': channel.get('type', 'tv'),
                        'category': category_name,
                        'subcategory': subcategory_name,
                        'url': channel.get('url', '')
                    }
                    
                    # 使用 name 作为 key
                    channel_map[channel['name']] = info
                    
                    # 如果有 bakname，也添加一个映射
                    if 'bakname' in channel:
                        channel_map[channel['bakname']] = info
        
        return channel_map
    except Exception as e:
        print(f"警告：加载频道信息失败: {e}")
        import traceback
        traceback.print_exc()
        return {}


def generate_changelog():
    """生成更新日志JSON文件"""
    print("🔍 获取最近30天的Git日志...")
    log_text = get_git_log_last_30_days()
    
    if not log_text:
        print("❌ 没有找到更新记录")
        return
    
    print("📝 解析Git日志...")
    commits = parse_git_log(log_text)
    
    print("📚 加载频道信息...")
    channel_map = load_channels_info()
    
    # 为每个文件添加频道详细信息
    for commit in commits:
        for file_info in commit['files']:
            channel_name = file_info['channel']
            if channel_name in channel_map:
                file_info.update(channel_map[channel_name])
            else:
                file_info['display_name'] = channel_name
                file_info['type'] = 'unknown'
    
    # 按时间戳降序排序
    commits.sort(key=lambda x: x['timestamp'], reverse=True)
    
    # 生成统计信息
    total_commits = len(commits)
    total_files = sum(len(c['files']) for c in commits)
    
    # 统计频道更新次数
    channel_update_count = {}
    for commit in commits:
        for file_info in commit['files']:
            channel = file_info['channel']
            channel_update_count[channel] = channel_update_count.get(channel, 0) + 1
    
    # 生成输出数据
    output = {
        'generated_at': datetime.now().isoformat(),
        'period': '最近30天',
        'statistics': {
            'total_commits': total_commits,
            'total_files_changed': total_files,
            'channels_updated': len(channel_update_count)
        },
        'commits': commits
    }
    
    # 保存到文件
    output_file = Path(__file__).parent.parent / 'changelog.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    
    print(f"✅ 更新日志已生成: {output_file}")
    print(f"📊 统计:")
    print(f"   - 提交数: {total_commits}")
    print(f"   - 文件变更数: {total_files}")
    print(f"   - 更新频道数: {len(channel_update_count)}")


if __name__ == '__main__':
    generate_changelog()

