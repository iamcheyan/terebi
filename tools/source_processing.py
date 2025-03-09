import json
import os
from datetime import datetime
import glob
import sys

def process_channel_json(input_file, output_dir):
    try:
        # 读取原始JSON文件
        with open(input_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # 检查是否有视频数据
        has_videos = False
        if "items" in data and isinstance(data["items"], list):
            has_videos = len(data["items"]) > 0
        elif "videos" in data and isinstance(data["videos"], list):
            has_videos = len(data["videos"]) > 0
            
        if not has_videos:
            print(f"警告: {input_file} 中没有视频数据，删除该文件")
            os.remove(input_file)
            return
        # 直接使用输入文件名作为输出文件名
        input_filename = os.path.basename(input_file)
        output_file = os.path.join(output_dir, input_filename)
        
        # 创建新的数据结构
        new_data = {
            "channel_id": data.get("channel_id", ""),
            "channel_name": data.get("channel_name", ""),
            "updated_at": datetime.now().isoformat(),
            "videos": []
        }
        
        # # 打印原始数据的结构，帮助调试
        # print(f"原始数据键: {list(data.keys())}")
        # if "items" in data and len(data["items"]) > 0:
        #     print(f"第一个item的键: {list(data['items'][0].keys())}")
        #     if "snippet" in data["items"][0]:
        #         print(f"第一个item的snippet键: {list(data['items'][0]['snippet'].keys())}")
        # elif "videos" in data and len(data["videos"]) > 0:
        #     print(f"第一个video的键: {list(data['videos'][0].keys())}")
        
        # 处理视频数据
        if "items" in data and isinstance(data["items"], list):
            # 处理旧格式
            for item in data["items"]:
                # 正确提取视频ID
                video_id = None
                
                # 从resourceId中提取
                if "snippet" in item and "resourceId" in item["snippet"] and "videoId" in item["snippet"]["resourceId"]:
                    video_id = item["snippet"]["resourceId"]["videoId"]
                # 如果上面的方法失败，尝试从id中提取
                elif "id" in item and isinstance(item["id"], dict) and "videoId" in item["id"]:
                    video_id = item["id"]["videoId"]
                # 如果id是字符串，可能直接就是视频ID
                elif "id" in item and isinstance(item["id"], str) and not item["id"].startswith("UU"):
                    video_id = item["id"]
                
                if video_id:
                    # 获取缩略图URL
                    thumbnail = ""
                    if "snippet" in item and "thumbnails" in item["snippet"]:
                        thumbnails = item["snippet"]["thumbnails"]
                        for quality in ["maxres", "standard", "high", "medium", "default"]:
                            if quality in thumbnails and "url" in thumbnails[quality]:
                                thumbnail = thumbnails[quality]["url"]
                                break
                    
                    # 获取标题
                    title = ""
                    if "snippet" in item and "title" in item["snippet"]:
                        title = item["snippet"]["title"]
                    
                    # 添加视频信息
                    new_data["videos"].append({
                        "id": video_id,
                        "title": title,
                        "thumbnail": thumbnail,
                        "url": f"https://www.youtube.com/watch?v={video_id}"
                    })
                    
                    # 调试信息
                    if not title or not thumbnail:
                        print(f"警告: 视频 {video_id} 缺少标题或缩略图")
                        print(f"item数据: {json.dumps(item, ensure_ascii=False)[:200]}...")
        
        elif "videos" in data and isinstance(data["videos"], list):
            # 处理新格式，只提取需要的字段
            for video in data["videos"]:
                # 尝试多种可能的ID字段
                video_id = video.get("id", "") or video.get("videoId", "") or video.get("video_id", "")
                
                # 如果ID是播放列表项ID而不是视频ID，尝试从其他字段提取
                if video_id and (video_id.startswith("UU") or len(video_id) > 15):
                    # 尝试从resourceId中提取
                    if "resourceId" in video and "videoId" in video["resourceId"]:
                        video_id = video["resourceId"]["videoId"]
                    # 尝试从snippet中提取
                    elif "snippet" in video and "resourceId" in video["snippet"] and "videoId" in video["snippet"]["resourceId"]:
                        video_id = video["snippet"]["resourceId"]["videoId"]
                
                if video_id and not video_id.startswith("UU") and len(video_id) <= 15:
                    # 尝试多种可能的标题字段
                    title = video.get("title", "")
                    if not title and "snippet" in video and "title" in video["snippet"]:
                        title = video["snippet"]["title"]
                    
                    # 尝试多种可能的缩略图字段
                    thumbnail = video.get("thumbnail", "")
                    if not thumbnail and "snippet" in video and "thumbnails" in video["snippet"]:
                        thumbnails = video["snippet"]["thumbnails"]
                        for quality in ["maxres", "standard", "high", "medium", "default"]:
                            if quality in thumbnails and "url" in thumbnails[quality]:
                                thumbnail = thumbnails[quality]["url"]
                                break
                    
                    new_data["videos"].append({
                        "id": video_id,
                        "title": title,
                        "thumbnail": thumbnail,
                        "url": f"https://www.youtube.com/watch?v={video_id}"
                    })
                    
                    # 调试信息
                    if not title or not thumbnail:
                        print(f"警告: 视频 {video_id} 缺少标题或缩略图")
                        print(f"video数据: {json.dumps(video, ensure_ascii=False)[:200]}...")
        
        # 检查目标文件是否已存在
        if os.path.exists(output_file):
            # 如果文件已存在，读取现有数据
            with open(output_file, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
            
            # 获取现有视频ID列表
            existing_video_ids = {video['id'] for video in existing_data.get('videos', [])}
            
            # 只添加不存在的视频
            new_videos = []
            for video in new_data['videos']:
                if video['id'] not in existing_video_ids:
                    new_videos.append(video)
                    existing_video_ids.add(video['id'])
            
            # 将新视频添加到现有数据中
            existing_data['videos'].extend(new_videos)
            
            # 保存合并后的数据
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(existing_data, f, ensure_ascii=False, indent=2)
            
            # 只有在有新增视频时才打印详细信息
            if len(new_videos) > 0:
                print(f"处理完成！已更新 {os.path.abspath(output_file)}")
                print(f"新增了 {len(new_videos)} 个视频，总共 {len(existing_data['videos'])} 个视频")
            else:
                print(f"{os.path.abspath(output_file)} 没有新增视频，总共 {len(existing_data['videos'])} 个视频")
        else:
            # 如果文件不存在，直接保存新数据
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(new_data, f, ensure_ascii=False, indent=2)
            
            print(f"处理完成！已创建 {output_file}")
            print(f"共处理了 {len(new_data['videos'])} 个视频")
        # print(f"其中有标题的视频: {sum(1 for v in new_data['videos'] if v['title'])}")
        # print(f"其中有缩略图的视频: {sum(1 for v in new_data['videos'] if v['thumbnail'])}")
        
    except Exception as e:
        print(f"处理文件时出错: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    # 输入目录和输出目录
    input_dir = "../source"
    output_dir = "../data"
    
    # 确保输出目录存在
    os.makedirs(output_dir, exist_ok=True)
    
    # 检查是否提供了文件路径参数
    if len(sys.argv) > 1:
        # 使用提供的文件路径
        input_file = sys.argv[1]
        if os.path.exists(input_file):
            print(f"正在处理指定文件: {input_file}")
            process_channel_json(input_file, output_dir)
        else:
            print(f"错误: 指定的文件 {input_file} 不存在")
            sys.exit(1)
    else:
        # 获取source目录下的所有json文件
        input_files = glob.glob(os.path.join(input_dir, "*.json"))
        
        if not input_files:
            print(f"警告: 在 {input_dir} 目录中没有找到JSON文件")
        
        # 处理每个文件
        for input_file in input_files:
            print(f"正在处理: {input_file}")
            process_channel_json(input_file, output_dir)
    
    # 处理完后更新japan_tv_youtube_channels.json中的状态
    try:
        # 读取japan_tv_youtube_channels.json
        with open('../japan_tv_youtube_channels.json', 'r', encoding='utf-8') as f:
            channels_data = json.load(f)
        
        # 获取data目录下所有json文件名(不含扩展名)
        data_files = [os.path.splitext(os.path.basename(f))[0] for f in glob.glob(os.path.join(output_dir, "*.json"))]
        # # 打印data_files内容
        # print("已处理的频道列表:")
        # for i, channel_name in enumerate(data_files, 1):
        #     print(f"{i}. {channel_name}")
        
        # # 暂停程序执行
        # input("按回车键继续...")
        
        # 创建一个集合，存储所有已知频道的名称
        existing_channels = set()
        
        # 更新所有频道的状态
        # 遍历所有分类（如全国放送局、地方放送局等）
        for category_name, category_data in channels_data.items():
            # 处理直接是频道列表的分类（如全国放送局）
            if isinstance(category_data, list):
                for channel in category_data:
                    existing_channels.add(channel["name"])
                    if "bakname" in channel and channel["bakname"].strip():
                        existing_channels.add(channel["bakname"].strip())
            # 处理有区域子分类的情况（如地方放送局）
            elif isinstance(category_data, dict):
                for region_data in category_data.values():
                    if isinstance(region_data, list):
                        for channel in region_data:
                            existing_channels.add(channel["name"])
                            if "bakname" in channel and channel["bakname"].strip():
                                existing_channels.add(channel["bakname"].strip())
        
        # 查找data_files中有但channels_data中没有的频道
        new_channels = [name for name in data_files if name not in existing_channels]
        # 如果有新频道，添加到"その他"分类下的"その他チャンネル"列表中
        if new_channels:
            if "その他" not in channels_data:
                channels_data["その他"] = {"その他チャンネル": []}
            elif "その他チャンネル" not in channels_data["その他"]:
                channels_data["その他"]["その他チャンネル"] = []
                
            for new_channel in new_channels:
                # 读取对应的JSON文件获取channel_url
                channel_file_path = os.path.join(output_dir, f"{new_channel}.json")
                channel_url = ""
                if os.path.exists(channel_file_path):
                    with open(channel_file_path, 'r', encoding='utf-8') as channel_file:
                        channel_data = json.load(channel_file)
                        if "channel_url" in channel_data:
                            channel_url = channel_data["channel_url"]
                            print(f"成功提取 {new_channel} 的 channel_url: {channel_url}")  # 添加调试信息
                        else:
                            print(f"警告: {new_channel}.json 中没有找到 channel_url")  # 添加调试信息
                
                channels_data["その他"]["その他チャンネル"].append({
                    "name": new_channel,
                    "url": channel_url
                })
            print(f"已添加 {len(new_channels)} 个新频道到「その他チャンネル」分类")
                            
        # 保存更新后的文件
        with open('../japan_tv_youtube_channels.json', 'w', encoding='utf-8') as f:
            json.dump(channels_data, f, ensure_ascii=False, indent=4)
            
        # print("已更新japan_tv_youtube_channels.json中的状态")
        
    except Exception as e:
        print(f"更新状态时出错: {e}")
        traceback.print_exc()