#!/bin/bash
# Terebi 安全同步脚本
# 用于在本地工作前安全地同步远程更改

set -e  # 遇到错误立即退出

echo "🔄 开始同步远程更新..."

# 检查是否有未提交的修改
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  检测到本地有未提交的修改"
    echo ""
    git status
    echo ""
    read -p "是否暂存本地修改并拉取远程更新？(y/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 暂存本地修改..."
        git stash
        
        echo "⬇️  拉取远程更新..."
        git pull
        
        echo "📂 恢复本地修改..."
        if git stash pop; then
            echo "✅ 同步完成，本地修改已恢复"
        else
            echo "⚠️  合并时出现冲突，请手动解决"
            echo "解决冲突后运行: git add . && git stash drop"
        fi
    else
        echo "❌ 取消同步"
        exit 1
    fi
else
    echo "⬇️  拉取远程更新..."
    git pull
    echo "✅ 同步完成，工作目录干净"
fi

echo ""
echo "📊 当前状态："
git log --oneline -3

