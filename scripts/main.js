// 简单的通知功能
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        max-width: 320px;
    `;
    
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Make notification function globally available
window.showNotification = showNotification;

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
        clear_cache: 'キャッシュをクリア',
        clear_cache_desc: 'すべてのローカルキャッシュデータをクリア（お気に入り、設定など）',
        
        // 频道统计
        channel_statistics: 'チャンネル統計',
        total_channels: '総チャンネル数',
        total_videos: '総番組数',
        by_region: '地域別',
        channel_details: 'チャンネル詳細',
        search_channels: 'チャンネルを検索...',
        chart_total_channels: 'チャンネル',
        
        // 观看历史
        view_history: '視聴履歴',
        clear_history_btn: '履歴をクリア',
        history_count_label: '総記録数：',
        confirm_clear_history: '視聴履歴をクリアしますか？',
        history_cleared: '履歴がクリアされました',
        no_history: '視聴履歴がありません',
        history_all: 'すべて',
        history_favorites: 'お気に入り',
        favorite_video: 'お気に入りに追加',
        unfavorite_video: 'お気に入りから削除',
        video_favorited: 'お気に入りに追加しました',
        video_unfavorited: 'お気に入りから削除しました',
        
        // 用户账户
        login: 'ログイン',
        logout: 'ログアウト',
        sync_data: 'データを同期',
        switch_account: 'アカウントを切り替え',
        login_success: 'ログインしました',
        login_error: 'ログインエラー',
        logout_success: 'ログアウトしました',
        logout_error: 'ログアウトエラー',
        sync_success: 'データを同期しました',
        sync_error: '同期エラー'
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
        clear_cache: 'Clear Cache',
        clear_cache_desc: 'Clear all local cache data (favorites, settings, etc.)',
        
        // 频道统计
        channel_statistics: 'Channel Statistics',
        total_channels: 'Total Channels',
        total_videos: 'Total Programs',
        by_region: 'By Region',
        channel_details: 'Channel Details',
        search_channels: 'Search channels...',
        chart_total_channels: 'Channels',
        
        // 观看历史
        view_history: 'View History',
        clear_history_btn: 'Clear History',
        history_count_label: 'Total Records: ',
        confirm_clear_history: 'Clear viewing history?',
        history_cleared: 'History cleared',
        no_history: 'No viewing history',
        history_all: 'All',
        history_favorites: 'Favorites',
        favorite_video: 'Add to favorites',
        unfavorite_video: 'Remove from favorites',
        video_favorited: 'Added to favorites',
        video_unfavorited: 'Removed from favorites',
        
        // 用户账户
        login: 'Login',
        logout: 'Logout',
        sync_data: 'Sync Data',
        switch_account: 'Switch Account',
        login_success: 'Logged in successfully',
        login_error: 'Login error',
        logout_success: 'Logged out successfully',
        logout_error: 'Logout error',
        sync_success: 'Data synced successfully',
        sync_error: 'Sync error'
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
        clear_cache: '清除缓存',
        clear_cache_desc: '清除所有本地缓存数据（收藏、设置等）',
        
        // 频道统计
        channel_statistics: '频道统计',
        total_channels: '总频道数',
        total_videos: '总节目数',
        by_region: '按地区分类',
        channel_details: '频道详情',
        search_channels: '搜索频道...',
        chart_total_channels: '频道',
        
        // 观看历史
        view_history: '观看历史',
        clear_history_btn: '清空历史',
        history_count_label: '总记录数：',
        confirm_clear_history: '是否清空观看历史？',
        history_cleared: '历史记录已清空',
        no_history: '暂无观看历史',
        history_all: '全部',
        history_favorites: '收藏',
        favorite_video: '收藏节目',
        unfavorite_video: '取消收藏',
        video_favorited: '已添加到收藏',
        video_unfavorited: '已取消收藏',
        
        // 用户账户
        login: '登录',
        logout: '登出',
        sync_data: '同步数据',
        switch_account: '切换账户',
        login_success: '登录成功',
        login_error: '登录错误',
        logout_success: '登出成功',
        logout_error: '登出错误',
        sync_success: '数据同步成功',
        sync_error: '同步错误'
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
    // 固定为日语
    const langToUse = 'ja';
    if (i18n[langToUse]) {
        currentLanguage = langToUse;
        localStorage.setItem('language', langToUse);
        updatePageText();
        if (channelStatsData) {
            displayChannelStats();
        }
        
        console.log('语言已固定为: ja');
        
        // 自动同步设置到云端
        autoSyncData();
    }
}

// 初始化语言
function initLanguage() {
    // 固定语言为日语
    currentLanguage = 'ja';
    localStorage.setItem('language', 'ja');
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
    
    // 初始化收藏数量
    updateFavoritesCount();
    
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
        statusElement.textContent = 'チャンネル一覧を取得しています...';
        
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
            console.log('URLパラメータのチャンネルIDを取得:', channelIdParam);
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
                console.log('一致するチャンネルを発見:', foundChannel.name);
                statusElement.textContent = 'チャンネルを読み込んでいます: ' + foundChannel.name;
                
                setTimeout(() => {
                    const channelButtons = document.querySelectorAll('.channel-item');
                    channelButtons.forEach(btn => {
                        if (btn.querySelector('.channel-name').textContent === foundChannel.name) {
                            btn.classList.add('active');
                            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                            
                            setTimeout(() => {
                                btn.click();
                                console.log('URL指定チャンネルのクリックを自動実行:', foundChannel.name);
                            }, 30);
                        }
                    });
                }, 100);
                
                getChannelUploads(channelIdParam, foundChannel.name);
            } else {
                // 如果找不到匹配的频道名称，直接使用参数中的ID
                console.log('一致するチャンネル名が見つからないためIDを直接使用:', channelIdParam);
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
                                    console.log('前回視聴チャンネルのクリックを自動実行:', channelInfo.name);
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
        // 当使用name加载失败时，优先尝试bakname
        if (channel.bakname && channel.bakname.trim() !== "") {
            this.src = `img/resized/${encodeURIComponent(channel.bakname)}.jpg`;
        } else {
            // 其次：从URL中提取稳定标识（handle/UC.../user/c）作为文件名
            try {
                const url = channel.url || "";
                let key = null;
                // @handle
                let m = url.match(/youtube\.com\/@([^/?#]+)/);
                if (m) key = decodeURIComponent(m[1]);
                // channel/UC...
                if (!key) {
                    m = url.match(/youtube\.com\/channel\/(UC[\w-]{20,})/);
                    if (m) key = m[1];
                }
                // user/xxx
                if (!key) {
                    m = url.match(/youtube\.com\/user\/([^/?#]+)/);
                    if (m) key = m[1];
                }
                // c/xxx
                if (!key) {
                    m = url.match(/youtube\.com\/c\/([^/?#]+)/);
                    if (m) key = m[1];
                }
                if (key) {
                    this.src = `img/resized/${encodeURIComponent(key)}.jpg`;
                    return;
                }
            } catch (_) {}

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
    
    // 创建收藏按钮
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn';
    favoriteBtn.innerHTML = '☆';
    favoriteBtn.title = 'お気に入りに追加';
    favoriteBtn.setAttribute('data-channel-name', channel.name);
    
    // 检查是否已收藏
    if (isFavoriteChannel(channel.name)) {
        favoriteBtn.classList.add('favorited');
        favoriteBtn.innerHTML = '★';
        favoriteBtn.title = 'お気に入りから削除';
    }
    
    favoriteBtn.addEventListener('click', function(e) {
        e.stopPropagation(); // 阻止事件冒泡，避免触发频道点击
        toggleFavorite(channel.name, favoriteBtn);
    });
    
    channelButton.appendChild(favoriteBtn);
    
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
                url: channelUrl,
                timestamp: new Date().toISOString()
            }));
            
            // 自动同步到云端
            autoSyncData();
            
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
            // 构建候选文件名（优先顺序）
            const candidates = [];
            // 1) 完整显示名
            candidates.push(channelName);
            // 2) 去除全角括号后缀（如：めざましテレビチャンネル（フジテレビ） → めざましテレビチャンネル）
            const baseName = channelName.replace(/（[^）]*）$/, '').trim();
            if (baseName && baseName !== channelName) candidates.push(baseName);

            // 3) 从配置中取 bakname 与 handle
            try {
                const response = await fetch('japan_tv_youtube_channels.json');
                const channelsData = await response.json();
                let foundChannel = null;
                for (const region in channelsData) {
                    for (const category in channelsData[region]) {
                        const channels = channelsData[region][category];
                        if (!Array.isArray(channels)) continue;
                        const found = channels.find(channel => 
                            (channel.url && channelId && channel.url.includes(channelId)) || 
                            channel.name === channelName || channel.name === baseName
                        );
                        if (found) { foundChannel = found; break; }
                    }
                    if (foundChannel) break;
                }
                if (foundChannel) {
                    if (foundChannel.bakname && foundChannel.bakname.trim() !== '') {
                        candidates.push(foundChannel.bakname.trim());
                    }
                    // 从URL提取 @handle
                    if (foundChannel.url && foundChannel.url.includes('/@')) {
                        const handle = decodeURIComponent(foundChannel.url.split('/@').pop().split(/[/?#]/)[0]);
                        if (handle) candidates.push(handle);
                    }
                }
            } catch (e) {
                // 忽略配置加载失败，继续使用已有候选
            }

            // 依次尝试加载候选 JSON
            let loaded = false;
            for (const cand of candidates) {
                const tryUrl = new URL('data/' + encodeURIComponent(cand) + '.json', window.location.href).pathname;
                try {
                    const resp = await fetch(tryUrl);
                    if (resp.ok) {
                        jsonUrl = tryUrl;
                        loaded = true;
                        break;
                    }
                } catch (_) { /* ignore */ }
            }

            if (!loaded) {
                throw new Error('使用候选名称均无法获取JSON文件');
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
            // 过滤掉不可播放的视频
            const videoItems = videoListData.videos
                .filter(video => {
            // 条件: 非公開/削除/無効な動画を除外
                    if (!video.id || !video.title || !video.url) {
                        return false;
                    }
                    
                    // 检查标题是否包含私有或删除的标记
                    const title = video.title.toLowerCase();
                    const invalidTitles = [
                        'private video',
                        'deleted video',
                        '[private video]',
                        '[deleted video]',
                        'プライベート動画',
                        '削除された動画',
                        '非公開動画'
                    ];
                    
                    for (const invalidTitle of invalidTitles) {
                        if (title.includes(invalidTitle)) {
                            console.log('再生不可の動画を除外:', video.title);
                            return false;
                        }
                    }
                    
                    // 检查缩略图是否有效（排除默认的占位图）
                    if (video.thumbnail && video.thumbnail.includes('no_thumbnail')) {
                        console.log('サムネイルが無効な動画を除外:', video.title);
                        return false;
                    }
                    
                    return true;
                })
                .map(video => ({
                videoId: video.id,
                title: video.title,
                thumbnail: video.thumbnail,
                url: video.url
            }));
            
            if (videoItems.length === 0) {
                statusElement.textContent = 'このチャンネルには再生可能な動画がありません';
                return;
            }
            
            console.log(`フィルタ後の動画数: ${videoItems.length} / ${videoListData.videos.length}`);
            
            videoContainer.style.display = 'none';
            startRandomPlayback(videoItems);
            return;
        }
        
        statusElement.textContent = 'このチャンネルには再生可能な動画がありません';
        
    } catch (error) {
        console.error('エラー:', error);
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
    
    // 随机选择一个视频（避免与刚播放的视频重复）
    const lastId = window.lastPlayedVideoId || null;
    const candidateList = lastId && videos.length > 1
        ? videos.filter(v => v.videoId !== lastId)
        : videos;
    const randomIndex = Math.floor(Math.random() * candidateList.length);
    const randomVideo = candidateList[randomIndex];
    
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
        console.error('無効な動画IDです');
        return;
    }
    
    // 记录刚请求播放的视频，用于下一次随机时避免重复
    window.lastPlayedVideoId = videoId;
    
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
        
        // 添加到观看历史
        try {
            const lastWatchedChannel = localStorage.getItem('lastWatchedChannel');
            let channelName = '未知频道';
            if (lastWatchedChannel) {
                const channelInfo = JSON.parse(lastWatchedChannel);
                channelName = channelInfo.name;
            }
            
            addToViewHistory({
                videoId: currentVideo.videoId,
                title: currentVideo.title,
                thumbnail: currentVideo.thumbnail,
                url: currentVideo.url,
                channelName: channelName
            });
        } catch (error) {
            console.error('視聴履歴への追加に失敗:', error);
        }
        
        // 更新页脚中的视频信息 - 添加元素存在性检查
        const logoElement = document.getElementById('currentChannelLogo');
        const titleElement = document.getElementById('currentVideoTitle');
        const titleLinkElement = document.getElementById('currentVideoTitleLink');
        const urlElement = document.getElementById('currentChannelUrl');
        const nameElement = document.getElementById('currentChannelName');
        const favoriteBtn = document.getElementById('favoriteVideoBtn');
        
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
        
        // 显示并更新收藏按钮状态
        if (favoriteBtn) {
            favoriteBtn.style.display = 'flex';
            favoriteBtn.setAttribute('data-video-id', currentVideo.videoId);
            updateFavoriteButtonState(currentVideo.videoId);
        }
        
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
        console.log('YouTube APIの読み込みを待機中...');
        pendingVideoId = videoId;
        return;
    }

    let activePlayer = getActivePlayer();

    if (activePlayer) {
        if (!playerReady) {
        console.log('プレーヤーは準備中のため、再生待ちに登録');
            pendingVideoId = videoId;
            return;
        }

        try {
            activePlayer.loadVideoById({ videoId });
            pendingVideoId = null;
            return;
        } catch (loadError) {
            console.warn('既存プレーヤーの読み込みに失敗。再初期化を試みます', loadError);
            if (typeof activePlayer.destroy === 'function') {
                try {
                    activePlayer.destroy();
                } catch (destroyError) {
                    console.warn('旧プレーヤーの破棄時に問題が発生', destroyError);
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
    let shouldRemoveFromPlaylist = false;
    
    switch (event.data) {
        case 2:
            errorMessage = '動画パラメータが無効です';
            shouldRemoveFromPlaylist = true;
            break;
        case 5:
            errorMessage = 'HTML5プレーヤーエラー';
            break;
        case 100:
            errorMessage = '動画が存在しないか、削除されました';
            shouldRemoveFromPlaylist = true;
            break;
        case 101:
        case 150:
            errorMessage = '動画を再生できません（著作権者の要望によりブロックされています）';
            shouldRemoveFromPlaylist = true;
            break;
        default:
            errorMessage = '不明なエラー';
    }
    
    console.log('错误信息:', errorMessage, '- 自动切换到下一个视频');
    statusElement.textContent = `${errorMessage} - 次の動画に切り替えています...`;
    
    // 如果需要，从播放列表中移除无法播放的视频
    if (shouldRemoveFromPlaylist && window.videoPlaylist && window.videoPlaylist.length > 1) {
        const currentVideo = player && player.getVideoData ? player.getVideoData() : null;
        if (currentVideo && currentVideo.video_id) {
            const videoId = currentVideo.video_id;
            const beforeLength = window.videoPlaylist.length;
            window.videoPlaylist = window.videoPlaylist.filter(v => v.videoId !== videoId);
            console.log(`从播放列表中移除无法播放的视频 (${videoId}), 剩余: ${window.videoPlaylist.length}/${beforeLength}`);
        }
    }
    
    // 自动切换到下一个视频（避免重复刚播放的视频）
    if (window.videoPlaylist && window.videoPlaylist.length > 0) {
        setTimeout(() => {
            const lastId = window.lastPlayedVideoId || null;
            const candidates = lastId && window.videoPlaylist.length > 1
                ? window.videoPlaylist.filter(v => v.videoId !== lastId)
                : window.videoPlaylist;
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const nextVideo = candidates[randomIndex];
    console.log('次の動画へ自動切替:', nextVideo.title);
            console.log('次の動画へ自動切替:', nextVideo.title);
            console.log('次の動画へ自動切替:', nextVideo.title);
            statusElement.textContent = '再生中: ' + nextVideo.url;
            playVideo(nextVideo.videoId);
        }, 1500); // 等待1.5秒后切换
    } else {
        statusElement.textContent = '再生可能な動画がありません';
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
            const lastId = window.lastPlayedVideoId || null;
            const candidates = lastId && window.videoPlaylist.length > 1
                ? window.videoPlaylist.filter(v => v.videoId !== lastId)
                : window.videoPlaylist;
            const randomIndex = Math.floor(Math.random() * candidates.length);
            const nextVideo = candidates[randomIndex];
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
        console.warn('コンテナ要素が見つからず、フルスクリーン切替ができません');
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

        console.log('フルスクリーンボタンのリスナーを追加し、設定で初期化しました');
    } else {
        console.warn('フルスクリーンボタンが見つかりません');
    }
});

// 添加调试信息
console.log('DOMContentLoaded リスナーを追加しました');

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
            
            // 自动同步主题设置到云端
            autoSyncData();
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
    console.log('設定機能の初期化を開始...');
    
    const settingsButton = document.getElementById('settingsButton');
    const footerVisibility = document.getElementById('footerVisibility');
    const defaultFullscreen = document.getElementById('defaultFullscreen');
    darkModeToggle = document.getElementById('darkMode');
    const footer = document.querySelector('.footer');
    
    console.log('設定関連要素のチェック:', {
        settingsButton: !!settingsButton,
        footerVisibility: !!footerVisibility,
        defaultFullscreen: !!defaultFullscreen,
        darkModeToggle: !!darkModeToggle,
        footer: !!footer
    });
    
    if (!settingsButton || !footerVisibility || !defaultFullscreen || !footer || !darkModeToggle) {
        console.error('設定関連の要素が見つかりません。500ms後に再試行します');
        setTimeout(initSettings, 500);
        return;
    }
    
    // 确保设置面板初始处于关闭状态
    const initialPanel = document.getElementById('settingsPanel');
    const initialOverlay = document.getElementById('settingsOverlay');
    if (initialPanel && initialOverlay) {
        initialPanel.classList.remove('show');
        initialOverlay.classList.remove('show');
        // 使用 inert 属性替代 aria-hidden
        initialPanel.setAttribute('inert', '');
        console.log('設定パネルの初期化が完了しました');
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
        console.log('設定ボタンがクリックされました');
        
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        
        console.log('パネル要素の確認:', {
            panel: !!panel,
            overlay: !!overlay,
            panelClasses: panel ? panel.className : 'N/A',
            overlayClasses: overlay ? overlay.className : 'N/A'
        });
        
        if (panel && overlay) {
            const isVisible = panel.classList.contains('show');
            console.log('パネルの現在状態:', isVisible ? '表示' : '非表示');
            if (isVisible) {
                closeSettingsPanel();
            } else {
                openSettingsPanel();
            }
        } else {
            console.error('設定パネルまたはオーバーレイが見つかりません');
        }
    });
    
    // 关闭设置面板
    function closeSettingsPanel() {
        console.log('設定パネルのクローズを開始');
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        const playerContainer = document.getElementById('playerContainer');
        
        console.log('パネル要素の確認:', {
            panel: !!panel,
            overlay: !!overlay,
            playerContainer: !!playerContainer
        });
        
        if (panel && overlay) {
            panel.classList.remove('show');
            overlay.classList.remove('show');
            document.body.style.overflow = '';
            document.body.removeAttribute('data-modal-open');
            
            // 添加 inert 属性使面板不可交互
            panel.setAttribute('inert', '');
            
            // 移除播放器容器的设置面板打开状态class
            if (playerContainer) {
                playerContainer.classList.remove('settings-open');
            }
            console.log('設定パネルを閉じました');
        } else {
            console.error('パネルまたはオーバーレイが見つかりません');
        }
    }
    
    // 打开设置面板
    function openSettingsPanel() {
        console.log('設定パネルのオープンを開始');
        const panel = document.getElementById('settingsPanel');
        const overlay = document.getElementById('settingsOverlay');
        const playerContainer = document.getElementById('playerContainer');
        
        console.log('オープン時の要素確認:', {
            panel: !!panel,
            overlay: !!overlay,
            playerContainer: !!playerContainer
        });
        
        if (panel && overlay) {
            panel.classList.add('show');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
            document.body.setAttribute('data-modal-open', 'true');
            
            // 移除 inert 属性使面板可交互
            panel.removeAttribute('inert');
            
            console.log('設定パネルを開きました。現在のクラス:', panel.className);
            
            // 添加播放器容器的设置面板打开状态class
            if (playerContainer) {
                playerContainer.classList.add('settings-open');
            }
        } else {
            console.error('設定パネルまたはオーバーレイが見つかりません');
        }
    }
    
    // 关闭按钮事件
    const closeBtn = document.getElementById('closeSettings');
    if (closeBtn) {
        console.log('閉じるボタンを検出。イベントを追加');
        closeBtn.addEventListener('click', closeSettingsPanel);
    } else {
        console.error('閉じるボタン要素が見つかりません');
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
        autoSyncData();
    });
    
    // 默认全屏设置
    defaultFullscreen.addEventListener('change', function() {
        const isDefaultFullscreen = this.checked;
        localStorage.setItem('defaultFullscreen', isDefaultFullscreen.toString());
        console.log('默认全屏状态已更新:', isDefaultFullscreen ? '启用' : '禁用');
        autoSyncData();
    });
    
    // 语言固定为日语，无需监听选择器
    
    console.log('设置功能初始化完成');
}

// 加载设置
function loadSettings() {
    initializeTheme();

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
    
    // 语言固定为日语，不从本地恢复选择器
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
            // 关闭统计面板
            closeChannelStatsPanel();
            
            // 筛选并显示该地区的频道
            filterChannelsByRegion(region);
        });
        
        // 添加鼠标悬停提示
        regionElement.title = `クリックして${region.name}のチャンネルを表示`;
        
        container.appendChild(regionElement);
    });
}

// 根据地区筛选频道
function filterChannelsByRegion(region) {
    console.log('选中地区:', region.name);
    
    // 获取所有频道按钮
    const channelItems = document.querySelectorAll('.channel-item');
    let matchedChannels = [];
    
    // 遍历所有频道，找出属于该地区的频道
    channelItems.forEach(item => {
        const channelName = item.getAttribute('data-channel-name');
        const channelUrl = item.getAttribute('data-channel-url');
        
        // 检查频道是否属于该地区
        if (region.channels.some(ch => ch.channelName === channelName)) {
            matchedChannels.push(item);
        }
    });
    
    if (matchedChannels.length > 0) {
        // 清空搜索框
        const searchInput = document.getElementById('channelSearch');
        if (searchInput) {
            searchInput.value = '';
        }
        
        // 显示所有频道
        channelItems.forEach(item => {
            item.style.display = 'none';
        });
        
        // 只显示匹配的频道
        matchedChannels.forEach(item => {
            item.style.display = 'flex';
            // 确保父容器可见
            let parent = item.parentElement;
            while (parent && !parent.classList.contains('channel-section')) {
                parent.style.display = 'block';
                parent = parent.parentElement;
            }
            if (parent) parent.style.display = 'block';
        });
        
        // 隐藏空的子分类和分类
        const subCategories = document.querySelectorAll('.subcategory-container');
        subCategories.forEach(subCategory => {
            const visibleChannels = subCategory.querySelectorAll('.channel-item[style*="display: flex"]');
            subCategory.style.display = visibleChannels.length > 0 ? 'block' : 'none';
        });
        
        const sections = document.querySelectorAll('.channel-section');
        sections.forEach(section => {
            const visibleSubCategories = section.querySelectorAll('.subcategory-container[style*="display: block"]');
            section.style.display = visibleSubCategories.length > 0 ? 'block' : 'none';
        });
        
        // 更新状态显示
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = `${region.name}のチャンネルを表示中（${matchedChannels.length}件）`;
        }
        
        // 显示清除筛选按钮
        const clearButton = document.getElementById('clearFilterButton');
        if (clearButton) {
            clearButton.style.display = 'flex';
            clearButton.querySelector('.filter-text').textContent = `${region.name} フィルター解除`;
        }
        
        // 滚动到频道列表顶部
        const channelSelector = document.getElementById('channelSelector');
        if (channelSelector) {
            channelSelector.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // 自动播放第一个频道（可选）
        if (matchedChannels.length > 0) {
            setTimeout(() => {
                matchedChannels[0].click();
            }, 500);
        }
    }
}

// 清除地区筛选
function clearRegionFilter() {
    console.log('清除地区筛选');
    
    // 显示所有频道
    showAllChannels();
    
    // 隐藏清除按钮
    const clearButton = document.getElementById('clearFilterButton');
    if (clearButton) {
        clearButton.style.display = 'none';
    }
    
    // 更新状态显示
    const statusElement = document.getElementById('status');
    if (statusElement) {
        statusElement.textContent = '準備完了、チャンネルを読み込んでいます...';
    }
}

// === 清除缓存功能 ===

// 清除所有本地缓存
function clearAllCache() {
    // 获取当前语言
    const currentLang = localStorage.getItem('language') || 'ja';
    
    // 确认对话框文本
    const confirmMessages = {
        ja: 'すべてのキャッシュデータを削除しますか？\n\n以下のデータが削除されます：\n• お気に入りチャンネル\n• 設定（テーマ、言語など）\n• 最後に視聴したチャンネル\n• その他のキャッシュデータ\n\nこの操作は取り消せません。',
        en: 'Clear all cache data?\n\nThe following data will be deleted:\n• Favorite channels\n• Settings (theme, language, etc.)\n• Last watched channel\n• Other cached data\n\nThis action cannot be undone.',
        zh: '是否清除所有缓存数据？\n\n以下数据将被删除：\n• 收藏的频道\n• 设置（主题、语言等）\n• 最后观看的频道\n• 其他缓存数据\n\n此操作无法撤销。'
    };
    
    const successMessages = {
        ja: 'キャッシュが正常にクリアされました。ページを再読み込みします...',
        en: 'Cache cleared successfully. Reloading page...',
        zh: '缓存已成功清除。正在重新加载页面...'
    };
    
    // 显示确认对话框
    if (confirm(confirmMessages[currentLang])) {
        try {
            // 清除所有localStorage数据
            localStorage.clear();
            
            // 清除sessionStorage（如果有使用）
            sessionStorage.clear();
            
            console.log('所有缓存已清除');
            
            // 显示成功消息
            alert(successMessages[currentLang]);
            
            // 延迟500ms后重新加载页面，让用户看到成功消息
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (error) {
            console.error('清除缓存失败:', error);
            const errorMessages = {
                ja: 'キャッシュのクリアに失敗しました。',
                en: 'Failed to clear cache.',
                zh: '清除缓存失败。'
            };
            alert(errorMessages[currentLang]);
        }
    }
}

// === 收藏功能 ===

// 获取收藏列表
function getFavoriteChannels() {
    try {
        const favorites = localStorage.getItem('favoriteChannels');
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('获取收藏列表失败:', error);
        return [];
    }
}

// 保存收藏列表
function saveFavoriteChannels(favorites) {
    try {
        localStorage.setItem('favoriteChannels', JSON.stringify(favorites));
    } catch (error) {
        console.error('保存收藏列表失败:', error);
    }
}

// 检查频道是否已收藏
function isFavoriteChannel(channelName) {
    const favorites = getFavoriteChannels();
    return favorites.includes(channelName);
}

// 切换收藏状态
function toggleFavorite(channelName, button) {
    let favorites = getFavoriteChannels();
    
    if (favorites.includes(channelName)) {
        // 取消收藏
        favorites = favorites.filter(name => name !== channelName);
        button.classList.remove('favorited');
        button.innerHTML = '☆';
        button.title = 'お気に入りに追加';
        console.log('取消收藏:', channelName);
    } else {
        // 添加收藏
        favorites.push(channelName);
        button.classList.add('favorited');
        button.innerHTML = '★';
        button.title = 'お気に入りから削除';
        console.log('添加收藏:', channelName);
    }
    
    saveFavoriteChannels(favorites);
    updateFavoritesCount();
    
    // 自动同步到云端
    autoSyncData();
    
    // 如果当前在收藏视图，刷新显示
    const activeTab = document.querySelector('.filter-tab.active');
    if (activeTab && activeTab.getAttribute('data-filter') === 'favorites') {
        switchChannelFilter('favorites');
    }
}

// 更新收藏数量显示
function updateFavoritesCount() {
    const favorites = getFavoriteChannels();
    const countElement = document.getElementById('favoritesCount');
    if (countElement) {
        countElement.textContent = favorites.length;
    }
}

// 切换频道筛选（全部/收藏）
function switchChannelFilter(filter) {
    console.log('切换筛选:', filter);
    
    // 更新按钮状态
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.filter-tab[data-filter="${filter}"]`).classList.add('active');
    
    const channelItems = document.querySelectorAll('.channel-item');
    const favorites = getFavoriteChannels();
    
    if (filter === 'favorites') {
        // 只显示收藏的频道
        let hasVisibleChannels = false;
        
        channelItems.forEach(item => {
            const channelName = item.getAttribute('data-channel-name');
            if (favorites.includes(channelName)) {
                item.style.display = 'flex';
                hasVisibleChannels = true;
                
                // 确保父容器可见
                let parent = item.parentElement;
                while (parent && !parent.classList.contains('channel-section')) {
                    parent.style.display = 'block';
                    parent = parent.parentElement;
                }
                if (parent) parent.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        // 隐藏空的子分类和分类
        const subCategories = document.querySelectorAll('.subcategory-container');
        subCategories.forEach(subCategory => {
            const visibleChannels = subCategory.querySelectorAll('.channel-item[style*="display: flex"]');
            subCategory.style.display = visibleChannels.length > 0 ? 'block' : 'none';
        });
        
        const sections = document.querySelectorAll('.channel-section');
        sections.forEach(section => {
            const visibleSubCategories = section.querySelectorAll('.subcategory-container[style*="display: block"]');
            section.style.display = visibleSubCategories.length > 0 ? 'block' : 'none';
        });
        
        // 更新状态
        const statusElement = document.getElementById('status');
        if (statusElement) {
            if (hasVisibleChannels) {
                statusElement.textContent = `お気に入りチャンネルを表示中（${favorites.length}件）`;
            } else {
                statusElement.textContent = 'お気に入りチャンネルがありません。星ボタンをクリックして追加してください。';
            }
        }
    } else {
        // 显示所有频道
        showAllChannels();
        
        const statusElement = document.getElementById('status');
        if (statusElement) {
            statusElement.textContent = '準備完了、チャンネルを読み込んでいます...';
        }
    }
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
}

// 获取地区图标
function getRegionIcon(regionName) {
    const iconMap = {
        '北海道': '🗻',
        '北海道地方': '🗻',
        '東北': '🌾',
        '東北地方': '🌾',
        '関東': '🗼',
        '関東地方': '🗼',
        '中部': '🏔️',
        '中部地方': '🏔️',
        '関西': '🏯',
        '関西地方': '🏯',
        '近畿': '🏯',
        '近畿地方': '🏯',
        '中国': '⛰️',
        '中国地方': '⛰️',
        '四国': '🌊',
        '四国地方': '🌊',
        '九州・沖縄': '🌺',
        '九州・沖縄地方': '🌺',
        '九州': '🌺',
        '九州地方': '🌺',
        '日本テレビ系': '📺',
        'テレビ朝日系': '📡',
        'TBS系': '🎬',
        'テレビ東京系': '🎥',
        'フジテレビ系': '📹',
        '日本語学習': '📚',
        'その他チャンネル': '✨',
        'その他': '✨'
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
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[index];
        
        const label = document.createElement('span');
        label.className = 'legend-label';
        label.textContent = region.name;
        
        const value = document.createElement('span');
        value.className = 'legend-value';
        value.textContent = region.channels.length;
        
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
    initViewHistory();
    initTvSearch();
});

// === 观看历史功能 ===

const MAX_HISTORY_ITEMS = 100; // 最多保存100条记录

// 获取观看历史
function getViewHistory() {
    try {
        const history = localStorage.getItem('viewHistory');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('获取观看历史失败:', error);
        return [];
    }
}

// 保存观看历史
function saveViewHistory(history) {
    try {
        localStorage.setItem('viewHistory', JSON.stringify(history));
    } catch (error) {
        console.error('保存观看历史失败:', error);
    }
}

// 添加到观看历史
function addToViewHistory(videoInfo) {
    let history = getViewHistory();
    
    // 创建历史记录项
    const historyItem = {
        videoId: videoInfo.videoId,
        title: videoInfo.title,
        thumbnail: videoInfo.thumbnail,
        url: videoInfo.url,
        channelName: videoInfo.channelName || '未知频道',
        timestamp: new Date().toISOString()
    };
    
    // 移除相同视频的旧记录
    history = history.filter(item => item.videoId !== videoInfo.videoId);
    
    // 添加到开头
    history.unshift(historyItem);
    
    // 限制最大数量
    if (history.length > MAX_HISTORY_ITEMS) {
        history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    
    saveViewHistory(history);
    console.log('已添加到观看历史:', historyItem.title);
    
    // 自动同步到云端
    autoSyncData();
}

// 初始化观看历史功能
function initViewHistory() {
    const historyButton = document.getElementById('viewHistoryButton');
    const historyPanel = document.getElementById('viewHistoryPanel');
    const historyOverlay = document.getElementById('viewHistoryOverlay');
    const closeHistoryBtn = document.getElementById('closeViewHistory');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    // 初始化面板状态
    if (historyPanel) {
        historyPanel.setAttribute('inert', '');
        console.log('历史记录面板初始化完成');
    }
    
    if (historyButton) {
        historyButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('历史记录按钮被点击');
            openViewHistoryPanel();
            displayViewHistory();
        });
    }
    
    if (closeHistoryBtn) {
        closeHistoryBtn.addEventListener('click', function() {
            closeViewHistoryPanel();
        });
    }
    
    if (historyOverlay) {
        historyOverlay.addEventListener('click', function() {
            closeViewHistoryPanel();
        });
    }
    
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            clearViewHistory();
        });
    }
    
    // ESC键关闭面板
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const panel = document.getElementById('viewHistoryPanel');
            if (panel && panel.classList.contains('show')) {
                closeViewHistoryPanel();
            }
        }
    });
}

