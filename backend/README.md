# 后端工具使用说明

本目录提供一个统一入口脚本 `runner.py` 来管理和运行项目所有的 Python 工具，无需记忆各脚本路径。

## 前置条件

- Python 3.9+
- 在项目根目录存在以下文件/目录：
  - `WEB-INF/config.properties`（包含 youtube.apikey1..n、ftp 配置等）
  - `all_channels.json`
  - `tools/`、`data/`、`source/`、`img/`
- 推荐在项目根目录执行命令：`python backend/runner.py ...`

## 常用命令

- 抓取频道视频（自动模式，配额友好，默认每频道 500 条，支持 --videos-per-channel 调整）

```bash
python backend/runner.py fetch --auto-task --videos-per-channel 250 --yes
```

- 仅进行数据处理：把 `source/*.json` 规范化输出到 `data/*.json`

```bash
python backend/runner.py process
```

- 标记 `all_channels.json` 中频道的 cached 状态

```bash
python backend/runner.py mark
```

- 下载频道头像到 `img/`

```bash
python backend/runner.py avatars
```

- 缩放 `img/` 下的图片到 `img/resized/`

```bash
python backend/runner.py resize-logos
```

- 根据 `img/` 中图片存在性清理频道配置

```bash
python backend/runner.py clear
```

- 检查 `data/` 与配置中的频道名称差异

```bash
python backend/runner.py check-names
```

- 处理保存的频道页面 HTML：抽取视频并合并到 `data/`

```bash
python backend/runner.py html-extract
```

- 启动调度器（每天 00:00 自动抓取）

```bash
python backend/runner.py schedule
```

## 目录关系与不移动原则

为避免破坏现有脚本中广泛使用的相对路径（如 `../data`、`../WEB-INF/config.properties`），本整理不移动原有 `tools/` 下脚本，仅提供统一入口包装调用，并以正确 `cwd` 运行，确保原路径生效。


