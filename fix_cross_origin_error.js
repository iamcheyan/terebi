// 修复跨域安全错误的解决方案

// 1. 添加错误处理来捕获跨域错误
window.addEventListener('error', function(event) {
    if (event.message && event.message.includes('SecurityError') && event.message.includes('$dialog')) {
        console.warn('检测到跨域安全错误，这通常由浏览器扩展引起:', event.message);
        // 阻止错误冒泡
        event.preventDefault();
        event.stopPropagation();
        return false;
    }
});

// 2. 添加YouTube API加载错误处理
function handleYouTubeAPIError() {
    // 检查YouTube API是否正常加载
    if (typeof YT === 'undefined') {
        console.warn('YouTube API未正确加载，尝试重新加载...');
        loadYouTubeAPI();
    }
}

// 3. 安全的YouTube API加载函数
function loadYouTubeAPI() {
    // 检查是否已经加载
    if (typeof YT !== 'undefined' && YT.Player) {
        return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
        // 创建script标签加载YouTube API
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        
        script.onload = () => {
            // 等待YT对象准备就绪
            const checkYT = () => {
                if (typeof YT !== 'undefined' && YT.Player) {
                    resolve();
                } else {
                    setTimeout(checkYT, 100);
                }
            };
            checkYT();
        };
        
        script.onerror = () => {
            console.error('YouTube API加载失败');
            reject(new Error('YouTube API加载失败'));
        };
        
        document.head.appendChild(script);
    });
}

// 4. 添加iframe安全配置
function configureIframeSecurity() {
    // 为所有iframe添加安全属性
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
        iframe.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
    });
}

// 5. 修复播放器初始化
function safePlayerInit(videoId, containerId) {
    try {
        // 确保容器存在
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('播放器容器不存在:', containerId);
            return null;
        }
        
        // 清理现有播放器
        if (window.player && typeof window.player.destroy === 'function') {
            try {
                window.player.destroy();
            } catch (e) {
                console.warn('清理旧播放器时出错:', e);
            }
        }
        
        // 创建新播放器
        const player = new YT.Player(containerId, {
            videoId: videoId,
            width: '100%',
            height: '100%',
            playerVars: {
                'autoplay': 1,
                'controls': 1,
                'rel': 0,
                'fs': 1,
                'cc_load_policy': 1,
                'cc_lang_pref': 'ja',
                'hl': 'ja',
                'enablejsapi': 1,
                'origin': window.location.origin
            },
            events: {
                'onReady': function(event) {
                    console.log('播放器准备就绪');
                },
                'onError': function(event) {
                    console.error('播放器错误:', event.data);
                }
            }
        });
        
        return player;
    } catch (error) {
        console.error('播放器初始化失败:', error);
        return null;
    }
}

// 6. 添加全局错误处理
window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && event.reason.message && event.reason.message.includes('SecurityError')) {
        console.warn('捕获到未处理的跨域安全错误:', event.reason);
        event.preventDefault();
    }
});

// 7. 初始化安全配置
document.addEventListener('DOMContentLoaded', function() {
    configureIframeSecurity();
    handleYouTubeAPIError();
});

// 导出函数供其他脚本使用
window.safePlayerInit = safePlayerInit;
window.loadYouTubeAPI = loadYouTubeAPI;