// 打开观看历史面板
function openViewHistoryPanel() {
    const panel = document.getElementById('viewHistoryPanel');
    const overlay = document.getElementById('viewHistoryOverlay');
    
    if (panel && overlay) {
        // 先显示面板
        panel.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        document.body.setAttribute('data-modal-open', 'true');
        
        // 移除 inert 属性使面板可交互
        panel.removeAttribute('inert');
        
        console.log('历史记录面板已打开');
    }
}

// 关闭观看历史面板
function closeViewHistoryPanel() {
    const panel = document.getElementById('viewHistoryPanel');
    const overlay = document.getElementById('viewHistoryOverlay');
    
    if (panel && overlay) {
        panel.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        document.body.removeAttribute('data-modal-open');
        
        // 添加 inert 属性使面板不可交互
        panel.setAttribute('inert', '');
        
        console.log('历史记录面板已关闭');
    }
}

// 显示观看历史 - 此函数已在文件末尾重新定义以支持筛选功能

// 格式化历史时间
function formatHistoryTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) {
        return currentLanguage === 'ja' ? 'たった今' : 
               currentLanguage === 'zh' ? '刚刚' : 'Just now';
    } else if (minutes < 60) {
        return currentLanguage === 'ja' ? `${minutes}分前` :
               currentLanguage === 'zh' ? `${minutes}分钟前` : `${minutes} minutes ago`;
    } else if (hours < 24) {
        return currentLanguage === 'ja' ? `${hours}時間前` :
               currentLanguage === 'zh' ? `${hours}小时前` : `${hours} hours ago`;
    } else if (days < 7) {
        return currentLanguage === 'ja' ? `${days}日前` :
               currentLanguage === 'zh' ? `${days}天前` : `${days} days ago`;
    } else {
        return date.toLocaleDateString(currentLanguage === 'ja' ? 'ja-JP' : 
                                       currentLanguage === 'zh' ? 'zh-CN' : 'en-US');
    }
}

