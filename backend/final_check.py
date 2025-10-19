#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
最终检查：统计所有频道和JSON文件的匹配情况
"""

import json
import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).parent.parent

def final_check():
    """最终检查所有频道和JSON文件的匹配情况"""
    
    print("🔍 最终检查：频道和JSON文件匹配情况")
    print("=" * 80)
    
    # 读取all_channels.json
    all_channels_file = PROJECT_ROOT / 'all_channels.json'
    data_dir = PROJECT_ROOT / 'data'
    
    with open(all_channels_file, 'r', encoding='utf-8') as f:
        channels_data = json.load(f)
    
    # 收集所有频道
    all_channels = []
    
    def collect_channels(category_data, category_name=""):
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
    
    print(f"📊 频道统计:")
    print(f"   总频道数: {len(all_channels)}")
    
    # 统计有bakname的频道
    channels_with_bakname = [ch for ch in all_channels if ch.get('bakname')]
    print(f"   有bakname的频道: {len(channels_with_bakname)}")
    
    # 检查JSON文件
    json_files = list(data_dir.glob("*.json"))
    print(f"   data目录JSON文件数: {len(json_files)}")
    
    # 检查匹配情况
    matched_channels = 0
    missing_channels = 0
    
    print(f"\n📋 详细检查结果:")
    print("-" * 80)
    
    for channel in channels_with_bakname:
        bakname = channel['bakname']
        json_file = data_dir / f"{bakname}.json"
        
        if json_file.exists():
            matched_channels += 1
            print(f"✅ {channel['name']} -> {json_file.name}")
        else:
            missing_channels += 1
            print(f"❌ {channel['name']} -> {bakname}.json (缺失)")
    
    print("-" * 80)
    print(f"📈 最终统计:")
    print(f"   ✅ 有JSON文件的频道: {matched_channels}")
    print(f"   ❌ 缺少JSON文件的频道: {missing_channels}")
    print(f"   📁 data目录中的JSON文件: {len(json_files)}")
    print(f"   📊 匹配率: {matched_channels/len(channels_with_bakname)*100:.1f}%")
    
    # 检查data目录中的额外文件
    expected_files = {f"{ch.get('bakname', '')}.json" for ch in channels_with_bakname if ch.get('bakname')}
    actual_files = {f.name for f in json_files}
    extra_files = actual_files - expected_files
    
    print(f"\n📁 额外文件统计:")
    print(f"   期望的JSON文件: {len(expected_files)}")
    print(f"   实际的JSON文件: {len(actual_files)}")
    print(f"   额外文件数量: {len(extra_files)}")
    
    if extra_files:
        print(f"\n📋 前10个额外文件:")
        for i, file in enumerate(sorted(extra_files)[:10], 1):
            print(f"   {i:2d}. {file}")
        if len(extra_files) > 10:
            print(f"   ... 还有 {len(extra_files) - 10} 个文件")
    
    print("\n" + "=" * 80)
    print("最终检查完成！")

if __name__ == "__main__":
    final_check()
