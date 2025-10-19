#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
专门为yukirin_u频道下载头像
"""

import json
import urllib.request
import urllib.parse
import os
from pathlib import Path

def download_yukirin_avatar():
    """下载yukirin_u频道的头像"""
    
    # 频道信息
    channel_url = "https://www.youtube.com/@yukirin_u"
    bakname = "yukirin_u"
    
    # 目录设置
    PROJECT_ROOT = Path(__file__).parent
    IMG_DIR = PROJECT_ROOT / "img"
    IMG_RESIZED_DIR = PROJECT_ROOT / "img" / "resized"
    
    # 创建目录
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    IMG_RESIZED_DIR.mkdir(parents=True, exist_ok=True)
    
    print(f"=== 下载 {bakname} 频道头像 ===")
    print(f"频道URL: {channel_url}")
    
    try:
        # 抓取频道页面HTML
        req = urllib.request.Request(channel_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
        
        # 查找头像图片URL
        import re
        
        # 尝试多种方式查找头像URL
        patterns = [
            r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']',
            r'"avatar":\s*{\s*"thumbnails":\s*\[.*?"url":\s*"([^"]+)"',
            r'"avatar":\s*{\s*"thumbnails":\s*\[.*?"url":\s*"([^"]+)"',
            r'"avatar":\s*{\s*"thumbnails":\s*\[.*?"url":\s*"([^"]+)"',
        ]
        
        avatar_url = None
        for pattern in patterns:
            match = re.search(pattern, html)
            if match:
                avatar_url = match.group(1)
                break
        
        if not avatar_url:
            print("❌ 无法从HTML中提取头像URL")
            return False
        
        print(f"✅ 找到头像URL: {avatar_url}")
        
        # 下载头像
        req2 = urllib.request.Request(avatar_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req2, timeout=20) as resp2:
            content = resp2.read()
        
        # 保存原图
        raw_path = IMG_DIR / f"{bakname}.jpg"
        with open(raw_path, "wb") as f:
            f.write(content)
        print(f"✅ 已保存原图: {raw_path}")
        
        # 生成缩略图
        try:
            from PIL import Image
            from io import BytesIO
            
            with Image.open(BytesIO(content)) as im:
                # 转成RGB，等比缩放到 128x128 画布内，再居中铺满裁剪（方形）
                im = im.convert("RGB")
                size = 128
                # 先按短边等比放大，后居中裁剪
                ratio = max(size / im.width, size / im.height)
                new_w, new_h = int(im.width * ratio), int(im.height * ratio)
                im = im.resize((new_w, new_h), Image.LANCZOS)
                left = (new_w - size) // 2
                top = (new_h - size) // 2
                im = im.crop((left, top, left + size, top + size))
                
                resized_path = IMG_RESIZED_DIR / f"{bakname}.jpg"
                im.save(resized_path, format="JPEG", quality=88, optimize=True)
                print(f"✅ 已生成缩略图: {resized_path}")
                
        except ImportError:
            print("⚠️ 未安装Pillow，无法生成缩略图")
            # 如果没有Pillow，直接复制原图作为缩略图
            resized_path = IMG_RESIZED_DIR / f"{bakname}.jpg"
            with open(resized_path, "wb") as f:
                f.write(content)
            print(f"✅ 已复制为缩略图: {resized_path}")
        
        return True
        
    except Exception as e:
        print(f"❌ 下载失败: {e}")
        return False

if __name__ == "__main__":
    download_yukirin_avatar()
