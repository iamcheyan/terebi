#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import os
import subprocess
import sys
from datetime import datetime


def start_http_server(project_root: str, port: int) -> subprocess.Popen:
    os.chdir(project_root)
    http_cmd = [
        sys.executable,
        '-m',
        'http.server',
        str(port),
    ]
    print(f"$ {' '.join(http_cmd)} (cwd={os.getcwd()})")
    return subprocess.Popen(http_cmd)


def print_current_counts(project_root: str) -> None:
    # 动态导入 tools.stats.collect_stats
    try:
        from tools.stats import collect_stats
    except ImportError:
        sys.path.insert(0, project_root)
        from tools.stats import collect_stats  # type: ignore
    data_dir = os.path.join(project_root, 'data')
    stats = collect_stats(data_dir)
    print(f"当前电视台(频道)总数: {stats.get('total_channels', 0)}")
    print(f"当前节目总数: {stats.get('total_videos', 0)}")


def main():
    parser = argparse.ArgumentParser(description='先更新节目，再启动静态服务器')
    parser.add_argument('port', type=int, nargs='?', default=8000, help='HTTP 服务端口，默认 8000')
    args = parser.parse_args()

    project_root = os.path.dirname(os.path.abspath(__file__))
    # 仅打印当前统计 -> 启动服务
    print_current_counts(project_root)
    server = start_http_server(project_root, args.port)
    # 前台等待，转发信号由操作系统处理
    try:
        server.wait()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()


