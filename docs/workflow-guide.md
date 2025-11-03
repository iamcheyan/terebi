# 工作流程指南 - 避免 Git 冲突

## 🎯 问题说明

GitHub Actions 每天凌晨会自动更新频道数据并提交到远程仓库。如果本地也修改了相同的文件，在 `git pull` 时会产生冲突。

## ✅ 推荐工作流程

### 方法 1：使用同步脚本（最简单）

每次开始工作前运行：

```bash
./sync.sh
```

这个脚本会：
- ✅ 自动检测本地是否有未提交的修改
- ✅ 暂存本地修改
- ✅ 拉取远程更新
- ✅ 恢复本地修改并尝试自动合并

### 方法 2：手动同步

```bash
# 1. 开始工作前先拉取
git pull

# 2. 进行本地操作
python tools/get_channel_videos.py

# 3. 提交前再次检查
git pull --rebase

# 4. 提交
git add .
git commit -m "手动更新频道数据"
git push
```

### 方法 3：使用 Git 别名（高级）

在 `.gitconfig` 中添加：

```bash
git config --global alias.sync '!git stash && git pull && git stash pop'
```

然后使用：

```bash
git sync  # 一键同步
```

## 🔄 冲突发生时如何处理

### 场景 1：拉取时提示冲突

```bash
# 1. 暂存本地修改
git stash

# 2. 拉取远程更新
git pull

# 3. 恢复本地修改
git stash pop

# 4. 如果有冲突，手动解决
# 编辑冲突文件，删除冲突标记 <<<<<<<, =======, >>>>>>>

# 5. 标记为已解决
git add .

# 6. 完成合并
git stash drop
```

### 场景 2：推送时提示 rejected

```bash
# 远程有新提交，本地推送失败
error: failed to push some refs to 'xxx'

# 解决方法：
git pull --rebase   # 将本地提交放在远程提交之后
git push            # 重新推送
```

### 场景 3：数据文件冲突

如果 `data/*.json` 文件冲突：

```bash
# 选项 A: 保留远程版本（推荐）
git checkout --theirs data/某文件.json
git add data/某文件.json

# 选项 B: 保留本地版本
git checkout --ours data/某文件.json
git add data/某文件.json

# 选项 C: 手动合并
# 打开文件，编辑冲突部分
```

## 📅 最佳实践

### 1. 时间安排

- **GitHub Actions 运行时间**：东京时间 00:00（凌晨）
- **建议工作时间**：白天（不会冲突）
- **提交时间**：随时，但提交前先 `git pull`

### 2. 文件分工

| 文件类型 | 修改者 | 说明 |
|---------|--------|------|
| `data/*.json` | 主要由 Actions 更新 | 本地尽量不手动修改 |
| `all_channels.json` | 本地修改 | 添加/删除频道 |
| 代码文件 | 本地修改 | Python、HTML、CSS 等 |
| `img/` 目录 | 主要由 Actions 更新 | 新头像由脚本下载 |

### 3. 每日流程

```bash
# 早上开始工作
./sync.sh

# 添加新频道
python add_channel_interactive.py --url @some_channel

# 测试
python tools/get_channel_videos.py

# 提交
git pull --rebase
git add .
git commit -m "添加新频道"
git push
```

## 🚫 避免的操作

❌ **不要**在本地手动编辑 `data/*.json` 文件（除非必要）
❌ **不要**在凌晨（Actions 运行时）推送更新
❌ **不要**强制推送 `git push --force`（会覆盖 Actions 的更新）
❌ **不要**忽略 `git pull` 提示直接推送

## 💡 小技巧

### 查看远程是否有更新

```bash
git fetch
git status
# 会显示：Your branch is behind 'origin/master' by X commits
```

### 查看冲突文件

```bash
git diff --name-only --diff-filter=U
```

### 放弃本地所有修改

```bash
git reset --hard origin/master  # 谨慎使用！
```

## 🆘 紧急情况

如果完全搞混了：

```bash
# 1. 备份重要的本地修改（如果有）
cp -r data/ data_backup/

# 2. 重置到远程状态
git fetch origin
git reset --hard origin/master

# 3. 如果需要，手动复制回重要文件
```

## 📞 常见问题

### Q: Actions 运行时我正在推送怎么办？

A: 没关系，你们推送的时间点不太可能完全重合。最坏情况下你的推送会被拒绝，只需要 `git pull --rebase` 然后重新推送即可。

### Q: 可以关闭自动更新吗？

A: 可以，但不推荐。如果需要临时关闭：
1. 进入 GitHub 仓库
2. Actions → 定时更新频道数据 → 右上角 ⋯ → Disable workflow

### Q: 能否让 Actions 只更新某些频道？

A: 可以修改 workflow 参数，或使用 `skip` 标记。详见 `backend/runner.py --help`。

---

**记住**：使用 `./sync.sh` 是最安全、最简单的方式！ 🚀

