#!/usr/bin/env python3
"""
智能重命名数据文件以匹配bakname的脚本
这个脚本会尝试将现有的数据文件重命名为对应的bakname，而不是删除它们
"""
import json
import shutil
import re
from pathlib import Path

def normalize_name(name):
    """标准化名称，用于匹配"""
    # 移除特殊字符，转换为小写
    normalized = re.sub(r'[^\w\-_.]', '_', name.lower())
    # 合并多个下划线
    normalized = re.sub(r'_+', '_', normalized)
    return normalized.strip('_')

def find_matching_channel(filename, channels_data):
    """在频道数据中查找匹配的频道"""
    file_stem = Path(filename).stem
    
    def search_in_channels(channels):
        matches = []
        if isinstance(channels, list):
            for channel in channels:
                if isinstance(channel, dict) and 'name' in channel:
                    name = channel['name']
                    bakname = channel.get('bakname', '')
                    
                    # 尝试多种匹配方式
                    name_normalized = normalize_name(name)
                    file_normalized = normalize_name(file_stem)
                    
                    # 1. 直接匹配bakname
                    if bakname and file_stem == bakname:
                        matches.append((channel, 'bakname_exact'))
                    
                    # 2. 标准化后匹配name
                    elif name_normalized == file_normalized:
                        matches.append((channel, 'name_normalized'))
                    
                    # 3. 部分匹配
                    elif name_normalized in file_normalized or file_normalized in name_normalized:
                        matches.append((channel, 'name_partial'))
                    
                    # 4. 检查是否包含关键字符
                    elif any(char in file_normalized for char in name_normalized.split('_') if len(char) > 2):
                        matches.append((channel, 'name_keywords'))
        
        elif isinstance(channels, dict):
            for key, value in channels.items():
                matches.extend(search_in_channels(value))
        
        return matches
    
    return search_in_channels(channels_data)

def smart_rename_files():
    """智能重命名数据文件"""
    data_dir = Path("data")
    channels_file = data_dir / "youtube_channels.json"
    japan_file = Path("japan_tv_youtube_channels.json")
    
    if not channels_file.exists():
        print("❌ youtube_channels.json 文件不存在")
        return
    
    # 加载频道配置
    with open(channels_file, 'r', encoding='utf-8') as f:
        channels_data = json.load(f)
    
    # 如果japan文件存在，也加载它
    japan_data = {}
    if japan_file.exists():
        with open(japan_file, 'r', encoding='utf-8') as f:
            japan_data = json.load(f)
    
    # 合并两个数据源
    all_channels = {**channels_data, **japan_data}
    
    # 收集所有有效的bakname
    valid_baknames = set()
    channel_map = {}
    
    def collect_baknames(channels):
        if isinstance(channels, list):
            for channel in channels:
                if isinstance(channel, dict) and 'name' in channel:
                    bakname = channel.get('bakname', '')
                    if bakname:
                        valid_baknames.add(bakname)
                        channel_map[bakname] = channel
        elif isinstance(channels, dict):
            for key, value in channels.items():
                collect_baknames(value)
    
    collect_baknames(all_channels)
    
    print(f"找到 {len(valid_baknames)} 个有效的bakname")
    
    # 处理现有文件
    existing_files = [f for f in data_dir.glob("*.json") if f.name != "youtube_channels.json"]
    print(f"找到 {len(existing_files)} 个JSON文件需要处理")
    
    renamed_count = 0
    kept_count = 0
    no_match_count = 0
    
    for file_path in existing_files:
        file_stem = file_path.stem
        
        # 如果文件名已经是有效的bakname，保持不变
        if file_stem in valid_baknames:
            print(f"✅ 保持: {file_path.name} (已经是正确的bakname)")
            kept_count += 1
            continue
        
        # 尝试找到匹配的频道
        matches = find_matching_channel(file_path.name, all_channels)
        
        if matches:
            # 选择最佳匹配
            best_match = matches[0]  # 按优先级排序：exact > normalized > partial > keywords
            channel, match_type = best_match
            bakname = channel.get('bakname', '')
            
            if bakname:
                new_file = data_dir / f"{bakname}.json"
                
                if not new_file.exists():
                    shutil.move(str(file_path), str(new_file))
                    print(f"✅ 重命名: {file_path.name} -> {bakname}.json ({match_type})")
                    renamed_count += 1
                else:
                    # 如果目标文件已存在，比较文件大小
                    if file_path.stat().st_size > new_file.stat().st_size:
                        shutil.move(str(file_path), str(new_file))
                        print(f"✅ 替换: {file_path.name} -> {bakname}.json (更大文件)")
                        renamed_count += 1
                    else:
                        file_path.unlink()
                        print(f"🗑️  删除: {file_path.name} (较小文件)")
                        no_match_count += 1
            else:
                print(f"⚠️  跳过: {file_path.name} (频道没有bakname)")
                no_match_count += 1
        else:
            print(f"❌ 无匹配: {file_path.name}")
            no_match_count += 1
    
    print(f"\n=== 重命名完成 ===")
    print(f"重命名: {renamed_count} 个文件")
    print(f"保持: {kept_count} 个文件")
    print(f"无匹配/删除: {no_match_count} 个文件")

if __name__ == "__main__":
    smart_rename_files()
