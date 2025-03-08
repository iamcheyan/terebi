import sqlite3
import json
import glob
import os
import re

# 连接到 SQLite 数据库（如果不存在则会创建一个新的）
conn = sqlite3.connect('videos.db')
cursor = conn.cursor()

# 检查表是否存在
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='videos'")
table_exists = cursor.fetchone()

# 如果表不存在，创建新表
if not table_exists:
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS videos (
        id TEXT PRIMARY KEY,
        title TEXT,
        thumbnail TEXT,
        url TEXT,
        channel_id TEXT,
        channel_name TEXT,
        channel_filename TEXT,
        updated_at TEXT
    )
    ''')
else:
    # 检查表结构，确认是否有 channel_filename 列
    cursor.execute("PRAGMA table_info(videos)")
    columns = [column[1] for column in cursor.fetchall()]
    
    # 如果没有 channel_filename 列，添加它
    if 'channel_filename' not in columns:
        cursor.execute("ALTER TABLE videos ADD COLUMN channel_filename TEXT")

# 获取所有 JSON 文件
json_files = glob.glob('data/*.json')

for file in json_files:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)
        channel_id = data['channel_id']
        channel_name = data['channel_name']
        updated_at = data['updated_at']
        
        # 获取不包含扩展名的文件名
        channel_filename = os.path.splitext(os.path.basename(file))[0]
        # 清理文件名中的特殊字符
        channel_filename = re.sub(r'[\\/:*?"<>|]', '_', channel_filename)
        print(f"处理文件: {file}, 提取的频道文件名: {channel_filename}")
        
        for video in data['videos']:
            video_id = video.get('id')
            title = video.get('title')
            thumbnail = video.get('thumbnail')
            url = video.get('url')
            
            # 插入或更新数据到表中
            cursor.execute('''
            INSERT OR REPLACE INTO videos (id, title, thumbnail, url, channel_id, channel_name, channel_filename, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (video_id, title, thumbnail, url, channel_id, channel_name, channel_filename, updated_at))

# 提交事务并关闭连接
conn.commit()
conn.close()