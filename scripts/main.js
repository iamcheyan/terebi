// 多语言配置
const i18n = {
    ja: {
        // 设置面板
        settings: '設定',
        theme_settings: 'テーマ設定',
        interface_settings: 'インターフェース設定',
        playback_settings: '再生設定',
        advanced_settings: '詳細設定',
        
        // 主题设置
        dark_mode: 'ダークモード',
        dark_mode_desc: 'ダークテーマのインターフェースを使用',
        
        // 语言设置
        language: '言語',
        language_desc: 'インターフェースの表示言語を選択',
        japanese: '日本語',
        english: 'English',
        chinese: '中文',
        
        // 界面设置
        show_footer: '下部情報バーを表示',
        show_footer_desc: 'ページ下部の動画情報の表示を制御',
        default_fullscreen: 'デフォルトでフルスクリーンモード',
        default_fullscreen_desc: 'ページ読み込み時に自動的にフルスクリーン再生',
        
        // 播放设置
        auto_play: '自動再生',
        auto_play_desc: 'チャンネル選択後に自動的に動画再生を開始',
        auto_next: '自動的に次へ',
        auto_next_desc: '現在の動画終了後に自動的に次を再生',
        loop_playback: 'ループ再生',
        loop_playback_desc: 'プレイリスト終了後に最初から再開',
        compact_mode: 'コンパクトモード',
        compact_mode_desc: 'インターフェースの間隔を減らし、より多くのコンテンツを表示',
        
        // 高级设置
        debug_mode: 'デバッグモード',
        debug_mode_desc: '詳細なデバッグ情報を表示',
        cache_videos: '動画をキャッシュ',
        cache_videos_desc: 'チャンネル動画リストをキャッシュして読み込み速度を向上',
        
        // 频道统计
        channel_statistics: 'チャンネル統計',
        total_channels: '総チャンネル数',
        total_videos: '総番組数',
        by_region: '地域別',
        channel_details: 'チャンネル詳細',
        search_channels: 'チャンネルを検索...',
        chart_total_channels: 'チャンネル'
    },
    en: {
        // 设置面板
        settings: 'Settings',
        theme_settings: 'Theme Settings',
        interface_settings: 'Interface Settings',
        playback_settings: 'Playback Settings',
        advanced_settings: 'Advanced Settings',
        
        // 主题设置
        dark_mode: 'Dark Mode',
        dark_mode_desc: 'Use dark theme interface',
        
        // 语言设置
        language: 'Language',
        language_desc: 'Select interface display language',
        japanese: '日本語',
        english: 'English',
        chinese: '中文',
        
        // 界面设置
        show_footer: 'Show Bottom Info Bar',
        show_footer_desc: 'Control the display of video information at the bottom of the page',
        default_fullscreen: 'Default Fullscreen Mode',
        default_fullscreen_desc: 'Automatically enter fullscreen playback when page loads',
        
        // 播放设置
        auto_play: 'Auto Play',
        auto_play_desc: 'Automatically start video playback after selecting a channel',
        auto_next: 'Auto Next',
        auto_next_desc: 'Automatically play the next video after current one ends',
        loop_playback: 'Loop Playback',
        loop_playback_desc: 'Restart from the beginning after playlist ends',
        compact_mode: 'Compact Mode',
        compact_mode_desc: 'Reduce interface spacing to display more content',
        
        // 高级设置
        debug_mode: 'Debug Mode',
        debug_mode_desc: 'Display detailed debugging information',
        cache_videos: 'Cache Videos',
        cache_videos_desc: 'Cache channel video lists to improve loading speed',
        
        // 频道统计
        channel_statistics: 'Channel Statistics',
        total_channels: 'Total Channels',
        total_videos: 'Total Programs',
        by_region: 'By Region',
        channel_details: 'Channel Details',
        search_channels: 'Search channels...',
        chart_total_channels: 'Channels'
    },
    zh: {
        // 设置面板
        settings: '设置',
        theme_settings: '主题设置',
        interface_settings: '界面设置',
        playback_settings: '播放设置',
        advanced_settings: '高级设置',
        
        // 主题设置
        dark_mode: '深色模式',
        dark_mode_desc: '使用深色主题界面',
        
        // 语言设置
        language: '语言',
        language_desc: '选择界面显示语言',
        japanese: '日本語',
        english: 'English',
        chinese: '中文',
        
        // 界面设置
        show_footer: '显示底部信息栏',
        show_footer_desc: '控制页面底部视频信息的显示',
        default_fullscreen: '默认进入全屏模式',
        default_fullscreen_desc: '页面加载时自动进入全屏播放',
        
        // 播放设置
        auto_play: '自动播放',
        auto_play_desc: '选择频道后自动开始播放视频',
        auto_next: '自动切换下一个',
        auto_next_desc: '当前视频结束后自动播放下一个',
        loop_playback: '循环播放',
        loop_playback_desc: '播放列表结束后重新开始',
        compact_mode: '紧凑模式',
        compact_mode_desc: '减少界面间距，显示更多内容',
        
        // 高级设置
        debug_mode: '调试模式',
        debug_mode_desc: '显示详细的调试信息',
        cache_videos: '缓存视频',
        cache_videos_desc: '缓存频道视频列表以提高加载速度',
        
        // 频道统计
        channel_statistics: '频道统计',
        total_channels: '总频道数',
        total_videos: '总节目数',
        by_region: '按地区分类',
        channel_details: '频道详情',
        search_channels: '搜索频道...',
        chart_total_channels: '频道'
    }
};

