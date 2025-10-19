import json
import re
import random
import os
import urllib.parse
import urllib.request
import urllib.error
from datetime import datetime
import subprocess
import traceback
import argparse
import time
import sys

# 统一路径，支持从项目根或 tools 目录执行
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
LOG_DIR = os.path.join(PROJECT_ROOT, 'log')
# 时间戳日志文件，避免覆盖
_LOG_TS = datetime.now().strftime('%Y%m%d_%H%M%S')
LOG_FILE = os.path.join(LOG_DIR, f'get_channel_videos_{_LOG_TS}.log')

# 将标准输出/错误同时写入文件与控制台
class _Tee:
    def __init__(self, stream, file_path):
        self._stream = stream
        # 确保日志目录存在
        try:
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
        except Exception:
            pass
        # 按追加方式写入，保证utf-8
        self._file = open(file_path, 'a', encoding='utf-8', buffering=1)

    def write(self, data):
        try:
            self._stream.write(data)
        except Exception:
            pass
        try:
            # 为每一行添加时间前缀，提升可读性
            if data:
                lines = data.splitlines(True)
                for line in lines:
                    if line.endswith('\n'):
                        self._file.write(f"[{datetime.now().isoformat()}] {line}")
                    else:
                        self._file.write(f"[{datetime.now().isoformat()}] {line}\n")
        except Exception:
            pass

    def flush(self):
        try:
            self._stream.flush()
        except Exception:
            pass
        try:
            self._file.flush()
        except Exception:
            pass

    def close(self):
        try:
            self._file.close()
        except Exception:
            pass

# 安装 Tee，仅在作为脚本运行时生效
if __name__ == '__main__':
    try:
        sys.stdout = _Tee(sys.stdout, LOG_FILE)
        sys.stderr = _Tee(sys.stderr, LOG_FILE)
    except Exception:
        pass

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

# 读取JSON文件（项目根）
with open(os.path.join(PROJECT_ROOT, 'all_channels.json'), 'r', encoding='utf-8') as file:
    data = json.load(file)

# 初始化URL列表
channel_search_urls = []

