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
# 基本使用，每个频道获取500个视频
python get_channel_videos.py


# 指定每个频道获取1000个视频
python get_channel_videos.py --videos-per-channel 1000


# 自动任务模式，自动管理API配额
功能：指定每个频道获取的视频数量为250个
适中数量：250个视频是一个平衡的选择，既能获取足够的内容，又不会过度消耗API配额
API调用：每个频道约需5次API调用（250÷50=5）
配额计算：系统会根据这个数值计算每个API密钥可以处理的频道数量

python get_channel_videos.py --auto-task --videos-per-channel 250 --yes


# 强制更新所有频道，忽略时间检查
python get_channel_videos.py --force
"""

# 最大结果数
MAX_RESULTS = 50

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
    
    # 统一处理所有层级的频道数据
    channels_to_process = []
    
    # 将不同结构的数据统一转换为频道列表
    if isinstance(channels_data, dict):
        for category, items in channels_data.items():
            if isinstance(items, list):
                channels_to_process.extend(items)
    elif isinstance(channels_data, list):
        channels_to_process.extend(channels_data)
    
    # 统一处理所有频道
    for channel in channels_to_process:
        # 如果skip为true则跳过处理
        if channel.get("skip"):
            continue
            
        if channel.get("url"):
            # 提取URL中的关键字
            match = re.search(r'(?:youtube\.com/(?:@|c/|channel/|user/)?)([^/]+)(?:/.*)?$', channel["url"])
            if match:
                keyword = match.group(1)
                # 构建API URL
                api_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={urllib.parse.quote(keyword)}&type=channel&key={API_KEY}&maxResults=10"
                result.append({
                    "name": channel["name"],
                    "url": api_url
                })
    
    return result

# 处理所有分类
for category, channels in data.items():
    channel_search_info.extend(process_channels(channels))

# 打印结果数量
print(f"总共生成了 {len(channel_search_info)} 个搜索URL")
# for info in channel_search_info:
#     print(f"频道名称: {info['name']}")
#     print(f"搜索URL: {info['url']}")
#     print("-" * 50)

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

# 将频道分成5组，每组使用不同的API密钥
def process_channels_in_groups():
    # 假设您有100个频道
    total_channels = len(shuffled_info)
    channels_per_group = (total_channels + len(api_keys) - 1) // len(api_keys)
    
    print(f"总共有 {total_channels} 个频道，分成 {len(api_keys)} 组，每组约 {channels_per_group} 个频道")
    
    for i, api_key in enumerate(api_keys):
        start_idx = i * channels_per_group
        end_idx = min((i + 1) * channels_per_group, total_channels)
        
        if start_idx >= total_channels:
            break
            
        group_channels = shuffled_info[start_idx:end_idx]
        print(f"\n=== 处理第 {i+1} 组频道 (使用API密钥 {api_key[:5]}...{api_key[-3:]}) ===")
        print(f"本组包含 {len(group_channels)} 个频道")
        
        # 为这组频道设置全局API密钥
        global API_KEY
        API_KEY = api_key
        
        # 处理这组频道
        for info in group_channels:
            try:
                process_channel(info)
            except Exception as e:
                print(f"处理频道 {info['name']} 时出错: {str(e)}")
                continue

# 处理单个频道的函数
def process_channel(info, videos_per_channel=500, auto_confirm=False):
    print(f'\n准备处理频道: {info["name"]}')
    
    # 检查缓存
    data_filename = f'../data/{info["name"]}.json'
    if os.path.exists(data_filename):
        # 获取文件的最后修改时间
        file_mtime = os.path.getmtime(data_filename)
        current_time = datetime.now().timestamp()
        time_diff = current_time - file_mtime
        
        # 如果文件是48小时内创建的,跳过处理
        if time_diff < 48 * 3600:
            print(f'频道 {info["name"]} 的数据在48小时内已更新,跳过处理')
            return
        
        # 检查频道是否有新视频
        try:
            # 读取缓存的数据
            with open(data_filename, 'r', encoding='utf-8') as f:
                cached_data = json.load(f)
            
            # 获取缓存的频道ID
            channel_id = cached_data.get('channel_id')
            
            if channel_id:
                # 获取频道最新视频信息
                playlist_id = f'UU{channel_id[2:]}'
                url = f'https://www.googleapis.com/youtube/v3/playlistItems'
                params = {
                    'part': 'snippet',
                    'playlistId': playlist_id,
                    'maxResults': 1,
                    'key': API_KEY
                }
                
                response = requests.get(url, params=params)
                if response.status_code == 200:
                    latest_data = response.json()
                    if 'items' in latest_data and len(latest_data['items']) > 0:
                        latest_video = latest_data['items'][0]
                        latest_video_id = latest_video['snippet']['resourceId']['videoId']
                        
                        # 检查最新视频是否已在缓存中
                        cached_video_ids = [video['snippet']['resourceId']['videoId'] 
                                          for video in cached_data.get('videos', [])]
                        
                        if latest_video_id in cached_video_ids:
                            # 最新视频已在缓存中，且缓存文件不太旧，可以跳过
                            if time_diff < 7 * 24 * 3600:  # 7天
                                print(f'频道 {info["name"]} 没有新视频且缓存不超过7天，跳过处理')
                                return
                            else:
                                print(f'频道 {info["name"]} 没有新视频，但缓存已超过7天，将更新')
        except Exception as e:
            print(f"检查频道新视频时出错: {str(e)}")
            # 出错时继续处理，以确保数据更新
    
    # 计算API调用次数
    api_calls = (videos_per_channel + 49) // 50  # 向上取整
    
    # 提示用户确认
    if not auto_confirm and videos_per_channel > 100:
        print(f"\n警告: 即将获取频道 '{info['name']}' 的 {videos_per_channel} 个视频")
        print(f"这将消耗约 {api_calls} 次API调用")
        
        confirm = input(f"确定要处理频道 '{info['name']}' 吗? (y/n): ").strip().lower()
        if confirm != 'y' and confirm != 'yes':
            print(f"跳过处理频道 '{info['name']}'")
            return
    
    # 获取频道ID
    response = requests.get(info["url"])
    if response.status_code == 200:
        data = response.json()
        if 'items' in data and len(data['items']) > 0:
            channel_id = data['items'][0]['id']['channelId']
            
            # 获取视频数据
            all_videos = get_channel_videos_with_limit(channel_id, videos_per_channel)
            
            if all_videos:
                # 准备要保存的数据
                channel_name = get_channel_info(channel_id)
                data = {
                    'channel_id': channel_id,
                    'channel_name': channel_name,
                    'original_name': info["name"],
                    'updated_at': datetime.now().isoformat(),
                    'videos': all_videos
                }
                
                # 保存数据
                safe_name = "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in info["name"])
                filename = f'../source/{safe_name}.json'
                
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                print(f'视频数据已保存到: {filename}')
                
                # 处理文件
                try:
                    abs_path = os.path.abspath(filename)
                    subprocess.run(['python', 'source_processing.py', abs_path], check=True)
                    print(f"文件 {abs_path} 处理完成")
                except Exception as e:
                    print(f"处理文件时出错: {str(e)}")
            else:
                print(f'未能获取到频道 {info["name"]} 的视频')
        else:
            print(f'未找到频道信息: {info["name"]}')
    else:
        print(f'请求失败 ({response.status_code}): {info["url"]}')

# 获取指定数量的视频
def get_channel_videos_with_limit(channel_id, max_videos=500):
    """获取指定数量的视频，使用增量更新策略"""
    # 获取上传播放列表ID
    playlist_id = f'UU{channel_id[2:]}'
    url = f'https://www.googleapis.com/youtube/v3/playlistItems'
    
    # 检查是否有现有缓存
    cache_file = None
    cached_videos = []
    cached_video_ids = set()
    
    # 查找该频道的缓存文件
    for filename in os.listdir('../data/'):
        if filename.endswith('.json'):
            try:
                with open(f'../data/{filename}', 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if data.get('channel_id') == channel_id:
                        cache_file = f'../data/{filename}'
                        cached_videos = data.get('videos', [])
                        cached_video_ids = {v['snippet']['resourceId']['videoId'] for v in cached_videos if 'snippet' in v and 'resourceId' in v['snippet']}
                        break
            except Exception as e:
                print(f"读取缓存文件时出错: {str(e)}")
                continue
    
    # 增量更新策略
    if cached_videos:
        print(f"找到现有缓存，包含 {len(cached_videos)} 个视频")
        
        # 只获取最新的视频（通常只需要1-2页）
        new_videos = []
        params = {
            'part': 'snippet',
            'playlistId': playlist_id,
            'maxResults': MAX_RESULTS,
            'key': API_KEY
        }
        
        # 最多获取3页新视频
        for _ in range(3):
            try:
                response = requests.get(url, params=params)
                if response.status_code == 200:
                    data = response.json()
                    videos = data.get('items', [])
                    if not videos:
                        break
                    
                    # 检查是否有新视频
                    all_existing = True
                    for video in videos:
                        # 添加错误处理
                        if 'snippet' not in video or 'resourceId' not in video.get('snippet', {}):
                            continue
                            
                        video_id = video['snippet']['resourceId']['videoId']
                        if video_id not in cached_video_ids:
                            new_videos.append(video)
                            all_existing = False
                    
                    # 如果这一页全是已有视频，就不用继续了
                    if all_existing or 'nextPageToken' not in data:
                        break
                    
                    params['pageToken'] = data['nextPageToken']
                else:
                    print(f"API请求失败，状态码: {response.status_code}")
                    break
            except Exception as e:
                print(f"获取频道视频时出错: {str(e)}")
                traceback.print_exc()  # 打印详细错误信息
                break
        
        print(f"发现 {len(new_videos)} 个新视频")
        
        # 合并新旧视频，保持总数不超过max_videos
        all_videos = new_videos + cached_videos
        # 去重
        unique_videos = []
        seen_ids = set()
        for video in all_videos:
            # 添加错误处理
            if 'snippet' not in video or 'resourceId' not in video.get('snippet', {}):
                continue
                
            video_id = video['snippet']['resourceId']['videoId']
            if video_id not in seen_ids:
                unique_videos.append(video)
                seen_ids.add(video_id)
        
        # 随机打乱并返回
        if unique_videos:
            random.shuffle(unique_videos)
            return unique_videos[:max_videos]
        else:
            print("警告: 合并后没有有效视频，将尝试重新获取")
    
    # 如果没有缓存或合并后没有有效视频，使用原来的方法获取视频
    all_videos = []
    params = {
        'part': 'snippet',
        'playlistId': playlist_id,
        'maxResults': 50,
        'key': API_KEY
    }
    
    # 计算需要获取的页数（限制最大页数为20，约1000个视频）
    pages_needed = min(20, (max_videos + 49) // 50)  # 向上取整，但最多20页
    
    for _ in range(pages_needed):
        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                data = response.json()
                videos = data.get('items', [])
                if not videos:
                    break
                    
                # 过滤掉无效的视频
                valid_videos = [v for v in videos if 'snippet' in v and 'resourceId' in v.get('snippet', {})]
                all_videos.extend(valid_videos)
                
                if 'nextPageToken' not in data or len(all_videos) >= max_videos:
                    break
                    
                params['pageToken'] = data['nextPageToken']
            else:
                print(f"API请求失败，状态码: {response.status_code}")
                break
        except Exception as e:
            print(f"获取频道视频时出错: {str(e)}")
            traceback.print_exc()  # 打印详细错误信息
            break
    
    # 随机打乱并返回
    if all_videos:
        random.shuffle(all_videos)
        return all_videos[:max_videos]
    else:
        print(f"警告: 未能获取到任何有效视频")
        return []

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
        
# 修改main函数，移除only_uncached参数
def main(force_update=False, auto_task=False, videos_per_channel=500):
    # 获取所有频道
    channels_to_process = shuffled_info.copy()
    
    # 如果是自动任务模式，按优先级排序频道
    if auto_task:
        # 检查每个频道的缓存状态
        cached_channels = []
        
        for info in channels_to_process:
            data_filename = f'../data/{info["name"]}.json'
            if os.path.exists(data_filename):
                # 已缓存的频道，按最后更新时间排序
                file_mtime = os.path.getmtime(data_filename)
                cached_channels.append((info, file_mtime))
            else:
                # 如果有未缓存的频道（不太可能），放在最前面
                cached_channels.insert(0, (info, 0))
        
        # 对已缓存频道按更新时间排序（最旧的优先）
        cached_channels.sort(key=lambda x: x[1])
        channels_to_process = [item[0] for item in cached_channels]
        
        print(f"自动任务模式: 找到 {len(cached_channels)} 个频道，按最后更新时间排序")
    
    # 分组处理频道
    total_channels = len(channels_to_process)
    channels_per_group = (total_channels + len(api_keys) - 1) // len(api_keys)
    
    print(f"总共有 {total_channels} 个频道，分成 {len(api_keys)} 组，每组约 {channels_per_group} 个频道")
    
    # 计算每个API密钥可以处理的频道数量（考虑配额限制）
    # 假设每个频道需要 (videos_per_channel/50) 次API调用，每个密钥每天有10,000单位配额
    # 为安全起见，我们只使用配额的80%
    api_calls_per_channel = (videos_per_channel + 49) // 50
    safe_quota_per_key = 8000  # 80% of 10,000
    max_channels_per_key = safe_quota_per_key // api_calls_per_channel
    
    if auto_task:
        print(f"自动任务模式: 每个频道需要约 {api_calls_per_channel} 次API调用")
        print(f"每个API密钥安全配额为 {safe_quota_per_key} 单位，可以处理约 {max_channels_per_key} 个频道")
    
    # 处理频道
    channels_processed = 0
    for i, api_key in enumerate(api_keys):
        if channels_processed >= total_channels:
            break
            
        # 在自动任务模式下，限制每个密钥处理的频道数量
        channels_for_this_key = min(
            max_channels_per_key if auto_task else float('inf'),
            channels_per_group,
            total_channels - channels_processed
        )
        
        if channels_for_this_key <= 0:
            continue
            
        start_idx = channels_processed
        end_idx = channels_processed + channels_for_this_key
        
        group_channels = channels_to_process[start_idx:end_idx]
        print(f"\n=== 处理第 {i+1} 组频道 (使用API密钥 {api_key[:5]}...{api_key[-3:]}) ===")
        print(f"本组包含 {len(group_channels)} 个频道")
        
        # 为这组频道设置全局API密钥
        global API_KEY
        API_KEY = api_key
        
        # 处理这组频道
        for info in group_channels:
            try:
                # 在自动任务模式下自动确认
                process_channel(info, videos_per_channel, auto_confirm=auto_task)
                channels_processed += 1
            except Exception as e:
                print(f"处理频道 {info['name']} 时出错: {str(e)}")
                continue
    
    print(f"\n总共处理了 {channels_processed} 个频道")
    
    # 处理源文件
    process_source_files()

if __name__ == "__main__":
    # 添加命令行参数解析
    parser = argparse.ArgumentParser(description='处理YouTube频道视频数据')
    parser.add_argument('--force', '-f', action='store_true',
                      help='强制更新所有频道，忽略时间检查')
    parser.add_argument('--videos-per-channel', type=int, default=500,
                      help='每个频道获取的视频数量，默认500')
    parser.add_argument('--yes', '-y', action='store_true',
                      help='自动确认所有提示，不询问用户')
    parser.add_argument('--auto-task', action='store_true',
                      help='自动任务模式，优先处理未缓存频道，自动管理API配额')
    args = parser.parse_args()
    
    # 当请求大量视频时提示用户确认（除非是自动任务模式）
    if args.videos_per_channel > 100 and not args.yes and not args.auto_task:
        # 计算API调用次数和总频道数
        api_calls_per_channel = (args.videos_per_channel + 49) // 50  # 向上取整
        total_channels = len(shuffled_info)
        total_api_calls = api_calls_per_channel * total_channels
        print(f"\n警告: 您正在请求每个频道获取 {args.videos_per_channel} 个视频")
        print(f"这将消耗大量API配额:")
        print(f"- 每个频道约需 {api_calls_per_channel} 次API调用")
        print(f"- 总共有 {total_channels} 个频道")
        print(f"- 预计总共需要 {total_api_calls} 次API调用")
        print(f"- 您有 {len(api_keys)} 个API密钥，每个密钥每天配额约10,000单位")
        
        confirm = input("\n确定要继续整个处理过程吗? (y/n): ").strip().lower()
        if confirm != 'y' and confirm != 'yes':
            print("操作已取消")
            exit(0)
    
    # 自动任务模式
    if args.auto_task:
        main(args.force, True, args.videos_per_channel)
    # 使用自定义视频数量
    elif args.videos_per_channel:
        for info in shuffled_info:
            try:
                process_channel(info, args.videos_per_channel, args.yes)
            except Exception as e:
                print(f"处理频道 {info['name']} 时出错: {str(e)}")
        process_source_files()
    # 使用原有逻辑
    else:
        main(args.force)