// 当前语言
let currentLanguage = 'ja'; // 默认日语

// 更新页面文本
function updatePageText() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (i18n[currentLanguage] && i18n[currentLanguage][key]) {
            element.textContent = i18n[currentLanguage][key];
        }
    });

    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (i18n[currentLanguage] && i18n[currentLanguage][key]) {
            element.placeholder = i18n[currentLanguage][key];
        }
    });
}

// 设置语言
function setLanguage(lang) {
    if (i18n[lang]) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        updatePageText();
        if (channelStatsData) {
            displayChannelStats();
        }
        
        // 更新语言选择器的值
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = lang;
        }
        
        console.log('语言已切换到:', lang);
    }
}

// 初始化语言
function initLanguage() {
    // 从本地存储加载语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && i18n[savedLanguage]) {
        currentLanguage = savedLanguage;
    }
    
    // 设置语言选择器的初始值
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        
        // 添加语言切换事件监听器
        languageSelect.addEventListener('change', function() {
            setLanguage(this.value);
        });
    }
    
    // 更新页面文本
    updatePageText();
    
    console.log('语言初始化完成，当前语言:', currentLanguage);
}

// 全局变量定义
let statusElement, videoContainer, playlistInfoElement, channelSelector, channelCategories, playerContainer;
let player;
let playerReady = false;
let pendingVideoId = null;

const THEME_STORAGE_KEY = 'preferredTheme';
const THEMES = { DARK: 'dark', LIGHT: 'light' };
let darkModeToggle = null;
let hasStoredThemePreference = false;
let systemThemeMediaQuery = null;
let themeInitialized = false;
let activeTheme = THEMES.DARK;

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
    
    // 初始化语言设置
    initLanguage();
    
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
            'onError': onPlayerError,
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

// 播放器错误处理
function onPlayerError(event) {
    console.log('播放器错误，错误代码:', event.data);
    
    // YouTube API错误代码:
    // 2: 无效的参数值
    // 5: HTML5播放器错误
    // 100: 找不到视频 / 视频已被删除
    // 101: 视频所有者不允许在嵌入式播放器中播放（版权限制）
    // 150: 同101（版权限制）
    
    let errorMessage = '';
    switch (event.data) {
        case 2:
            errorMessage = '動画パラメータが無効です';
            break;
        case 5:
            errorMessage = 'HTML5プレーヤーエラー';
            break;
        case 100:
            errorMessage = '動画が存在しないか、削除されました';
            break;
        case 101:
        case 150:
            errorMessage = '動画を再生できません（著作権者の要望によりブロックされています）';
            break;
        default:
            errorMessage = '不明なエラー';
    }
    
    console.log('错误信息:', errorMessage, '- 自动切换到下一个视频');
    statusElement.textContent = `${errorMessage} - 次の動画に切り替えています...`;
    
    // 自动切换到下一个视频
    if (window.videoPlaylist && window.videoPlaylist.length > 0) {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * window.videoPlaylist.length);
            const nextVideo = window.videoPlaylist[randomIndex];
            console.log('自动切换到下一个视频:', nextVideo.title);
            statusElement.textContent = '再生中: ' + nextVideo.url;
            playVideo(nextVideo.videoId);
        }, 2000); // 等待2秒后切换，让用户看到错误信息
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
function updateFullscreenButtonVisual(button, isActive) {
    if (!button) {
        return;
    }

    const iconElement = button.querySelector('img');
    const iconFull = button.dataset.iconFull;
    const iconCompact = button.dataset.iconCompact || iconFull;
    const enterLabel = button.dataset.labelEnter || '进入全屏';
    const exitLabel = button.dataset.labelExit || '退出全屏';

    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    button.setAttribute('aria-label', isActive ? exitLabel : enterLabel);
    button.title = isActive ? exitLabel : enterLabel;

    if (iconElement && iconFull) {
        const targetSrc = isActive ? iconCompact : iconFull;
        if (targetSrc && iconElement.getAttribute('src') !== targetSrc) {
            iconElement.setAttribute('src', targetSrc);
        }
    }
}

