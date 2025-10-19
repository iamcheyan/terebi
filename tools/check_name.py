import os
import json
import glob

# 打开 japan_tv_youtube_channels.json 文件
try:
    with open('../all_channels.json', 'r', encoding='utf-8') as f:
        channels_data = json.load(f)
except Exception as e:
    print(f"读取 japan_tv_youtube_channels.json 文件时出错: {e}")
    exit(1)

# 提取所有频道名称
channel_names = []

# 递归处理频道数据
def extract_channel_names(data):
    if isinstance(data, dict):
        for key, value in data.items():
            extract_channel_names(value)
    elif isinstance(data, list):
        for item in data:
            if isinstance(item, dict) and "name" in item:
                channel_names.append(item["name"])
            elif isinstance(item, (dict, list)):
                extract_channel_names(item)

# 处理所有频道
for category, channels in channels_data.items():
    extract_channel_names(channels)

print("all_channels.json 中的频道名称:")
print(f"共找到 {len(channel_names)} 个频道")
for name in channel_names:
    print(name)

print("\n" + "-" * 50 + "\n")

# 打开 ../data 目录
data_dir = "../data"
if not os.path.exists(data_dir):
    print(f"错误: {data_dir} 目录不存在!")
    exit(1)

# 获取所有 json 文件名（不含扩展名）
data_files = []
for file_path in glob.glob(os.path.join(data_dir, "*.json")):
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    data_files.append(base_name)

print("data 目录中的文件名（不含扩展名）:")
print(f"共找到 {len(data_files)} 个文件")
for name in data_files:
    print(name)

# 找出在 json 中但不在 data 目录中的频道
missing_channels = [name for name in channel_names if name not in data_files]
if missing_channels:
    print("\n" + "-" * 50 + "\n")
    print(f"在 all_channels.json 中找到但在 data 目录中未找到的频道: {len(missing_channels)} 个")
    for name in missing_channels:
        print(name)

# 找出在 data 目录中但不在 json 中的频道
extra_channels = [name for name in data_files if name not in channel_names]
if extra_channels:
    print("\n" + "-" * 50 + "\n")
    print(f"在 data 目录中找到但在 all_channels.json 中未找到的频道: {len(extra_channels)} 个")
    for name in extra_channels:
        print(name)
