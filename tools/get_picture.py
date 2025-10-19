import json
import random
import requests
import os
import urllib.parse
import configparser
import re

# 从配置文件读取API密钥
config = configparser.ConfigParser()
config_path = '../WEB-INF/config.properties'
if not os.path.exists(config_path):
    config_path = '../../WEB-INF/config.properties'
config.read(config_path)
api_keys = []

# 读取并显示所有可用的API密钥
for key, value in config['DEFAULT'].items():
    if key.startswith('youtube.apikey'):
        api_keys.append(value)

print(f"找到 {len(api_keys)} 个API密钥")

if not api_keys:
    raise ValueError("未能从配置文件中读取到任何API密钥，请检查配置文件路径和内容是否正确")

# 读取JSON文件
with open('../all_channels.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# 初始化头像保存目录
if not os.path.exists('../img'):
    os.makedirs('../img')

# 在开始处理频道之前初始化计数器
def initialize_counters(data):
    total_count = 0
    
    # 遍历所有分类和子分类
    for category, subcategories in data.items():
        if isinstance(subcategories, dict):
            for subcategory, channels in subcategories.items():
                if isinstance(channels, list):
                    for channel in channels:
                        if isinstance(channel, dict) and 'name' in channel:
                            avatar_filename = f"../img/{channel['name']}.jpg"
                            if not os.path.exists(avatar_filename):
                                total_count += 1
    
    process_channel.total_count = total_count
    process_channel.processed_count = 0
    process_channel.skipped_count = 0
    process_channel.failed_count = 0

# 定义处理频道并获取头像的函数
def process_channel(channel):
    # 检查是否已存在头像文件
    avatar_filename = f"../img/{channel['name']}.jpg"
    if os.path.exists(avatar_filename):
        print(f"头像文件已存在: {avatar_filename}，跳过处理")
        process_channel.skipped_count = getattr(process_channel, 'skipped_count', 0) + 1
        print(f"进度统计: 总计{process_channel.total_count}个频道，已处理{process_channel.processed_count}个，跳过{process_channel.skipped_count}个，失败{process_channel.failed_count}个，剩余{process_channel.total_count - process_channel.processed_count - process_channel.failed_count}个")
        return  # 跳过已有头像的频道
    
    if channel["url"]:
        print(f"\n处理频道: {channel['name']}")
        print(f"频道URL: {channel['url']}")
        match = re.search(r'(?:youtube\.com/(?:@|c/|channel/|user/)?)([^/]+)(?:/.*)?$', channel["url"])
        
        if match:
            keyword = match.group(1)
            print(f"提取的关键字: {keyword}")
            
            # 遍历所有API密钥直到成功
            for api_key in api_keys:
                try:
                    print(f"使用API密钥: {api_key[:15]}...{api_key[-5:]}")
                    
                    # 使用搜索API查询
                    search_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={urllib.parse.quote(keyword)}&type=channel&key={api_key}&maxResults=1"
                    print(f"搜索API请求URL: {search_url}")
                    search_response = requests.get(search_url)
                    print(f"搜索API响应状态码: {search_response.status_code}")
                    search_data = search_response.json()
                    
                    # 检查是否配额超限
                    if search_response.status_code == 403 and 'error' in search_data:
                        error_message = search_data['error'].get('message', '')
                        if 'quota' in error_message.lower():
                            print(f"API密钥 {api_key[:15]}... 配额已超限，尝试下一个密钥")
                            continue
                    
                    if search_response.status_code == 200 and 'items' in search_data and len(search_data['items']) > 0:
                        # 处理成功的情况
                        random_item = random.choice(search_data['items'])
                        channel_id = random_item['id']['channelId']
                        
                        # 获取频道信息
                        url = f'https://www.googleapis.com/youtube/v3/channels?part=snippet&id={channel_id}&key={api_key}'
                        response = requests.get(url)
                        data = response.json()
                        
                        if 'items' in data and len(data['items']) > 0:
                            channel_info = data['items'][0]['snippet']
                            avatar_url = channel_info['thumbnails']['high']['url']
                            print(f"找到头像URL: {avatar_url}")
                            
                            # 下载头像
                            avatar_response = requests.get(avatar_url)
                            if avatar_response.status_code == 200:
                                filename = f"../img/{channel['name']}.jpg"
                                with open(filename, 'wb') as f:
                                    f.write(avatar_response.content)
                                print(f"已保存头像: {filename}")
                                process_channel.processed_count += 1
                                break  # 成功后退出循环
                            else:
                                print(f"无法下载头像: {avatar_url}")
                                continue  # 尝试下一个API密钥
                    
                except Exception as e:
                    print(f"使用API密钥 {api_key[:15]}... 时发生错误: {str(e)}")
                    continue  # 发生错误时尝试下一个API密钥
            
            else:  # 所有API密钥都尝试失败
                print(f"⚠️ 所有API密钥都尝试失败，跳过频道: {channel['name']}")
                process_channel.failed_count += 1
        
        print(f"进度统计: 总计{process_channel.total_count}个频道，已处理{process_channel.processed_count}个，跳过{process_channel.skipped_count}个，失败{process_channel.failed_count}个，剩余{process_channel.total_count - process_channel.processed_count - process_channel.failed_count}个")

# 在开始处理频道之前调用初始化函数
initialize_counters(data)

# 处理所有分类和子分类
for category, subcategories in data.items():
    if isinstance(subcategories, dict):
        print(f"\n开始处理{category}分类")
        for subcategory, channels in subcategories.items():
            if isinstance(channels, list):
                print(f"  处理{subcategory}子分类")
                for channel in channels:
                    if isinstance(channel, dict) and 'name' in channel:
                        process_channel(channel)

# 显示最终统计
print(f"\n=== 头像下载完成 ===")
print(f"总计: {process_channel.total_count} 个频道")
print(f"已处理: {process_channel.processed_count} 个")
print(f"跳过: {process_channel.skipped_count} 个（头像已存在）")
print(f"失败: {process_channel.failed_count} 个（API配额不足等）")

if process_channel.failed_count > 0:
    print(f"\n⚠️ 注意: {process_channel.failed_count} 个频道因API配额不足等原因未能下载头像")
    print("这是正常现象，不影响系统正常运行")
    print("头像下载失败不会影响频道数据的抓取和处理")