function setFullscreenMode(isActive, options = {}) {
    const container = document.querySelector('.container');
    if (!container) {
        console.warn('未找到容器元素，无法切换全屏布局');
        return;
    }

    const { button = document.getElementById('fullscreenButton'), persist = true } = options;

    container.classList.toggle('is-fullscreen', isActive);
    container.style.maxWidth = isActive ? 'none' : '';
    document.body.classList.toggle('fullscreen-active', isActive);

    updateFullscreenButtonVisual(button, isActive);

    if (persist) {
        try {
            localStorage.setItem('isFullscreen', isActive.toString());
        } catch (error) {
            console.warn('无法保存全屏偏好设置:', error);
        }
    }

    console.log(isActive ? '已进入全屏模式' : '已退出全屏模式');
}

function toggleFullscreen(button, options = {}) {
    const shouldActivate = !document.body.classList.contains('fullscreen-active');
    setFullscreenMode(shouldActivate, { button: button || document.getElementById('fullscreenButton'), ...options });
}

// 添加全屏按钮点击事件监听
document.addEventListener('DOMContentLoaded', function() {
    const fullscreenButton = document.getElementById('fullscreenButton');
    if (fullscreenButton) {
        const defaultFullscreenSetting = localStorage.getItem('defaultFullscreen') === 'true';
        let storedPreference = null;

        try {
            storedPreference = localStorage.getItem('isFullscreen');
        } catch (error) {
            console.warn('无法读取全屏偏好设置:', error);
        }

        let initialState;
        if (storedPreference === 'true') {
            initialState = true;
        } else if (storedPreference === 'false') {
            initialState = false;
        } else {
            initialState = defaultFullscreenSetting;
        }

        setFullscreenMode(initialState, {
            button: fullscreenButton,
            persist: storedPreference !== null || defaultFullscreenSetting
        });

        fullscreenButton.addEventListener('click', function() {
            toggleFullscreen(fullscreenButton, { persist: true });
        });

        console.log('全屏按钮事件监听已添加，并根据偏好初始化状态');
    } else {
        console.warn('未找到全屏按钮元素');
    }
});

// 添加调试信息
console.log('DOMContentLoaded イベントリスナーが追加されました');

function prefersDarkMode() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return true;
    }
    if (!systemThemeMediaQuery) {
        systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    }
    return systemThemeMediaQuery.matches;
}

function setTheme(theme, persist = false) {
    const body = document.body;
    if (!body) {
        return;
    }

    const resolvedTheme = theme === THEMES.LIGHT ? THEMES.LIGHT : THEMES.DARK;
    const isDark = resolvedTheme === THEMES.DARK;
    activeTheme = resolvedTheme;

    body.classList.remove('theme-dark', 'theme-light');
    body.classList.add(isDark ? 'theme-dark' : 'theme-light');

    const root = document.documentElement;
    if (root) {
        root.dataset.theme = resolvedTheme;
        root.style.colorScheme = isDark ? 'dark' : 'light';
        root.classList.remove('theme-dark', 'theme-light');
        root.classList.add(isDark ? 'theme-dark' : 'theme-light');
    }

    if (darkModeToggle) {
        darkModeToggle.checked = isDark;
    }

    if (persist) {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, resolvedTheme);
            hasStoredThemePreference = true;
        } catch (error) {
            console.warn('无法保存主题设置到本地存储:', error);
        }
    }

    updateRegionChartTheme();
}

function bindSystemThemeListener() {
    if (typeof window === 'undefined' || !window.matchMedia) {
        return;
    }

    if (!systemThemeMediaQuery) {
        systemThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    }

    const handler = (event) => {
        if (!hasStoredThemePreference) {
            setTheme(event.matches ? THEMES.DARK : THEMES.LIGHT);
        }
    };

    try {
        systemThemeMediaQuery.addEventListener('change', handler);
    } catch (error) {
        if (typeof systemThemeMediaQuery.addListener === 'function') {
            systemThemeMediaQuery.addListener(handler);
        }
    }
}

function initializeTheme() {
    if (themeInitialized) {
        setTheme(activeTheme);
        return;
    }

    let storedTheme = null;
    try {
        storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    } catch (error) {
        console.warn('无法从本地存储读取主题设置:', error);
    }

    if (storedTheme === THEMES.DARK || storedTheme === THEMES.LIGHT) {
        hasStoredThemePreference = true;
        setTheme(storedTheme);
    } else {
        hasStoredThemePreference = false;
        setTheme(prefersDarkMode() ? THEMES.DARK : THEMES.LIGHT);
    }

    bindSystemThemeListener();
    themeInitialized = true;
}

