#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
查找并重命名缺少JSON文件的频道
通过比对频道名称、文件名和bakname来找到对应的文件
"""

import json
import os
import re
import shutil
from pathlib import Path

# 添加项目根目录到Python路径
PROJECT_ROOT = Path(__file__).parent.parent

def normalize_name(name):
    """标准化名称，用于比较"""
    if not name:
        return ""
    # 移除特殊字符，转换为小写
    normalized = re.sub(r'[^\w\u4e00-\u9fff]', '', name.lower())
    return normalized

def find_matching_files(missing_channels, data_dir):
    """为缺少JSON文件的频道找到匹配的文件"""
    
    # 获取data目录中所有JSON文件
    json_files = list(data_dir.glob("*.json"))
    print(f"📁 data目录中找到 {len(json_files)} 个JSON文件")
    
    matches = []
    unmatched_channels = []
    
    for channel in missing_channels:
        channel_name = channel['name']
        bakname = channel.get('bakname', '')
        expected_filename = f"{bakname}.json"
        
        print(f"\n🔍 查找频道: {channel_name}")
        print(f"   Bakname: {bakname}")
        print(f"   期望文件名: {expected_filename}")
        
        # 1. 直接匹配bakname
        direct_match = data_dir / expected_filename
        if direct_match.exists():
            print(f"   ✅ 直接匹配找到: {expected_filename}")
            matches.append({
                'channel': channel,
                'source_file': direct_match,
                'target_file': direct_match,
                'match_type': 'direct'
            })
            continue
        
        # 2. 通过频道名称匹配
        best_match = None
        best_score = 0
        
        for json_file in json_files:
            filename = json_file.stem  # 不带扩展名的文件名
            
            # 计算匹配分数
            score = 0
            
            # 频道名称匹配
            if channel_name in filename or filename in channel_name:
                score += 3
            
            # 标准化名称匹配
            norm_channel = normalize_name(channel_name)
            norm_filename = normalize_name(filename)
            if norm_channel and norm_filename:
                if norm_channel in norm_filename or norm_filename in norm_channel:
                    score += 2
                elif norm_channel == norm_filename:
                    score += 5
            
            # bakname匹配
            if bakname and bakname in filename:
                score += 4
            
            # URL关键词匹配
            url = channel.get('url', '')
            if url:
                # 提取URL中的关键词
                url_keywords = []
                if '@' in url:
                    url_keywords.append(url.split('@')[-1].split('/')[0])
                if 'channel/' in url:
                    channel_id = url.split('channel/')[-1].split('/')[0]
                    if channel_id:
                        url_keywords.append(f"channel_{channel_id[:10]}")
                
                for keyword in url_keywords:
                    if keyword and keyword in filename:
                        score += 3
            
            if score > best_score:
                best_score = score
                best_match = json_file
        
        if best_match and best_score >= 2:
            print(f"   ✅ 找到匹配文件: {best_match.name} (匹配分数: {best_score})")
            matches.append({
                'channel': channel,
                'source_file': best_match,
                'target_file': data_dir / expected_filename,
                'match_type': 'fuzzy',
                'score': best_score
            })
        else:
            print(f"   ❌ 未找到匹配文件")
            unmatched_channels.append(channel)
    
    return matches, unmatched_channels

def rename_matched_files(matches):
    """重命名匹配的文件"""
    renamed_count = 0
    
    print(f"\n🔄 开始重命名 {len(matches)} 个匹配的文件...")
    
    for match in matches:
        channel = match['channel']
        source_file = match['source_file']
        target_file = match['target_file']
        
        if source_file == target_file:
            print(f"   ✅ {source_file.name} 已经是正确名称")
            continue
        
        try:
            # 如果目标文件已存在，先备份
            if target_file.exists():
                backup_file = target_file.with_suffix('.json.backup')
                shutil.move(str(target_file), str(backup_file))
                print(f"   📦 备份现有文件: {backup_file.name}")
            
            # 重命名文件
            shutil.move(str(source_file), str(target_file))
            print(f"   ✅ 重命名: {source_file.name} -> {target_file.name}")
            renamed_count += 1
            
        except Exception as e:
            print(f"   ❌ 重命名失败: {source_file.name} -> {target_file.name}, 错误: {e}")
    
    return renamed_count

def main():
    """主函数"""
    print("🔍 开始查找并重命名缺少JSON文件的频道...")
    
    # 读取all_channels.json
    all_channels_file = PROJECT_ROOT / 'all_channels.json'
    data_dir = PROJECT_ROOT / 'data'
    
    if not all_channels_file.exists():
        print(f"❌ 错误: {all_channels_file} 不存在")
        return
    
    if not data_dir.exists():
        print(f"❌ 错误: {data_dir} 目录不存在")
        return
    
    # 加载频道配置
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
    
    # 找出缺少JSON文件的频道
    missing_channels = []
    for channel in all_channels:
        if not channel.get('bakname'):
            continue
            
        bakname = channel['bakname']
        json_file = data_dir / f"{bakname}.json"
        
        if not json_file.exists():
            missing_channels.append(channel)
    
    print(f"📊 找到 {len(missing_channels)} 个缺少JSON文件的频道")
    
    # 查找匹配的文件
    matches, unmatched = find_matching_files(missing_channels, data_dir)
    
    print(f"\n📋 匹配结果:")
    print(f"   ✅ 找到匹配: {len(matches)} 个")
    print(f"   ❌ 未找到匹配: {len(unmatched)} 个")
    
    if matches:
        # 显示匹配详情
        print(f"\n📝 匹配详情:")
        for i, match in enumerate(matches, 1):
            channel = match['channel']
            source_file = match['source_file']
            target_file = match['target_file']
            print(f"{i:2d}. {channel['name']}")
            print(f"    源文件: {source_file.name}")
            print(f"    目标文件: {target_file.name}")
            print(f"    匹配类型: {match['match_type']}")
            if 'score' in match:
                print(f"    匹配分数: {match['score']}")
            print()
        
        # 自动执行重命名
        print("🔄 自动执行重命名操作...")
        renamed_count = rename_matched_files(matches)
        print(f"\n✅ 成功重命名 {renamed_count} 个文件")
    
    if unmatched:
        print(f"\n❌ 未找到匹配的频道:")
        for i, channel in enumerate(unmatched, 1):
            print(f"{i:2d}. {channel['name']} (bakname: {channel.get('bakname', 'N/A')})")
    
    print("\n" + "=" * 80)
    print("查找和重命名完成！")

if __name__ == "__main__":
    main()
