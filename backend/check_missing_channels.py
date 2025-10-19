#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
检查all_channels.json中缺少对应JSON文件的频道
"""

import json
import os
import sys
from pathlib import Path

# 添加项目根目录到Python路径
PROJECT_ROOT = Path(__file__).parent.parent
sys.path.append(str(PROJECT_ROOT))

def check_missing_channels():
    """检查all_channels.json中缺少对应JSON文件的频道"""
    
    # 读取all_channels.json
    all_channels_file = PROJECT_ROOT / 'all_channels.json'
    data_dir = PROJECT_ROOT / 'data'
    
    if not all_channels_file.exists():
        print(f"❌ 错误: {all_channels_file} 不存在")
        return
    
    if not data_dir.exists():
        print(f"❌ 错误: {data_dir} 目录不存在")
        return
    
    print("🔍 开始检查缺少JSON文件的频道...")
    print(f"📁 数据目录: {data_dir}")
    print(f"📄 频道配置文件: {all_channels_file}")
    print("-" * 80)
    
    # 加载频道配置
    with open(all_channels_file, 'r', encoding='utf-8') as f:
        channels_data = json.load(f)
    
    # 收集所有频道
    all_channels = []
    
    def collect_channels(category_data, category_name=""):
        """递归收集所有频道"""
        if isinstance(category_data, dict):
            for key, value in category_data.items():
                if isinstance(value, list):
                    for item in value:
                        if isinstance(item, dict) and 'name' in item:
                            item['category'] = f"{category_name}/{key}" if category_name else key
                            all_channels.append(item)
                elif isinstance(value, dict):
                    collect_channels(value, f"{category_name}/{key}" if category_name else key)
    
    collect_channels(channels_data)
    
    print(f"📊 总共找到 {len(all_channels)} 个频道")
    print("-" * 80)
    
    # 检查每个频道是否有对应的JSON文件
    missing_channels = []
    existing_channels = []
    
    for channel in all_channels:
        if not channel.get('bakname'):
            print(f"⚠️  频道 '{channel['name']}' 没有bakname字段")
            continue
            
        bakname = channel['bakname']
        json_file = data_dir / f"{bakname}.json"
        
        if json_file.exists():
            existing_channels.append(channel)
        else:
            missing_channels.append(channel)
    
    # 打印统计信息
    print(f"✅ 有JSON文件的频道: {len(existing_channels)} 个")
    print(f"❌ 缺少JSON文件的频道: {len(missing_channels)} 个")
    print("-" * 80)
    
    # 详细打印缺少JSON文件的频道
    if missing_channels:
        print("📋 缺少JSON文件的频道详细信息:")
        print("=" * 80)
        
        for i, channel in enumerate(missing_channels, 1):
            print(f"\n{i}. 频道名称: {channel['name']}")
            print(f"   Bakname: {channel.get('bakname', 'N/A')}")
            print(f"   URL: {channel.get('url', 'N/A')}")
            print(f"   类型: {channel.get('type', 'N/A')}")
            print(f"   分类: {channel.get('category', 'N/A')}")
            print(f"   缓存状态: {channel.get('cached', 'N/A')}")
            print(f"   跳过状态: {channel.get('skip', 'N/A')}")
            print(f"   期望的JSON文件: data/{channel.get('bakname', 'N/A')}.json")
            print("-" * 60)
    else:
        print("🎉 所有频道都有对应的JSON文件！")
    
    # 额外检查：data目录中是否有额外的JSON文件
    print("\n🔍 检查data目录中的额外文件...")
    data_files = list(data_dir.glob("*.json"))
    expected_files = {f"{ch.get('bakname', '')}.json" for ch in all_channels if ch.get('bakname')}
    actual_files = {f.name for f in data_files}
    
    extra_files = actual_files - expected_files
    if extra_files:
        print(f"📁 data目录中有 {len(extra_files)} 个额外的JSON文件:")
        for file in sorted(extra_files):
            print(f"   - {file}")
    else:
        print("✅ data目录中没有额外的JSON文件")
    
    print("\n" + "=" * 80)
    print("检查完成！")

if __name__ == "__main__":
    check_missing_channels()