// 初始化设置功能
function initSettings() {
    console.log('开始初始化设置功能...');
    
    const settingsButton = document.getElementById('settingsButton');
    const footerVisibility = document.getElementById('footerVisibility');
    const defaultFullscreen = document.getElementById('defaultFullscreen');
    const languageSelect = document.getElementById('languageSelect');
    darkModeToggle = document.getElementById('darkMode');
    const footer = document.querySelector('.footer');
    
    console.log('设置元素检查:', {
        settingsButton: !!settingsButton,
        footerVisibility: !!footerVisibility,
        defaultFullscreen: !!defaultFullscreen,
        languageSelect: !!languageSelect,
        darkModeToggle: !!darkModeToggle,
        footer: !!footer
    });
    
    if (!settingsButton || !footerVisibility || !defaultFullscreen || !languageSelect || !footer || !darkModeToggle) {
        console.error('设置相关元素未找到，将在500ms后重试');
        setTimeout(initSettings, 500);
        return;
    }
    
    // 确保设置面板初始处于关闭状态
    const initialPanel = document.getElementById('settingsPanel');
    const initialOverlay = document.getElementById('settingsOverlay');
    if (initialPanel && initialOverlay) {
        initialPanel.classList.remove('show');
        initialOverlay.classList.remove('show');
        initialPanel.setAttribute('aria-hidden', 'true');
        initialOverlay.setAttribute('aria-hidden', 'true');
    }

    // 从本地存储加载设置
    loadSettings();

    if (darkModeToggle && !darkModeToggle.dataset.themeListenerBound) {
        darkModeToggle.addEventListener('change', function() {
            const theme = this.checked ? THEMES.DARK : THEMES.LIGHT;
            setTheme(theme, true);
        });
        darkModeToggle.dataset.themeListenerBound = 'true';
    }
    
    // 设置按钮点击事件 - 显示/隐藏设置面板
    settingsButton.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('设置按钮被点击');
        
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        
        console.log('面板元素检查:', {
            panel: !!panel,
            overlay: !!overlay,
            panelClasses: panel ? panel.className : 'N/A',
            overlayClasses: overlay ? overlay.className : 'N/A'
        });
        
        if (panel && overlay) {
            const isVisible = panel.classList.contains('show');
            console.log('面板当前状态:', isVisible ? '显示' : '隐藏');
            if (isVisible) {
                closeSettingsPanel();
            } else {
                openSettingsPanel();
            }
        } else {
            console.error('无法找到设置面板或遮罩元素');
        }
    });
    
    // 关闭设置面板
    function closeSettingsPanel() {
        console.log('开始关闭设置面板');
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        const playerContainer = document.getElementById('playerContainer');
        
        console.log('面板元素检查:', {
            panel: !!panel,
            overlay: !!overlay,
            playerContainer: !!playerContainer
        });
        
        if (panel && overlay) {
            panel.classList.remove('show');
            overlay.classList.remove('show');
            panel.setAttribute('aria-hidden', 'true');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            document.body.removeAttribute('data-modal-open');
            
            // 移除播放器容器的设置面板打开状态class
            if (playerContainer) {
                playerContainer.classList.remove('settings-open');
            }
            console.log('设置面板已关闭');
        } else {
            console.error('无法找到面板或遮罩元素');
        }
    }
    
    // 打开设置面板
    function openSettingsPanel() {
        console.log('开始打开设置面板');
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        const playerContainer = document.getElementById('playerContainer');
        
        console.log('打开面板元素检查:', {
            panel: !!panel,
            overlay: !!overlay,
            playerContainer: !!playerContainer
        });
        
        if (panel && overlay) {
            panel.classList.add('show');
            overlay.classList.add('show');
            panel.setAttribute('aria-hidden', 'false');
            overlay.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            document.body.setAttribute('data-modal-open', 'true');
            
            console.log('设置面板已打开，当前类名:', panel.className);
            
            // 添加播放器容器的设置面板打开状态class
            if (playerContainer) {
                playerContainer.classList.add('settings-open');
            }
        } else {
            console.error('无法找到设置面板或遮罩元素');
        }
    }
    
    // 关闭按钮事件
    const closeBtn = document.getElementById('closeSettings');
    if (closeBtn) {
        console.log('找到关闭按钮，添加事件监听器');
        closeBtn.addEventListener('click', closeSettingsPanel);
    } else {
        console.error('未找到关闭按钮元素');
    }
    
    // 点击遮罩关闭设置面板
    const overlay = document.getElementById('settingsOverlay');
    if (overlay) {
        overlay.addEventListener('click', closeSettingsPanel);
    }
    
    // ESC键关闭设置面板
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const panel = document.getElementById('settingsPanel');
            if (panel && panel.classList.contains('show')) {
                closeSettingsPanel();
            }
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
    
    // 语言切换设置
    languageSelect.addEventListener('change', function() {
        const selectedLanguage = this.value;
        setLanguage(selectedLanguage);
        console.log('语言已切换到:', selectedLanguage);
    });
    
    console.log('设置功能初始化完成');
}

