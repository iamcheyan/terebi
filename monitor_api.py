#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
API配额监控脚本
用于监控YouTube API的使用情况和频道更新状态
"""

import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
import requests
import configparser

PROJECT_ROOT = Path(__file__).parent
DATA_DIR = PROJECT_ROOT / "data"
LOG_DIR = PROJECT_ROOT / "log"

def load_api_keys():
    """加载API密钥"""
    config_file = PROJECT_ROOT / "WEB-INF" / "config.properties"
    if not config_file.exists():
        return []
    
    config = configparser.ConfigParser()
    config.read(config_file)
    api_keys = []
    
    for key, value in config['DEFAULT'].items():
        if key.startswith('youtube.apikey'):
            api_keys.append(value)
    
    return api_keys

def check_channel_data_status():
    """检查频道数据状态"""
    print("=== 频道数据状态检查 ===")
    
    if not DATA_DIR.exists():
        print("❌ 数据目录不存在")
        return
    
    json_files = list(DATA_DIR.glob("*.json"))
    print(f"📁 找到 {len(json_files)} 个数据文件")
    
    # 统计视频数量
    total_videos = 0
    empty_channels = 0
    recent_updates = 0
    
    cutoff_time = datetime.now() - timedelta(days=1)
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            videos = data.get('videos', [])
            video_count = len(videos)
            total_videos += video_count
            
            if video_count == 0:
                empty_channels += 1
            
            # 检查更新时间
            updated_at = data.get('updated_at', '')
            if updated_at:
                try:
                    update_time = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
                    if update_time > cutoff_time:
                        recent_updates += 1
                except:
                    pass
                    
        except Exception as e:
            print(f"⚠️ 读取文件失败: {json_file.name} - {e}")
    
    print(f"📊 统计信息:")
    print(f"  - 总视频数: {total_videos}")
    print(f"  - 空频道数: {empty_channels}")
    print(f"  - 最近更新: {recent_updates} 个频道")
    print(f"  - 数据完整性: {((len(json_files) - empty_channels) / len(json_files) * 100):.1f}%")

def estimate_api_usage():
    """估算API使用情况"""
    print("\n=== API使用情况估算 ===")
    
    api_keys = load_api_keys()
    if not api_keys:
        print("❌ 未找到API密钥")
        return
    
    print(f"🔑 可用API密钥: {len(api_keys)} 个")
    
    # 计算理论配额
    total_quota = len(api_keys) * 10000  # 每个密钥每天10,000单位
    safe_quota = total_quota * 0.5  # 使用50%的安全配额
    
    print(f"📈 配额信息:")
    print(f"  - 总配额: {total_quota:,} 单位/天")
    print(f"  - 安全配额: {safe_quota:,} 单位/天")
    
    # 估算当前配置的API使用
    videos_per_channel = 200
    api_calls_per_channel = (videos_per_channel + 49) // 50  # 向上取整
    quota_per_channel = api_calls_per_channel * 100  # 每次搜索调用消耗100单位
    
    print(f"🔢 当前配置估算:")
    print(f"  - 每频道视频数: {videos_per_channel}")
    print(f"  - 每频道API调用: {api_calls_per_channel} 次")
    print(f"  - 每频道配额消耗: {quota_per_channel} 单位")
    
    # 估算可处理的频道数
    max_channels = safe_quota // quota_per_channel
    print(f"  - 可处理频道数: 约 {max_channels} 个频道")

def check_recent_logs():
    """检查最近的日志"""
    print("\n=== 最近日志检查 ===")
    
    if not LOG_DIR.exists():
        print("❌ 日志目录不存在")
        return
    
    # 查找最近的日志文件
    log_files = list(LOG_DIR.glob("cron_update_*.log"))
    if not log_files:
        print("❌ 未找到更新日志")
        return
    
    # 按修改时间排序，获取最新的日志
    latest_log = max(log_files, key=lambda x: x.stat().st_mtime)
    print(f"📄 最新日志: {latest_log.name}")
    
    try:
        with open(latest_log, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 分析日志内容
        lines = content.split('\n')
        error_lines = [line for line in lines if '错误' in line or '失败' in line or 'ERROR' in line.upper()]
        success_lines = [line for line in lines if '成功' in line or '完成' in line or 'SUCCESS' in line.upper()]
        
        print(f"📊 日志分析:")
        print(f"  - 总行数: {len(lines)}")
        print(f"  - 错误行数: {len(error_lines)}")
        print(f"  - 成功行数: {len(success_lines)}")
        
        if error_lines:
            print(f"⚠️ 最近错误:")
            for error in error_lines[-3:]:  # 显示最后3个错误
                print(f"    {error}")
        
    except Exception as e:
        print(f"❌ 读取日志失败: {e}")

def main():
    print("🔍 Terebi API监控工具")
    print("=" * 50)
    
    check_channel_data_status()
    estimate_api_usage()
    check_recent_logs()
    
    print("\n" + "=" * 50)
    print("✅ 监控完成")

if __name__ == "__main__":
    main()
