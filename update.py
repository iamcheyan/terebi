#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent
VENV_PYTHON = PROJECT_ROOT / "venv" / "bin" / "python"
BACKEND_RUNNER = PROJECT_ROOT / "backend" / "runner.py"


def run_with_venv(cmd, cwd=None):
    """使用虚拟环境运行命令"""
    # 确保使用虚拟环境的 Python
    if not VENV_PYTHON.exists():
        print(f"错误：虚拟环境不存在于 {VENV_PYTHON}")
        print("请先创建虚拟环境：python -m venv venv")
        sys.exit(1)
    
    # 构建完整命令
    full_cmd = [str(VENV_PYTHON)] + cmd
    print(f"$ {' '.join(full_cmd)} (cwd={cwd or os.getcwd()})")
    
    result = subprocess.run(full_cmd, cwd=str(cwd) if cwd else None)
    if result.returncode != 0:
        print(f"命令执行失败，退出码: {result.returncode}")
        sys.exit(result.returncode)


def git_commit():
    """提交更改到 git 并推送到远程仓库"""
    try:
        # 检查是否有更改需要提交
        result = subprocess.run(['git', 'status', '--porcelain'], capture_output=True, text=True)
        if not result.stdout.strip():
            print("✅ 工作目录干净，无需提交")
            return True
        
        # 添加所有更改
        subprocess.run(['git', 'add', '.'], check=True)
        
        # 生成提交信息（使用当前时间戳）
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        commit_message = f"频道数据更新 - {timestamp}"
        
        # 提交更改
        subprocess.run(['git', 'commit', '-m', commit_message], check=True)
        print(f"✅ 已提交到本地 git: {commit_message}")
        
        # 推送到远程仓库
        print("正在推送到远程仓库...")
        push_result = subprocess.run(['git', 'push'], capture_output=True, text=True)
        
        if push_result.returncode == 0:
            print("✅ 已成功推送到远程仓库")
            return True
        else:
            print(f"⚠️ 推送到远程仓库失败: {push_result.stderr}")
            print("本地提交已成功，但远程同步失败")
            print("请检查网络连接和远程仓库配置")
            return False
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Git 操作失败: {e}")
        print("请检查 git 配置和网络连接")
        return False
    except FileNotFoundError:
        print("❌ 未找到 git 命令，请确保已安装 git")
        return False
    except Exception as e:
        print(f"❌ 操作过程中出现错误: {e}")
        return False


def update_channels(args):
    """更新频道数据"""
    print("=== 开始更新频道数据 ===")
    
    # 1. 抓取频道视频
    print("\n1. 抓取频道视频...")
    fetch_cmd = [str(BACKEND_RUNNER), "fetch"]
    if args.auto_task:
        fetch_cmd.append("--auto-task")
    if args.videos_per_channel is not None:
        fetch_cmd.extend(["--videos-per-channel", str(args.videos_per_channel)])
    if args.yes:
        fetch_cmd.append("--yes")
    if args.force:
        fetch_cmd.append("--force")
    if args.upload:
        fetch_cmd.append("--upload")
    
    run_with_venv(fetch_cmd, cwd=PROJECT_ROOT)
    
    # 2. 处理数据
    print("\n2. 处理数据...")
    process_cmd = [str(BACKEND_RUNNER), "process"]
    if args.file:
        process_cmd.append("--file")
        process_cmd.append(args.file)
    
    run_with_venv(process_cmd, cwd=PROJECT_ROOT)
    
    # 3. 更新缓存标记
    print("\n3. 更新缓存标记...")
    mark_cmd = [str(BACKEND_RUNNER), "mark"]
    run_with_venv(mark_cmd, cwd=PROJECT_ROOT)
    
    # 4. 下载头像
    print("\n4. 下载频道头像...")
    avatars_cmd = [str(BACKEND_RUNNER), "avatars"]
    try:
        run_with_venv(avatars_cmd, cwd=PROJECT_ROOT)
    except SystemExit as e:
        if e.code != 0:
            print(f"⚠️ 头像下载过程中出现错误（退出码: {e.code}），但继续执行后续步骤")
            print("头像下载失败不会影响频道数据的抓取和处理")
        else:
            raise
    
    # 5. 调整图片大小
    print("\n5. 调整图片大小...")
    resize_cmd = [str(BACKEND_RUNNER), "resize-logos"]
    run_with_venv(resize_cmd, cwd=PROJECT_ROOT)
    
    # 6. 清理无效频道
    print("\n6. 清理无效频道...")
    clear_cmd = [str(BACKEND_RUNNER), "clear"]
    run_with_venv(clear_cmd, cwd=PROJECT_ROOT)
    
    # 7. 检查名称差异
    print("\n7. 检查名称差异...")
    check_cmd = [str(BACKEND_RUNNER), "check-names"]
    run_with_venv(check_cmd, cwd=PROJECT_ROOT)
    
    print("\n=== 频道更新完成 ===")
    
    # 8. 提交所有更改到 Git
    print("\n8. 提交到 Git...")
    git_commit()