// 加载设置
function loadSettings() {
    initializeTheme();

    const footer = document.querySelector('.footer');
    const footerVisibility = document.getElementById('footerVisibility');
    const defaultFullscreen = document.getElementById('defaultFullscreen');
    const languageSelect = document.getElementById('languageSelect');
    
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
    } else {
        // 如果没有保存的设置，默认隐藏底部信息栏
        footer.style.display = 'none';
        footerVisibility.checked = false;
        document.body.classList.add('footer-hidden');
        console.log('使用默认设置: Footer隐藏');
    }
    
    // 加载默认全屏设置
    const defaultFullscreenSetting = localStorage.getItem('defaultFullscreen');
    if (defaultFullscreenSetting !== null) {
        const isDefaultFullscreen = defaultFullscreenSetting === 'true';
        defaultFullscreen.checked = isDefaultFullscreen;
        console.log('已恢复默认全屏设置:', isDefaultFullscreen ? '启用' : '禁用');
    }
    
    // 加载语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && languageSelect) {
        languageSelect.value = savedLanguage;
        console.log('已恢复语言设置:', savedLanguage);
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

// 频道统计弹出框功能
let channelStatsData = null;
let regionChartInstance = null;
const REGION_CHART_COLOR_SETS = {
    dark: ['#4F8AF7', '#7C6BFF', '#4ADDB5', '#F3C567', '#FF8A7A', '#6BCBFF', '#B68BFF', '#5ED39D', '#FF9ED1', '#FFA95E'],
    light: ['#3454D1', '#8A5CFF', '#2BB2A2', '#F39C12', '#E76F51', '#4FA3F7', '#9D6BDE', '#5BC489', '#F37FB2', '#F2B266']
};

// 初始化频道统计功能
function initChannelStats() {
    const statsButton = document.getElementById('channelStatsButton');
    const statsPanel = document.getElementById('channelStatsPanel');
    const statsOverlay = document.getElementById('channelStatsOverlay');
    const closeStatsBtn = document.getElementById('closeChannelStats');
    
    if (statsButton) {
        statsButton.addEventListener('click', function() {
            loadChannelStats();
        });
    }
    
    if (closeStatsBtn) {
        closeStatsBtn.addEventListener('click', function() {
            closeChannelStatsPanel();
        });
    }
    
    if (statsOverlay) {
        statsOverlay.addEventListener('click', function() {
            closeChannelStatsPanel();
        });
    }
    
    // ESC键关闭面板
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const panel = document.getElementById('channelStatsPanel');
            if (panel && panel.classList.contains('show')) {
                closeChannelStatsPanel();
            }
        }
    });
}

// 加载频道统计数据
async function loadChannelStats() {
    try {
        console.log('开始加载频道统计数据...');
        
        // 显示加载状态
        openChannelStatsPanel();
        updateStatsContent('正在加载频道数据...');
        
        // 获取频道列表数据
        const response = await fetch('japan_tv_youtube_channels.json');
        if (!response.ok) {
            throw new Error('无法获取频道列表: ' + response.status);
        }
        
        const channelData = await response.json();
        console.log('频道列表数据:', channelData);
        
        // 收集所有频道信息
        const allChannels = [];
        Object.entries(channelData).forEach(([groupName, groupContent]) => {
            Object.entries(groupContent).forEach(([categoryName, channels]) => {
                channels.forEach(channel => {
                    if (channel.name && channel.url && channel.url.trim() !== '') {
                        allChannels.push({
                            name: channel.name,
                            url: channel.url,
                            group: groupName,
                            category: categoryName,
                            bakname: channel.bakname
                        });
                    }
                });
            });
        });
        
        console.log(`找到 ${allChannels.length} 个频道`);
        
        // 为每个频道尝试加载视频数据
        const channelPromises = allChannels.map(async (channel) => {
            try {
                // 尝试加载频道的视频数据
                const primaryName = channel.name;
                const channelResponse = await fetch(`data/${encodeURIComponent(primaryName)}.json`);
                if (channelResponse.ok) {
                    const channelData = await channelResponse.json();
                    return {
                        channelName: channel.name,
                        videoCount: channelData.videos ? channelData.videos.length : 0,
                        updatedAt: channelData.updated_at,
                        region: channel.group,
                        category: channel.category
                    };
                } else {
                    const fallbackName = channel.bakname;
                    if (fallbackName) {
                        const bakResponse = await fetch(`data/${encodeURIComponent(fallbackName)}.json`);
                        if (bakResponse.ok) {
                            const channelData = await bakResponse.json();
                            return {
                                channelName: channel.name,
                                videoCount: channelData.videos ? channelData.videos.length : 0,
                                updatedAt: channelData.updated_at,
                                region: channel.group,
                                category: channel.category
                            };
                        }
                    }
                    
                    return {
                        channelName: channel.name,
                        videoCount: 0,
                        updatedAt: null,
                        region: channel.group,
                        category: channel.category
                    };
                }
            } catch (error) {
                console.error(`加载频道 ${channel.name} 数据失败:`, error);
                return {
                    channelName: channel.name,
                    videoCount: 0,
                    updatedAt: null,
                    region: channel.group,
                    category: channel.category
                };
            }
        });
        
        const channels = await Promise.all(channelPromises);
        
        // 按地区分类频道
        const regionStats = categorizeChannelsByRegion(channels);
        
        channelStatsData = {
            channels: channels,
            regions: regionStats,
            totalChannels: channels.length,
            totalVideos: channels.reduce((sum, channel) => sum + channel.videoCount, 0)
        };
        
        // 更新显示
        displayChannelStats();
        
    } catch (error) {
        console.error('加载频道统计数据失败:', error);
        updateStatsContent('加载数据失败，请稍后重试。');
    }
}

