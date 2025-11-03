# GitHub Actions 自动定时更新指南

## 📅 自动定时执行

已为您配置好 GitHub Actions 定时任务，**无需手动提交代码**，系统会自动在每天指定时间运行更新脚本。

## ⚙️ 配置步骤

### 1. 设置 YouTube API Key

在 GitHub 仓库中设置 API Key：

1. 进入仓库页面
2. 点击 **Settings** > **Secrets and variables** > **Actions**
3. 点击 **New repository secret**
4. 添加以下 secrets：
   - `YOUTUBE_API_KEY_1`：您的第一个 YouTube API Key
   - `YOUTUBE_API_KEY_2`（可选）：第二个 API Key
   - `YOUTUBE_API_KEY_3`（可选）：第三个 API Key

### 2. 启用 GitHub Actions

1. 进入仓库的 **Actions** 标签
2. 如果看到提示，点击 **I understand my workflows, go ahead and enable them**
3. 等待下次定时触发，或手动运行测试

## 🕐 定时计划

### 当前设置

```yaml
schedule:
  - cron: '0 16 * * *'  # 每天 UTC 16:00（北京时间 00:00）
```

### 常用 Cron 表达式

| 时间 | Cron 表达式 | 说明 |
|------|------------|------|
| 每天 00:00（北京） | `0 16 * * *` | UTC 16:00 |
| 每天 06:00（北京） | `0 22 * * *` | UTC 22:00 |
| 每天 12:00（北京） | `0 4 * * *` | UTC 04:00 |
| 每 6 小时 | `0 */6 * * *` | 0:00, 6:00, 12:00, 18:00 UTC |
| 每周一 00:00 | `0 16 * * 1` | 每周一 UTC 16:00 |

> **注意**：GitHub Actions 使用 UTC 时间，北京时间 = UTC + 8

### 修改定时时间

编辑 `.github/workflows/auto-update.yml` 文件中的 cron 表达式：

```yaml
on:
  schedule:
    - cron: '0 16 * * *'  # 修改这一行
```

## 🚀 手动触发

除了自动定时执行，您也可以手动触发：

1. 进入仓库的 **Actions** 标签
2. 选择 **定时更新频道数据** workflow
3. 点击 **Run workflow**
4. 选择是否强制更新所有频道
5. 点击绿色的 **Run workflow** 按钮

## 📊 查看执行结果

### 查看运行历史

1. 进入 **Actions** 标签
2. 点击任意一次运行记录
3. 查看各个步骤的详细日志

### 下载日志文件

每次运行后，系统会自动保存日志文件：

1. 进入运行记录详情页
2. 滚动到底部的 **Artifacts** 部分
3. 下载 `update-logs-xxx` 压缩包
4. 日志文件会保留 7 天

## ⚠️ 注意事项

### API 配额限制

- YouTube Data API v3 每天有配额限制（默认 10,000 单位）
- 建议配置多个 API Key 轮换使用
- 使用 `--auto-task` 模式可优化 API 使用

### GitHub Actions 限制

- **定时任务最小间隔**：5 分钟（不建议过于频繁）
- **定时任务可能延迟**：高峰期可能延迟 3-10 分钟
- **并发限制**：免费账户最多同时运行 20 个 workflow
- **存储空间**：artifacts 和 cache 有存储限制

### 仓库权限

确保 Actions 有写入权限：

1. 进入 **Settings** > **Actions** > **General**
2. 滚动到 **Workflow permissions**
3. 选择 **Read and write permissions**
4. 勾选 **Allow GitHub Actions to create and approve pull requests**
5. 点击 **Save**

## 🛠️ 故障排查

### 问题 1：定时任务没有执行

**可能原因**：
- 仓库长期没有活动（60 天），GitHub 会自动禁用定时任务
- Actions 未启用

**解决方法**：
- 手动运行一次 workflow 重新激活
- 或进行任意一次代码提交

### 问题 2：推送失败

**错误信息**：`refusing to allow a GitHub App to create or update workflow`

**解决方法**：
检查 workflow permissions 设置（见上面"仓库权限"部分）

### 问题 3：API Key 失效

**错误信息**：`API key not valid` 或 `quotaExceeded`

**解决方法**：
- 检查 Secrets 中的 API Key 是否正确
- 检查 Google Cloud Console 中 API 配额
- 添加更多 API Key 分散配额

## 📝 工作流程说明

每次自动运行时，会按以下顺序执行：

1. ✅ 检出代码
2. ✅ 设置 Python 环境
3. ✅ 安装依赖包
4. ✅ 配置 API Key
5. ✅ 执行更新脚本（抓取视频数据、处理数据、下载头像等）
6. ✅ 提交并推送更改
7. ✅ 上传日志文件

整个过程完全自动化，无需人工干预。

## 🔗 相关文档

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Cron 表达式说明](https://crontab.guru/)
- [YouTube Data API 配额](https://developers.google.com/youtube/v3/getting-started#quota)