// 播放历史视频
function playHistoryVideo(item) {
    console.log('播放历史视频:', item.title);
    
    // 关闭历史面板
    closeViewHistoryPanel();
    
    // 播放视频
    if (item.videoId) {
        playVideo(item.videoId);
    }
}

// 清空观看历史
function clearViewHistory() {
    const confirmMessage = i18n[currentLanguage].confirm_clear_history || '是否清空观看历史？';
    
    if (confirm(confirmMessage)) {
        try {
            localStorage.removeItem('viewHistory');
            displayViewHistory();
            
            const clearedMessage = i18n[currentLanguage].history_cleared || '历史记录已清空';
            alert(clearedMessage);
            
            console.log('观看历史已清空');
            
            // 自动同步到云端
            autoSyncData();
        } catch (error) {
            console.error('清空观看历史失败:', error);
        }
    }
}

// === 电视节目搜索功能 ===

// 初始化电视节目搜索功能
function initTvSearch() {
    const searchButton = document.getElementById('tvSearchButton');
    const searchPanel = document.getElementById('tvSearchPanel');
    const searchOverlay = document.getElementById('tvSearchOverlay');
    const closeSearchBtn = document.getElementById('closeTvSearch');
    const searchInput = document.getElementById('tvSearchInput');
    const searchSubmitBtn = document.getElementById('tvSearchSubmit');
    
    // 初始化面板状态
    if (searchPanel) {
        searchPanel.setAttribute('inert', '');
        console.log('电视节目搜索面板初始化完成');
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('电视节目搜索按钮被点击');
            openTvSearchPanel();
        });
    }
    
    if (closeSearchBtn) {
        closeSearchBtn.addEventListener('click', function() {
            closeTvSearchPanel();
        });
    }
    
    if (searchOverlay) {
        searchOverlay.addEventListener('click', function() {
            closeTvSearchPanel();
        });
    }
    
    if (searchSubmitBtn) {
        searchSubmitBtn.addEventListener('click', function() {
            performTvSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performTvSearch();
            }
        });
    }
    
    // ESC键关闭面板
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const panel = document.getElementById('tvSearchPanel');
            if (panel && panel.classList.contains('show')) {
                closeTvSearchPanel();
            }
        }
    });
}

