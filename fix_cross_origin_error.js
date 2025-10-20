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

// 添加YouTube API重试机制
let youtubeAPIRetryCount = 0;
const maxRetries = 3;

function retryYouTubeAPILoad() {
    if (youtubeAPIRetryCount < maxRetries) {
        youtubeAPIRetryCount++;
        console.warn(`YouTube API重试加载 (${youtubeAPIRetryCount}/${maxRetries})...`);
        loadYouTubeAPI().catch(() => {
            setTimeout(retryYouTubeAPILoad, 2000);
        });
    } else {
        console.error('YouTube API加载失败，已达到最大重试次数');
    }
}

// 添加YouTube API加载状态检查
function checkYouTubeAPIStatus() {
    if (typeof YT === 'undefined') {
        console.warn('YouTube API未加载，等待加载...');
        return false;
    }
    if (!YT.Player) {
        console.warn('YouTube Player API未就绪，等待就绪...');
        return false;
    }
    return true;
}

// 3. 安全的YouTube API加载函数
function loadYouTubeAPI() {
    // 检查是否已经加载
    if (typeof YT !== 'undefined' && YT.Player) {
        return Promise.resolve();
    }
    
    return new Promise((resolve, reject) => {
        // 移除现有的YouTube API脚本
        const existingScript = document.querySelector('script[src*="youtube.com/iframe_api"]');
        if (existingScript) {
            existingScript.remove();
        }
        
        // 创建script标签加载YouTube API
        const script = document.createElement('script');
        script.src = 'https://www.youtube.com/iframe_api';
        script.async = true;
        script.defer = true;
        
        let timeoutId;
        let checkCount = 0;
        const maxChecks = 50; // 最多检查5秒
        
        script.onload = () => {
            console.log('YouTube API脚本加载完成，等待YT对象...');
            
            // 等待YT对象准备就绪
            const checkYT = () => {
                checkCount++;
                if (typeof YT !== 'undefined' && YT.Player) {
                    clearTimeout(timeoutId);
                    console.log('YouTube API准备就绪');
                    resolve();
                } else if (checkCount < maxChecks) {
                    setTimeout(checkYT, 100);
                } else {
                    clearTimeout(timeoutId);
                    console.error('YouTube API加载超时');
                    reject(new Error('YouTube API加载超时'));
                }
            };
            
            // 设置超时
            timeoutId = setTimeout(() => {
                console.error('YouTube API加载超时');
                reject(new Error('YouTube API加载超时'));
            }, 5000);
            
            checkYT();
        };
        
        script.onerror = () => {
            clearTimeout(timeoutId);
            console.error('YouTube API脚本加载失败');
            reject(new Error('YouTube API脚本加载失败'));
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

// 添加权限策略配置
function configurePermissionsPolicy() {
    // 创建meta标签来配置权限策略
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', 'Permissions-Policy');
    meta.setAttribute('content', 'compute-pressure=(), camera=(), microphone=(), geolocation=(), payment=()');
    document.head.appendChild(meta);
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

// 添加跨域消息处理
function handleCrossOriginMessages() {
    // 监听所有消息事件
    window.addEventListener('message', function(event) {
        // 检查是否是YouTube相关的消息
        if (event.origin && event.origin.includes('youtube.com')) {
            try {
                // 安全地处理YouTube消息
                if (event.data && typeof event.data === 'object') {
                    // 可以在这里处理YouTube播放器的消息
                    console.log('收到YouTube消息:', event.data);
                }
            } catch (error) {
                console.warn('处理YouTube消息时出错:', error);
            }
        }
    });
    
    // 添加postMessage错误处理
    const originalPostMessage = window.postMessage;
    window.postMessage = function(message, targetOrigin, transfer) {
        try {
            return originalPostMessage.call(this, message, targetOrigin, transfer);
        } catch (error) {
            if (error.message.includes('target origin')) {
                console.warn('postMessage跨域错误已忽略:', error.message);
                return;
            }
            throw error;
        }
    };
}

// 7. 添加文件加载错误处理
function handleFileLoadErrors() {
    // 监听所有网络错误
    window.addEventListener('error', function(event) {
        if (event.target && event.target.tagName === 'SCRIPT') {
            console.warn('脚本加载失败:', event.target.src);
        }
    });
    
    // 监听fetch错误
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).catch(error => {
            if (error.message.includes('404')) {
                console.warn('文件未找到:', args[0]);
                // 可以在这里添加备用方案
            }
            throw error;
        });
    };
}

// 8. 初始化安全配置
document.addEventListener('DOMContentLoaded', function() {
    configureIframeSecurity();
    configurePermissionsPolicy();
    handleCrossOriginMessages();
    handleYouTubeAPIError();
    handleFileLoadErrors();
    
    // 延迟检查YouTube API状态
    setTimeout(() => {
        if (typeof YT === 'undefined') {
            console.warn('页面加载后YouTube API仍未就绪，启动重试机制');
            retryYouTubeAPILoad();
        }
    }, 3000);
});

// 导出函数供其他脚本使用
window.safePlayerInit = safePlayerInit;
window.loadYouTubeAPI = loadYouTubeAPI;
window.retryYouTubeAPILoad = retryYouTubeAPILoad;
window.checkYouTubeAPIStatus = checkYouTubeAPIStatus;
