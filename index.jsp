<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Properties" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.io.IOException" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Terebi</title>

    <!-- 添加 favicon -->
    <link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjgiIHJ5PSI4IiBmaWxsPSIjMzMzMzMzIiBzdHJva2U9IiM0NDQ0NDQiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjEyIiB5PSIxMiIgd2lkdGg9Ijc2IiBoZWlnaHQ9Ijc2IiByeD0iNiIgcnk9IjYiIGZpbGw9IiMyYTJhMmEiLz48cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSI3MCIgaGVpZ2h0PSI1MCIgcng9IjIiIHJ5PSIyIiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMyMjIyMjIiIHN0cm9rZS13aWR0aD0iMC41Ii8+PHJlY3QgeD0iMTUiIHk9IjE1IiB3aWR0aD0iMTQiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmZmMDAiLz48cmVjdCB4PSIyOSIgeT0iMTUiIHdpZHRoPSIxNCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzAwZmYwMCIvPjxyZWN0IHg9IjQzIiB5PSIxNSIgd2lkdGg9IjE0IiBoZWlnaHQ9IjUwIiBmaWxsPSIjZmY2OWI0Ii8+PHJlY3QgeD0iNTciIHk9IjE1IiB3aWR0aD0iMTQiIGhlaWdodD0iNTAiIGZpbGw9IiNmZjAwMDAiLz48cmVjdCB4PSI3MSIgeT0iMTUiIHdpZHRoPSIxNCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzQxNjlMMSIvPjxyZWN0IHg9IjE1IiB5PSI3MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjE1IiByeD0iMiIgcnk9IjIiIGZpbGw9IiMyMjIyMjIiLz48Y2lyY2xlIGN4PSIyNSIgY3k9Ijc3LjUiIHI9IjMiIGZpbGw9IiM0NDQ0NDQiIHN0cm9rZT0iIzU1NTU1NSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9Ijc3LjUiIHI9IjMiIGZpbGw9IiM0NDQ0NDQiIHN0cm9rZT0iIzU1NTU1NSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48Y2lyY2xlIGN4PSI1NSIgY3k9Ijc3LjUiIHI9IjMiIGZpbGw9IiM0NDQ0NDQiIHN0cm9rZT0iIzU1NTU1NSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48Y2lyY2xlIGN4PSI3NSIgY3k9Ijc3LjUiIHI9IjQiIGZpbGw9IiM2NjY2NjYiIHN0cm9rZT0iIzc3Nzc3NyIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48Y2lyY2xlIGN4PSI3NSIgY3k9Ijc3LjUiIHI9IjIiIGZpbGw9IiM1NTU1NTUiLz48bGluZSB4MT0iMzAiIHkxPSIxMCIgeDI9IjQwIiB5Mj0iMCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIvPjxsaW5lIHgxPSI3MCIgeTE9IjEwIiB4Mj0iNjAiIHkyPSIwIiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMS41Ii8+PC9zdmc+" type="image/svg+xml">
    
    <link rel="stylesheet" href="styles/main.css">
