// 全局变量定义
let statusElement, videoContainer, playlistInfoElement, channelSelector, channelCategories, playerContainer;
let player;

// 检测是否为移动设备
function isMobileDevice() {
    return (window.innerWidth <= 768) || 
            (navigator.userAgent.match(/Android/i)) || 
            (navigator.userAgent.match(/webOS/i)) || 
            (navigator.userAgent.match(/iPhone/i)) || 
            (navigator.userAgent.match(/iPad/i)) || 
            (navigator.userAgent.match(/iPod/i)) || 
            (navigator.userAgent.match(/BlackBerry/i)) || 
            (navigator.userAgent.match(/Windows Phone/i));
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('页面已加载，初始化应用...');
    
    // 初始化DOM元素引用
    statusElement = document.getElementById('status');
    videoContainer = document.getElementById('videoContainer');
    playlistInfoElement = document.getElementById('playlistInfo');
    channelSelector = document.getElementById('channelSelector');
    channelCategories = document.getElementById('channelCategories');
    playerContainer = document.getElementById('playerContainer');
    
    // 检查元素是否存在
    if (!statusElement || !videoContainer || !channelSelector || !channelCategories || !playerContainer) {
        console.error('无法找到必要的DOM元素');
        return;
    }
    
    // // 初始化频道列表折叠/展开按钮
    // initToggleChannelList();
    
    // 加载YouTube API
    loadYouTubeAPI();
    
    // 获取上次观看的频道信息
    const lastWatchedChannel = localStorage.getItem('lastWatchedChannel');
    
    // 自动获取频道列表，并根据是否有上次观看记录决定是否随机选择
    fetchChannelList(!lastWatchedChannel);
    
    // 动态加载移动端样式
    if (isMobileDevice()) {
        loadMobileStyles();
    } else {
        console.log('PC端样式已加载');
    }
    
    // // 设置自动搜索计时器
    // setupAutoSearchTimer();
});

// // 初始化频道列表折叠/展开按钮
// function initToggleChannelList() {
//     const toggleButton = document.getElementById('toggleChannelList');
//     const rightColumn = document.querySelector('.right-column');
//     const fixedBox = document.querySelector('.fixed-box');
//     const mainContent = document.querySelector('.main-content');
    
//     if (toggleButton && rightColumn && fixedBox && mainContent) {
//         toggleButton.addEventListener('click', function() {
//             // 切换折叠状态
//             rightColumn.classList.toggle('collapsed');
//             fixedBox.classList.toggle('expanded');
//             mainContent.classList.toggle('expanded');
//             toggleButton.classList.toggle('collapsed');
            
//             // 保存状态到本地存储
//             const isCollapsed = rightColumn.classList.contains('collapsed');
//             localStorage.setItem('channelListCollapsed', isCollapsed);
            
//             console.log('频道列表折叠状态:', isCollapsed ? '已折叠' : '已展开');
//         });
        
//         // 从本地存储恢复状态
//         const savedState = localStorage.getItem('channelListCollapsed');
//         if (savedState === 'true') {
//             // rightColumn.classList.add('collapsed');
//             // fixedBox.classList.add('expanded');
//             // mainContent.classList.add('expanded');
//             // toggleButton.classList.add('collapsed');
//         }
//     } else {
//         console.error('无法找到频道列表折叠/展开按钮或相关元素');
//     }
// }

