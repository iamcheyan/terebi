<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.Properties" %>
<%@ page import="java.io.InputStream" %>
<%@ page import="java.io.IOException" %>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Terebi</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <!-- 添加 favicon -->
    <link rel="icon" href="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgcng9IjgiIHJ5PSI4IiBmaWxsPSIjMzMzMzMzIiBzdHJva2U9IiM0NDQ0NDQiIHN0cm9rZS13aWR0aD0iMSIvPjxyZWN0IHg9IjEyIiB5PSIxMiIgd2lkdGg9Ijc2IiBoZWlnaHQ9Ijc2IiByeD0iNiIgcnk9IjYiIGZpbGw9IiMyYTJhMmEiLz48cmVjdCB4PSIxNSIgeT0iMTUiIHdpZHRoPSI3MCIgaGVpZ2h0PSI1MCIgcng9IjIiIHJ5PSIyIiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9IiMyMjIyMjIiIHN0cm9rZS13aWR0aD0iMC41Ii8+PHJlY3QgeD0iMTUiIHk9IjE1IiB3aWR0aD0iMTQiIGhlaWdodD0iNTAiIGZpbGw9IiNmZmZmMDAiLz48cmVjdCB4PSIyOSIgeT0iMTUiIHdpZHRoPSIxNCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzAwZmYwMCIvPjxyZWN0IHg9IjQzIiB5PSIxNSIgd2lkdGg9IjE0IiBoZWlnaHQ9IjUwIiBmaWxsPSIjZmY2OWI0Ii8+PHJlY3QgeD0iNTciIHk9IjE1IiB3aWR0aD0iMTQiIGhlaWdodD0iNTAiIGZpbGw9IiNmZjAwMDAiLz48cmVjdCB4PSI3MSIgeT0iMTUiIHdpZHRoPSIxNCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzQxNjlMMSIvPjxyZWN0IHg9IjE1IiB5PSI3MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjE1IiByeD0iMiIgcnk9IjIiIGZpbGw9IiMyMjIyMjIiLz48Y2lyY2xlIGN4PSIyNSIgY3k9Ijc3LjUiIHI9IjMiIGZpbGw9IiM0NDQ0NDQiIHN0cm9rZT0iIzU1NTU1NSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48Y2lyY2xlIGN4PSI0MCIgY3k9Ijc3LjUiIHI9IjMiIGZpbGw9IiM0NDQ0NDQiIHN0cm9rZT0iIzU1NTU1NSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48Y2lyY2xlIGN4PSI1NSIgY3k9Ijc3LjUiIHI9IjMiIGZpbGw9IiM0NDQ0NDQiIHN0cm9rZT0iIzU1NTU1NSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48Y2lyY2xlIGN4PSI3NSIgY3k9Ijc3LjUiIHI9IjQiIGZpbGw9IiM2NjY2NjYiIHN0cm9rZT0iIzc3Nzc3NyIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48Y2lyY2xlIGN4PSI3NSIgY3k9Ijc3LjUiIHI9IjIiIGZpbGw9IiM1NTU1NTUiLz48bGluZSB4MT0iMzAiIHkxPSIxMCIgeDI9IjQwIiB5Mj0iMCIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjEuNSIvPjxsaW5lIHgxPSI3MCIgeTE9IjEwIiB4Mj0iNjAiIHkyPSIwIiBzdHJva2U9IiM2NjY2NjYiIHN0cm9rZS13aWR0aD0iMS41Ii8+PC9zdmc+" type="image/svg+xml">
    
    <!-- 基础样式 - 所有设备都加载 -->
    <link rel="stylesheet" href="styles/main.css">
    
</head>
<body>
    <div class="container">
        <div class="main-content">
            <div class="fixed-box">
                <jsp:include page="header.jsp" />
                <div class="left-column">
                    <div class="box-container">
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
                    
                </div>
                 <%-- <!-- footer -->
                <footer class="footer">
                    <div style="display: inline-block; padding-left: 10px; zoom: 0.5; position: relative;">
                        <a href="https://github.com/iamcheyan/terebi" target="_blank" title="GitHubでソースコードを見る">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                        </a>
                    </div>
                    <a href="https://iamcheyan.com/">Cheyan</a> All Rights Reserved
                </footer> --%>
            </div>
            <div class="right-column">
                <div class="channel-list-title">
                    チャンネルリスト
                </div>
                
                <!-- 添加搜索输入框 -->
                <input type="text" id="channelSearch" placeholder="チャンネルを検索..." onkeyup="filterChannels()">
                
                <div id="channelSelector">
                    <div id="channelCategories">
                        <!-- 频道分类将在这里显示 -->
                    </div>
                </div>
                <%-- <footer class="footer" style="display: none;">
                    <div style="display: inline-block; padding-left: 10px; zoom: 0.5; position: relative;">
                        <a href="https://github.com/iamcheyan/terebi" target="_blank" title="GitHubでソースコードを見る">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path></svg>
                        </a>
                    </div>
                    <a href="https://iamcheyan.com/">Cheyan</a> All Rights Reserved
                </footer> --%>
            </div>
        </div>
    </div>
    
    <div id="fullscreenButton" class="fullscreen-button">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M4 4h4v2H6v2H4V4zm0 16h4v-2H6v-2H4v4zm16-16h-4v2h2v2h2V4zm0 16h-4v-2h2v-2h2v4z" fill="white"/>
        </svg>
    </div>

    
    <%-- <!-- 添加频道列表折叠/展开按钮 -->
    <div id="toggleChannelList" class="toggle-channel-list">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
        </svg>
    </div>
     --%>
   
    
    <script src="scripts/main.js"></script>
    
    <script>
    function filterChannels() {
        var input, filter, channelCategories, channels, i, txtValue;
        input = document.getElementById('channelSearch');
        filter = input.value.toUpperCase();
        channelCategories = document.getElementById('channelCategories');
        channels = channelCategories.getElementsByTagName('div'); // 假设每个频道是一个 div

        for (i = 0; i < channels.length; i++) {
            txtValue = channels[i].textContent || channels[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                channels[i].style.display = "";
            } else {
                channels[i].style.display = "none";
            }
        }
    }
    </script>
    
</body>
</html> 