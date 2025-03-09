from bs4 import BeautifulSoup
import json
from datetime import datetime
import re
import os
from pathlib import Path
import requests

def extract_video_id(href):
    if not href:
        return None
    match = re.search(r'watch\?v=([^&]+)', href)
    if match:
        return match.group(1)
    # 提取Shorts视频ID
    shorts_match = re.search(r'shorts/([^/?&]+)', href)
    return shorts_match.group(1) if shorts_match else None

def extract_youtube_info(html_content, channel_name):
    soup = BeautifulSoup(html_content, 'html.parser')
    videos = []
    
    # 尝试从HTML中提取真实的频道URL后缀
    channel_handle = None
    channel_pattern = r'"@id":\s*"http:\\?/\\?/www\.youtube\.com\\?/@([^"]+)"'
    channel_match = re.search(channel_pattern, html_content)
    if channel_match:
        channel_handle = channel_match.group(1)
    
    # 提取频道的正式名称
    official_name = channel_name  # 默认使用文件名
    name_pattern = r'"name":\s*"([^"]+)"'
    name_match = re.search(name_pattern, html_content)
    if name_match:
        official_name = name_match.group(1)
        
    # 处理频道名称，删除【】及其中的内容
    official_name = re.sub(r'【.*?】', '', official_name).strip()
    
    # 查找所有视频链接
    video_links = soup.find_all('a', id='video-title-link')
    
    # 尝试查找另一种格式的视频链接
    if not video_links:
        video_links = soup.find_all('a', id='video-title')
    
    # 提取常规视频
    for link in video_links:
        video_id = extract_video_id(link.get('href'))
        if not video_id:
            continue
            
        title = link.get('title', '')
        
        video_info = {
            "id": video_id,
            "title": title,
            "thumbnail": f"https://i.ytimg.com/vi/{video_id}/sddefault.jpg",
            "url": f"https://www.youtube.com/watch?v={video_id}"
        }
        videos.append(video_info)
    
    # 提取Shorts视频
    shorts_data = re.findall(r'"videoId":"([^"]+)".*?"accessibilityText":"([^"]+)"', html_content)
    for video_id, accessibility_text in shorts_data:
        if not video_id:
            continue
            
        # 从accessibility_text中提取标题
        title_match = re.match(r'([^,]+)', accessibility_text)
        title = title_match.group(1) if title_match else video_id
        
        video_info = {
            "id": video_id,
            "title": title,
            "thumbnail": f"https://i.ytimg.com/vi/{video_id}/sddefault.jpg",
            "url": f"https://www.youtube.com/shorts/{video_id}"
        }
        videos.append(video_info)
        
    # 提取播放列表中的视频
    playlist_items = soup.find_all('ytd-playlist-panel-video-renderer')
    for item in playlist_items:
        # 查找视频链接
        link_element = item.find('a', id='wc-endpoint')
        if not link_element:
            continue
            
        href = link_element.get('href', '')
        video_id = extract_video_id(href)
        if not video_id:
            continue
            
        # 查找视频标题
        title_element = item.find('span', id='video-title')
        title = title_element.get('title', '') if title_element else ''
        
        # 查找频道名称
        byline_element = item.find('span', id='byline')
        channel = byline_element.text.strip() if byline_element else channel_name
        
        video_info = {
            "id": video_id,
            "title": title,
            "thumbnail": f"https://i.ytimg.com/vi/{video_id}/sddefault.jpg",
            "url": f"https://www.youtube.com/watch?v={video_id}"
        }
        videos.append(video_info)
    
    channel_info = {
        "channel_id": f"UC{os.urandom(11).hex()[:16]}",  # 随机生成channel_id
        "channel_name": official_name,  # 使用提取的正式名称
        "channel_url": f"https://www.youtube.com/@{channel_handle if channel_handle else channel_name}",
        "updated_at": datetime.now().isoformat(),
        "videos": videos
    }
    
    return channel_info