// 按地区分类频道
function categorizeChannelsByRegion(channels) {
    const regions = {};
    
    channels.forEach(channel => {
        const region = channel.category || channel.region || getChannelRegion(channel.channelName);
        
        if (!regions[region]) {
            regions[region] = {
                name: region,
                channels: [],
                totalVideos: 0
            };
        }
        
        regions[region].channels.push(channel);
        regions[region].totalVideos += channel.videoCount;
    });
    
    return regions;
}

// 根据频道名称判断地区
function getChannelRegion(channelName) {
    // 北海道
    if (channelName.includes('北海道') || channelName.includes('札幌') || channelName.includes('HBC') || channelName.includes('STV')) {
        return '北海道';
    }
    
    // 东北地区
    if (channelName.includes('青森') || channelName.includes('岩手') || channelName.includes('宮城') || 
        channelName.includes('秋田') || channelName.includes('山形') || channelName.includes('福島') ||
        channelName.includes('仙台') || channelName.includes('ABA') || channelName.includes('IBC') ||
        channelName.includes('TBC') || channelName.includes('ABS') || channelName.includes('YBC') ||
        channelName.includes('FCT') || channelName.includes('KFB')) {
        return '東北';
    }
    
    // 关东地区
    if (channelName.includes('東京') || channelName.includes('神奈川') || channelName.includes('埼玉') ||
        channelName.includes('千葉') || channelName.includes('茨城') || channelName.includes('栃木') ||
        channelName.includes('群馬') || channelName.includes('フジテレビ') || channelName.includes('日本テレビ') ||
        channelName.includes('TBS') || channelName.includes('テレビ朝日') || channelName.includes('テレビ東京') ||
        channelName.includes('NHK') || channelName.includes('tvk') || channelName.includes('MX')) {
        return '関東';
    }
    
    // 中部地区
    if (channelName.includes('新潟') || channelName.includes('富山') || channelName.includes('石川') ||
        channelName.includes('福井') || channelName.includes('山梨') || channelName.includes('長野') ||
        channelName.includes('岐阜') || channelName.includes('静岡') || channelName.includes('愛知') ||
        channelName.includes('名古屋') || channelName.includes('中京') || channelName.includes('CBC') ||
        channelName.includes('東海テレビ') || channelName.includes('メ～テレ')) {
        return '中部';
    }
    
    // 关西地区
    if (channelName.includes('三重') || channelName.includes('滋賀') || channelName.includes('京都') ||
        channelName.includes('大阪') || channelName.includes('兵庫') || channelName.includes('奈良') ||
        channelName.includes('和歌山') || channelName.includes('関西') || channelName.includes('MBS') ||
        channelName.includes('ABC') || channelName.includes('読売') || channelName.includes('KTV')) {
        return '関西';
    }
    
    // 中国地区
    if (channelName.includes('鳥取') || channelName.includes('島根') || channelName.includes('岡山') ||
        channelName.includes('広島') || channelName.includes('山口') || channelName.includes('RSK') ||
        channelName.includes('RCC') || channelName.includes('TSS')) {
        return '中国';
    }
    
    // 四国地区
    if (channelName.includes('徳島') || channelName.includes('香川') || channelName.includes('愛媛') ||
        channelName.includes('高知') || channelName.includes('JRT') || channelName.includes('RNC') ||
        channelName.includes('EBC') || channelName.includes('RKC')) {
        return '四国';
    }
    
    // 九州・冲绳地区
    if (channelName.includes('福岡') || channelName.includes('佐賀') || channelName.includes('長崎') ||
        channelName.includes('熊本') || channelName.includes('大分') || channelName.includes('宮崎') ||
        channelName.includes('鹿児島') || channelName.includes('沖縄') || channelName.includes('RKB') ||
        channelName.includes('KBC') || channelName.includes('TNC') || channelName.includes('TVQ') ||
        channelName.includes('OTV')) {
        return '九州・沖縄';
    }
    
    // 默认分类
    return 'その他';
}

