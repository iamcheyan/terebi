import schedule
import time
import os
import sys
import logging
from datetime import datetime

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("scheduler.log"),
        logging.StreamHandler(sys.stdout)
    ]
)

def job():
    """
    执行定时任务，获取YouTube频道视频
    
    此任务会自动从配置的YouTube频道获取最新视频信息，
    每个频道最多获取250个视频，并使用--auto-task和--yes参数
    自动确认所有操作。
    """
    logging.info("开始执行定时任务：获取YouTube频道视频")
    start_time = datetime.now()
    
    try:
        # 执行获取视频的脚本
        result = os.system('python get_channel_videos.py --auto-task --videos-per-channel 250 --yes')
        
        if result == 0:
            logging.info("任务执行成功")
        else:
            logging.error(f"任务执行失败，返回代码: {result}")
    except Exception as e:
        logging.error(f"执行任务时发生错误: {str(e)}")
    
    end_time = datetime.now()
    duration = end_time - start_time
    logging.info(f"任务完成，耗时: {duration}")

# 设置定时任务
# 每天晚上 00:00 运行
schedule.every().day.at("00:00").do(job)
logging.info("定时任务已设置，将在每天 00:00 执行")

# 如果需要立即执行一次，取消下面的注释
# logging.info("首次执行任务...")
# job()

# 主循环
logging.info("调度器已启动，等待执行定时任务...")
try:
    while True:
        schedule.run_pending()
        time.sleep(60)  # 每分钟检查一次，减少CPU使用
except KeyboardInterrupt:
    logging.info("程序被用户中断")
except Exception as e:
    logging.error(f"发生未预期的错误: {str(e)}")
    raise