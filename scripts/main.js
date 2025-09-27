// 全局变量定义
let statusElement, videoContainer, playlistInfoElement, channelSelector, channelCategories, playerContainer;
let player;
let playerReady = false;
let pendingVideoId = null;

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
    
    // 初始化设置功能
    initSettings();
    
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
    // 检查是否有待播放的视频
    if (pendingVideoId) {
        console.log('播放待播放的视频:', pendingVideoId);
        const queuedVideo = pendingVideoId;
        pendingVideoId = null;
        playVideo(queuedVideo);
    }
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

    // 在移动端将footer-info元素移动到right-column末尾
    const footerInfo = document.querySelector('.footer-info');
    const rightColumn = document.querySelector('.right-column');
    
    if (footerInfo && rightColumn) {
        // 克隆footer-info元素
        const footerInfoClone = footerInfo.cloneNode(true);
        
        // 在right-column末尾添加克隆的footer-info
        rightColumn.appendChild(footerInfoClone);
        
        // 隐藏原来的footer-info
        footerInfo.style.display = 'none';
        
        console.log('已将footer-info移动到right-column末尾');
    } else {
        console.error('未找到footer-info或right-column元素');
    }
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
        
        // 检查URL参数中是否有channelId
        const urlParams = new URLSearchParams(window.location.search);
        const channelIdParam = urlParams.get('channelId');
        
        if (channelIdParam) {
            // 如果URL中有channelId参数，优先使用该频道
            console.log('从URL参数获取频道ID:', channelIdParam);
            statusElement.textContent = 'URLパラメータからチャンネルを読み込んでいます...';
            
            // 查找匹配的频道名称
            let foundChannel = null;
            for (const channel of allChannels) {
                if (channel.url.includes(channelIdParam)) {
                    foundChannel = channel;
                    break;
                }
            }
            
            if (foundChannel) {
                console.log('找到匹配的频道:', foundChannel.name);
                statusElement.textContent = 'チャンネルを読み込んでいます: ' + foundChannel.name;
                
                setTimeout(() => {
                    const channelButtons = document.querySelectorAll('.channel-item');
                    channelButtons.forEach(btn => {
                        if (btn.querySelector('.channel-name').textContent === foundChannel.name) {
                            btn.classList.add('active');
                            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            
                            setTimeout(() => {
                                btn.click();
                                console.log('自动触发URL参数指定频道的点击事件:', foundChannel.name);
                            }, 30);
                        }
                    });
                }, 100);
                
                getChannelUploads(channelIdParam, foundChannel.name);
            } else {
                // 如果找不到匹配的频道名称，直接使用参数中的ID
                console.log('未找到匹配频道名称，直接使用ID:', channelIdParam);
                statusElement.textContent = 'チャンネルIDを直接使用しています: ' + channelIdParam;
                getChannelUploads(channelIdParam, 'チャンネル');
            }
        } else {
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
        }
        
    } catch (error) {
        console.error('チャンネルリストの取得に失敗しました: ' + error.message);
        statusElement.textContent = 'チャンネルリストの取得に失敗しました: ' + error.message;
    }
}

