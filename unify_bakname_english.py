#!/usr/bin/env python3
"""
统一所有bakname为英文格式
"""
import json
import re
from pathlib import Path

def sanitize_to_english(name: str) -> str:
    """将名称转换为英文格式的bakname"""
    # 移除所有非ASCII字符（包括日文），只保留字母数字、连字符、下划线
    safe_name = re.sub(r'[^\w\-]', '_', name)
    # 替换多个连续的下划线为单个下划线
    safe_name = re.sub(r'_+', '_', safe_name)
    # 移除开头和结尾的下划线
    safe_name = safe_name.strip('_')
    # 如果为空，使用默认值
    if not safe_name:
        safe_name = "channel"
    return safe_name

def extract_handle_from_url(url: str) -> str:
    """从URL中提取handle作为bakname"""
    if not url:
        return ""
    
    # 匹配 @handle 格式
    match = re.search(r'@([\w\-]+)', url)
    if match:
        return match.group(1)
    
    # 匹配 /c/handle 格式
    match = re.search(r'/c/([\w\-]+)', url)
    if match:
        return match.group(1)
    
    # 匹配 /user/handle 格式
    match = re.search(r'/user/([\w\-]+)', url)
    if match:
        return match.group(1)
    
    return ""

def update_json_file(file_path: Path):
    """更新JSON文件中的bakname为英文格式"""
    print(f"处理文件: {file_path.name}")
    
    if not file_path.exists():
        print(f"❌ 文件不存在: {file_path}")
        return
    
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"❌ 读取 {file_path.name} 失败: {e}")
        return
    
    updated = False
    
    def process_channels(channels_list):
        nonlocal updated
        if isinstance(channels_list, list):
            for channel in channels_list:
                if isinstance(channel, dict) and "name" in channel:
                    old_bakname = channel.get("bakname", "")
                    url = channel.get("url", "")
                    
                    # 优先从URL中提取handle
                    new_bakname = extract_handle_from_url(url)
                    
                    # 如果无法从URL提取，则使用清理后的name
                    if not new_bakname:
                        new_bakname = sanitize_to_english(channel["name"])
                    
                    # 只有当bakname发生变化时才更新
                    if new_bakname != old_bakname:
                        channel["bakname"] = new_bakname
                        print(f"  {channel['name']}: {old_bakname} -> {new_bakname}")
                        updated = True
    
    # 处理不同的数据结构
    for category, channels_list in data.items():
        if isinstance(channels_list, list):
            process_channels(channels_list)
        elif isinstance(channels_list, dict):
            for sub_category, sub_channels_list in channels_list.items():
                if isinstance(sub_channels_list, list):
                    process_channels(sub_channels_list)
    
    if updated:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"✅ 已更新文件: {file_path.name}")
    else:
        print(f"ℹ️  文件无需更新: {file_path.name}")

def main():
    print("=== 统一所有bakname为英文格式 ===")
    
    # 处理两个配置文件
    files_to_process = [
        Path(__file__).parent / "data" / "youtube_channels.json",
        Path(__file__).parent / "all_channels.json"
    ]
    
    for file_path in files_to_process:
        update_json_file(file_path)
    
    print("\n=== 统一完成 ===")

if __name__ == "__main__":
    main()