// 显示频道统计数据
function displayChannelStats() {
    if (!channelStatsData) return;
    
    const { channels, regions, totalChannels, totalVideos } = channelStatsData;
    
    // 更新总体统计
    const totalChannelsElement = document.getElementById('totalChannels');
    const totalVideosElement = document.getElementById('totalVideos');
    
    if (totalChannelsElement) totalChannelsElement.textContent = totalChannels;
    if (totalVideosElement) totalVideosElement.textContent = totalVideos;
    
    // 更新饼图中心标签
    const chartTotalChannelsElement = document.getElementById('chartTotalChannels');
    if (chartTotalChannelsElement) {
        chartTotalChannelsElement.textContent = totalChannels;
    }
    
    const regionEntries = Object.values(regions).sort((a, b) => b.channels.length - a.channels.length);

    // 显示地区分布饼图
    renderRegionPieChart(regionEntries);

    // 显示地区统计
    displayRegionalStats(regionEntries);
}

// 显示地区统计
function formatRegionChannelCount(count) {
    switch (currentLanguage) {
        case 'en':
            return count + ' channels';
        case 'zh':
            return count + '频道';
        default:
            return count + 'チャンネル';
    }
}

function formatRegionProgramCount(count) {
    switch (currentLanguage) {
        case 'en':
            return count + ' videos';
        case 'zh':
            return count + '节目';
        default:
            return count + '番組';
    }
}

function getSearchPlaceholderText() {
    switch (currentLanguage) {
        case 'en':
            return 'Search channels...';
        case 'ja':
            return 'チャンネルを検索...';
        default:
            return '搜索频道...';
    }
}

function displayRegionalStats(regions) {
    const container = document.getElementById('regionStats');
    if (!container) return;
    
    container.innerHTML = '';
    
    const regionList = Array.isArray(regions)
        ? regions
        : Object.values(regions).sort((a, b) => b.channels.length - a.channels.length);
    
    regionList.forEach(region => {
        const regionElement = document.createElement('div');
        regionElement.className = 'region-stat';
        
        const icon = getRegionIcon(region.name);
        
        regionElement.innerHTML = `
            <div class="region-header">
                <span class="region-icon">${icon}</span>
                <div class="region-name">${region.name}</div>
            </div>
            <div class="region-counts">
                <span class="channel-count">${formatRegionChannelCount(region.channels.length)}</span>
                <span class="video-count">${formatRegionProgramCount(region.totalVideos)}</span>
            </div>
        `;
        
        regionElement.addEventListener('click', () => {
            // 地区点击功能已移除
        });
        
        container.appendChild(regionElement);
    });
}

function getActiveThemeVariant() {
    const body = document.body;
    if (!body) {
        return 'dark';
    }
    return body.classList.contains('theme-light') ? 'light' : 'dark';
}

function getCssVariableValue(variableName, fallback) {
    const styles = window.getComputedStyle(document.documentElement);
    const value = styles.getPropertyValue(variableName);
    return value ? value.trim() : fallback;
}

function getRegionChartPalette() {
    const theme = getActiveThemeVariant();
    const palette = REGION_CHART_COLOR_SETS[theme] || REGION_CHART_COLOR_SETS.dark;
    return palette.slice();
}

function getRegionChartUnitLabel() {
    switch (currentLanguage) {
        case 'en':
            return ' channels';
        case 'zh':
            return '频道';
        default:
            return 'チャンネル';
    }
}

