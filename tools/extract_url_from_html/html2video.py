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
        "channel_name": channel_name,
        "updated_at": datetime.now().isoformat(),
        "videos": videos
    }
    
    return channel_info

def process_html_files():
    # 创建html和json目录
    html_dir = Path("html")
    json_dir = Path("json")
    json_dir.mkdir(exist_ok=True)
    
    # 获取所有html、txt文件和没有扩展名的文件
    html_files = list(html_dir.glob("*.html")) + list(html_dir.glob("*.txt")) + list(html_dir.glob("*")) 
    # 过滤掉已经包含的扩展名文件，只保留没有扩展名的文件
    html_files = [f for f in html_files if f.suffix not in ['.html', '.txt'] or f.suffix == '']
    
    for html_file in html_files:
        try:
            # 读取HTML内容
            with open(html_file, 'r', encoding='utf-8') as f:
                html_content = f.read()
            
            # 使用文件名（不含扩展名）作为channel_name
            channel_name = html_file.stem
            
            # 提取信息
            youtube_data = extract_youtube_info(html_content, channel_name)
            
            # 获取视频数量
            video_count = len(youtube_data['videos'])
            
            # 创建对应的JSON文件路径
            json_file = json_dir / f"{channel_name}.json"
            
            # 保存到JSON文件
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(youtube_data, f, ensure_ascii=False, indent=2)
            
            print(f"已处理: {html_file.name} -> {json_file.name}")
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
                    img_dir = Path("img")
                    img_dir.mkdir(exist_ok=True)
                    
                    img_file = img_dir / f"{channel_name}.jpg"
                    
                    try:
                        # 检查URL是否有效
                        if not logo_url.startswith(('http://', 'https://')):
                            # 尝试修复URL
                            fixed_url = f"https://{logo_url}" if not logo_url.startswith('//') else f"https:{logo_url}"
                            print(f"修复URL: {logo_url} -> {fixed_url}")
                            logo_url = fixed_url
                        
                        response = requests.get(logo_url, stream=True)
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
                    except Exception as img_err:
                        print(f"保存频道logo时出错: {str(img_err)}")
                else:
                    print(f"未找到频道 {channel_name} 的logo")
            except Exception as logo_err:
                print(f"提取频道logo时出错: {str(logo_err)}")
        except Exception as e:
            print(f"处理文件 {html_file.name} 时出错: {str(e)}")

def main():
    process_html_files()
    print("所有文件处理完成")

if __name__ == "__main__":
    main()