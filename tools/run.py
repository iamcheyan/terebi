import schedule
import time
import os

def job():
    os.system('python get_channel_videos.py')

# 每天晚上 00:00 运行
schedule.every().day.at("00:00").do(job)

while True:
    schedule.run_pending()
    time.sleep(1)