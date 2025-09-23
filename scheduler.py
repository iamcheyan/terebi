#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import random
import subprocess
import sys
import time
from datetime import datetime, timedelta


def run_fetch(project_root: str) -> None:
    os.chdir(project_root)
    cmd = [
        sys.executable,
        os.path.join('backend', 'runner.py'),
        'fetch',
        '--auto-task',
        '--videos-per-channel', '250',
        '--yes',
    ]
    print(f"$ {' '.join(cmd)} (cwd={os.getcwd()})")
    try:
        subprocess.run(cmd, check=False)
    except Exception as e:
        print(f"更新节目时出错: {e}")


def next_window_target(now: datetime) -> datetime:
    # 每天 00:00（本地时间）
    target = now.replace(hour=0, minute=0, second=0, microsecond=0)
    if now >= target:
        target = (target + timedelta(days=1))
    return target


def main():
    project_root = os.path.dirname(os.path.abspath(__file__))
    print('每日定时更新（每天 00:00）启动')
    # 启动时打印当前统计信息
    try:
        from tools.stats import collect_stats
    except ImportError:
        sys.path.insert(0, project_root)
        from tools.stats import collect_stats  # type: ignore
    stats = collect_stats(os.path.join(project_root, 'data'))
    print(f"当前电视台(频道)总数: {stats.get('total_channels', 0)}")
    print(f"当前节目总数: {stats.get('total_videos', 0)}")
    try:
        while True:
            now = datetime.now()
            target = next_window_target(now)
            wait_seconds = int((target - now).total_seconds())
            print(f"当前时间: {now.strftime('%Y-%m-%d %H:%M:%S')} -> 下一次计划: {target.strftime('%Y-%m-%d %H:%M:%S')} (等待 {wait_seconds}s)")
            # 分段睡眠，便于 Ctrl+C 打断
            slept = 0
            step = 30
            while slept < wait_seconds:
                time.sleep(min(step, wait_seconds - slept))
                slept += step
            # 到点执行抓取
            print('开始执行更新…')
            run_fetch(project_root)
    except KeyboardInterrupt:
        print('收到中断信号，退出定时器')


if __name__ == '__main__':
    main()


