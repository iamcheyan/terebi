#!/bin/bash

# Terebi 频道自动更新脚本
# 优化版本：减少API调用，增加错误处理和监控

# 设置工作目录
cd /home/ubuntu/www/terebi

# 设置日志文件
LOG_DIR="/home/ubuntu/www/terebi/log"
LOG_FILE="$LOG_DIR/cron_update_$(date +%Y%m%d_%H%M%S).log"
ERROR_LOG="$LOG_DIR/cron_error.log"

# 确保日志目录存在
mkdir -p "$LOG_DIR"

# 记录开始时间
echo "=== Terebi 频道更新开始 ===" >> "$LOG_FILE"
echo "开始时间: $(date)" >> "$LOG_FILE"
echo "工作目录: $(pwd)" >> "$LOG_FILE"

# 检查Python环境
if [ ! -f "/home/ubuntu/miniconda3/bin/python3" ]; then
    echo "错误: Python环境不存在" >> "$ERROR_LOG"
    echo "时间: $(date)" >> "$ERROR_LOG"
    exit 1
fi

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "警告: 虚拟环境不存在，使用系统Python" >> "$LOG_FILE"
    PYTHON_CMD="/home/ubuntu/miniconda3/bin/python3"
else
    PYTHON_CMD="/home/ubuntu/miniconda3/bin/python3"
fi

# 执行更新任务
echo "执行命令: $PYTHON_CMD update.py --auto-task --videos-per-channel 200 --yes" >> "$LOG_FILE"

# 使用timeout防止任务卡死，最多运行2小时
timeout 7200 $PYTHON_CMD update.py --auto-task --videos-per-channel 200 --yes >> "$LOG_FILE" 2>&1

# 检查执行结果
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    echo "=== 更新任务成功完成 ===" >> "$LOG_FILE"
    echo "结束时间: $(date)" >> "$LOG_FILE"
elif [ $EXIT_CODE -eq 124 ]; then
    echo "警告: 任务超时（2小时），已强制终止" >> "$ERROR_LOG"
    echo "时间: $(date)" >> "$ERROR_LOG"
else
    echo "错误: 更新任务失败，退出码: $EXIT_CODE" >> "$ERROR_LOG"
    echo "时间: $(date)" >> "$ERROR_LOG"
    
    # 发送错误通知（如果有配置邮件）
    # echo "Terebi更新任务失败，请检查日志" | mail -s "Terebi更新失败" your-email@example.com
fi

# 清理旧日志文件（保留最近7天）
find "$LOG_DIR" -name "cron_update_*.log" -mtime +7 -delete 2>/dev/null
find "$LOG_DIR" -name "cron_error.log" -mtime +30 -delete 2>/dev/null

echo "=== 脚本执行完成 ===" >> "$LOG_FILE"
