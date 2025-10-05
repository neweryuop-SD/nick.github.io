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
      bgOverlay: "rgba(255, 255, 255, 0.1)",
      cardBg: "rgba(255,255,255,0.25)",
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
      bgOverlay: "rgba(0, 0, 0, 0.3)",
      cardBg: "rgba(32,32,32,0.3)",
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

  // 创建动态背景元素
  const bg = (() => {
    const el = document.createElement("div");
    el.className = "herobgcolor";
    document.body.insertBefore(el, document.body.firstChild);
    
    // 创建覆盖层，增强毛玻璃效果
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
        backdrop-filter: blur(20px) brightness(0.8);
        -webkit-backdrop-filter: blur(20px) brightness(0.8);
        transition: background 0.6s ease;
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

  // 音乐播放器功能
  function initMusicPlayer() {
    // 音乐配置
    const musicConfig = {
      enabled: true,
      autoplay: false,
      loop: true,
      volume: 0.5,
      tracks: [
        {
          name: "宁静钢琴曲",
          artist: "背景音乐",
          url: "https://example.com/music/peaceful-piano.mp3", // 请替换为实际音乐URL
          duration: "3:45"
        },
        {
          name: "轻音乐",
          artist: "背景音乐", 
          url: "https://example.com/music/light-music.mp3", // 请替换为实际音乐URL
          duration: "4:20"
        },
        {
          name: "环境音效",
          artist: "自然声音",
          url: "https://example.com/music/ambient.mp3", // 请替换为实际音乐URL
          duration: "5:10"
        }
      ]
    };

    // 创建音乐播放器UI
    const player = document.createElement('div');
    player.className = 'music-player';
    player.innerHTML = `
      <div class="music-header">
        <div class="music-title">音乐播放器</div>
        <button class="close-btn" title="关闭">×</button>
      </div>
      <div class="music-info">
        <span class="track-title">选择曲目</span>
        <span class="track-artist">点击播放</span>
      </div>
      <div class="music-controls">
        <button class="control-btn prev-btn" title="上一首">⏮</button>
        <button class="control-btn play-btn" title="播放">▶</button>
        <button class="control-btn next-btn" title="下一首">⏭</button>
      </div>
      <div class="progress-container">
        <span class="time-display current-time">0:00</span>
        <div class="progress-bar">
          <div class="progress"></div>
        </div>
        <span class="time-display total-time">0:00</span>
      </div>
      <div class="volume-controls">
        <button class="volume-btn" title="音量">🔊</button>
        <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="${musicConfig.volume}">
      </div>
      <div class="playlist">
        <button class="playlist-toggle">
          <span>播放列表</span>
          <span>▼</span>
        </button>
        <div class="playlist-items"></div>
      </div>
    `;
    
    document.body.appendChild(player);
    
    // 创建音频元素
    const audio = new Audio();
    audio.volume = musicConfig.volume;
    audio.loop = musicConfig.loop;
    
    // 播放器状态
    let currentTrackIndex = 0;
    let isPlaying = false;
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    // 初始化播放列表
    const playlistItems = player.querySelector('.playlist-items');
    musicConfig.tracks.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = 'playlist-item';
      if (index === 0) item.classList.add('active');
      item.innerHTML = `
        <span>${track.name}</span>
        <span class="track-duration">${track.duration}</span>
      `;
      item.addEventListener('click', () => {
        loadTrack(index);
        if (isPlaying) audio.play();
      });
      playlistItems.appendChild(item);
    });
    
    // 加载并播放指定曲目
    function loadTrack(index) {
      if (musicConfig.tracks[index]) {
        currentTrackIndex = index;
        const track = musicConfig.tracks[index];
        audio.src = track.url;
        
        // 更新UI
        player.querySelector('.track-title').textContent = track.name;
        player.querySelector('.track-artist').textContent = track.artist;
        player.querySelector('.total-time').textContent = track.duration;
        player.querySelector('.current-time').textContent = '0:00';
        player.querySelector('.progress').style.width = '0%';
        
        // 更新播放列表活跃状态
        document.querySelectorAll('.playlist-item').forEach((item, i) => {
          if (i === index) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });
      }
    }
    
    // 播放/暂停音乐
    function togglePlay() {
      if (isPlaying) {
        audio.pause();
        player.querySelector('.play-btn').textContent = '▶';
      } else {
        // 如果没有加载曲目，加载第一首
        if (!audio.src) {
          loadTrack(0);
        }
        audio.play().catch(error => {
          console.log('播放失败:', error);
        });
        player.querySelector('.play-btn').textContent = '⏸';
      }
      isPlaying = !isPlaying;
    }
    
    // 下一首
    function nextTrack() {
      let nextIndex = currentTrackIndex + 1;
      if (nextIndex >= musicConfig.tracks.length) {
        nextIndex = 0;
      }
      loadTrack(nextIndex);
      if (isPlaying) {
        audio.play();
      }
    }
    
    // 上一首
    function prevTrack() {
      let prevIndex = currentTrackIndex - 1;
      if (prevIndex < 0) {
        prevIndex = musicConfig.tracks.length - 1;
      }
      loadTrack(prevIndex);
      if (isPlaying) {
        audio.play();
      }
    }
    
    // 设置音量
    function setVolume(value) {
      audio.volume = value;
      const volumeBtn = player.querySelector('.volume-btn');
      if (value == 0) {
        volumeBtn.textContent = '🔇';
      } else if (value < 0.5) {
        volumeBtn.textContent = '🔈';
      } else {
        volumeBtn.textContent = '🔊';
      }
    }
    
    // 更新进度条
    function updateProgress() {
      if (audio.duration) {
        const percent = (audio.currentTime / audio.duration) * 100;
        player.querySelector('.progress').style.width = percent + '%';
        
        // 更新时间显示
        const formatTime = (seconds) => {
          const mins = Math.floor(seconds / 60);
          const secs = Math.floor(seconds % 60);
          return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        };
        
        player.querySelector('.current-time').textContent = formatTime(audio.currentTime);
      }
    }
    
    // 拖动播放器功能
    function initDragging() {
      player.addEventListener('mousedown', startDrag);
      player.addEventListener('touchstart', startDrag);
      
      function startDrag(e) {
        isDragging = true;
        player.classList.add('dragging');
        
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        const rect = player.getBoundingClientRect();
        dragOffset.x = clientX - rect.left;
        dragOffset.y = clientY - rect.top;
        
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('touchmove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
        
        e.preventDefault();
      }
      
      function doDrag(e) {
        if (!isDragging) return;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (clientX && clientY) {
          const x = clientX - dragOffset.x;
          const y = clientY - dragOffset.y;
          
          // 限制在视口范围内
          const maxX = window.innerWidth - player.offsetWidth;
          const maxY = window.innerHeight - player.offsetHeight;
          
          player.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
          player.style.right = 'auto';
          player.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
          player.style.bottom = 'auto';
        }
        
        e.preventDefault();
      }
      
      function stopDrag() {
        isDragging = false;
        player.classList.remove('dragging');
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('touchmove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
      }
    }
    
    // 绑定事件
    player.querySelector('.play-btn').addEventListener('click', togglePlay);
    player.querySelector('.next-btn').addEventListener('click', nextTrack);
    player.querySelector('.prev-btn').addEventListener('click', prevTrack);
    player.querySelector('.volume-slider').addEventListener('input', (e) => {
      setVolume(parseFloat(e.target.value));
    });
    player.querySelector('.volume-btn').addEventListener('click', () => {
      const slider = player.querySelector('.volume-slider');
      slider.value = audio.volume > 0 ? 0 : 0.5;
      setVolume(parseFloat(slider.value));
    });
    player.querySelector('.close-btn').addEventListener('click', () => {
      player.style.display = 'none';
      audio.pause();
      isPlaying = false;
      player.querySelector('.play-btn').textContent = '▶';
    });
    
    // 进度条点击跳转
    player.querySelector('.progress-bar').addEventListener('click', (e) => {
      if (!audio.duration) return;
      
      const rect = e.target.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audio.currentTime = percent * audio.duration;
    });
    
    // 播放列表切换
    player.querySelector('.playlist-toggle').addEventListener('click', (e) => {
      const playlist = player.querySelector('.playlist');
      playlist.classList.toggle('open');
      e.target.querySelector('span:last-child').textContent = 
        playlist.classList.contains('open') ? '▲' : '▼';
    });
    
    // 音频事件监听
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', () => {
      if (musicConfig.loop) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    });
    
    // 初始化拖动功能
    initDragging();
    
    // 初始化加载第一首曲目（但不自动播放）
    loadTrack(0);
  }

  // 在DOM加载完成后执行
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", () => {
      rebuildCards();
      initMusicPlayer();
    });
  } else {
    rebuildCards();
    initMusicPlayer();
  }

  // 移除UI挂起状态
  document.documentElement.removeAttribute("data-ui-pending");
})();