// 打开电视节目搜索面板
function openTvSearchPanel() {
    const panel = document.getElementById('tvSearchPanel');
    const overlay = document.getElementById('tvSearchOverlay');
    
    if (panel && overlay) {
        // 先显示面板
        panel.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        document.body.setAttribute('data-modal-open', 'true');
        
        // 移除 inert 属性使面板可交互
        panel.removeAttribute('inert');
        
        // 聚焦到搜索输入框
        const searchInput = document.getElementById('tvSearchInput');
        if (searchInput) {
            setTimeout(() => {
                searchInput.focus();
            }, 100);
        }
        
        console.log('电视节目搜索面板已打开');
    }
}

// 关闭电视节目搜索面板
function closeTvSearchPanel() {
    const panel = document.getElementById('tvSearchPanel');
    const overlay = document.getElementById('tvSearchOverlay');
    
    if (panel && overlay) {
        panel.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
        document.body.removeAttribute('data-modal-open');
        
        // 添加 inert 属性使面板不可交互
        panel.setAttribute('inert', '');
        
        console.log('电视节目搜索面板已关闭');
    }
}

// 执行电视节目搜索
function performTvSearch() {
    const searchInput = document.getElementById('tvSearchInput');
    const searchResults = document.getElementById('tvSearchResults');
    
    if (!searchInput || !searchResults) return;
    
    const query = searchInput.value.trim();
    if (!query) {
        showNotification('検索キーワードを入力してください', 'error');
        return;
    }

    console.log('テレビ番組を検索:', query);

    // ロード中の状態を表示
    searchResults.innerHTML = '<div class="search-no-results"><h4>検索中...</h4><p>全チャンネルデータを検索しています...</p></div>';

    // 実際の検索を開始
    searchTvPrograms(query);
}