// 加载YouTube API
function loadYouTubeAPI() {
    console.log('加载YouTube API...');
    let tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    let firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// YouTube API准备就绪时的回调函数
function onYouTubeIframeAPIReady() {
    console.log('YouTube API已加载完成');
    // 此时可以初始化播放器，但我们会在选择频道后再创建播放器
}

// 加载移动端样式
function loadMobileStyles() {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'styles/mobile.css';
    document.head.appendChild(link);
    
    // 添加移动端标记类
    document.documentElement.classList.add('mobile-device');
    console.log('移动端样式已加载');

    // 处理移动端布局
    setTimeout(function() {
        const fixedBox = document.querySelector('.fixed-box');
        const rightColumn = document.querySelector('.right-column');

        if (fixedBox && rightColumn) {
            const updateMarginTop = () => {
                const fixedBoxHeight = fixedBox.offsetHeight;
                console.log('Fixed Box Height:', fixedBoxHeight);
                
                if (fixedBoxHeight && fixedBoxHeight > 0) {
                    const marginTopValue = (fixedBoxHeight + 10) + 'px';
                    rightColumn.style.marginTop = marginTopValue;
                    console.log('Margin Top Value:', marginTopValue);
                } else {
                    console.error('Invalid Fixed Box Height:', fixedBoxHeight);
                }
            };

            // 初始设置
            updateMarginTop();

            // 监听固定框的高度变化
            const resizeObserver = new ResizeObserver(() => {
                setTimeout(updateMarginTop, 500);
            });
            resizeObserver.observe(fixedBox);
        } else {
            console.error('Fixed Box or Right Column not found');
        }
    }, 500);
}

// 获取频道列表
async function fetchChannelList(autoSelectRandom = false) {
    try {
        statusElement.textContent = '正在获取频道列表...';
        
        const response = await fetch('japan_tv_youtube_channels.json');
        if (!response.ok) {
            throw new Error('无法获取频道列表: ' + response.status);
        }
        
        const channelData = await response.json();
        console.log('原始JSON数据:', channelData);
        
        // 显示频道选择器
        displayChannelSelector(channelData);
        
        // 收集所有有效且已缓存的频道
        let allChannels = [];
        
        // 遍历所有分类
        Object.entries(channelData).forEach(([category, content]) => {
            Object.values(content).forEach(channels => {
                channels.forEach(channel => {
                    if (channel.name && channel.url && channel.url.trim() !== '') {
                        allChannels.push(channel);
                    }
                });
            });
        });
        
        statusElement.textContent = 'チャンネルリストの読み込みが完了しました。チャンネルを選択してください';
        channelSelector.style.display = 'block';
        
        // 获取上次观看的频道信息
        const lastWatchedChannel = localStorage.getItem('lastWatchedChannel');
        
        if (lastWatchedChannel) {
            // 如果有上次观看记录，优先使用该频道
            const channelInfo = JSON.parse(lastWatchedChannel);
            console.log('前回視聴したチャンネル:', channelInfo.name);
            statusElement.textContent = '前回視聴したチャンネル: ' + channelInfo.name;
            
            let channelId = extractChannelId(channelInfo.url);
            if (channelId) {
                setTimeout(() => {
                    const channelButtons = document.querySelectorAll('.channel-item');
                    channelButtons.forEach(btn => {
                        if (btn.querySelector('.channel-name').textContent === channelInfo.name) {
                            btn.classList.add('active');
                            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            
                            // 30毫秒后自动触发点击事件
                            setTimeout(() => {
                                btn.click();
                                console.log('自动触发上次观看频道的点击事件:', channelInfo.name);
                            }, 30);
                        }
                    });
                }, 100);
                
                getChannelUploads(channelId, channelInfo.name);
            }
        } else if (autoSelectRandom && allChannels.length > 0) {
            // 如果没有上次观看记录且需要随机选择
            const randomChannel = allChannels[Math.floor(Math.random() * allChannels.length)];
            console.log('ランダムに選択されたチャンネル:', randomChannel.name);
            statusElement.textContent = 'ランダムに選択されたチャンネル: ' + randomChannel.name;
            
            let channelId = extractChannelId(randomChannel.url);
            if (channelId) {
                setTimeout(() => {
                    const channelButtons = document.querySelectorAll('.channel-item');
                    channelButtons.forEach(btn => {
                        if (btn.textContent === randomChannel.name) {
                            btn.classList.add('active');
                            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }
                    });
                }, 100);
                
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
    
    // 遍历所有顶级分类
    Object.entries(channelData).forEach(([category, content]) => {
        const section = document.createElement('div');
        section.className = 'channel-section';
        
        const title = document.createElement('h3');
        title.textContent = category;
        section.appendChild(title);
        
        const channelList = document.createElement('div');
        channelList.className = 'channel-list';
        
        // 处理所有分类
        Object.entries(content).forEach(([subCategory, channels]) => {
            const subCategoryTitle = document.createElement('h4');
            subCategoryTitle.textContent = subCategory;
            subCategoryTitle.className = 'network-title';
            channelList.appendChild(subCategoryTitle);
            
            channels.forEach(channel => {
                if (channel.name && channel.url) {
                    const channelButton = createChannelButton(channel);
                    channelList.appendChild(channelButton);
                }
            });
        });
        
        // 只有当有频道时才添加该区域
        if (channelList.children.length > 0) {
            section.appendChild(channelList);
            channelCategories.appendChild(section);
        }
    });
}

// 创建频道按钮
function createChannelButton(channel) {
    const channelButton = document.createElement('div');
    channelButton.className = 'channel-item';
    
    // 创建头像容器
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'channel-avatar';
    
    // 创建头像图片
    const avatarImg = document.createElement('img');
    avatarImg.src = `img/${encodeURIComponent(channel.name)}.jpg`;
    avatarImg.onerror = function() {
        this.src = 'img/placeholder.jpg';
    };
    avatarImg.alt = channel.name;
    
    // 创建频道信息容器
    const channelInfo = document.createElement('div');
    channelInfo.className = 'channel-info';
    
    // 创建频道名称元素
    const channelName = document.createElement('span');
    channelName.className = 'channel-name';
    channelName.textContent = channel.name;
    
    // 组装DOM结构
    avatarContainer.appendChild(avatarImg);
    channelInfo.appendChild(channelName);
    channelButton.appendChild(avatarContainer);
    channelButton.appendChild(channelInfo);
    
    // 从URL中提取频道ID或播放列表ID
    const channelUrl = channel.url;
    
    // 只处理有效的URL
    if (channelUrl && channelUrl.trim() !== '') {
        channelButton.addEventListener('click', function() {
            console.log('選択されたチャンネル:', channel.name, channelUrl);
            
            // 保存当前选择的频道信息到本地存储
            localStorage.setItem('lastWatchedChannel', JSON.stringify({
                name: channel.name,
                url: channelUrl
            }));
            
            // 移除所有频道按钮的活跃状态
            document.querySelectorAll('.channel-item').forEach(btn => {
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
        channelButton.classList.add('disabled');
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
        
        // console.log('调试信息 - 开始获取频道上传列表');
        // console.log('调试信息 - 频道ID:', channelId);
        // console.log('调试信息 - 频道名称:', channelName);

        // 首先尝试使用频道名称构建URL
        if (channelName) {
            jsonUrl = new URL('data/' + encodeURIComponent(channelName) + '.json', window.location.href).pathname;
            // console.log('调试信息 - 使用频道名称构建JSON URL:', jsonUrl);
            
            // 尝试获取JSON文件
            try {
                let testResponse = await fetch(jsonUrl);
                if (testResponse.ok) {
                    // console.log('调试信息 - 使用频道名称成功获取到JSON文件');
                } else {
                    throw new Error('使用频道名称无法获取JSON文件');
                }
            } catch (error) {
                // console.log('调试信息 - 使用频道名称获取失败，尝试使用bakname');
                
                // 如果使用频道名称失败，尝试获取bakname
                const response = await fetch('japan_tv_youtube_channels.json');
                const channelsData = await response.json();
                
                // 查找对应的频道信息
                let foundChannel = null;
                // 遍历所有地区
                for (const region in channelsData) {
                    // 遍历每个地区下的分类
                    for (const category in channelsData[region]) {
                        // 遍历分类下的频道列表
                        const channels = channelsData[region][category];
                        const found = channels.find(channel => 
                            channel.url.includes(channelId) || 
                            channel.name === channelName
                        );
                        if (found) {
                            foundChannel = found;
                            break;
                        }
                    }
                    if (foundChannel) break;
                }

                // console.log('调试信息 - 找到的频道信息:', foundChannel);

                // 使用bakname构建新的URL
                if (foundChannel && foundChannel.bakname && foundChannel.bakname.trim() !== "") {
                    jsonUrl = new URL('data/' + encodeURIComponent(foundChannel.bakname) + '.json', window.location.href).pathname;
                    // console.log('调试信息 - 使用bakname构建JSON URL:', jsonUrl);
                } else {
                    throw new Error('無効なチャンネル情報です');
                }
            }
        } else {
            throw new Error('チャンネル名が見つかりません');
        }

        // 获取JSON文件
        // console.log('调试信息 - 开始获取JSON文件:', jsonUrl);
        let videoResponse = await fetch(jsonUrl);
        // console.log('调试信息 - 获取JSON响应状态:', videoResponse.status, videoResponse.statusText);
        
        if (!videoResponse.ok) {
            throw new Error('動画リストの取得に失敗しました: ' + videoResponse.status);
        }
        
        const videoListData = await videoResponse.json();
        // console.log('调试信息 - 获取到的视频数据:', videoListData);
        
        // 检查是否有视频数据
        if (videoListData && videoListData.videos && videoListData.videos.length > 0) {
            const videoItems = videoListData.videos.map(video => ({
                videoId: video.id,
                title: video.title,
                thumbnail: video.thumbnail,
                url: video.url
            }));
            
            videoContainer.style.display = 'none';
            startRandomPlayback(videoItems);
            return;
        }
        
        statusElement.textContent = 'このチャンネルには再生可能な動画がありません';
        
    } catch (error) {
        console.error('错误:', error);
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

// 播放视频
function playVideo(videoId) {
    if (!videoId) {
        console.error('无效的视频ID');
        return;
    }
    
    // 隐藏加载动画
    document.querySelector('.player-loading').style.display = 'none';
    
    const playerConfig = {
        videoId: videoId,
        playerVars: {
            'autoplay': 1,
            'controls': 1,
            'rel': 0,
            'fs': 1,
            'cc_load_policy': 1,
            'cc_lang_pref': 'ja',
            'hl': 'ja',
            'enablejsapi': 1
        }
    };
    
    if (player) {
        // 如果播放器已存在，加载新视频
        player.loadVideoById(playerConfig);
    } else {
        // 初始化播放器
        player = new YT.Player('player', {
            height: '100%',
            width: '100%',
            ...playerConfig,
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onApiChange': function(event) {
                    // 当字幕API准备就绪时
                    if (player.getOptions().indexOf('captions') !== -1) {
                        // 获取可用的字幕轨道
                        const tracks = player.getOption('captions', 'tracklist');
                        // 启用字幕
                        player.loadModule('captions');
                        player.setOption('captions', 'track', {'languageCode': 'ja'});
                        player.setOption('captions', 'reload', true);
                        player.setOption('captions', 'fontSize', 2);
                    }
                }
            }
        });
    }
}

// 播放器准备就绪
function onPlayerReady(event) {
    event.target.playVideo();
    // 尝试启用字幕
    if (player.getOptions().indexOf('captions') !== -1) {
        player.loadModule('captions');
        player.setOption('captions', 'track', {'languageCode': 'ja'});
        player.setOption('captions', 'reload', true);
        player.setOption('captions', 'fontSize', 2);
    }
}

// 播放器状态变化
function onPlayerStateChange(event) {
    // 当视频开始播放时
    if (event.data == YT.PlayerState.PLAYING) {
        // 再次尝试启用字幕
        if (player.getOptions().indexOf('captions') !== -1) {
            player.loadModule('captions');
            player.setOption('captions', 'track', {'languageCode': 'ja'});
            player.setOption('captions', 'reload', true);
            player.setOption('captions', 'fontSize', 2);
        }
    }
    // 当视频结束时的原有逻辑
    else if (event.data == YT.PlayerState.ENDED) {
        if (window.videoPlaylist && window.videoPlaylist.length > 0) {
            const randomIndex = Math.floor(Math.random() * window.videoPlaylist.length);
            const nextVideo = window.videoPlaylist[randomIndex];
            statusElement.textContent = '再生中: ' + nextVideo.url;
            playVideo(nextVideo.videoId);
        }
    }
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
// 全屏切换功能
function toggleFullscreen() {
    const container = document.querySelector('.container');
    const footer = document.querySelector('.footer');
    
    if (container.style.maxWidth === 'none') {
        // 恢复正常宽度
        container.style.maxWidth = '1200px';
        // 显示页脚
        if (footer) footer.style.display = '';
        console.log('已退出全屏模式');
    } else {
        // 进入全屏模式
        container.style.maxWidth = 'none';
        // 隐藏页脚
        if (footer) footer.style.display = 'none';
        console.log('已进入全屏模式');
    }
}

// 添加全屏按钮点击事件监听
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenButton = document.getElementById('fullscreenButton');
    if (fullscreenButton) {
        // 检查本地存储中的全屏状态
        const isFullscreen = localStorage.getItem('isFullscreen') === 'true';
        
        // 如果上次是全屏模式，则恢复全屏状态
        if (isFullscreen) {
            toggleFullscreen();
        }
        
        // 添加点击事件，并在点击时保存状态到本地存储
        fullscreenButton.addEventListener('click', function() {
            toggleFullscreen();
            // 切换并保存当前状态到本地存储
            const currentState = localStorage.getItem('isFullscreen') === 'true';
            localStorage.setItem('isFullscreen', (!currentState).toString());
        });
        
        console.log('全屏按钮事件监听已添加，并从本地缓存恢复状态');
    } else {
        console.warn('未找到全屏按钮元素');
    }
});

// 添加调试信息
console.log('DOMContentLoaded イベントリスナーが追加されました');