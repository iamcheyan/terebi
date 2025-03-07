import json
import re
import random
import requests
import os
import urllib.parse
from datetime import datetime
import subprocess
import traceback
import argparse

"""
正常运行（处理所有频道）：python get_channel_videos.py
只处理未缓存频道：python get_channel_videos.py --only-uncached
"""

# 最大结果数
MAX_RESULTS = 100

# 读取JSON文件
with open('../japan_tv_youtube_channels.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 初始化URL列表
channel_search_urls = []

# 从配置文件读取API密钥
import configparser
config = configparser.ConfigParser()
config.read('../WEB-INF/config.properties')
api_keys = []

# 读取并显示所有可用的API密钥
print("\n=== 可用的API密钥 ===")
for key, value in config['DEFAULT'].items():
    if key.startswith('youtube.apikey'):
        print(f"密钥 {key}: {value[:15]}...{value[-5:]}")  # 只显示密钥的一部分，保护安全
        api_keys.append(value)

if not api_keys:
    raise ValueError("未能从配置文件中读取到任何API密钥，请检查配置文件路径和内容是否正确")

# 随机选择一个API密钥并显示
API_KEY = random.choice(api_keys)
print(f"\n当前选择使用的API密钥: {API_KEY[:15]}...{API_KEY[-5:]}")

# 初始化URL和名称的字典
channel_search_info = []

# 处理所有分类的频道
def process_channels(channels_data, is_nested=True):
    """
    处理频道数据，提取URL并构建API搜索URL
    
    参数:
    channels_data - 频道数据，可以是列表或字典
    is_nested - 是否是嵌套结构（如地方放送局）
    """
    result = []
    
    if isinstance(channels_data, dict):
        # 处理嵌套结构（如地方放送局）
        for category, items in channels_data.items():
            if isinstance(items, list):
                # 直接处理频道列表
                result.extend(process_channels(items, False))
            elif isinstance(items, dict):
                # 递归处理更深层次的嵌套
                result.extend(process_channels(items, True))
    elif isinstance(channels_data, list):
        # 处理频道列表
        for channel in channels_data:
            if channel.get("url"):
                # 提取URL中的关键字
                match = re.search(r'(?:youtube\.com/(?:@|c/|channel/|user/)?)([^/]+)(?:/.*)?$', channel["url"])
                if match:
                    keyword = match.group(1)
                    # 构建API URL
                    api_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={urllib.parse.quote(keyword)}&type=channel&key={API_KEY}&maxResults=10"
                    result.append({
                        "name": channel["name"],
                        "url": api_url,
                        "cached": channel.get("cached", False)
                    })
    
    return result

# 处理所有分类
for category, channels in data.items():
    channel_search_info.extend(process_channels(channels))

# 打印结果数量
print(f"总共生成了 {len(channel_search_info)} 个搜索URL")
for info in channel_search_info:
    print(f"频道名称: {info['name']}")
    print(f"搜索URL: {info['url']}")
    print("-" * 50)

def get_channel_info(channel_id):
    url = f'https://www.googleapis.com/youtube/v3/channels'
    params = {
        'part': 'snippet',
        'id': channel_id,
        'key': API_KEY
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        if data['items']:
            return data['items'][0]['snippet']['title']
    return channel_id  # 如果获取失败，使用channel_id作为后备名称

def get_channel_videos(channel_id):
    # 获取上传播放列表ID
    playlist_id = f'UU{channel_id[2:]}'
    
    url = f'https://www.googleapis.com/youtube/v3/playlistItems'
    
    params = {
        'part': 'snippet',
        'playlistId': playlist_id,
        'maxResults': MAX_RESULTS,
        'key': API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()['items']
    return []

def save_videos_to_json(channel_id, original_name):
    # 确保source目录存在
    if not os.path.exists('../source'):
        os.makedirs('../source')
    
    # 获取频道名称
    channel_name = get_channel_info(channel_id)
    
    # 获取视频列表
    videos = get_channel_videos(channel_id)
    
    # 准备要保存的数据
    data = {
        'channel_id': channel_id,
        'channel_name': channel_name,
        'original_name': original_name,
        'updated_at': datetime.now().isoformat(),
        'videos': videos
    }
    
    # 使用原始名称作为文件名
    safe_name = "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in original_name)
    filename = f'../source/{safe_name}.json'
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    return filename

# 修正：使用channel_search_info而不是channel_search_urls
shuffled_info = channel_search_info.copy()
random.shuffle(shuffled_info)

# 主执行逻辑
def main(only_uncached=False, force_update=False):
    # 将频道按cached状态分组
    uncached_channels = [info for info in shuffled_info if not info.get("cached", True)]
    cached_channels = [info for info in shuffled_info if info.get("cached", True)]
    
    # 根据参数决定要处理的频道列表
    channels_to_process = uncached_channels if only_uncached else (uncached_channels + cached_channels)
    
    # 处理频道
    for info in channels_to_process:
        try:
            print(f'准备处理频道: {info["name"]} (cached: {info.get("cached", True)})')
            print(f'URL: {info["url"]}')
            
            # 检查data目录中是否已存在该频道的json文件
            data_filename = f'../data/{info["name"]}.json'
            if not force_update and os.path.exists(data_filename):
                # 获取文件的最后修改时间
                file_mtime = os.path.getmtime(data_filename)
                current_time = datetime.now().timestamp()
                time_diff = current_time - file_mtime
                
                # 如果文件是24小时内创建的,跳过处理
                if time_diff < 24 * 3600:
                    print(f'频道 {info["name"]} 的数据在24小时内已更新,跳过处理')
                    continue
                else:
                    print(f'频道 {info["name"]} 的数据已过期,准备更新')
            
            response = requests.get(info["url"])
            if response.status_code == 200:
                data = response.json()
                if 'items' in data and len(data['items']) > 0:
                    channel_id = data['items'][0]['id']['channelId']
                    filename = save_videos_to_json(channel_id, info["name"])
                    print(f'视频数据已保存到: {filename}')
                else:
                    print(f'未找到频道信息: {info["name"]}')
            else:
                print(f'请求失败 ({response.status_code}): {info["url"]}')
                # 尝试使用其他API密钥
                for api_key in api_keys[1:]:  # 从第二个key开始尝试
                    try:
                        print(f'尝试使用新的API密钥重试...')
                        # 更新请求URL中的API密钥
                        new_url = info["url"].replace(api_keys[0], api_key)
                        response = requests.get(new_url)
                        if response.status_code == 200:
                            data = response.json()
                            if 'items' in data and len(data['items']) > 0:
                                channel_id = data['items'][0]['id']['channelId']
                                # 获取视频数据
                                videos_data = get_videos_for_channel(channel_id, info["name"])
                                # 检查视频列表是否为空
                                if videos_data and 'videos' in videos_data and len(videos_data['videos']) > 0:
                                    filename = save_videos_to_json(channel_id, info["name"])
                                    print(f'使用新密钥成功,视频数据已保存到: {filename}')
                                else:
                                    print(f'频道 {info["name"]} 的视频列表为空，跳过保存')
                                break
                    except Exception as e:
                        print(f'使用新密钥尝试失败: {str(e)}')
                else:
                    print(f'所有API密钥都尝试失败,跳过该频道: {info["name"]}')
        except Exception as e:
            print(f'处理频道时发生错误: {info["name"]}, 错误: {str(e)}')

# 执行source_processing.py
def process_source_files():
    try:
        print("开始执行source_processing.py...")
        subprocess.run(['python', 'source_processing.py'], check=True)
        print("source_processing.py执行完成")
    except subprocess.CalledProcessError as e:
        print(f"执行source_processing.py时出错: {e}")
    except Exception as e:
        print(f"发生未知错误: {e}")
        traceback.print_exc()
        
if __name__ == "__main__":
    # 添加命令行参数解析
    parser = argparse.ArgumentParser(description='处理YouTube频道视频数据')
    parser.add_argument('--only-uncached', action='store_true', 
                      help='只处理未缓存的频道')
    parser.add_argument('--force', '-f', action='store_true',
                      help='强制更新所有频道，忽略时间检查')
    args = parser.parse_args()
    
    main(args.only_uncached, args.force)
    process_source_files()