// 搜索电视节目
async function searchTvPrograms(query) {
    const searchResults = document.getElementById('tvSearchResults');
    const keyword = query.toLowerCase();
    
    try {
        // 读取频道配置
        const resp = await fetch('japan_tv_youtube_channels.json');
        if (!resp.ok) throw new Error('チャンネル一覧を取得できません');
        const channelsData = await resp.json();

        // 展开为扁平化频道数组
        const allChannels = [];
        for (const region in channelsData) {
            const categories = channelsData[region];
            for (const category in categories) {
                const list = categories[category];
                if (Array.isArray(list)) {
                    for (const ch of list) {
                        allChannels.push(ch);
                    }
                }
            }
        }

        // 工具：根据频道构造候选文件名
        const buildCandidates = (channel) => {
            const candidates = [];
            if (channel && channel.name) {
                candidates.push(channel.name);
                const baseName = channel.name.replace(/（[^）]*）$/, '').trim();
                if (baseName && baseName !== channel.name) candidates.push(baseName);
            }
            if (channel && channel.bakname) {
                const b = String(channel.bakname).trim();
                if (b) candidates.push(b);
            }
            if (channel && channel.url && channel.url.includes('/@')) {
                const handle = decodeURIComponent(channel.url.split('/@').pop().split(/[/?#]/)[0]);
                if (handle) candidates.push(handle);
            }
            // 去重保持顺序
            return [...new Set(candidates)];
        };

        // 工具：尝试加载某频道的JSON
        const loadChannelJson = async (channel) => {
            const candidates = buildCandidates(channel);
            for (const cand of candidates) {
                const url = new URL('data/' + encodeURIComponent(cand) + '.json', window.location.href).pathname;
                try {
                    const r = await fetch(url);
                    if (r.ok) {
                        const data = await r.json();
                        return { data, source: url, resolvedName: cand };
                    }
                } catch (_) { /* 忽略 */ }
            }
            return null;
        };

        // 并发处理（限速）
        const concurrency = 6;
        const results = [];
        let index = 0;
        
        const workers = new Array(concurrency).fill(0).map(async () => {
            while (index < allChannels.length) {
                const current = allChannels[index++];
                const loaded = await loadChannelJson(current);
                if (!loaded) continue;
                const channelName = current.name || (loaded.data && loaded.data.channel_name) || '未知频道';
                const videos = Array.isArray(loaded.data.videos) ? loaded.data.videos : [];
                for (const v of videos) {
                    if (!v || !v.title) continue;
                    const t = String(v.title);
                    if (t.toLowerCase().includes(keyword)) {
                        results.push({
                            title: t,
                            channel: channelName,
                            description: '',
                            videoId: v.id,
                            thumbnail: v.thumbnail,
                            url: v.url
                        });
                    }
                }
            }
        });
        
        await Promise.all(workers);
        
        // 如果没有结果
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-no-results"><h4>該当する番組が見つかりません</h4><p>別のキーワードでお試しください</p></div>';
            return;
        }
        
        // 简单按标题长度排序（更相关的在前），也可以不排序
        results.sort((a, b) => a.title.length - b.title.length);
        displaySearchResults(results);
    } catch (error) {
        console.error('番組検索に失敗:', error);
        searchResults.innerHTML = '<div class="search-no-results"><h4>検索に失敗しました</h4><p>しばらくしてからもう一度お試しください</p></div>';
    }
}

// 显示搜索结果
function displaySearchResults(results) {
    const searchResults = document.getElementById('tvSearchResults');
    
    if (!results || results.length === 0) {
        searchResults.innerHTML = '<div class="search-no-results"><h4>該当する番組が見つかりません</h4><p>別のキーワードでお試しください</p></div>';
        return;
    }
    
    let html = '';
    results.forEach(result => {
        const thumb = result.thumbnail || '';
        html += `
            <div class="search-result-item" onclick="playSearchResult('${result.videoId}')">
                <div class="search-result-thumb">
                    <img src="${thumb}" alt="thumb" loading="lazy" referrerpolicy="no-referrer"/>
                </div>
                <div class="search-result-meta">
                    <div class="search-result-title">${result.title}</div>
                    <div class="search-result-channel">${result.channel}</div>
                    <div class="search-result-description">${result.description || ''}</div>
                </div>
            </div>
        `;
    });
    
    searchResults.innerHTML = html;
}

// 播放搜索结果
function playSearchResult(videoId) {
    console.log('播放搜索结果:', videoId);
    
    // 关闭搜索面板
    closeTvSearchPanel();
    
    // 调用现有播放逻辑
    if (typeof playVideo === 'function') {
        playVideo(videoId);
    } else {
        showNotification('正在播放: ' + videoId, 'success');
    }
}

// === 收藏视频功能 ===

// 当前历史记录筛选状态
let currentHistoryFilter = 'all';

// 获取收藏视频列表
function getFavoriteVideos() {
    try {
        const favorites = localStorage.getItem('favoriteVideos');
        return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
        console.error('获取收藏视频失败:', error);
        return [];
    }
}

// 保存收藏视频列表
function saveFavoriteVideos(favorites) {
    try {
        localStorage.setItem('favoriteVideos', JSON.stringify(favorites));
    } catch (error) {
        console.error('保存收藏视频失败:', error);
    }
}

// 检查视频是否已收藏
function isVideoFavorited(videoId) {
    const favorites = getFavoriteVideos();
    return favorites.some(fav => fav.videoId === videoId);
}

// 切换视频收藏状态
function toggleVideoFavorite(videoId) {
    let favorites = getFavoriteVideos();
    const isFavorited = favorites.some(fav => fav.videoId === videoId);
    
    if (isFavorited) {
        // 取消收藏
        favorites = favorites.filter(fav => fav.videoId !== videoId);
        console.log('取消收藏视频:', videoId);
    } else {
        // 添加收藏 - 从历史记录中查找视频信息
        const history = getViewHistory();
        const video = history.find(item => item.videoId === videoId);
        
        if (video) {
            favorites.push({
                videoId: video.videoId,
                title: video.title,
                thumbnail: video.thumbnail,
                url: video.url,
                channelName: video.channelName,
                favoritedAt: new Date().toISOString()
            });
            console.log('收藏视频:', video.title);
        }
    }
    
    saveFavoriteVideos(favorites);
    updateFavoriteButtonState(videoId);
    updateHistoryFavoritesCount();
    
    // 如果当前在收藏筛选视图，刷新显示
    if (currentHistoryFilter === 'favorites') {
        displayViewHistory();
    }
    
    // 自动同步到云端
    autoSyncData();
    
    return !isFavorited;
}

// 更新收藏按钮状态
function updateFavoriteButtonState(videoId) {
    const favoriteBtn = document.getElementById('favoriteVideoBtn');
    if (!favoriteBtn) return;
    
    const isFavorited = isVideoFavorited(videoId);
    const svg = favoriteBtn.querySelector('svg polygon');
    
    if (isFavorited) {
        favoriteBtn.classList.add('favorited');
        if (svg) svg.setAttribute('fill', 'currentColor');
        favoriteBtn.title = i18n[currentLanguage].unfavorite_video || '取消收藏';
    } else {
        favoriteBtn.classList.remove('favorited');
        if (svg) svg.setAttribute('fill', 'none');
        favoriteBtn.title = i18n[currentLanguage].favorite_video || '收藏节目';
    }
}

// 初始化收藏按钮事件监听
document.addEventListener('DOMContentLoaded', function() {
    const favoriteBtn = document.getElementById('favoriteVideoBtn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                const isFavorited = toggleVideoFavorite(videoId);
                const message = isFavorited ? 
                    (i18n[currentLanguage].video_favorited || '已添加到收藏') :
                    (i18n[currentLanguage].video_unfavorited || '已取消收藏');
                
                // 显示提示（可选）
                console.log(message);
            }
        });
    }
});

