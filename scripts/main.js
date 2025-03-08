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
    
    // 初始化频道列表折叠/展开按钮
    initToggleChannelList();
    
    // 加载YouTube API
    loadYouTubeAPI();
    
    // 自动获取频道列表
    fetchChannelList(true);
    
    // 动态加载移动端样式
    if (isMobileDevice()) {
        loadMobileStyles();
    } else {
        console.log('PC端样式已加载');
    }
    
    // 设置自动搜索计时器
    setupAutoSearchTimer();
});

// 初始化频道列表折叠/展开按钮
function initToggleChannelList() {
    const toggleButton = document.getElementById('toggleChannelList');
    const rightColumn = document.querySelector('.right-column');
    const fixedBox = document.querySelector('.fixed-box');
    const mainContent = document.querySelector('.main-content');
    
    if (toggleButton && rightColumn && fixedBox && mainContent) {
        toggleButton.addEventListener('click', function() {
            // 切换折叠状态
            rightColumn.classList.toggle('collapsed');
            fixedBox.classList.toggle('expanded');
            mainContent.classList.toggle('expanded');
            toggleButton.classList.toggle('collapsed');
            
            // 保存状态到本地存储
            const isCollapsed = rightColumn.classList.contains('collapsed');
            localStorage.setItem('channelListCollapsed', isCollapsed);
            
            console.log('频道列表折叠状态:', isCollapsed ? '已折叠' : '已展开');
        });
        
        // 从本地存储恢复状态
        const savedState = localStorage.getItem('channelListCollapsed');
        if (savedState === 'true') {
            // rightColumn.classList.add('collapsed');
            // fixedBox.classList.add('expanded');
            // mainContent.classList.add('expanded');
            // toggleButton.classList.add('collapsed');
        }
    } else {
        console.error('无法找到频道列表折叠/展开按钮或相关元素');
    }
}

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

// 设置自动收缩频道列表计时器
// function setupAutoSearchTimer() {
//     // 检查是否为移动端
//     if (window.matchMedia("(max-width: 768px)").matches) {
//         // console.log('移动端，不执行自动收缩频道列表计时器');
//         return; // 如果是移动端则不执行
//     }

//     let inactivityTimer;
//     const inactivityTimeout = 10000; // 30秒
    
//     // 重置计时器函数
//     function resetTimer() {
//         clearTimeout(inactivityTimer);
//         inactivityTimer = setTimeout(performAutoSearch, inactivityTimeout);
//     }
    
//     // 自动收缩频道列表函数
//     function performAutoSearch() {
//         console.log('用户操作，自动收缩频道列表...');
//         // 点击 #toggleChannelList 来收缩频道列表
//         const toggleButton = document.getElementById('toggleChannelList');
//         if (toggleButton && !toggleButton.classList.contains('collapsed')) { // 检查是否已经收缩
//             toggleButton.click();
//         }
//     }
    
//     // 监听用户交互事件
//     const userEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
//     userEvents.forEach(event => {
//         document.addEventListener(event, resetTimer, false);
//     });
    
//     // 初始化计时器
//     resetTimer();
    
//     console.log('自动收缩频道列表计时器已设置，30秒无操作将自动收缩频道列表');
// }

// 添加调试信息
console.log('DOMContentLoaded イベントリスナーが追加されました');