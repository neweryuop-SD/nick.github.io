(function () {
  if (window.__TiengmingModernized) return;
  window.__TiengmingModernized = true;
  console.log("🍏 TiengmingModern 插件已启用 https://code.buxiantang.top/");

  // 定义主题颜色配置
  const themeColors = {
    light: {
      bgGradient: "linear-gradient(135deg, #f4f4f4, #fef2f2, #f4f0ff)",
      // 桌面端背景图
      bgImage: "url('https://neweryuop-sd.github.io/nick.github.io/light.webp')",
      // 移动端背景图 - 竖屏优化
      bgImageMobile: "url('https://neweryuop-sd.github.io/nick.github.io/mobile-light.webp')",
      bgOverlay: "rgba(255, 255, 255, 0)", // 透明覆盖层
      cardBg: "rgba(255,255,255,0.15)", // 稍微增加透明度
      cardBorder: "1px solid rgba(255,255,255,0.2)",
      title: "#1c1c1e",
      summary: "#444",
      meta: "#888"
    },
    dark: {
      bgGradient: "linear-gradient(135deg, #1a1a2b, #222c3a, #2e3950)",
      // 桌面端背景图
      bgImage: "url('https://neweryuop-sd.github.io/nick.github.io/night.webp')",
      // 移动端背景图 - 竖屏优化
      bgImageMobile: "url('https://neweryuop-sd.github.io/nick.github.io/mobile-night.webp')",
      bgOverlay: "rgba(0, 0, 0, 0)", // 透明覆盖层
      cardBg: "rgba(32,32,32,0.15)", // 稍微增加透明度
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

  // 预加载图片函数 - 优化背景图片加载
  function preloadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });
  }

  // 预加载所有背景图片
  async function preloadBackgroundImages() {
    const images = [
      themeColors.light.bgImage.replace("url('", "").replace("')", ""),
      themeColors.light.bgImageMobile.replace("url('", "").replace("')", ""),
      themeColors.dark.bgImage.replace("url('", "").replace("')", ""),
      themeColors.dark.bgImageMobile.replace("url('", "").replace("')", "")
    ];
    
    try {
      await Promise.all(images.map(url => preloadImage(url)));
      console.log("所有背景图片预加载完成");
    } catch (error) {
      console.warn("部分背景图片预加载失败:", error);
    }
  }

  // 创建动态背景元素
  const bg = (() => {
    const el = document.createElement("div");
    el.className = "herobgcolor";
    document.body.insertBefore(el, document.body.firstChild);
    
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
    
    const style = document.createElement("style");
    style.textContent = `
      .herobgcolor {
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
      
      .herobgcolor {
        animation: subtleZoom 60s ease-in-out infinite;
      }

      /* 移动端背景图片填充方式 */
      @media (max-width: 768px) {
        .herobgcolor {
          background-size: cover !important;
          background-position: center !important;
        }
      }
    `;
    document.head.appendChild(style);
    return el;
  })();

  // 应用主题样式的主要函数
  function applyTheme() {
    const mode = getEffectiveMode();
    const theme = themeColors[mode];

    // 根据设备类型选择背景图片
    const isMobile = isMobileDevice();
    const bgImage = isMobile ? theme.bgImageMobile : theme.bgImage;

    // 设置背景
    bg.style.backgroundImage = bgImage;
    const overlay = bg.querySelector('.bg-overlay');
    if (overlay) {
      overlay.style.background = theme.bgOverlay;
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

  // 监听窗口大小变化，切换背景图片
  window.addEventListener('resize', applyTheme);

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

  // 空函数 - 保留原有函数调用但不执行任何操作
  function initMusicPlayer() {
    // 音频播放器功能已移除，此函数为空以保持代码结构
    console.log("音乐播放器功能已禁用");
  }

  // 在DOM加载完成后执行
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", async () => {
      // 预加载背景图片
      await preloadBackgroundImages();
      
      // 隐藏背景加载器
      const bgLoader = document.querySelector('.bg-loader');
      if (bgLoader) {
        bgLoader.style.display = 'none';
      }
      
      rebuildCards();
      initMusicPlayer(); // 保留调用但函数为空
    });
  } else {
    preloadBackgroundImages().then(() => {
      // 隐藏背景加载器
      const bgLoader = document.querySelector('.bg-loader');
      if (bgLoader) {
        bgLoader.style.display = 'none';
      }
    });
    
    rebuildCards();
    initMusicPlayer(); // 保留调用但函数为空
  }

  // 移除UI挂起状态
  document.documentElement.removeAttribute("data-ui-pending");
})();