</head>
<body>
    <div class="container">
        <div class="page-header">
            <!-- LOGO -->
            <svg class="logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <!-- 电视机主体 -->
                <rect x="10" y="10" width="80" height="80" rx="8" ry="8" fill="#333333" stroke="#444444" stroke-width="1"/>
                <!-- 电视机边框阴影 -->
                <rect x="12" y="12" width="76" height="76" rx="6" ry="6" fill="#2a2a2a"/>
                <!-- 屏幕 -->
                <rect x="15" y="15" width="70" height="50" rx="2" ry="2" fill="#000000" stroke="#222222" stroke-width="0.5"/>
                <!-- 彩条 - 更精确的颜色和宽度 -->
                <rect x="15" y="15" width="14" height="50" fill="#ffff00"/>
                <rect x="29" y="15" width="14" height="50" fill="#00ff00"/>
                <rect x="43" y="15" width="14" height="50" fill="#ff69b4"/>
                <rect x="57" y="15" width="14" height="50" fill="#ff0000"/>
                <rect x="71" y="15" width="14" height="50" fill="#4169e1"/>
                <!-- 控制面板 -->
                <rect x="15" y="70" width="70" height="15" rx="2" ry="2" fill="#222222"/>
                <!-- 精致的控制按钮 -->
                <circle cx="25" cy="77.5" r="3" fill="#444444" stroke="#555555" stroke-width="0.5"/>
                <circle cx="40" cy="77.5" r="3" fill="#444444" stroke="#555555" stroke-width="0.5"/>
                <circle cx="55" cy="77.5" r="3" fill="#444444" stroke="#555555" stroke-width="0.5"/>
                <!-- 旋钮 -->
                <circle cx="75" cy="77.5" r="4" fill="#666666" stroke="#777777" stroke-width="0.5"/>
                <circle cx="75" cy="77.5" r="2" fill="#555555"/>
                <!-- 天线 -->
                <line x1="30" y1="10" x2="40" y2="0" stroke="#666666" stroke-width="1.5"/>
                <line x1="70" y1="10" x2="60" y2="0" stroke="#666666" stroke-width="1.5"/>
            </svg>
            <h1>テレビ</h1>
            <%-- <span class="tagline">油管视频在线观看</span> --%>
        </div>
        
        <div class="main-content">
            <div class="left-column">
                <!-- 播放器容器 -->
                <div id="playerContainer">
                    <div class="player-loading">
                        <svg class="loading-icon" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#3d7cf4" stroke-width="2" fill="none" stroke-dasharray="30 15"/>
                        </svg>
                        <span>動画を読み込んでいます。しばらくお待ちください...</span>
                    </div>
                    <div id="player"></div>
                </div>
                
                <!-- 状态信息移到播放器下方 -->
                <div id="status">準備完了、チャンネルを読み込んでいます...</div>
                
                <div id="videoContainer" class="video-grid" style="display: none;">
                    <!-- 视频卡片将在这里显示 -->
                </div>
            </div>
            
            <div class="right-column">
                <div class="channel-list-title">
                    チャンネルリスト
                </div>
                
                <button id="loadChannels" class="load-button">チャンネルリストを読み込む</button>
                
                <div id="channelSelector" style="display: none;">
                    <div id="channelCategories">
                        <!-- 频道分类将在这里显示 -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // 状态元素
        const statusElement = document.getElementById('status');
        const videoContainer = document.getElementById('videoContainer');
        const playlistInfoElement = document.getElementById('playlistInfo');
        const loadChannelsButton = document.getElementById('loadChannels');
        const channelSelector = document.getElementById('channelSelector');
        const channelCategories = document.getElementById('channelCategories');
        const playerContainer = document.getElementById('playerContainer');
        
        // 页面加载完成后自动加载频道列表
        document.addEventListener('DOMContentLoaded', function() {
            console.log('页面已加载，自动获取频道列表');
            fetchChannelList(true); // 传递参数表示加载后随机选择一个频道
        });
        
        // 加载频道按钮事件监听
        loadChannelsButton.addEventListener('click', function() {
            console.log('加载频道按钮被点击');
            fetchChannelList(false); // 手动点击不需要随机选择
        });
        
        // 获取频道列表
        async function fetchChannelList(autoSelectRandom = false) {
            try {
                statusElement.textContent = '正在获取频道列表...';
                
                const response = await fetch('japan_tv_youtube_channels.json');
                if (!response.ok) {
                    throw new Error('无法获取频道列表: ' + response.status);
                }
                
                const channelData = await response.json();
                console.log('频道数据:', channelData);
                
                // 显示频道选择器
                displayChannelSelector(channelData);
                
                // 收集所有有效且已缓存的频道
                let allChannels = [];
                
                // 处理全国放送局
                if (channelData['全国放送局']) {
                    channelData['全国放送局'].forEach(channel => {
                        if (channel.name && channel.url && channel.url.trim() !== '' && channel.cached === true) {
                            allChannels.push(channel);
                        }
                    });
                }
                
                // 处理地方放送局
                if (channelData['地方放送局']) {
                    const regions = Object.keys(channelData['地方放送局']);
                    regions.forEach(region => {
                        channelData['地方放送局'][region].forEach(channel => {
                            if (channel.name && channel.url && channel.url.trim() !== '' && channel.cached === true) {
                                allChannels.push(channel);
                            }
                        });
                    });
                }
                
                statusElement.textContent = 'チャンネルリストの読み込みが完了しました。チャンネルを選択してください';
                loadChannelsButton.style.display = 'none';
                channelSelector.style.display = 'block';
                
                // 如果需要自动选择随机频道
                if (autoSelectRandom && allChannels.length > 0) {
                    const randomChannel = allChannels[Math.floor(Math.random() * allChannels.length)];
                    console.log('ランダムに選択されたチャンネル:', randomChannel.name);
                    statusElement.textContent = 'ランダムに選択されたチャンネル: ' + randomChannel.name;
                    
                    // 提取频道ID并加载视频
                    let channelId = extractChannelId(randomChannel.url);
                    if (channelId) {
                        // 查找并高亮显示对应的频道按钮
                        setTimeout(() => {
                            const channelButtons = document.querySelectorAll('.channel-button');
                            channelButtons.forEach(btn => {
                                if (btn.textContent === randomChannel.name) {
                                    btn.classList.add('active');
                                    // 滚动到该按钮位置
                                    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                }
                            });
                        }, 100);
                        
                        // 直接使用频道名称加载视频
                        getChannelUploads(channelId, randomChannel.name);
                    }
                }
                
            } catch (error) {
                console.error('チャンネルリストの取得に失敗しました: ' + error.message);
                statusElement.textContent = 'チャンネルリストの取得に失敗しました: ' + error.message;
            }
        }
        
        // 显示频道选择器
        function displayChannelSelector(channelData) {
            channelCategories.innerHTML = '';
            
            // 处理全国放送局
            if (channelData['全国放送局']) {
                const nationalSection = document.createElement('div');
                nationalSection.className = 'channel-section';
                
                const nationalTitle = document.createElement('h3');
                nationalTitle.textContent = '全国放送局';
                nationalSection.appendChild(nationalTitle);
                
                const nationalChannels = document.createElement('div');
                nationalChannels.className = 'channel-list';
                
                // 只显示 cached 为 true 的频道
                channelData['全国放送局'].forEach(channel => {
                    if (channel.name && channel.url && channel.cached === true) {
                        const channelButton = createChannelButton(channel);
                        nationalChannels.appendChild(channelButton);
                    }
                });
                
                // 只有当有频道时才添加该区域
                if (nationalChannels.children.length > 0) {
                    nationalSection.appendChild(nationalChannels);
                    channelCategories.appendChild(nationalSection);
                }
            }
            
            // 处理地方放送局
            if (channelData['地方放送局']) {
                const regions = Object.keys(channelData['地方放送局']);
                
                regions.forEach(region => {
                    const regionSection = document.createElement('div');
                    regionSection.className = 'channel-section';
                    
                    const regionTitle = document.createElement('h3');
                    regionTitle.textContent = region;
                    regionSection.appendChild(regionTitle);
                    
                    const regionChannels = document.createElement('div');
                    regionChannels.className = 'channel-list';
                    
                    // 只显示 cached 为 true 的频道
                    channelData['地方放送局'][region].forEach(channel => {
                        if (channel.name && channel.url && channel.cached === true) {
                            const channelButton = createChannelButton(channel);
                            regionChannels.appendChild(channelButton);
                        }
                    });
                    
                    // 只有当该地区有频道时才添加该区域
                    if (regionChannels.children.length > 0) {
                        regionSection.appendChild(regionChannels);
                        channelCategories.appendChild(regionSection);
                    }
                });
            }
        }
        
        // 创建频道按钮
        function createChannelButton(channel) {
            const channelButton = document.createElement('button');
            channelButton.className = 'channel-button';
            channelButton.textContent = channel.name;
            
            // 从URL中提取频道ID或播放列表ID
            const channelUrl = channel.url;
            
            // 只处理有效的URL
            if (channelUrl && channelUrl.trim() !== '') {
                channelButton.addEventListener('click', function() {
                    console.log('選択されたチャンネル:', channel.name, channelUrl);
                    
                    // 移除所有频道按钮的活跃状态
                    document.querySelectorAll('.channel-button').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    
                    // 为当前点击的按钮添加活跃状态
                    this.classList.add('active');
                    
                    // 提取频道ID
                    let channelId = extractChannelId(channelUrl);
                    
                    if (channelId) {
                        // 设置状态
                        statusElement.textContent = 'チャンネルの動画を読み込んでいます: ' + channel.name + '...';
                        
                        // 更新URL，不刷新页面
                        updateUrlParameter('channelId', channelId);
                        
                        // 获取频道的上传播放列表ID，传递频道名称
                        getChannelUploads(channelId, channel.name);
                    } else {
                        statusElement.textContent = 'このチャンネルには有効なURLがありません: ' + channelUrl;
                    }
                });
            } else {
                channelButton.disabled = true;
                channelButton.title = 'このチャンネルには有効なURLがありません';
            }
            
            return channelButton;
        }
        
        // 更新URL参数而不刷新页面
        function updateUrlParameter(key, value) {
            const url = new URL(window.location.href);
            url.searchParams.set(key, value);
            window.history.pushState({ path: url.href }, '', url.href);
        }
        
        // 从URL中提取频道ID
        function extractChannelId(url) {
            try {
                const urlObj = new URL(url);
                if (urlObj.hostname.includes('youtube.com')) {
                    if (urlObj.pathname.includes('/channel/')) {
                        return urlObj.pathname.split('/channel/')[1].split('/')[0];
                    }
                    if (urlObj.pathname.includes('/c/') || urlObj.pathname.includes('/user/') || urlObj.pathname.includes('/@')) {
                        return urlObj.pathname.split('/').pop();
                    }
                }
                return null;
            } catch (e) {
                console.error('URL解析エラー:', e);
                return null;
            }
        }
        
        // 获取频道的上传播放列表ID
        async function getChannelUploads(channelId, channelName) {
            try {
                if (!channelId) {
                    throw new Error('チャンネルIDが無効です');
                }
                
                let jsonUrl;
                
                // 如果有频道名称，优先使用频道名称查找JSON文件
                if (channelName) {
                    jsonUrl = new URL('data/' + encodeURIComponent(channelName) + '.json', window.location.href).pathname;
                } 

                // 尝试获取JSON文件
                let response = await fetch(jsonUrl);
                
                // 如果使用频道名称的JSON不存在，尝试使用频道ID
                if (!response.ok && channelName) {
                    const encodedChannelId = encodeURIComponent(channelId.trim());
                    jsonUrl = new URL('data/' + encodedChannelId + '.json', window.location.href).pathname;
                    response = await fetch(jsonUrl);
                }

                if (!response.ok) {
                    throw new Error('動画リストの取得に失敗しました: ' + response.status);
                }
                
                const channelData = await response.json();
                
                // 检查是否有视频数据
                if (channelData && channelData.videos && channelData.videos.length > 0) {
                    // 处理视频数据
                    const videoItems = channelData.videos.map(video => ({
                        videoId: video.id,
                        title: video.title,
                        thumbnail: video.thumbnail,
                        url: video.url
                    }));
                    
       
                    
                    // 隐藏视频容器
                    videoContainer.style.display = 'none';
                    
                    // 开始随机播放
                    startRandomPlayback(videoItems);
                    return;
                }
             
                statusElement.textContent = 'このチャンネルには再生可能な動画がありません';
                
            } catch (error) {
                statusElement.textContent = '動画リストの取得に失敗しました: ' + error.message;
            }
        }
        
        // 新增函数：开始随机播放
        function startRandomPlayback(videos) {
            if (!videos || videos.length === 0) {
                statusElement.textContent = '再生可能な動画がありません';
                return;
            }
            
            // 保存视频列表到全局变量，以便在视频结束后使用
            window.videoPlaylist = videos;
            
            // 随机选择一个视频
            const randomIndex = Math.floor(Math.random() * videos.length);
            const randomVideo = videos[randomIndex];
            
            // 更新状态 - 显示频道URL
            statusElement.textContent = '再生中: ' + randomVideo.url;
            
            // 播放视频
            playVideo(randomVideo.videoId);
        }

        // 播放器状态变化
        function onPlayerStateChange(event) {
            // 当视频结束时
            if (event.data == YT.PlayerState.ENDED) {
                // 检查是否有播放列表
                if (window.videoPlaylist && window.videoPlaylist.length > 0) {
                    // 随机选择下一个视频
                    const randomIndex = Math.floor(Math.random() * window.videoPlaylist.length);
                    const nextVideo = window.videoPlaylist[randomIndex];
                    
                    // 更新状态 - 显示频道URL
                    statusElement.textContent = '再生中: ' + nextVideo.url;
                    
                    // 播放随机选择的视频
                    playVideo(nextVideo.videoId);
                }
            }
        }

        // 播放视频
        function playVideo(videoId) {
            if (!videoId) {
                console.error('无效的视频ID');
                return;
            }
            
            // 隐藏加载动画
            document.querySelector('.player-loading').style.display = 'none';
            
            if (player) {
                // 如果播放器已存在，加载新视频
                player.loadVideoById(videoId);
            } else {
                // 初始化播放器
                player = new YT.Player('player', {
                    height: '100%',
                    width: '100%',
                    videoId: videoId,
                    playerVars: {
                        'autoplay': 1,
                        'controls': 1,
                        'rel': 0,
                        'fs': 1
                    },
                    events: {
                        'onReady': onPlayerReady,
                        'onStateChange': onPlayerStateChange
                    }
                });
            }
        }

        // 播放器准备就绪
        function onPlayerReady(event) {
            event.target.playVideo();
        }
        
        // 格式化日期函数
        function formatDate(isoString) {
            const date = new Date(isoString);
            return date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        
        // 数组随机排序函数
        function shuffleArray(array) {
            const shuffled = array.slice();
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        // 添加调试信息
        console.log('DOMContentLoaded イベントリスナーが追加されました');

        // 添加YouTube播放器API
        let tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        let firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // 定义播放器变量
        let player;

        document.addEventListener('DOMContentLoaded', function() {
        // 给页面一点时间完全加载所有元素
        setTimeout(() => {
            // 查找带有active类的channel-button
            const activeButton = document.querySelector('.channel-button.active');
            
            if (activeButton) {
                console.log('找到活跃频道按钮:', activeButton.textContent);
                
                // 模拟鼠标点击
                activeButton.click();
                
            } else {
                console.log('未找到带有active类的频道按钮');
            }
        }, 1000); // 延迟1秒执行
    });
    </script>


</body>
</html> 