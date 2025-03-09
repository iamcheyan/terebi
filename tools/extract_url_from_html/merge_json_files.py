import os
import json
import shutil

def merge_json_files():
    # 定义目录路径
    json_dir = "json"
    data_dir = "../../data"
    
    # 确保两个目录都存在
    if not os.path.exists(json_dir):
        print(f"错误: {json_dir} 目录不存在")
        return
    if not os.path.exists(data_dir):
        print(f"错误: {data_dir} 目录不存在")
        return
    
    # 获取两个目录中的所有文件
    json_files = [f for f in os.listdir(json_dir) if f.endswith('.json')]
    data_files = [f for f in os.listdir(data_dir) if f.endswith('.json')]
    
    # 处理每个json目录中的文件
    for json_file in json_files:
        json_file_path = os.path.join(json_dir, json_file)
        data_file_path = os.path.join(data_dir, json_file)
        
        # 检查data目录中是否有同名文件
        if json_file in data_files:
            print(f"发现同名文件: {json_file}")
            
            # 读取两个文件的内容
            with open(json_file_path, 'r', encoding='utf-8') as f:
                json_content = json.load(f)
            
            with open(data_file_path, 'r', encoding='utf-8') as f:
                data_content = json.load(f)
            
            # 合并内容
            if isinstance(json_content, dict) and isinstance(data_content, dict):
                # 如果两个文件都是字典，合并字典
                # 检查是否是频道视频数据格式
                if "channel_id" in json_content and "channel_id" in data_content and "videos" in json_content and "videos" in data_content:
                    # 保留data_content的基本信息，但合并videos列表
                    merged_videos = data_content["videos"] + json_content["videos"]
                    
                    # 去重视频
                    unique_videos = []
                    seen_video_ids = set()
                    for video in merged_videos:
                        if video["id"] not in seen_video_ids:
                            seen_video_ids.add(video["id"])
                            unique_videos.append(video)
                    
                    # 显示合并前后的视频数量并请求确认
                    print(f"当前视频数量: data目录 {len(data_content['videos'])}个, json目录 {len(json_content['videos'])}个")
                    print(f"合并后视频数量: {len(unique_videos)}个")
                    confirm = input("确认合并这些视频? (y/n): ")
                    
                    if confirm.lower() != 'y':
                        print(f"已取消合并: {json_file}")
                        continue
                    
                    # 更新合并后的内容
                    merged_content = data_content.copy()
                    merged_content["videos"] = unique_videos
                    merged_content["updated_at"] = json_content.get("updated_at", data_content.get("updated_at"))
                else:
                    # 普通字典合并
                    merged_content = {**data_content, **json_content}
                    print(f"将合并两个普通字典，键的数量: data目录 {len(data_content)}个, json目录 {len(json_content)}个")
                    confirm = input("确认合并这些数据? (y/n): ")
                    
                    if confirm.lower() != 'y':
                        print(f"已取消合并: {json_file}")
                        continue
                
                # 写回到data目录的文件
                with open(data_file_path, 'w', encoding='utf-8') as f:
                    json.dump(merged_content, f, ensure_ascii=False, indent=2)
                
                print(f"已合并字典: {json_file}")
                print(f"文件保存路径: {os.path.abspath(data_file_path)}")
            
            else:
                print(f"无法合并不同类型的JSON: {json_file}")
                print(f"文件路径: {os.path.abspath(json_file_path)}, {os.path.abspath(data_file_path)}")
        else:
            # 如果data目录中没有同名文件，询问用户是否移动
            response = input(f"文件 {json_file} 在data目录中不存在，是否移动到data目录? (y/n): ")
            if response.lower() == 'y':
                shutil.copy2(json_file_path, data_file_path)
                print(f"已复制 {json_file} 到data目录")

if __name__ == "__main__":
    merge_json_files()
