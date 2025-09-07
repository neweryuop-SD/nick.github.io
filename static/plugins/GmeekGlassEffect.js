// GmeekGlassEffect.js - 玻璃效果功能
(function() {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGlassEffect);
    } else {
        initGlassEffect();
    }
    
    function initGlassEffect() {
        console.log('初始化玻璃效果');
        
        // 添加背景装饰元素
        addBackgroundElements();
        
        // 应用玻璃效果到现有组件
        applyGlassEffect();
        
        // 添加滚动效果
        addScrollEffects();
        
        // 移除UI挂起状态
        document.documentElement.removeAttribute("data-ui-pending");
    }
    
    // 添加背景装饰元素
    function addBackgroundElements() {
        const blob1 = document.createElement('div');
        blob1.className = 'bg-blob blob-1';
        
        const blob2 = document.createElement('div');
        blob2.className = 'bg-blob blob-2';
        
        document.body.appendChild(blob1);
        document.body.appendChild(blob2);
    }
    
    // 应用玻璃效果到现有组件
    function applyGlassEffect() {
        // 为现有组件添加玻璃效果
        const components = document.querySelectorAll('.post-card, .toc, #header, #footer');
        
        components.forEach(component => {
            component.classList.add('glass-component');
        });
        
        // 为主容器添加玻璃效果
        const contentContainer = document.getElementById('content');
        if (contentContainer) {
            contentContainer.classList.add('glass-container');
        }
    }
    
    // 添加滚动效果
    function addScrollEffects() {
        let lastScrollY = window.scrollY;
        const containers = document.querySelectorAll('.glass-container, .glass-component');
        
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const scrollDirection = scrollY > lastScrollY ? 'down' : 'up';
            
            // 根据滚动方向调整模糊度
            containers.forEach(container => {
                if (scrollDirection === 'down') {
                    container.classList.add('scroll-down');
                    container.classList.remove('scroll-up');
                } else {
                    container.classList.add('scroll-up');
                    container.classList.remove('scroll-down');
                }
            });
            
            lastScrollY = scrollY;
        });
    }
})();