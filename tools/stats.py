#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import argparse
import json
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


def parse_iso_datetime(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    try:
        # 支持无时区与带时区的 ISO 格式
        dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
        # 统一转为本地时区显示
        return dt.astimezone()
    except Exception:
        return None


def humanize_timedelta(dt: datetime, now: datetime) -> str:
    delta = now - dt
    seconds = int(delta.total_seconds())
    if seconds < 60:
        return f"{seconds}s 前"
    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes}m 前"
    hours = minutes // 60
    if hours < 24:
        return f"{hours}h 前"
    days = hours // 24
    return f"{days}d 前"


def load_channel_file(path: str) -> Optional[Dict[str, Any]]:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return None


def collect_stats(data_dir: str) -> Dict[str, Any]:
    now = datetime.now().astimezone()
    result: Dict[str, Any] = {
        'channels': [],
        'total_channels': 0,
        'total_videos': 0,
        'min_updated_at': None,
        'max_updated_at': None,
    }

    if not os.path.isdir(data_dir):
        return result

    for filename in sorted(os.listdir(data_dir)):
        if not filename.endswith('.json'):
            continue
        full_path = os.path.join(data_dir, filename)
        data = load_channel_file(full_path)
        if not data:
            continue

        channel_name = data.get('channel_name') or os.path.splitext(filename)[0]
        updated_at_raw = data.get('updated_at')
        updated_at = parse_iso_datetime(updated_at_raw)
        videos: List[Dict[str, Any]] = data.get('videos', []) or []
        video_count = len(videos)

        # 备用：文件修改时间（用于辅助判断）
        mtime_dt = datetime.fromtimestamp(os.path.getmtime(full_path), tz=timezone.utc).astimezone()

        result['channels'].append({
            'file': filename,
            'channel_name': channel_name,
            'video_count': video_count,
            'updated_at': updated_at.isoformat() if updated_at else None,
            'updated_at_human': humanize_timedelta(updated_at, now) if updated_at else None,
            'file_mtime': mtime_dt.isoformat(),
            'file_mtime_human': humanize_timedelta(mtime_dt, now),
        })

    # 汇总
    result['total_channels'] = len(result['channels'])
    result['total_videos'] = sum(c['video_count'] for c in result['channels'])

    # 计算最早/最晚更新时间（基于 updated_at，缺失则跳过）
    updated_list = [
        parse_iso_datetime(c['updated_at']) for c in result['channels'] if c.get('updated_at')
    ]
    if updated_list:
        min_dt = min(updated_list)
        max_dt = max(updated_list)
        result['min_updated_at'] = min_dt.isoformat()
        result['max_updated_at'] = max_dt.isoformat()
        result['min_updated_at_human'] = humanize_timedelta(min_dt, now)
        result['max_updated_at_human'] = humanize_timedelta(max_dt, now)

    return result


def print_table(channels: List[Dict[str, Any]], limit: Optional[int] = None) -> None:
    rows = sorted(channels, key=lambda x: (-x['video_count'], x['channel_name']))
    if limit is not None:
        rows = rows[:limit]
    # 简单对齐输出
    print(f"{'频道':<28} {'节目数':>6} {'更新于':>16} {'文件时间':>16}  文件")
    for c in rows:
        name = c['channel_name'][:26] + ('…' if len(c['channel_name']) > 26 else '')
        print(f"{name:<28} {c['video_count']:>6} {c.get('updated_at_human') or '-':>16} {c.get('file_mtime_human') or '-':>16}  {c['file']}")


def main():
    parser = argparse.ArgumentParser(description='统计 data 目录下的频道与节目数量')
    parser.add_argument('--data-dir', default=None, help='数据目录，默认为项目根目录的 data')
    parser.add_argument('--json', action='store_true', help='以 JSON 格式输出统计结果')
    parser.add_argument('--top', type=int, default=20, help='打印前 N 个节目数最多的频道')
    parser.add_argument('--stale-days', type=int, help='列出 updated_at 超过 N 天未更新的频道')
    args = parser.parse_args()

    # 解析数据目录：优先使用 --data-dir；未提供时自动定位到项目根目录的 data
    data_dir = args.data_dir
    if not data_dir:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        project_root = os.path.dirname(script_dir)
        data_dir = os.path.join(project_root, 'data')
    stats = collect_stats(data_dir)

    if args.json:
        print(json.dumps(stats, ensure_ascii=False, indent=2))
        return

    print('=== 汇总 ===')
    print(f"频道总数: {stats['total_channels']}")
    print(f"节目总数: {stats['total_videos']}")
    if stats.get('min_updated_at') and stats.get('max_updated_at'):
        print(f"最早更新时间: {stats['min_updated_at']} ({stats.get('min_updated_at_human')})")
        print(f"最新更新时间: {stats['max_updated_at']} ({stats.get('max_updated_at_human')})")
    print()

    if args.stale_days is not None:
        now = datetime.now().astimezone()
        print(f"=== 超过 {args.stale_days} 天未更新（基于 updated_at）===")
        stale: List[Dict[str, Any]] = []
        for c in stats['channels']:
            if not c.get('updated_at'):
                continue
            dt = parse_iso_datetime(c['updated_at'])
            if not dt:
                continue
            if (now - dt).days >= args.stale_days:
                stale.append(c)
        if stale:
            print_table(stale, None)
        else:
            print('无')
        print()

    print(f"=== 节目数 Top {args.top} ===")
    print_table(stats['channels'], args.top)


if __name__ == '__main__':
    main()


