// 激光浣熊 交互脚本

document.addEventListener('DOMContentLoaded', () => {
  // 复制合约地址
  window.copyCA = function() {
    const caEl = document.getElementById('caAddress');
    const hint = document.getElementById('caHint');
    if (!caEl) return;
    const ca = caEl.textContent.trim();
    navigator.clipboard.writeText(ca).then(() => {
      if (hint) {
        const original = hint.textContent;
        hint.textContent = '已复制 ✓';
        hint.style.color = 'var(--neon-green)';
        setTimeout(() => {
          hint.textContent = original;
          hint.style.color = '';
        }, 2000);
      }
    }).catch(() => {
      if (hint) {
        hint.textContent = '复制失败，请手动复制';
        hint.style.color = 'var(--neon-pink)';
      }
    });
  };

  // 移动菜单
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.textContent = '☰';
      });
    });
  }

  // 霓虹股票图表
  const canvas = document.getElementById('memeChart');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    const points = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const progress = i / steps;
      const base = height * 0.75;
      const trend = -progress * height * 0.45;
      const noise = Math.sin(i * 0.8) * height * 0.08;
      const spike = progress > 0.75 ? -height * 0.2 * (progress - 0.75) * 4 : 0;
      points.push({ x, y: base + trend + noise + spike });
    }

    // 网格
    ctx.strokeStyle = 'rgba(57, 255, 20, 0.08)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    for (let i = 0; i <= 8; i++) {
      const x = (i / 8) * width;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 折线渐变
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#39ff14');
    gradient.addColorStop(0.5, '#00f0ff');
    gradient.addColorStop(1, '#bd00ff');

    // 填充区域
    ctx.beginPath();
    ctx.moveTo(points[0].x, height);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, height);
    ctx.closePath();
    const fillGradient = ctx.createLinearGradient(0, 0, 0, height);
    fillGradient.addColorStop(0, 'rgba(57, 255, 20, 0.25)');
    fillGradient.addColorStop(1, 'rgba(57, 255, 20, 0)');
    ctx.fillStyle = fillGradient;
    ctx.fill();

    // 主折线
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 4;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 终点发光点
    const last = points[points.length - 1];
    ctx.beginPath();
    ctx.arc(last.x, last.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#faff00';
    ctx.shadowColor = '#faff00';
    ctx.shadowBlur = 20;
    ctx.fill();

    // 坐标轴标签
    ctx.fillStyle = '#a0a0b8';
    ctx.font = '12px "Noto Sans SC", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('ATH', 60, points[points.length - 1].y + 5);
  }

  // 滚动显示动画
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.about-card, .token-card, .step, .timeline-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // 添加 visible 类样式
  const style = document.createElement('style');
  style.textContent = `
    .about-card.visible,
    .token-card.visible,
    .step.visible,
    .timeline-item.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);
});