function renderRegionPieChart(regions) {
    const canvas = document.getElementById('regionPieChart');

    if (!canvas || typeof Chart === 'undefined') {
        return;
    }

    const hasData = Array.isArray(regions) && regions.length > 0;
    if (regionChartInstance) {
        regionChartInstance.destroy();
        regionChartInstance = null;
    }

    if (!hasData) {
        const context = canvas.getContext('2d');
        if (context) {
            context.clearRect(0, 0, canvas.width || canvas.clientWidth, canvas.height || canvas.clientHeight);
        }
        return;
    }

    const palette = getRegionChartPalette();
    const labels = regions.map(region => region.name);
    const data = regions.map(region => region.channels.length);
    const backgroundColors = palette.slice(0, data.length);
    const textColor = getCssVariableValue('--color-text-primary', '#f0f0f0');
    const borderColor = getCssVariableValue('--color-panel-border', 'rgba(255, 255, 255, 0.12)');
    const tooltipBackground = getCssVariableValue('--color-surface-primary', '#111827');
    const totalChannels = data.reduce((sum, value) => sum + value, 0);
    const context = canvas.getContext('2d');

    if (!context) {
        return;
    }

    regionChartInstance = new Chart(context, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderColor: borderColor,
                borderWidth: 1.5,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '52%',
            layout: {
                padding: 8
            },
            plugins: {
                legend: {
                    display: false  // 隐藏图例
                },
                tooltip: {
                    backgroundColor: tooltipBackground,
                    titleColor: textColor,
                    bodyColor: textColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed;
                            const percentage = totalChannels ? ((value / totalChannels) * 100).toFixed(1) : 0;
                            const unit = getRegionChartUnitLabel();
                            const name = labels[context.dataIndex] || '';
                            return name + ': ' + value + unit + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
    
    // 生成图例
    renderChartLegend(regions, backgroundColors);
}

// 获取地区图标
function getRegionIcon(regionName) {
    const iconMap = {
        '北海道': '🗻',
        '東北': '🌾',
        '関東': '🗼',
        '中部': '🏔️',
        '関西': '🏯',
        '中国': '⛰️',
        '四国': '🌊',
        '九州・沖縄': '🌺',
        '日本テレビ系': '📺',
        'テレビ朝日系': '📡',
        'TBS系': '🎬',
        'テレビ東京系': '🎥',
        'フジテレビ系': '📹',
        '日本語学習': '📚',
        'その他チャンネル': '✨'
    };
    return iconMap[regionName] || '📍';
}

// 渲染图例
function renderChartLegend(regions, colors) {
    const legendContainer = document.getElementById('chartLegend');
    if (!legendContainer) return;
    
    legendContainer.innerHTML = '';
    
    regions.forEach((region, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const icon = document.createElement('span');
        icon.className = 'legend-icon';
        icon.textContent = getRegionIcon(region.name);
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[index];
        
        const label = document.createElement('span');
        label.className = 'legend-label';
        label.textContent = region.name;
        
        const value = document.createElement('span');
        value.className = 'legend-value';
        value.textContent = region.channels.length;
        
        legendItem.appendChild(icon);
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendItem.appendChild(value);
        
        legendContainer.appendChild(legendItem);
    });
}

function updateRegionChartTheme() {
    if (!regionChartInstance) {
        return;
    }

    const palette = getRegionChartPalette();
    const dataset = regionChartInstance.data && regionChartInstance.data.datasets
        ? regionChartInstance.data.datasets[0]
        : null;

    if (dataset) {
        dataset.backgroundColor = palette.slice(0, dataset.data.length);
        dataset.borderColor = getCssVariableValue('--color-panel-border', 'rgba(255, 255, 255, 0.12)');
    }

    const textColor = getCssVariableValue('--color-text-primary', '#f0f0f0');
    const tooltipBackground = getCssVariableValue('--color-surface-primary', '#111827');
    const borderColor = getCssVariableValue('--color-panel-border', 'rgba(255, 255, 255, 0.12)');

    if (regionChartInstance.options && regionChartInstance.options.plugins) {
        if (regionChartInstance.options.plugins.legend && regionChartInstance.options.plugins.legend.labels) {
            regionChartInstance.options.plugins.legend.labels.color = textColor;
        }
        if (regionChartInstance.options.plugins.tooltip) {
            const tooltip = regionChartInstance.options.plugins.tooltip;
            tooltip.backgroundColor = tooltipBackground;
            tooltip.titleColor = textColor;
            tooltip.bodyColor = textColor;
            tooltip.borderColor = borderColor;
        }
    }

    regionChartInstance.update();
}




// 打开频道统计面板
function openChannelStatsPanel() {
    const panel = document.getElementById('channelStatsPanel');
    const overlay = document.getElementById('channelStatsOverlay');
    
    if (panel && overlay) {
        panel.classList.add('show');
        overlay.classList.add('show');
        panel.setAttribute('aria-hidden', 'false');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        document.body.setAttribute('data-modal-open', 'true');
    }
}

// 关闭频道统计面板
function closeChannelStatsPanel() {
    const panel = document.getElementById('channelStatsPanel');
    const overlay = document.getElementById('channelStatsOverlay');
    
    if (panel && overlay) {
        panel.classList.remove('show');
        overlay.classList.remove('show');
        panel.setAttribute('aria-hidden', 'true');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.body.removeAttribute('data-modal-open');
    }
}


// 更新统计内容（用于加载状态）
function updateStatsContent(message) {
    const container = document.getElementById('channelDetailsList');
    if (container) {
        container.innerHTML = `<div class="loading-message">${message}</div>`;
    }
}

// 在DOMContentLoaded事件中初始化频道统计功能
document.addEventListener('DOMContentLoaded', function() {
    initChannelStats();
});
