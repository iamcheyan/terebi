#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import random
import subprocess
import sys
import time
from datetime import datetime, timedelta
import argparse
from typing import Optional, List


def _now_str() -> str:
    return datetime.now().strftime('%Y-%m-%d %H:%M:%S')


def ensure_log_dir(project_root: str) -> str:
    log_dir = os.path.join(project_root, 'log')
    os.makedirs(log_dir, exist_ok=True)
    return log_dir


def rotate_logs(log_dir: str, keep: int = 90) -> None:
    try:
        files: List[str] = [f for f in os.listdir(log_dir) if f.startswith('scheduler_') and f.endswith('.log')]
        files.sort()  # 依文件名时间顺序
        if len(files) > keep:
            to_delete = files[0:len(files) - keep]
            for name in to_delete:
                try:
                    os.remove(os.path.join(log_dir, name))
                except Exception:
                    pass
    except Exception:
        pass


def new_log_file(project_root: str) -> str:
    log_dir = ensure_log_dir(project_root)
    rotate_logs(log_dir, keep=90)
    ts = datetime.now().strftime('%Y%m%d_%H%M%S')
    return os.path.join(log_dir, f'scheduler_{ts}.log')


def append_log(log_path: str, message: str) -> None:
    try:
        with open(log_path, 'a', encoding='utf-8') as f:
            f.write(message.rstrip('\n') + '\n')
    except Exception:
        pass


def run_fetch(project_root: str, log_path: Optional[str] = None) -> None:
    os.chdir(project_root)
    cmd = [
        sys.executable,
        os.path.join('backend', 'runner.py'),
        'fetch',
        '--auto-task',
        '--videos-per-channel', '250',
        '--yes',
    ]
    header = f"[{_now_str()}] RUN: {' '.join(cmd)} (cwd={os.getcwd()})"
    print(header)
    if log_path:
        append_log(log_path, header)
    try:
        # 实时读取子进程输出，边打印边写日志
        with subprocess.Popen(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1,
            universal_newlines=True,
        ) as proc:
            # 交替读取 stdout/stderr
            while True:
                out_line = proc.stdout.readline() if proc.stdout else ''
                err_line = proc.stderr.readline() if proc.stderr else ''
                if out_line:
                    print(out_line, end='')
                    if log_path:
                        append_log(log_path, out_line)
                if err_line:
                    # 将 stderr 也打印与记录
                    print(err_line, end='')
                    if log_path:
                        append_log(log_path, err_line)
                if proc.poll() is not None:
                    # 读取残余
                    remaining_out = proc.stdout.read() if proc.stdout else ''
                    remaining_err = proc.stderr.read() if proc.stderr else ''
                    if remaining_out:
                        print(remaining_out, end='')
                        if log_path:
                            append_log(log_path, remaining_out)
                    if remaining_err:
                        print(remaining_err, end='')
                        if log_path:
                            append_log(log_path, remaining_err)
                    break
    except KeyboardInterrupt:
        msg = f"[{_now_str()}] 收到中断信号，中止本次更新"
        print(msg)
        if log_path:
            append_log(log_path, msg)
        return
    except Exception as e:
        err = f"[{_now_str()}] 更新节目时出错: {e}"
        print(err)
        if log_path:
            append_log(log_path, err)


def next_window_target(now: datetime) -> datetime:
    # 每天 00:00（本地时间）
    target = now.replace(hour=0, minute=0, second=0, microsecond=0)
    if now >= target:
        target = (target + timedelta(days=1))
    return target


def main():
    parser = argparse.ArgumentParser(description='每日 00:00 定时更新频道数据')
    parser.add_argument('--force', action='store_true', help='启动时先立即更新一次，然后再进入定时循环')
    args = parser.parse_args()
    # tools 目录作为入口时，project_root 是上一级目录
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    print('每日定时更新（每天 00:00）启动')
    log_path = new_log_file(project_root)
    append_log(log_path, f"[{_now_str()}] 调度器启动")
    # 启动时打印当前统计信息
    try:
        from tools.stats import collect_stats
    except ImportError:
        sys.path.insert(0, project_root)
        from tools.stats import collect_stats  # type: ignore
    stats = collect_stats(os.path.join(project_root, 'data'))
    ch_line = f"当前电视台(频道)总数: {stats.get('total_channels', 0)}"
    vd_line = f"当前节目总数: {stats.get('total_videos', 0)}"
    print(ch_line)
    print(vd_line)
    append_log(log_path, f"[{_now_str()}] {ch_line}")
    append_log(log_path, f"[{_now_str()}] {vd_line}")
    # 若指定 --force，先立即更新一次
    if args.force:
        msg = '收到 --force，立即执行一次更新…'
        print(msg)
        append_log(log_path, f"[{_now_str()}] {msg}")
        run_fetch(project_root, log_path)
    try:
        while True:
            now = datetime.now()
            target = next_window_target(now)
            wait_seconds = int((target - now).total_seconds())
            tick = f"当前时间: {now.strftime('%Y-%m-%d %H:%M:%S')} -> 下一次计划: {target.strftime('%Y-%m-%d %H:%M:%S')} (等待 {wait_seconds}s)"
            print(tick)
            append_log(log_path, f"[{_now_str()}] {tick}")
            # 分段睡眠，便于 Ctrl+C 打断
            slept = 0
            step = 30
            while slept < wait_seconds:
                time.sleep(min(step, wait_seconds - slept))
                slept += step
            # 到点执行抓取
            start_line = '开始执行更新…'
            print(start_line)
            append_log(log_path, f"[{_now_str()}] {start_line}")
            run_fetch(project_root, log_path)
    except KeyboardInterrupt:
        end_line = '收到中断信号，退出定时器'
        print(end_line)
        append_log(log_path, f"[{_now_str()}] {end_line}")


if __name__ == '__main__':
    main()


