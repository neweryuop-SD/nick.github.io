(function () {
  if (window.__TiengmingModernized) return;
  window.__TiengmingModernized = true;
  console.log("🍏 TiengmingModern 插件已启用 https://code.buxiantang.top/");

  // 获取配置
  const getConfig = () => {
    // 尝试从全局配置获取
    if (window.GMEEK_CONFIG && window.GMEEK_CONFIG.useVideoBackground !== undefined) {
      return window.GMEEK_CONFIG.useVideoBackground;
    }
    
    // 默认启用视频背景
    return true;
  };

  // 定义主题颜色配置
  const themeColors = {
    light: {
      // 视频背景
      bgVideo: "https://neweryuop-sd.github.io/nick.github.io/light-video.mp4",
      // 静态背景图
      bgImage: "url('https://neweryuop-sd.github.io/nick.github.io/light.webp')",
      bgImageMobile: "url('https://neweryuop-sd.github.io/nick.github.io/mobile-light.webp')",
      bgOverlay: "rgba(255, 255, 255, 0.1)",
      cardBg: "rgba(255,255,255,0.15)",
      cardBorder: "1px solid rgba(255,255,255,0.2)",
      title: "#1c1c1e",
      summary: "#444",
      meta: "#888"
    },
    dark: {
      // 视频背景
      bgVideo: "https://neweryuop-sd.github.io/nick.github.io/night-video.mp4",
      // 静态背景图
      bgImage: "url('https://neweryuop-sd.github.io/nick.github.io/night.webp')",
      bgImageMobile: "url('https://neweryuop-sd.github.io/nick.github.io/mobile-night.webp')",
      bgOverlay: "rgba(0, 0, 0, 0.2)",
      cardBg: "rgba(32,32,32,0.15)",
      cardBorder: "1px solid rgba(255,255,255,0.08)",
      title: "#eee",
      summary: "#aaa",
      meta: "#bbb"
    }
  };

  // 获取当前有效主题模式
  function getEffectiveMode() {
    const raw = document.documentElement.getAttribute("data-color-mode");
    if (raw === "light" || raw === "dark") return raw;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // 根据背景色计算合适的文字颜色
  function getTextColor(bg) {
    const rgb = bg.match(/\d+/g);
    if (!rgb) return "#fff";
    const [r, g, b] = rgb.map(Number);
    const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return l > 0.6 ? "#000" : "#fff";
  }

  // 检测是否为移动设备
  function isMobileDevice() {
    return window.innerWidth <= 768;
  }

  // 检测是否启用视频背景
  function shouldUseVideoBackground() {
    const useVideo = getConfig();
    const isMobile = isMobileDevice();
    
    // 如果配置启用视频背景且不是移动设备，则使用视频背景
    return useVideo && !isMobile;
  }

  // 预加载资源函数
  function preloadResource(url, type = 'image') {
    return new Promise((resolve, reject) => {
      if (type === 'video') {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.onloadeddata = resolve;
        video.onerror = reject;
        video.src = url;
      } else {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      }
    });
  }

  // 预加载所有背景资源
  async function preloadBackgroundResources() {
    const useVideo = shouldUseVideoBackground();
    const resources = [];
    
    if (useVideo) {
      // 预加载视频
      resources.push(
        preloadResource(themeColors.light.bgVideo, 'video'),
        preloadResource(themeColors.dark.bgVideo, 'video')
      );
    } else {
      // 预加载图片
      resources.push(
        preloadResource(themeColors.light.bgImage.replace("url('", "").replace("')", "")),
        preloadResource(themeColors.light.bgImageMobile.replace("url('", "").replace("')", "")),
        preloadResource(themeColors.dark.bgImage.replace("url('", "").replace("')", "")),
        preloadResource(themeColors.dark.bgImageMobile.replace("url('", "").replace("')", ""))
      );
    }
    
    try {
      await Promise.all(resources);
      console.log("所有背景资源预加载完成");
    } catch (error) {
      console.warn("部分背景资源预加载失败:", error);
    }
  }

  // 创建动态背景元素
  const createBackground = () => {
    const useVideo = shouldUseVideoBackground();
    
    if (useVideo) {
      // 创建视频背景
      return createVideoBackground();
    } else {
      // 创建图片背景
      return createImageBackground();
    }
  };

  // 创建视频背景
  const createVideoBackground = () => {
    const container = document.createElement("div");
    container.className = "video-bg-container";
    
    // 创建视频元素
    const video = document.createElement("video");
    video.className = "video-bg";
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    
    // 创建加载指示器
    const loader = document.createElement("div");
    loader.className = "bg-loader";
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <div class="loader-text">加载视频背景中...</div>
    `;
    
    // 创建覆盖层
    const overlay = document.createElement("div");
    overlay.className = "bg-overlay";
    
    container.appendChild(video);
    container.appendChild(loader);
    container.appendChild(overlay);
    document.body.insertBefore(container, document.body.firstChild);
    
    const style = document.createElement("style");
    style.textContent = `
      .video-bg-container {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: -1;
        overflow: hidden;
      }
      
      .video-bg {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        min-width: 100%; 
        min-height: 100%;
        width: auto;
        height: auto;
        object-fit: cover;
        transition: opacity 0.8s ease;
      }
      
      .bg-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        transition: background 0.6s ease;
      }
      
      .bg-loader {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(0,0,0,0.5);
        color: white;
        z-index: 2;
      }
      
      .loader-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255,255,255,0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
      }
      
      .loader-text {
        font-size: 14px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      /* 移动端禁用视频背景 */
      @media (max-width: 768px) {
        .video-bg-container {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return {
      container,
      video,
      loader,
      overlay,
      type: 'video'
    };
  };

  // 创建图片背景
  const createImageBackground = () => {
    const el = document.createElement("div");
    el.className = "image-bg-container";
    
    // 创建加载指示器
    const loader = document.createElement("div");
    loader.className = "bg-loader";
    loader.innerHTML = `
      <div class="loader-spinner"></div>
      <div class="loader-text">加载背景中...</div>
    `;
    el.appendChild(loader);
    
    // 创建覆盖层
    const overlay = document.createElement("div");
    overlay.className = "bg-overlay";
    el.appendChild(overlay);
    
    document.body.insertBefore(el, document.body.firstChild);
    
    const style = document.createElement("style");
    style.textContent = `
      .image-bg-container {
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        z-index: -1;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        transition: background-image 0.6s ease;
      }
      
      .bg-overlay {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        transition: background 0.6s ease;
      }
      
      .bg-loader {
        position: absolute;
        top: 0; left: 0;
        width: 100%; height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background: rgba(0,0,0,0.3);
        color: white;
        z-index: 1;
      }
      
      .loader-spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(255,255,255,0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 10px;
      }
      
      .loader-text {
        font-size: 14px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes subtleZoom {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      .image-bg-container {
        animation: subtleZoom 60s ease-in-out infinite;
      }

      /* 移动端背景图片填充方式 */
      @media (max-width: 768px) {
        .image-bg-container {
          background-size: cover !important;
          background-position: center !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return {
      container: el,
      loader,
      overlay,
      type: 'image'
    };
  };

  // 创建背景元素
  const bg = createBackground();

  // 应用主题样式的主要函数
  function applyTheme() {
    const mode = getEffectiveMode();
    const theme = themeColors[mode];
    const useVideo = shouldUseVideoBackground();
    const isMobile = isMobileDevice();

    // 显示加载器
    if (bg.loader) {
      bg.loader.style.display = 'flex';
    }

    if (useVideo && bg.type === 'video') {
      // 设置视频背景
      bg.video.src = theme.bgVideo;
      bg.overlay.style.background = theme.bgOverlay;
      
      // 监听视频加载完成
      bg.video.addEventListener('loadeddata', () => {
        if (bg.loader) {
          bg.loader.style.display = 'none';
        }
      }, { once: true });
      
      // 监听视频错误
      bg.video.addEventListener('error', () => {
        console.error('视频加载失败:', bg.video.src);
        if (bg.loader) {
          bg.loader.querySelector('.loader-text').textContent = '视频加载失败';
          setTimeout(() => {
            bg.loader.style.display = 'none';
          }, 2000);
        }
      }, { once: true });
    } else {
      // 设置图片背景
      const bgImage = isMobile ? theme.bgImageMobile : theme.bgImage;
      bg.container.style.backgroundImage = bgImage;
      bg.overlay.style.background = theme.bgOverlay;
      
      // 图片背景直接隐藏加载器（因为预加载已经完成）
      if (bg.loader) {
        bg.loader.style.display = 'none';
      }
    }

    // 为所有文章卡片应用样式
    document.querySelectorAll(".post-card").forEach(card => {
      card.style.background = theme.cardBg;
      card.style.border = theme.cardBorder;

      const title = card.querySelector(".post-title");
      const summary = card.querySelector(".post-summary");
      const meta = card.querySelector(".post-meta");

      if (title) title.style.color = theme.title;
      if (summary) summary.style.color = theme.summary;
      if (meta) meta.style.color = theme.meta;
    });

    // 设置页头和页脚颜色
    ["#header", "#footer"].forEach(sel => {
      const el = document.querySelector(sel);
      if (el) el.style.color = mode === "dark" ? "#ddd" : "";
    });
  }

  // 监听系统主题变化
  if (document.documentElement.getAttribute("data-color-mode") === "auto") {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
  }

  // 监听html元素属性变化，实时响应主题切换
  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-color-mode"]
  });

  // 监听窗口大小变化，重新应用主题（可能切换移动/桌面模式）
  window.addEventListener('resize', () => {
    const currentUseVideo = shouldUseVideoBackground();
    const bgType = bg.type;
    
    // 如果背景类型需要切换
    if ((currentUseVideo && bgType !== 'video') || (!currentUseVideo && bgType !== 'image')) {
      // 移除现有背景
      bg.container.remove();
      
      // 创建新背景
      const newBg = createBackground();
      Object.assign(bg, newBg);
      
      // 重新应用主题
      applyTheme();
    } else {
      // 只是窗口大小变化，重新应用主题
      applyTheme();
    }
  });

  // 重构卡片：将原始导航项转换为美观的卡片
  function rebuildCards() {
    document.querySelectorAll(".SideNav-item").forEach((card, i) => {
      // 提取卡片信息
      const title = card.querySelector(".listTitle")?.innerText || "未命名文章";
      const link = card.getAttribute("href");
      const labels = [...card.querySelectorAll(".Label")];
      
      // 从标签中提取时间信息
      const time = labels.find(el => /^\d{4}/.test(el.textContent.trim()))?.textContent.trim() || "";
      
      // 处理标签
      const tags = labels.filter(el => el.textContent.trim() !== time).map(el => {
        const tag = el.textContent.trim();
        const bg = el.style.backgroundColor || "#e7c08dff";
        const fg = getTextColor(bg);
        return `<span class="post-tag" style="background-color:${bg};color:${fg}">${tag}</span>`;
      }).join("");

      // 生成摘要文本
      const summary = `本篇内容涵盖主题「${labels.map(x => x.textContent.trim()).join(" / ")}」，带你深入探索相关知识点。`;

      // 创建新的卡片元素
      const newCard = document.createElement("a");
      newCard.href = link;
      newCard.className = "post-card";
      newCard.style.animationDelay = `${i * 60}ms`;
      newCard.innerHTML = `
        <div class="post-meta">${tags}<span class="post-date">${time}</span></div>
        <h2 class="post-title">${title}</h2>
        <p class="post-summary">${summary}</p>
      `;
      
      // 替换原始元素
      card.replaceWith(newCard);
    });

    applyTheme();
  }

  // 在DOM加载完成后执行
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", async () => {
      // 预加载背景资源
      await preloadBackgroundResources();
      
      rebuildCards();
    });
  } else {
    preloadBackgroundResources().then(() => {
      rebuildCards();
    });
  }

  // 移除UI挂起状态
  document.documentElement.removeAttribute("data-ui-pending");
})();