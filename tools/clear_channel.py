import os
import json
import re

# 读取JSON文件
print("正在读取频道配置文件...")
with open('../all_channels.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 获取img目录中的所有图片文件
print("正在检查img目录中的图片文件...")
img_dir = '../img'
if not os.path.exists(img_dir):
    print(f"错误: {img_dir} 目录不存在!")
    exit(1)

img_files = os.listdir(img_dir)
# 提取图片文件名（不含扩展名）
img_channel_names = set()
for img_file in img_files:
    if img_file.endswith(('.jpg', '.jpeg', '.png', '.gif')):
        base_name = os.path.splitext(img_file)[0]
        img_channel_names.add(base_name)

print(f"在img目录中找到 {len(img_channel_names)} 个频道图片")

# 遍历JSON数据，检查每个频道是否在img目录中有对应图片
channels_to_remove = []
channels_kept = []

def process_channels(channels_data, parent_key=None):
    """递归处理频道数据"""
    if isinstance(channels_data, dict):
        for key, value in list(channels_data.items()):
            if isinstance(value, (dict, list)):
                process_channels(value, key)
    elif isinstance(channels_data, list):
        for i, channel in enumerate(channels_data[:]):
            if isinstance(channel, dict) and "name" in channel:
                channel_name = channel["name"]
                # 检查该频道是否在img目录中有对应图片
                if channel_name not in img_channel_names:
                    channels_to_remove.append((parent_key, channel_name))
                    channels_data.remove(channel)
                else:
                    channels_kept.append(channel_name)

# 处理所有频道
for category, channels in data.items():
    process_channels(channels, category)

# 输出结果
print("\n处理结果:")
print(f"保留的频道数量: {len(channels_kept)}")
print(f"移除的频道数量: {len(channels_to_remove)}")

if channels_to_remove:
    print("\n以下频道已从配置文件中移除（因为在img目录中没有对应图片）:")
    for category, channel_name in channels_to_remove:
        print(f"- {channel_name} (分类: {category})")

# 保存更新后的JSON文件
print("\n正在保存更新后的频道配置文件...")
with open('../all_channels.json', 'w', encoding='utf-8') as file:
    json.dump(data, file, ensure_ascii=False, indent=4)

print("频道清理完成!")
