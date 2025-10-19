#!/usr/bin/env python3
"""
重命名图片文件以匹配bakname
将img/目录中的图片文件重命名为对应的bakname
"""
import json
import shutil
import re
from pathlib import Path

DATA_DIR = Path("data")
IMG_DIR = Path("img")
CHANNELS_FILE = DATA_DIR / "youtube_channels.json"
JAPAN_CHANNELS_FILE = Path("japan_tv_youtube_channels.json")

def load_channels_from_file(file_path: Path) -> dict:
    """加载频道配置文件"""
    if not file_path.exists():
        return {}
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"❌ 读取文件失败 {file_path}: {e}")
        return {}

def normalize_name(name: str) -> str:
    """标准化名称，用于匹配"""
    # 移除特殊字符，转换为小写
    normalized = re.sub(r'[^\w\-_.]', '_', name.lower())
    # 合并多个下划线
    normalized = re.sub(r'_+', '_', normalized)
    return normalized.strip('_')

def find_matching_channel(image_name: str, channels_data: dict) -> tuple:
    """在频道数据中查找匹配的频道"""
    image_stem = Path(image_name).stem
    
    def search_in_channels(channels):
        matches = []
        if isinstance(channels, list):
            for channel in channels:
                if isinstance(channel, dict) and 'name' in channel and 'bakname' in channel:
                    name = channel['name']
                    bakname = channel['bakname']
                    
                    # 尝试多种匹配方式
                    name_normalized = normalize_name(name)
                    image_normalized = normalize_name(image_stem)
                    
                    # 1. 直接匹配bakname
                    if image_stem == bakname:
                        matches.append((channel, 'bakname_exact'))
                    
                    # 2. 标准化后匹配name
                    elif name_normalized == image_normalized:
                        matches.append((channel, 'name_normalized'))
                    
                    # 3. 部分匹配
                    elif name_normalized in image_normalized or image_normalized in name_normalized:
                        matches.append((channel, 'name_partial'))
                    
                    # 4. 检查是否包含关键字符
                    elif any(char in image_normalized for char in name_normalized.split('_') if len(char) > 2):
                        matches.append((channel, 'name_keywords'))
        
        elif isinstance(channels, dict):
            for key, value in channels.items():
                matches.extend(search_in_channels(value))
        
        return matches
    
    return search_in_channels(channels_data)

def rename_images():
    """重命名图片文件"""
    print("=== 开始重命名图片文件 ===")
    
    # 加载频道配置
    youtube_data = load_channels_from_file(CHANNELS_FILE)
    japan_data = load_channels_from_file(JAPAN_CHANNELS_FILE)
    
    # 合并数据
    all_channels = {**youtube_data, **japan_data}
    
    # 获取所有图片文件
    image_files = list(IMG_DIR.glob("*.jpg")) + list(IMG_DIR.glob("*.png"))
    print(f"找到 {len(image_files)} 个图片文件")
    
    renamed_count = 0
    kept_count = 0
    no_match_count = 0
    
    for image_file in image_files:
        # 跳过已经是bakname的文件
        if any(image_file.stem == bakname for bakname in get_all_baknames(all_channels)):
            print(f"✅ 保持: {image_file.name} (已经是正确的bakname)")
            kept_count += 1
            continue
        
        # 尝试找到匹配的频道
        matches = find_matching_channel(image_file.name, all_channels)
        
        if matches:
            # 选择最佳匹配
            best_match = matches[0]
            channel, match_type = best_match
            bakname = channel.get('bakname', '')
            
            if bakname:
                new_file = IMG_DIR / f"{bakname}.jpg"
                
                if not new_file.exists():
                    shutil.move(str(image_file), str(new_file))
                    print(f"✅ 重命名: {image_file.name} -> {bakname}.jpg ({match_type})")
                    renamed_count += 1
                else:
                    # 如果目标文件已存在，比较文件大小
                    if image_file.stat().st_size > new_file.stat().st_size:
                        shutil.move(str(image_file), str(new_file))
                        print(f"✅ 替换: {image_file.name} -> {bakname}.jpg (更大文件)")
                        renamed_count += 1
                    else:
                        image_file.unlink()
                        print(f"🗑️  删除: {image_file.name} (较小文件)")
                        no_match_count += 1
            else:
                print(f"⚠️  跳过: {image_file.name} (频道没有bakname)")
                no_match_count += 1
        else:
            print(f"❌ 无匹配: {image_file.name}")
            no_match_count += 1
    
    print(f"\n=== 重命名完成 ===")
    print(f"重命名: {renamed_count} 个文件")
    print(f"保持: {kept_count} 个文件")
    print(f"无匹配/删除: {no_match_count} 个文件")

def get_all_baknames(channels_data: dict) -> set:
    """获取所有有效的bakname"""
    baknames = set()
    
    def collect_baknames(channels):
        if isinstance(channels, list):
            for channel in channels:
                if isinstance(channel, dict) and 'bakname' in channel and channel['bakname']:
                    baknames.add(channel['bakname'])
        elif isinstance(channels, dict):
            for key, value in channels.items():
                collect_baknames(value)
    
    collect_baknames(channels_data)
    return baknames

if __name__ == "__main__":
    rename_images()