def process_html_files():
    # 创建html和json目录
    html_dir = Path("html")
    json_dir = Path("json")
    json_dir.mkdir(exist_ok=True)
    
    # 检查html目录是否存在
    if not html_dir.exists():
        print(f"错误：html目录不存在，正在创建...")
        html_dir.mkdir(exist_ok=True)
        print(f"已创建html目录，请将HTML文件放入该目录后重新运行程序")
        return
    
    # 获取所有html、txt文件和没有扩展名的文件
    html_files = []
    for pattern in ["*.html", "*.txt", "*"]:
        for file in html_dir.glob(pattern):
            # 确保文件不会被重复添加，且是文件而非目录
            if file not in html_files and file.is_file():
                html_files.append(file)
    
    # 检查是否找到文件
    if not html_files:
        print(f"错误：在html目录中未找到任何文件，请确保文件已正确放置")
        return
    
    # 打印所有找到的文件
    print("找到以下HTML文件:")
    for file in html_files:
        print(f"  - {file}")
    print(f"总共找到 {len(html_files)} 个文件\n")
    
    # # 判断是否需要处理文件
    # process_files = input("是否处理这些文件？(y/n): ").strip().lower()
    # if process_files != 'y':
    #     print("所有文件处理完成\n")
    #     print("没有执行处理过程")
    #     return
    
    # 过滤掉已经包含的扩展名文件，只保留没有扩展名的文件或html/txt文件
    filtered_files = [f for f in html_files if f.suffix in ['.html', '.txt'] or f.suffix == '']
    
    if not filtered_files:
        print(f"错误：过滤后没有可处理的文件")
        return
    
    print(f"过滤后将处理 {len(filtered_files)} 个文件\n")
    
    processed_count = 0
    error_count = 0
    
    for html_file in filtered_files:
        try:
            print(f"开始处理文件: {html_file}")
            
            # 检查文件大小
            file_size = html_file.stat().st_size
            if file_size == 0:
                print(f"警告：文件 {html_file.name} 为空，跳过处理")
                continue
                
            # 读取HTML内容
            with open(html_file, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            if not html_content.strip():
                print(f"警告：文件 {html_file.name} 内容为空，跳过处理")
                continue
            
            # 使用文件名（不含扩展名）作为channel_name
            channel_name = html_file.stem
            
            # 提取信息
            youtube_data = extract_youtube_info(html_content, channel_name)
            
            # # 打印提取的视频信息
            # print(f"频道名称: {youtube_data['channel_name']}")
            # print(f"频道ID: {youtube_data['channel_id']}")
            # print(f"更新时间: {youtube_data['updated_at']}")
            # print(f"视频数量: {len(youtube_data['videos'])}")
            
            # # 打印每个视频的详细信息
            # if youtube_data['videos']:
            #     print("视频列表:")
            #     for i, video in enumerate(youtube_data['videos'], 1):
            #         print(f"  {i}. ID: {video['id']}")
            #         print(f"     标题: {video['title']}")
            #         print(f"     缩略图: {video['thumbnail']}")
            #         print(f"     URL: {video['url']}")
            # else:
            #     print("没有找到视频")
            
            # 获取视频数量
            video_count = len(youtube_data['videos'])
            
            # 使用清理后的频道名称作为文件名
            sanitized_channel_name = sanitize_filename(youtube_data['channel_name'])
            
            # 创建对应的JSON文件路径
            json_file = json_dir / f"{sanitized_channel_name}.json"
            
            # 保存到JSON文件
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(youtube_data, f, ensure_ascii=False, indent=2)
            
            # 复制文件到data目录
            data_dir = Path("../../data")
            data_dir.mkdir(exist_ok=True)
            data_json_file = data_dir / json_file.name
            
            # 复制文件（如果已存在则替换）
            import shutil
            shutil.copy2(json_file, data_json_file)
            
            print(f"已处理: {html_file.name} -> {json_file.absolute()}")
            print(f"已复制到: {data_json_file.absolute()}")
            print(f"共提取出 {video_count} 个视频\n")
            
            # 提取频道logo
            try:
                # 查找包含频道logo的img标签
                # 查找频道logo图片
                logo_match = re.search(r'<img[^>]*class="[^"]*yt-core-image[^"]*yt-spec-avatar-shape__image[^"]*"[^>]*src="([^"]+)"[^>]*>', html_content)
                
                if logo_match:
                    print(f"匹配到的HTML: {html_content[logo_match.start():logo_match.end()]}")
                    logo_url = logo_match.group(1)
                    # 保存logo URL到频道信息中
                    youtube_data['channel_logo'] = logo_url
                    
                    # 下载logo图片
                    img_dir = Path("../../img")
                    img_dir.mkdir(exist_ok=True)
                    
                    img_file = img_dir / f"{sanitized_channel_name}.jpg"
                    
                    try:
                        # 检查URL是否有效
                        if not logo_url.startswith(('http://', 'https://')):
                            # 尝试修复URL
                            fixed_url = f"https://{logo_url}" if not logo_url.startswith('//') else f"https:{logo_url}"
                            print(f"修复URL: {logo_url} -> {fixed_url}")
                            logo_url = fixed_url
                        
                        response = requests.get(logo_url, stream=True, timeout=10)
                        if response.status_code == 200:
                            with open(img_file, 'wb') as img:
                                for chunk in response.iter_content(1024):
                                    img.write(chunk)
                            print(f"已下载频道logo: {img_file}")
                        else:
                            print(f"下载频道logo失败: HTTP {response.status_code}")
                    except requests.exceptions.MissingSchema as schema_err:
                        print(f"无效的URL格式: {logo_url}")
                        print(f"URL错误详情: {str(schema_err)}")
                    except requests.exceptions.Timeout:
                        print(f"下载频道logo超时: {logo_url}")
                    except Exception as img_err:
                        print(f"保存频道logo时出错: {str(img_err)}")
                else:
                    print(f"未找到频道 {channel_name} 的logo")
            except Exception as logo_err:
                print(f"提取频道logo时出错: {str(logo_err)}")
            
            processed_count += 1
            
        except UnicodeDecodeError:
            print(f"处理文件 {html_file.name} 时出错: 编码错误，尝试使用不同编码...")
            try:
                # 尝试使用其他编码
                with open(html_file, 'r', encoding='latin-1') as f:
                    html_content = f.read()
                # 继续处理...
                print(f"使用latin-1编码成功读取文件 {html_file.name}")
            except Exception as e:
                print(f"处理文件 {html_file.name} 时出错: {str(e)}")
                error_count += 1
        except Exception as e:
            print(f"处理文件 {html_file.name} 时出错: {str(e)}")
            error_count += 1
    
    print(f"\n处理完成统计:")
    print(f"总文件数: {len(filtered_files)}")
    print(f"成功处理: {processed_count}")
    print(f"处理失败: {error_count}")

def main():
    process_html_files()
    print("所有文件处理完成")

def sanitize_filename(filename):
    # 替换不支持的字符
    return re.sub(r'[\\/*?:"<>|]', "_", filename)

if __name__ == "__main__":
    main()