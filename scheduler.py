#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys


def main():
    # 根目录的调度器只做转发：引用 tools/scheduler.py
    project_root = os.path.dirname(os.path.abspath(__file__))
    tools_scheduler = os.path.join(project_root, 'tools', 'scheduler.py')
    os.execv(sys.executable, [sys.executable, tools_scheduler] + sys.argv[1:])


if __name__ == '__main__':
    main()