// 更新历史记录收藏数量（只显示在历史记录中且被收藏的数量）
function updateHistoryFavoritesCount() {
    const history = getViewHistory();
    const favorites = getFavoriteVideos();
    const favoriteVideoIds = favorites.map(fav => fav.videoId);
    
    // 统计在历史记录中且被收藏的视频数量
    const favoritedInHistory = history.filter(item => favoriteVideoIds.includes(item.videoId));
    
    const countElement = document.getElementById('historyFavoritesCount');
    if (countElement) {
        countElement.textContent = favoritedInHistory.length;
    }
}

// 切换历史记录筛选
function switchHistoryFilter(filter) {
    console.log('切换历史记录筛选:', filter);
    currentHistoryFilter = filter;
    
    // 更新按钮状态
    document.querySelectorAll('.history-filter-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.history-filter-tab[data-filter="${filter}"]`).classList.add('active');
    
    // 刷新历史记录显示
    displayViewHistory();
}

// 修改原有的 displayViewHistory 函数以支持筛选
function displayViewHistory() {
    console.log('开始显示观看历史');
    const history = getViewHistory();
    const favorites = getFavoriteVideos();
    const historyList = document.getElementById('historyList');
    const historyCount = document.getElementById('historyCount');
    
    console.log('历史记录数量:', history.length);
    console.log('收藏数量:', favorites.length);
    console.log('当前筛选:', currentHistoryFilter);
    
    if (!historyList || !historyCount) {
        console.error('找不到历史记录列表元素');
        return;
    }
    
    // 更新收藏数量
    updateHistoryFavoritesCount();
    
    // 根据筛选条件过滤历史记录
    let filteredHistory = history;
    if (currentHistoryFilter === 'favorites') {
        const favoriteVideoIds = favorites.map(fav => fav.videoId);
        filteredHistory = history.filter(item => favoriteVideoIds.includes(item.videoId));
        console.log('收藏筛选后的数量:', filteredHistory.length);
    }
    
    historyCount.textContent = filteredHistory.length;
    historyList.innerHTML = '';
    
    if (filteredHistory.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'history-empty';
        emptyMessage.textContent = currentHistoryFilter === 'favorites' ?
            (i18n[currentLanguage].no_history || '暂无收藏视频') :
            (i18n[currentLanguage].no_history || '暂无观看历史');
        historyList.appendChild(emptyMessage);
        console.log('显示空消息:', emptyMessage.textContent);
        return;
    }
    
    console.log('开始渲染', filteredHistory.length, '条历史记录');
    
    filteredHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const thumbnail = document.createElement('img');
        thumbnail.className = 'history-thumbnail';
        thumbnail.src = item.thumbnail;
        thumbnail.alt = item.title;
        thumbnail.onerror = function() {
            this.src = 'img/resized/placeholder.jpg';
        };
        
        const info = document.createElement('div');
        info.className = 'history-info';
        
        const titleContainer = document.createElement('div');
        titleContainer.className = 'history-title-container';
        
        const title = document.createElement('div');
        title.className = 'history-title';
        title.textContent = item.title;
        title.title = item.title;
        
        // 添加收藏图标
        const favoriteIcon = document.createElement('button');
        favoriteIcon.className = 'history-favorite-btn';
        favoriteIcon.innerHTML = isVideoFavorited(item.videoId) ? '★' : '☆';
        favoriteIcon.title = isVideoFavorited(item.videoId) ? 
            (i18n[currentLanguage].unfavorite_video || '取消收藏') :
            (i18n[currentLanguage].favorite_video || '收藏');
        favoriteIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleVideoFavorite(item.videoId);
            this.innerHTML = isVideoFavorited(item.videoId) ? '★' : '☆';
            this.title = isVideoFavorited(item.videoId) ? 
                (i18n[currentLanguage].unfavorite_video || '取消收藏') :
                (i18n[currentLanguage].favorite_video || '收藏');
        });
        
        titleContainer.appendChild(title);
        titleContainer.appendChild(favoriteIcon);
        
        const channel = document.createElement('div');
        channel.className = 'history-channel';
        channel.textContent = item.channelName;
        
        const time = document.createElement('div');
        time.className = 'history-time';
        time.textContent = formatHistoryTime(item.timestamp);
        
        info.appendChild(titleContainer);
        info.appendChild(channel);
        info.appendChild(time);
        
        const playBtn = document.createElement('button');
        playBtn.className = 'history-play-btn';
        playBtn.innerHTML = '▶';
        playBtn.title = '播放';
        playBtn.addEventListener('click', function() {
            playHistoryVideo(item);
        });
        
        historyItem.appendChild(thumbnail);
        historyItem.appendChild(info);
        historyItem.appendChild(playBtn);
        
        historyList.appendChild(historyItem);
    });
}

// === 自动同步功能 ===

// 防抖计时器
let autoSyncTimer = null;

// 自动同步数据到云端（带防抖）
function autoSyncData() {
    // 检查是否已登录和 Firebase 是否可用
    if (!window.firebaseAuth || !window.syncUserData) {
        return;
    }
    
    const user = window.firebaseAuth.currentUser;
    if (!user) {
        // 用户未登录，不需要同步
        return;
    }
    
    // 清除之前的计时器
    if (autoSyncTimer) {
        clearTimeout(autoSyncTimer);
    }
    
    // 延迟1秒后同步，避免频繁操作时多次同步
    autoSyncTimer = setTimeout(async () => {
        try {
            console.log('正在自动同步数据到云端...');
            await window.syncUserData(user);
            console.log('数据已自动同步');
        } catch (error) {
            console.error('自动同步失败:', error);
            // 静默失败，不打扰用户
        }
    }, 1000);
}

// 使自动同步函数全局可用
window.autoSyncData = autoSyncData;