# 从配置文件读取API密钥
import configparser
config = configparser.ConfigParser()
config.read(os.path.join(PROJECT_ROOT, 'WEB-INF', 'config.properties'))
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
            # 优先使用bakname作为搜索关键词，如果没有则从URL提取
            if channel.get("bakname") and channel.get("bakname").strip():
                keyword = channel.get("bakname").strip()
            else:
                # 提取URL中的关键字作为备选
                match = re.search(r'(?:youtube\.com/(?:@|c/|channel/|user/)?)([^/]+)(?:/.*)?$', channel["url"])
                if match:
                    keyword = match.group(1)
                else:
                    keyword = channel["name"]  # 最后使用频道名称
            
            # 构建API URL
            api_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={urllib.parse.quote(keyword)}&type=channel&key={API_KEY}&maxResults=10"
            result.append({
                "name": channel["name"],
                "bakname": channel.get("bakname", ""),
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

# 配置requests会话，添加重试功能
def get_requests_session():
    session = requests.Session()
    retry_strategy = Retry(
        total=5,  # 总共尝试次数(包括首次请求)
        backoff_factor=1,  # 重试间隔 = {backoff factor} * (2 ** ({重试次数} - 1))
        status_forcelist=[429, 500, 502, 503, 504],  # 遇到这些状态码时重试
        allowed_methods=["GET", "POST"]  # 允许重试的HTTP方法
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session

# 使用带重试的请求函数
def make_api_request(url, params=None, max_attempts=3, initial_delay=2):
    """
    发送带有重试机制的API请求
    
    参数:
    url - 请求URL
    params - 请求参数
    max_attempts - 最大尝试次数
    initial_delay - 初始延迟时间(秒)
    
    返回:
    请求响应或None
    """
    session = get_requests_session()
    attempt = 0
    last_exception = None
    
    while attempt < max_attempts:
        try:
            response = session.get(url, params=params, timeout=(10, 30))  # 连接超时10秒，读取超时30秒
            return response
        except (requests.ConnectionError, requests.Timeout) as e:
            attempt += 1
            last_exception = e
            delay = initial_delay * (2 ** (attempt - 1))  # 指数退避
            print(f"连接失败，{delay}秒后重试 ({attempt}/{max_attempts})...")
            time.sleep(delay)
    
    print(f"达到最大重试次数，请求失败: {str(last_exception)}")
    return None

# 修改各处API请求代码
def get_channel_info(channel_id):
    global API_KEY
    
    url = f'https://www.googleapis.com/youtube/v3/channels'
    params = {
        'part': 'snippet',
        'id': channel_id,
        'key': API_KEY
    }
    
    response = make_api_request(url, params)
    # 如果API请求失败，尝试切换API密钥
    if response is None or response.status_code != 200:
        API_KEY = try_switch_api_key(API_KEY)
        params['key'] = API_KEY
        response = make_api_request(url, params)
    
    if response is not None and response.status_code == 200:
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
    # 确保source目录存在（项目根）
    source_dir = os.path.join(PROJECT_ROOT, 'source')
    if not os.path.exists(source_dir):
        os.makedirs(source_dir)
    
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
    # 使用bakname作为文件名，如果没有bakname则使用频道名称
    safe_name = info.get("bakname", "").strip()
    if not safe_name:
        safe_name = "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in original_name)
    filename = os.path.join(source_dir, f'{safe_name}.json')
    
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
def fetch_channel_videos_via_rss(channel_id, max_count=200):
    """使用RSS方式获取频道视频列表"""
    if not channel_id:
        return []
    
    feed_url = f"https://www.youtube.com/feeds/videos.xml?channel_id={channel_id}"
    try:
        import urllib.request
        import xml.etree.ElementTree as ET
        
        req = urllib.request.Request(feed_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            xml_text = resp.read()
    except Exception as e:
        print(f"❌ RSS获取失败: {e}")
        return []

    try:
        root = ET.fromstring(xml_text)
    except Exception as e:
        print(f"❌ RSS解析失败: {e}")
        return []

    ns = {
        'atom': 'http://www.w3.org/2005/Atom',
        'media': 'http://search.yahoo.com/mrss/'
    }
    entries = root.findall('atom:entry', ns)

    videos = []
    for entry in entries[:max_count]:
        # 安全地获取video_id
        video_id = None
        try:
            video_id_el = entry.find('yt:videoId', {'yt': 'http://www.youtube.com/xml/schemas/2015'})
            if video_id_el is not None and hasattr(video_id_el, 'text'):
                video_id = video_id_el.text
        except Exception:
            pass
        
        if not video_id:
            # 备用：从 link href 中解析 v 参数
            try:
                link_el = entry.find('atom:link', ns)
                if link_el is not None:
                    href = link_el.get('href', '')
                    q = urllib.parse.urlparse(href).query
                    qs = urllib.parse.parse_qs(q)
                    video_id = (qs.get('v') or [''])[0]
            except Exception:
                pass

        # 安全地获取标题
        title = ""
        try:
            title_el = entry.find('atom:title', ns)
            if title_el is not None and hasattr(title_el, 'text'):
                title = title_el.text
        except Exception:
            pass

        # 安全地获取发布时间
        published_at = ""
        try:
            published_el = entry.find('atom:published', ns)
            if published_el is not None and hasattr(published_el, 'text'):
                published_at = published_el.text
        except Exception:
            pass

        # 安全地获取缩略图
        thumb_url = None
        try:
            media_group = entry.find('media:group', ns)
            if media_group is not None:
                thumb = media_group.find('media:thumbnail', ns)
                if thumb is not None:
                    thumb_url = thumb.get('url')
        except Exception:
            pass

        videos.append({
            "id": video_id or "",
            "title": title,
            "description": "",
            "publishedAt": published_at,
            "thumbnails": {"default": {"url": thumb_url}} if thumb_url else {},
            "url": f"https://www.youtube.com/watch?v={video_id}" if video_id else ""
        })

    return videos


def process_channel(info, videos_per_channel=500, auto_confirm=False):
    global API_KEY
    
    print(f'\n准备处理频道: {info["name"]}')
    
    # 检查缓存
    # 使用bakname作为文件名，如果没有bakname则使用频道名称
    safe_name = info.get("bakname", "").strip()
    if not safe_name:
        safe_name = "".join(c if c.isalnum() or c in (' ', '-', '_') else '_' for c in info["name"])
    data_filename = os.path.join(PROJECT_ROOT, 'data', f'{safe_name}.json')
    
    if os.path.exists(data_filename):
        print(f'发现现有缓存文件，准备检查是否有新视频: {data_filename}')
        # 检查频道是否有新视频（不再按文件系统时间跳过）
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
                
                response = make_api_request(url, params)
                # 如果API请求失败，尝试切换API密钥
                if response is None or response.status_code != 200:
                    API_KEY = try_switch_api_key(API_KEY)
                    params['key'] = API_KEY
                    response = make_api_request(url, params)
                
                if response is not None and response.status_code == 200:
                    latest_data = response.json()
                    if 'items' in latest_data and len(latest_data['items']) > 0:
                        latest_video = latest_data['items'][0]
                        latest_video_id = latest_video['snippet']['resourceId']['videoId']
                        
                        # 检查最新视频是否已在缓存中
                        cached_video_ids = [video['id'] for video in cached_data.get('videos', []) if 'id' in video]
                        
                        if latest_video_id in cached_video_ids:
                            # 最新视频已在缓存中，根据业务策略可选择跳过或定期刷新
                            print(f'频道 {info["name"]} 暂无新视频，跳过处理')
                            return
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
    response = make_api_request(info["url"])
    # 如果API请求失败，尝试切换API密钥
    if response is None or response.status_code != 200:
        print(f"请求失败: {info['url']}")
        if response is not None:
            print(f"状态码: {response.status_code}")
            try:
                error_data = response.json()
                print(f"错误信息: {error_data}")
            except:
                print(f"响应内容: {response.text[:200]}")
        # 从URL中提取当前API密钥
        current_key = re.search(r'key=([^&]+)', info["url"]).group(1)
        new_key = try_switch_api_key(current_key)
        # 更新URL中的API密钥
        info["url"] = info["url"].replace(f"key={current_key}", f"key={new_key}")
        print(f"切换API密钥并重试...")
        response = make_api_request(info["url"])
    
    if response is not None and response.status_code == 200:
        data = response.json()
        if 'items' in data and len(data['items']) > 0:
            channel_id = data['items'][0]['id']['channelId']
            
            # 获取视频数据
            all_videos, has_new_videos = get_channel_videos_with_limit(channel_id, videos_per_channel)
            
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
                filename = os.path.join(PROJECT_ROOT, 'data', f'{safe_name}.json')
                
                with open(filename, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                print(f'视频数据已保存到: {filename}')
                
                # 处理文件
                try:
                    abs_path = os.path.abspath(filename)
                    result = subprocess.run([sys.executable, os.path.join(SCRIPT_DIR, 'source_processing.py'), abs_path], check=True, capture_output=True, text=True)
                    print(f"文件 {abs_path} 处理完成")
                    
                    # 检查处理结果是否有新增视频
                    processing_output = result.stdout
                    processing_has_new_videos = "没有新增视频" not in processing_output
                    
                    # 处理完成
                except Exception as e:
                    print(f"处理文件时出错: {str(e)}")
            else:
                print(f'未能获取到频道 {info["name"]} 的视频')
        else:
            print(f'未找到频道信息: {info["name"]}')
    else:
        status_part = f'，状态码: {response.status_code}' if response else ''
        print(f'请求失败{status_part}: {info["url"]}')

# 添加一个函数来切换API密钥
def try_switch_api_key(current_key):
    """
    当API请求失败时，尝试切换到下一个可用的API密钥
    
    参数:
    current_key - 当前使用的API密钥
    
    返回:
    新的API密钥
    """
    global api_keys
    
    # 如果只有一个API密钥，无法切换
    if len(api_keys) <= 1:
        print("警告: 没有其他API密钥可用")
        return current_key
    
    # 找到当前密钥的索引
    try:
        current_index = api_keys.index(current_key)
    except ValueError:
        # 如果当前密钥不在列表中，使用第一个密钥
        print("当前API密钥不在可用列表中，使用第一个密钥")
        return api_keys[0]
    
    # 选择下一个密钥
    next_index = (current_index + 1) % len(api_keys)
    new_key = api_keys[next_index]
    
    print(f"API密钥已切换: {current_key[:5]}...{current_key[-3:]} -> {new_key[:5]}...{new_key[-3:]}")
    return new_key

# 获取指定数量的视频
def get_channel_videos_with_limit(channel_id, max_videos=500):
    """获取指定数量的视频，使用增量更新策略"""
    global API_KEY
    
    # 获取上传播放列表ID
    playlist_id = f'UU{channel_id[2:]}'
    url = f'https://www.googleapis.com/youtube/v3/playlistItems'
    
    # 检查是否有现有缓存
    cache_file = None
    cached_videos = []
    cached_video_ids = set()
    
    # 查找该频道的缓存文件
    data_dir = os.path.join(PROJECT_ROOT, 'data')
    for filename in os.listdir(data_dir):
        if filename.endswith('.json'):
            try:
                with open(os.path.join(data_dir, filename), 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    if data.get('channel_id') == channel_id:
                        cache_file = os.path.join(data_dir, filename)
                        cached_videos = data.get('videos', [])
                        cached_video_ids = {v['id'] for v in cached_videos if 'id' in v}
                        break
            except Exception as e:
                print(f"读取缓存文件时出错: {str(e)}")
                continue
    
    # 标记是否有新视频
    has_new_videos = False
    
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
        total_api_videos = 0
        for _ in range(3):
            try:
                response = make_api_request(url, params)
                # 如果API请求失败，尝试切换API密钥
                if response is None or response.status_code != 200:
                    API_KEY = try_switch_api_key(API_KEY)
                    params['key'] = API_KEY
                    response = make_api_request(url, params)
                
                if response is not None and response.status_code == 200:
                    data = response.json()
                    videos = data.get('items', [])
                    if not videos:
                        break
                    
                    total_api_videos += len(videos)
                    
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
                            has_new_videos = True  # 标记有新视频
                    
                    # 如果这一页全是已有视频，就不用继续了
                    if all_existing or 'nextPageToken' not in data:
                        break
                    
                    params['pageToken'] = data['nextPageToken']
                else:
                    print(f"API请求失败" + (f"，状态码: {response.status_code}" if response else ""))
                    break
            except Exception as e:
                print(f"获取频道视频时出错: {str(e)}")
                traceback.print_exc()  # 打印详细错误信息
                break
        
        print(f"从API获取了 {total_api_videos} 个视频，其中 {len(new_videos)} 个是真正的新视频")
        
        # 如果没有新视频，直接返回缓存的视频
        if len(new_videos) == 0:
            print("没有新视频，直接使用缓存数据")
            return cached_videos[:max_videos], False
        
        # 合并新旧视频，保持总数不超过max_videos
        # 确保新视频优先保留
        all_videos = new_videos.copy()  # 先添加所有新视频
        
        # 然后添加旧视频，直到达到最大数量
        remaining_slots = max_videos - len(all_videos)
        if remaining_slots > 0:
            # 随机选择旧视频填充剩余空间
            old_videos_to_keep = cached_videos.copy()
            random.shuffle(old_videos_to_keep)
            
            # 添加旧视频，但避免重复
            for video in old_videos_to_keep:
                if 'snippet' not in video or 'resourceId' not in video.get('snippet', {}):
                    continue
                    
                video_id = video['snippet']['resourceId']['videoId']
                # 检查是否已经在新视频列表中
                if not any(v.get('snippet', {}).get('resourceId', {}).get('videoId') == video_id for v in new_videos):
                    all_videos.append(video)
                    remaining_slots -= 1
                    if remaining_slots <= 0:
                        break
        
        # 返回合并后的视频
        if all_videos:
            return all_videos[:max_videos], has_new_videos
        else:
            print("警告: 合并后没有有效视频，跳过后续步骤")
            return [], False
    
    # 如果没有缓存，使用原来的方法获取视频
    all_videos = []
    params = {
        'part': 'snippet',
        'playlistId': playlist_id,
        'maxResults': 50,
        'key': API_KEY
    }
    
    # 计算需要获取的页数（限制最大页数为20，约1000个视频）
    pages_needed = min(20, (max_videos + 49) // 50)  # 向上取整，但最多20页
    
    total_api_videos = 0
    for _ in range(pages_needed):
        try:
            response = make_api_request(url, params)
            # 如果API请求失败，尝试切换API密钥
            if response is None or response.status_code != 200:
                API_KEY = try_switch_api_key(API_KEY)
                params['key'] = API_KEY
                response = make_api_request(url, params)
            
            if response is not None and response.status_code == 200:
                data = response.json()
                videos = data.get('items', [])
                if not videos:
                    break
                
                total_api_videos += len(videos)
                    
                # 过滤掉无效的视频
                valid_videos = [v for v in videos if 'snippet' in v and 'resourceId' in v.get('snippet', {})]
                all_videos.extend(valid_videos)
                
                if 'nextPageToken' not in data or len(all_videos) >= max_videos:
                    break
                    
                params['pageToken'] = data['nextPageToken']
            else:
                print(f"API请求失败" + (f"，状态码: {response.status_code}" if response else ""))
                break
        except Exception as e:
            print(f"获取频道视频时出错: {str(e)}")
            traceback.print_exc()  # 打印详细错误信息
            break
    
    print(f"从API获取了 {total_api_videos} 个视频")
    
    # 随机打乱并返回
    if all_videos:
        random.shuffle(all_videos)
        return all_videos[:max_videos], True  # 首次获取视频，认为都是新的
    else:
        print(f"警告: 未能获取到任何有效视频")
        return [], False

# 执行source_processing.py
def process_source_files():
    try:
        print("开始执行source_processing.py...")
        subprocess.run([sys.executable, os.path.join(SCRIPT_DIR, 'source_processing.py')], check=True)
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
        main(args.force, False, 500)