def quick_update(args):
    """快速更新（仅抓取和处理）"""
    print("=== 快速更新频道数据 ===")
    
    # 1. 抓取频道视频
    print("\n1. 抓取频道视频...")
    fetch_cmd = [str(BACKEND_RUNNER), "fetch"]
    if args.auto_task:
        fetch_cmd.append("--auto-task")
    if args.videos_per_channel is not None:
        fetch_cmd.extend(["--videos-per-channel", str(args.videos_per_channel)])
    if args.yes:
        fetch_cmd.append("--yes")
    if args.force:
        fetch_cmd.append("--force")
    if args.upload:
        fetch_cmd.append("--upload")
    
    run_with_venv(fetch_cmd, cwd=PROJECT_ROOT)
    
    # 2. 处理数据
    print("\n2. 处理数据...")
    process_cmd = [str(BACKEND_RUNNER), "process"]
    if args.file:
        process_cmd.append("--file")
        process_cmd.append(args.file)
    
    run_with_venv(process_cmd, cwd=PROJECT_ROOT)
    
    print("\n=== 快速更新完成 ===")


def main():
    parser = argparse.ArgumentParser(
        description="Terebi 频道自动更新脚本（自动使用虚拟环境）",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  # 基本更新
  python update.py

  # 强制更新所有频道
  python update.py --force

  # 自动任务模式，优先处理未缓存的频道
  python update.py --auto-task

  # 指定每个频道的视频数量
  python update.py --videos-per-channel 200

  # 自动确认所有提示
  python update.py --yes

  # 处理后自动上传到FTP服务器
  python update.py --upload

  # 快速更新（仅抓取和处理）
  python update.py quick

  # 运行调度器
  python update.py schedule
        """
    )
    
    # 默认命令（完整更新）
    parser.add_argument("--videos-per-channel", type=int, default=500, 
                       help="每个频道抓取的视频数量（默认: 500）")
    parser.add_argument("--auto-task", action="store_true", 
                       help="自动任务模式，按更新时间排序并管理配额，优先处理未缓存的频道")
    parser.add_argument("--yes", "-y", action="store_true", 
                       help="自动确认所有提示")
    parser.add_argument("--force", "-f", action="store_true", 
                       help="忽略时间检查，强制更新所有频道")
    parser.add_argument("--upload", "-u", action="store_true", 
                       help="处理后自动上传到FTP服务器")
    parser.add_argument("--file", help="仅处理指定文件的绝对路径")
    parser.add_argument("--quick", action="store_true", 
                       help="快速更新模式（仅抓取和处理数据，跳过头像下载等）")
    parser.add_argument("--schedule", action="store_true", 
                       help="运行调度器（每天 00:00 自动抓取）")
    
    args = parser.parse_args()
    
    # 根据参数选择执行模式
    if args.schedule:
        print("=== 运行调度器 ===")
        run_with_venv([str(BACKEND_RUNNER), "schedule"], cwd=PROJECT_ROOT)
    elif args.quick:
        print("=== 快速更新模式 ===")
        quick_update(args)
    else:
        print("=== 完整更新模式 ===")
        update_channels(args)


if __name__ == "__main__":
    main()
