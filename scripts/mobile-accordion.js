document.addEventListener('DOMContentLoaded', function() {
    // 无论是否为移动设备，都初始化折叠功能
    // 移除设备检测条件，确保功能始终生效
    initChannelAccordion();
    console.log('频道折叠功能已初始化');
});

function initChannelAccordion() {
    // 获取所有频道分类标题
    const sectionHeaders = document.querySelectorAll('.channel-section h3');
    console.log('找到频道标题数量:', sectionHeaders.length);
    
    // 默认情况下，只展开第一个分类，折叠其他所有分类
    const channelSections = document.querySelectorAll('.channel-section');
    channelSections.forEach((section, index) => {
        const channelList = section.querySelector('.channel-list');
        if (index !== 0) {
            channelList.style.display = 'none';
            section.classList.add('collapsed');
        } else {
            section.classList.add('expanded');
        }
    });
    
    // 为每个标题添加点击事件
    sectionHeaders.forEach(header => {
        // 添加展开/折叠指示器
        let indicator = header.querySelector('.accordion-indicator');
        if (!indicator) {
            indicator = document.createElement('span');
            indicator.className = 'accordion-indicator';
            header.appendChild(indicator);
        }
        
        // 移除旧的事件监听器（如果有）
        const newHeader = header.cloneNode(true);
        header.parentNode.replaceChild(newHeader, header);
        
        // 添加新的点击事件
        newHeader.addEventListener('click', function(event) {
            console.log('标题被点击:', this.textContent);
            
            const parentSection = this.parentElement;
            const channelList = parentSection.querySelector('.channel-list');
            const isCollapsed = parentSection.classList.contains('collapsed');
            
            // 折叠所有其他分类
            channelSections.forEach(section => {
                if (section !== parentSection) {
                    const list = section.querySelector('.channel-list');
                    list.style.display = 'none';
                    section.classList.remove('expanded');
                    section.classList.add('collapsed');
                }
            });
            
            // 展开/折叠当前分类
            if (isCollapsed) {
                channelList.style.display = 'flex';
                parentSection.classList.remove('collapsed');
                parentSection.classList.add('expanded');
            } else {
                channelList.style.display = 'none';
                parentSection.classList.remove('expanded');
                parentSection.classList.add('collapsed');
            }
            
            // 阻止事件冒泡
            event.stopPropagation();
        });
    });
    
    // 确保指示器不会触发额外的点击事件
    document.querySelectorAll('.accordion-indicator').forEach(indicator => {
        indicator.addEventListener('click', function(event) {
            event.stopPropagation();
            // 手动触发父元素的点击事件
            this.parentElement.click();
        });
    });
}

// 在页面加载后延迟执行，确保动态生成的元素也能被处理
window.addEventListener('load', function() {
    setTimeout(initChannelAccordion, 500);
}); 