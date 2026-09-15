/* =========================================================
   CANVAS BACKGROUND & BUMPER INTRO ANIMATION
   Cyan Academic Competition 2026 — Departemen Aksi
========================================================= */

(function () {
  // 1. BUMPER INTRO CANVAS
  const bCanvas = document.getElementById('bumperCanvas');
  if (bCanvas) {
    const bctx = bCanvas.getContext('2d');
    let bWidth, bHeight;

    function resizeBumper() {
      bWidth = bCanvas.width = window.innerWidth;
      bHeight = bCanvas.height = window.innerHeight;
    }
    resizeBumper();
    window.addEventListener('resize', resizeBumper);

    const bNodes = [];
    const numNodes = 40;

    for (let i = 0; i < numNodes; i++) {
      bNodes.push({
        x: Math.random() * bWidth,
        y: Math.random() * bHeight,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2.5 + 1.5,
      });
    }

    let bAnimId;
    function drawBumper() {
      bctx.clearRect(0, 0, bWidth, bHeight);

      // Grid pattern
      bctx.strokeStyle = 'rgba(0, 242, 254, 0.04)';
      bctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < bWidth; x += gridSize) {
        bctx.beginPath();
        bctx.moveTo(x, 0);
        bctx.lineTo(x, bHeight);
        bctx.stroke();
      }
      for (let y = 0; y < bHeight; y += gridSize) {
        bctx.beginPath();
        bctx.moveTo(0, y);
        bctx.lineTo(bWidth, y);
        bctx.stroke();
      }

      // Connecting lines
      for (let i = 0; i < numNodes; i++) {
        for (let j = i + 1; j < numNodes; j++) {
          const dx = bNodes[i].x - bNodes[j].x;
          const dy = bNodes[i].y - bNodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.3;
            bctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            bctx.lineWidth = 1;
            bctx.beginPath();
            bctx.moveTo(bNodes[i].x, bNodes[i].y);
            bctx.lineTo(bNodes[j].x, bNodes[j].y);
            bctx.stroke();
          }
        }
      }

      // Update & render nodes
      bNodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > bWidth) n.vx *= -1;
        if (n.y < 0 || n.y > bHeight) n.vy *= -1;

        bctx.fillStyle = '#00F2FE';
        bctx.beginPath();
        bctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        bctx.fill();

        // Glow ring
        bctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
        bctx.beginPath();
        bctx.arc(n.x, n.y, n.radius * 2.5, 0, Math.PI * 2);
        bctx.stroke();
      });

      bAnimId = requestAnimationFrame(drawBumper);
    }
    drawBumper();

    // Reveal Bumper Content Sequence
    setTimeout(() => {
      const badge = document.getElementById('bumperBadge');
      const title = document.getElementById('bumperTitle');
      const sub = document.getElementById('bumperSub');
      const line = document.getElementById('bumperLine');

      if (badge) { badge.style.opacity = '1'; badge.style.transform = 'translateY(0)'; }
      if (title) { title.style.opacity = '1'; title.style.transform = 'scale(1)'; }
      if (sub) { sub.style.opacity = '1'; sub.style.transform = 'translateY(0)'; }
      if (line) { line.style.width = '240px'; }
    }, 150);

    // Fadeout & Exit Bumper
    setTimeout(() => {
      const bumper = document.getElementById('bumper');
      if (bumper) {
        bumper.classList.add('exit');
        setTimeout(() => {
          cancelAnimationFrame(bAnimId);
          bumper.style.display = 'none';
          document.body.style.overflow = '';
        }, 600);
      }
    }, 2400);

    document.body.style.overflow = 'hidden';
  }

  // 2. HERO CONSTELLATION CANVAS
  const hCanvas = document.getElementById('heroCanvas');
  if (hCanvas) {
    const hctx = hCanvas.getContext('2d');
    let hWidth, hHeight;

    function resizeHeroCanvas() {
      hWidth = hCanvas.width = hCanvas.parentElement.clientWidth;
      hHeight = hCanvas.height = hCanvas.parentElement.clientHeight;
    }
    resizeHeroCanvas();
    window.addEventListener('resize', resizeHeroCanvas);

    const mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (e) => {
      const rect = hCanvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    const particles = [];
    const particleCount = 65;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * hWidth,
        y: Math.random() * hHeight,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        color: Math.random() > 0.3 ? '#00F2FE' : '#FF2A85',
      });
    }

    function renderHeroCanvas() {
      hctx.clearRect(0, 0, hWidth, hHeight);

      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.25;
            hctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
            hctx.lineWidth = 1;
            hctx.beginPath();
            hctx.moveTo(particles[i].x, particles[i].y);
            hctx.lineTo(particles[j].x, particles[j].y);
            hctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > hWidth) p.vx *= -1;
        if (p.y < 0 || p.y > hHeight) p.vy *= -1;

        // Interactive Mouse repulsion
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            p.x += Math.cos(angle) * force * 3;
            p.y += Math.sin(angle) * force * 3;
          }
        }

        hctx.fillStyle = p.color;
        hctx.beginPath();
        hctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        hctx.fill();
      });

      requestAnimationFrame(renderHeroCanvas);
    }
    renderHeroCanvas();
  }
})();