// 显示频道选择器
function displayChannelSelector(channelData) {
    channelCategories.innerHTML = '';
    
    // 确保已有的搜索框可见
    const existingSearchInput = document.getElementById('channelSearch');
    if (existingSearchInput) {
        existingSearchInput.style.display = 'block';
        
        // 添加搜索功能到已有的搜索框
        existingSearchInput.addEventListener('input', function() {
            searchChannels(this.value);
        });
    }
    
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
            // 创建子分类容器
            const subCategoryContainer = document.createElement('div');
            subCategoryContainer.className = 'subcategory-container';
            
            const subCategoryTitle = document.createElement('h4');
            subCategoryTitle.textContent = subCategory;
            subCategoryTitle.className = 'network-title';
            subCategoryContainer.appendChild(subCategoryTitle);
            
            // 创建频道组容器
            const channelsGroup = document.createElement('div');
            channelsGroup.className = 'channels-group';
            
            channels.forEach(channel => {
                if (channel.name && channel.url) {
                    const channelButton = createChannelButton(channel);
                    channelsGroup.appendChild(channelButton);
                }
            });
            
            // 将频道组添加到子分类容器
            subCategoryContainer.appendChild(channelsGroup);
            
            // 只有当有频道时才添加该子分类
            if (channelsGroup.children.length > 0) {
                channelList.appendChild(subCategoryContainer);
            }
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
    avatarContainer.style.display = 'flex'; // 确保初始状态为显示
    
    // 创建头像图片
    const avatarImg = document.createElement('img');
    avatarImg.src = `img/resized/${encodeURIComponent(channel.name)}.jpg`;
    avatarImg.onerror = async function() {
        // 当使用name加载失败时，尝试使用bakname
        if (channel.bakname && channel.bakname.trim() !== "") {
            this.src = `img/resized/${encodeURIComponent(channel.bakname)}.jpg`;
        } else {
            // 如果没有bakname或bakname也加载失败，尝试从频道列表中查找bakname
            try {
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
                        const found = channels.find(ch => 
                            ch.url === channel.url || 
                            ch.name === channel.name
                        );
                        if (found && found.bakname && found.bakname.trim() !== "") {
                            this.src = `img/resized/${encodeURIComponent(found.bakname)}.jpg`;
                            return;
                        }
                    }
                }
            } catch (error) {
                console.error('获取频道列表失败:', error);
            }
            
            // 如果所有尝试都失败，使用默认图片
            this.src = 'img/resized/placeholder.jpg';
        }
    };
    avatarImg.alt = channel.name;
    avatarContainer.appendChild(avatarImg);
    
    // 创建频道信息容器
    const channelInfo = document.createElement('div');
    channelInfo.className = 'channel-info';
    
    // 创建频道名称元素
    const channelName = document.createElement('span');
    channelName.className = 'channel-name';
    channelName.textContent = channel.name;
    // 保存原始文本，用于搜索高亮后恢复
    channelName.setAttribute('data-original-text', channel.name);
    
    // 组装DOM结构
    channelInfo.appendChild(channelName);
    channelButton.appendChild(avatarContainer);
    channelButton.appendChild(channelInfo);
    
    // 从URL中提取频道ID或播放列表ID
    const channelUrl = channel.url;
    
    // 只处理有效的URL
    if (channelUrl && channelUrl.trim() !== '') {
        // 存储原始频道名称，用于点击事件
        channelButton.setAttribute('data-channel-name', channel.name);
        channelButton.setAttribute('data-channel-url', channelUrl);
        
        channelButton.addEventListener('click', function() {
            // 获取原始频道名称和URL
            const channelName = this.getAttribute('data-channel-name');
            const channelUrl = this.getAttribute('data-channel-url');
            
            console.log('選択されたチャンネル:', channelName, channelUrl);
            
            // 保存当前选择的频道信息到本地存储
            localStorage.setItem('lastWatchedChannel', JSON.stringify({
                name: channelName,
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
                statusElement.textContent = 'チャンネルの動画を読み込んでいます: ' + channelName + '...';
                
                // 更新URL，不刷新页面
                updateUrlParameter('channelId', channelId);
                
                // 获取频道的上传播放列表ID，传递频道名称
                getChannelUploads(channelId, channelName);
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
                    console.log('调试信息 - 使用频道名称成功获取到JSON文件:', jsonUrl);
                } else {
                    throw new Error('使用频道名称无法获取JSON文件');
                }
            } catch (error) {
                console.log('调试信息 - 使用频道名称获取失败，尝试使用bakname');
                
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
        // 打印视频的详细信息
        console.log('频道信息:', videoListData.channel_name);
        console.log('更新时间:', videoListData.updated_at);
        console.log('视频数量:', videoListData.videos ? videoListData.videos.length : 0);
        
        // // 如果有视频，打印第一个视频的详细信息作为示例
        // if (videoListData.videos && videoListData.videos.length > 0) {
        //     console.log('第一个视频详情:');
        //     console.log('- ID:', videoListData.videos[0].id);
        //     console.log('- 标题:', videoListData.videos[0].title);
        //     console.log('- 缩略图:', videoListData.videos[0].thumbnail);
        //     console.log('- URL:', videoListData.videos[0].url);
        // }
        
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

function getActivePlayer() {
    if (player && typeof player.loadVideoById === 'function') {
        return player;
    }

    if (typeof YT !== 'undefined' && typeof YT.get === 'function') {
        const existingPlayer = YT.get('player');
        if (existingPlayer && typeof existingPlayer.loadVideoById === 'function') {
            player = existingPlayer;
            return existingPlayer;
        }
    }

    return null;
}

// 播放视频
function playVideo(videoId) {
    if (!videoId) {
        console.error('无效的视频ID');
        return;
    }
    
    // 隐藏加载动画
    const loadingElement = document.querySelector('.player-loading');
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    // 记录当前播放视频信息
    const currentVideo = window.videoPlaylist.find(video => video.videoId === videoId);
    if (currentVideo) {
        console.log('当前播放视频:', {
            id: currentVideo.videoId,
            title: currentVideo.title,
            thumbnail: currentVideo.thumbnail,
            url: currentVideo.url
        });
        
        // 更新页脚中的视频信息 - 添加元素存在性检查
        const logoElement = document.getElementById('currentChannelLogo');
        const titleElement = document.getElementById('currentVideoTitle');
        const titleLinkElement = document.getElementById('currentVideoTitleLink');
        const urlElement = document.getElementById('currentChannelUrl');
        const nameElement = document.getElementById('currentChannelName');
        
        if (logoElement) {
            // 设置缩略图并添加多级回退
            const fallbacks = [
                (src) => src.replace(/maxresdefault/,'sddefault'),
                (src) => src.replace(/sddefault/,'hqdefault'),
                () => 'img/resized/placeholder.jpg'
            ];
            let attempt = 0;
            logoElement.onerror = function() {
                if (attempt < fallbacks.length) {
                    try {
                        const next = fallbacks[attempt++](currentVideo.thumbnail);
                        this.onerror = null;
                        this.src = next;
                        const self = this;
                        setTimeout(() => {
                            self.onerror = function() {
                                if (attempt < fallbacks.length) {
                                    const n = fallbacks[attempt++](currentVideo.thumbnail);
                                    self.onerror = null;
                                    self.src = n;
                                }
                            };
                        });
                    } catch (_) {
                        this.onerror = null;
                        this.src = 'img/resized/placeholder.jpg';
                    }
                }
            };
            logoElement.src = currentVideo.thumbnail;
        }
        if (titleElement) titleElement.textContent = currentVideo.title;
        if (titleLinkElement) titleLinkElement.href = currentVideo.url;
        if (urlElement) urlElement.textContent = currentVideo.url;
        
        // 尝试从localStorage获取当前频道名称
        if (nameElement) {
            const lastWatchedChannel = localStorage.getItem('lastWatchedChannel');
            if (lastWatchedChannel) {
                try {
                    const channelInfo = JSON.parse(lastWatchedChannel);
                    nameElement.textContent = channelInfo.name;
                } catch (e) {
                    console.error('解析频道信息失败:', e);
                }
            }
        }
    }
    
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
    
    // 检查 YT 对象是否已定义
    if (typeof YT === 'undefined' || !YT.Player) {
        console.log('YouTube API 尚未加载完成，等待加载...');
        pendingVideoId = videoId;
        return;
    }

    let activePlayer = getActivePlayer();

    if (activePlayer) {
        if (!playerReady) {
            console.log('播放器尚未就绪，记录待播放视频');
            pendingVideoId = videoId;
            return;
        }

        try {
            activePlayer.loadVideoById({ videoId });
            pendingVideoId = null;
            return;
        } catch (loadError) {
            console.warn('现有播放器加载视频失败，尝试重新初始化', loadError);
            if (typeof activePlayer.destroy === 'function') {
                try {
                    activePlayer.destroy();
                } catch (destroyError) {
                    console.warn('销毁旧播放器时发生问题', destroyError);
                }
            }
            player = null;
            playerReady = false;
        }
    }

    playerReady = false;
    pendingVideoId = null;

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

// 播放器准备就绪
function onPlayerReady(event) {
    player = event.target;
    playerReady = true;

    if (pendingVideoId) {
        event.target.loadVideoById({ videoId: pendingVideoId });
        pendingVideoId = null;
    } else {
        event.target.playVideo();
    }
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
        playerReady = true;
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
        // if (footer) footer.style.display = '';
        console.log('已退出全屏模式');
    } else {
        // 进入全屏模式
        container.style.maxWidth = 'none';
        // 隐藏页脚
        // if (footer) footer.style.display = 'none';
        console.log('已进入全屏模式');
    }
}

// 添加全屏按钮点击事件监听
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenButton = document.getElementById('fullscreenButton');
    if (fullscreenButton) {
        // 检查默认全屏设置
        const defaultFullscreenSetting = localStorage.getItem('defaultFullscreen') === 'true';
        const isFullscreen = localStorage.getItem('isFullscreen') === 'true';
        
        // 如果设置了默认全屏，则进入全屏模式
        if (defaultFullscreenSetting && !isFullscreen) {
            toggleFullscreen();
            localStorage.setItem('isFullscreen', 'true');
        }
        // 如果上次是全屏模式，则恢复全屏状态
        else if (isFullscreen) {
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

// 初始化设置功能
function initSettings() {
    console.log('开始初始化设置功能...');
    
    const settingsButton = document.getElementById('settingsButton');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const footerVisibility = document.getElementById('footerVisibility');
    const defaultFullscreen = document.getElementById('defaultFullscreen');
    const footer = document.querySelector('.footer');
    
    console.log('设置元素检查:', {
        settingsButton: !!settingsButton,
        settingsModal: !!settingsModal,
        closeSettings: !!closeSettings,
        footerVisibility: !!footerVisibility,
        defaultFullscreen: !!defaultFullscreen,
        footer: !!footer
    });
    
    if (!settingsButton || !settingsModal || !closeSettings || !footerVisibility || !defaultFullscreen || !footer) {
        console.error('设置相关元素未找到，将在500ms后重试');
        setTimeout(initSettings, 500);
        return;
    }
    
    // 从本地存储加载设置
    loadSettings();
    
    // 设置按钮点击事件
    settingsButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('设置按钮被点击');
        settingsModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
    
    // 添加额外的测试事件监听
    settingsButton.addEventListener('mousedown', function() {
        console.log('设置按钮鼠标按下');
    });
    
    settingsButton.addEventListener('mouseup', function() {
        console.log('设置按钮鼠标释放');
    });
    
    // 关闭按钮点击事件
    closeSettings.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('关闭按钮被点击');
        settingsModal.style.display = 'none';
        document.body.style.overflow = ''; // 恢复背景滚动
    });
    
    // 点击模态框背景关闭
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            console.log('点击背景关闭设置');
            settingsModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // ESC键关闭设置
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && settingsModal.style.display === 'block') {
            console.log('ESC键关闭设置');
            settingsModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Footer显示/隐藏设置
    footerVisibility.addEventListener('change', function() {
        const isVisible = this.checked;
        footer.style.display = isVisible ? 'block' : 'none';
        
        // 添加或移除body的CSS类来控制播放器样式
        if (isVisible) {
            document.body.classList.remove('footer-hidden');
        } else {
            document.body.classList.add('footer-hidden');
        }
        
        localStorage.setItem('footerVisibility', isVisible.toString());
        console.log('Footer显示状态已更新:', isVisible ? '显示' : '隐藏');
    });
    
    // 默认全屏设置
    defaultFullscreen.addEventListener('change', function() {
        const isDefaultFullscreen = this.checked;
        localStorage.setItem('defaultFullscreen', isDefaultFullscreen.toString());
        console.log('默认全屏状态已更新:', isDefaultFullscreen ? '启用' : '禁用');
    });
    
    console.log('设置功能初始化完成');
    
    // 测试按钮是否可点击
    setTimeout(() => {
        console.log('测试设置按钮点击...');
        settingsButton.click();
        setTimeout(() => {
            settingsModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 1000);
    }, 2000);
}

// 加载设置
function loadSettings() {
    const footer = document.querySelector('.footer');
    const footerVisibility = document.getElementById('footerVisibility');
    const defaultFullscreen = document.getElementById('defaultFullscreen');
    
    // 加载Footer显示设置
    const footerVisible = localStorage.getItem('footerVisibility');
    if (footerVisible !== null) {
        const isVisible = footerVisible === 'true';
        footer.style.display = isVisible ? 'block' : 'none';
        footerVisibility.checked = isVisible;
        
        // 根据设置添加或移除CSS类
        if (isVisible) {
            document.body.classList.remove('footer-hidden');
        } else {
            document.body.classList.add('footer-hidden');
        }
        
        console.log('已恢复Footer显示状态:', isVisible ? '显示' : '隐藏');
    }
    
    // 加载默认全屏设置
    const defaultFullscreenSetting = localStorage.getItem('defaultFullscreen');
    if (defaultFullscreenSetting !== null) {
        const isDefaultFullscreen = defaultFullscreenSetting === 'true';
        defaultFullscreen.checked = isDefaultFullscreen;
        console.log('已恢复默认全屏设置:', isDefaultFullscreen ? '启用' : '禁用');
    }
}

// 修改原有的filterChannels函数，添加高亮功能
function filterChannels() {
    const keyword = document.getElementById('channelSearch').value.toLowerCase();
    searchChannels(keyword);
}

// 添加搜索频道功能
function searchChannels(keyword) {
    if (!keyword) {
        // 如果关键词为空，清除所有高亮
        clearHighlights();
        showAllChannels();
        return;
    }
    
    keyword = keyword.toLowerCase();
    let found = false;
    
    // 获取所有频道项
    const channelItems = document.querySelectorAll('.channel-item');
    
    channelItems.forEach(item => {
        const channelName = item.querySelector('.channel-name');
        const channelNameText = channelName.getAttribute('data-original-text').toLowerCase();
        
        if (channelNameText.includes(keyword)) {
            // 显示匹配的频道
            item.style.display = 'flex';
            
            // 高亮关键词
            const regex = new RegExp(`(${keyword})`, 'gi');
            const highlightedText = channelName.getAttribute('data-original-text').replace(regex, '<span class="highlight">$1</span>');
            channelName.innerHTML = highlightedText;
            
            // 确保父容器可见
            let parent = item.parentElement;
            while (parent && !parent.classList.contains('channel-section')) {
                parent.style.display = 'block';
                parent = parent.parentElement;
            }
            if (parent) parent.style.display = 'block';
            
            found = true;
        } else {
            // 隐藏不匹配的频道
            item.style.display = 'none';
        }
    });
    
    // 隐藏空的子分类和分类
    const subCategories = document.querySelectorAll('.subcategory-container');
    subCategories.forEach(subCategory => {
        const visibleChannels = subCategory.querySelectorAll('.channel-item[style="display: flex;"]');
        if (visibleChannels.length === 0) {
            subCategory.style.display = 'none';
        } else {
            subCategory.style.display = 'block';
        }
    });
    
    const sections = document.querySelectorAll('.channel-section');
    sections.forEach(section => {
        const visibleSubCategories = section.querySelectorAll('.subcategory-container[style="display: block;"]');
        if (visibleSubCategories.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = 'block';
        }
    });
    
    // 更新状态
    if (!found) {
        statusElement.textContent = `"${keyword}" に一致するチャンネルが見つかりませんでした`;
        statusElement.style.display = 'block';
    } else {
        statusElement.textContent = '';
        statusElement.style.display = 'none';
    }
}

// 清除所有高亮
function clearHighlights() {
    const highlightedElements = document.querySelectorAll('.channel-name');
    highlightedElements.forEach(element => {
        // 如果有保存原始文本，则恢复原始文本
        if (element.hasAttribute('data-original-text')) {
            element.textContent = element.getAttribute('data-original-text');
        } else {
            element.innerHTML = element.textContent;
        }
    });
}

// 显示所有频道
function showAllChannels() {
    const channelItems = document.querySelectorAll('.channel-item');
    channelItems.forEach(item => {
        item.style.display = 'flex';
    });
    
    const subCategories = document.querySelectorAll('.subcategory-container');
    subCategories.forEach(subCategory => {
        subCategory.style.display = 'block';
    });
    
    const sections = document.querySelectorAll('.channel-section');
    sections.forEach(section => {
        section.style.display = 'block';
    });
    
    statusElement.textContent = '';
    statusElement.style.display = 'none';
}

// 添加键盘快捷键监听
document.addEventListener('keydown', function(event) {
    // 检查是否按下 Ctrl+F (Windows/Linux) 或 Command+F (Mac)
    if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
        // 阻止默认的浏览器搜索行为
        event.preventDefault();
        
        // 获取搜索框元素
        const searchInput = document.getElementById('channelSearch');
        
        // 如果搜索框存在，则将焦点设置到搜索框上
        if (searchInput) {
            searchInput.focus();
            console.log('搜索快捷键触发，焦点已设置到搜索框');
        }
    }
    
    // 检查是否按下 ESC 键且焦点在搜索框中
    if (event.key === 'Escape' && document.activeElement.id === 'channelSearch') {
        // 清除搜索框内容
        document.getElementById('channelSearch').value = '';
        // 触发 input 事件以更新搜索结果
        document.getElementById('channelSearch').dispatchEvent(new Event('input'));
        // 移除焦点
        document.getElementById('channelSearch').blur();
        console.log('ESC键按下，已清除搜索框内容并移除焦点');
    }
    
    // 检查是否在输入框中
    const activeElement = document.activeElement;
    const isInInput = activeElement.tagName === 'INPUT' || 
                      activeElement.tagName === 'TEXTAREA' || 
                      activeElement.isContentEditable;
    
    // 如果不在输入框中，才响应快捷键
    if (!isInInput) {
        // j 键 - 选择下一个频道
        if (event.key === 'j') {
            navigateChannels('next');
        }
        // k 键 - 选择上一个频道
        else if (event.key === 'k') {
            navigateChannels('prev');
        }
        // r 键 - 随机选择一个频道
        else if (event.key === 'r') {
            selectRandomChannel();
        }
    }
});

// 频道导航函数
function navigateChannels(direction) {
    // 获取所有可点击的频道元素
    const channels = Array.from(document.querySelectorAll('.channel-item:not(.disabled)'));
    if (channels.length === 0) return;
    
    // 找到当前激活的频道
    const activeChannel = document.querySelector('.channel-item.active');
    let nextIndex = 0;
    
    if (activeChannel) {
        // 获取当前激活频道的索引
        const currentIndex = channels.indexOf(activeChannel);
        
        // 根据方向计算下一个索引
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % channels.length;
        } else {
            nextIndex = (currentIndex - 1 + channels.length) % channels.length;
        }
    }
    
    // 模拟点击下一个频道
    channels[nextIndex].click();
    
    // 确保新选中的频道在视图中可见
    channels[nextIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
    
    console.log(`通过快捷键 ${direction === 'next' ? 'j' : 'k'} 选择了频道: ${channels[nextIndex].textContent.trim()}`);
}

// 随机选择频道函数
function selectRandomChannel() {
    // 获取所有可点击的频道元素
    const channels = Array.from(document.querySelectorAll('.channel-item:not(.disabled)'));
    if (channels.length === 0) return;
    
    // 随机选择一个索引
    const randomIndex = Math.floor(Math.random() * channels.length);
    
    // 模拟点击随机选择的频道
    channels[randomIndex].click();
    
    // 确保随机选中的频道在视图中可见
    channels[randomIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
    
    console.log(`通过快捷键 r 随机选择了频道: ${channels[randomIndex].textContent.trim()}`);
}
