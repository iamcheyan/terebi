#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import os
import subprocess
import sys
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
TOOLS_DIR = PROJECT_ROOT / "tools"
EXTRACT_DIR = TOOLS_DIR / "extract_url_from_html"


def run(cmd, cwd=None):
    print(f"$ {' '.join(cmd)} (cwd={cwd or os.getcwd()})")
    result = subprocess.run(cmd, cwd=str(cwd) if cwd else None)
    if result.returncode != 0:
        sys.exit(result.returncode)


def cmd_fetch(args):
    # 高级抓取脚本（包含自动任务、限额管理等）
    script = TOOLS_DIR / "get_channel_videos.py"
    cmd = [sys.executable, str(script)]
    if args.auto_task:
        cmd.append("--auto-task")
    if args.videos_per_channel is not None:
        cmd.extend(["--videos-per-channel", str(args.videos_per_channel)])
    if args.yes:
        cmd.append("--yes")
    if args.force:
        cmd.append("--force")
    if args.upload:
        cmd.append("--upload")
    run(cmd, cwd=TOOLS_DIR)


def cmd_process(args):
    script = TOOLS_DIR / "source_processing.py"
    cmd = [sys.executable, str(script)]
    if args.file:
        cmd.append(args.file)
    run(cmd, cwd=TOOLS_DIR)


def cmd_mark(args):
    # 标记 cached 状态（使用根目录脚本）
    script = PROJECT_ROOT / "mark_channels.py"
    cmd = [sys.executable, str(script)]
    run(cmd, cwd=PROJECT_ROOT)


def cmd_avatars(args):
    script = TOOLS_DIR / "get_picture.py"
    cmd = [sys.executable, str(script)]
    run(cmd, cwd=TOOLS_DIR)


def cmd_resize_logos(args):
    script = TOOLS_DIR / "resize_images.py"
    cmd = [sys.executable, str(script)]
    run(cmd, cwd=TOOLS_DIR)


def cmd_clear(args):
    script = TOOLS_DIR / "clear_channel.py"
    cmd = [sys.executable, str(script)]
    run(cmd, cwd=TOOLS_DIR)


def cmd_check_names(args):
    script = TOOLS_DIR / "check_name.py"
    cmd = [sys.executable, str(script)]
    run(cmd, cwd=TOOLS_DIR)


def cmd_html_extract(args):
    # 从保存的 HTML 抽取视频并合并到 data
    html2video = EXTRACT_DIR / "html2video.py"
    merge = EXTRACT_DIR / "merge_json_files.py"
    run([sys.executable, str(html2video)], cwd=EXTRACT_DIR)
    run([sys.executable, str(merge)], cwd=EXTRACT_DIR)


def cmd_schedule(args):
    # 简单运行调度器（每天 00:00 自动抓取）
    script = TOOLS_DIR / "run.py"
    cmd = [sys.executable, str(script)]
    run(cmd, cwd=TOOLS_DIR)


def main():
    parser = argparse.ArgumentParser(
        description="Terebi 后端工具统一入口"
    )
    sub = parser.add_subparsers(dest="command", required=True)

    p_fetch = sub.add_parser("fetch", help="抓取频道视频并写入 source/ 与 data/")
    p_fetch.add_argument("--videos-per-channel", type=int, default=500)
    p_fetch.add_argument("--auto-task", action="store_true", help="自动任务模式，按更新时间排序并管理配额")
    p_fetch.add_argument("--yes", "-y", action="store_true", help="自动确认提示")
    p_fetch.add_argument("--force", "-f", action="store_true", help="忽略时间检查强制更新")
    p_fetch.add_argument("--upload", "-u", action="store_true", help="处理后自动上传（依赖 update2ftp）")
    p_fetch.set_defaults(func=cmd_fetch)

    p_process = sub.add_parser("process", help="处理 source/*.json 产出 data/*.json")
    p_process.add_argument("--file", help="仅处理指定文件的绝对路径")
    p_process.set_defaults(func=cmd_process)

    p_mark = sub.add_parser("mark", help="更新 japan_tv_youtube_channels.json 的 cached 标记")
    p_mark.set_defaults(func=cmd_mark)

    p_avatars = sub.add_parser("avatars", help="下载频道头像到 img/")
    p_avatars.set_defaults(func=cmd_avatars)

    p_resize = sub.add_parser("resize-logos", help="将 img 下图片缩放到 img/resized")
    p_resize.set_defaults(func=cmd_resize_logos)

    p_clear = sub.add_parser("clear", help="根据 img 中有无图片清理频道配置")
    p_clear.set_defaults(func=cmd_clear)

    p_check = sub.add_parser("check-names", help="检查 data 与配置中的频道名称差异")
    p_check.set_defaults(func=cmd_check_names)

    p_html = sub.add_parser("html-extract", help="从保存的 HTML 抽取视频并合并到 data/")
    p_html.set_defaults(func=cmd_html_extract)

    p_sched = sub.add_parser("schedule", help="运行日程调度器（每天 00:00 执行 fetch 任务）")
    p_sched.set_defaults(func=cmd_schedule)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()


