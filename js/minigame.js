/* =========================================================
   MINI GAME — CYAN TECH RUSH
   Cyan Academic Competition 2026 — Departemen Aksi
========================================================= */

(function () {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resizeGameCanvas() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  resizeGameCanvas();
  window.addEventListener('resize', resizeGameCanvas);

  // Web Audio FX Generator
  let audioCtx = null;
  function playSound(type) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'catch') {
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
      } else if (type === 'bomb') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.25);
      }
    } catch (e) {}
  }

  let isPlaying = false;
  let score = 0;
  let combo = 0;
  let highScore = parseInt(localStorage.getItem('cyanGameHighScore') || '0', 10);
  let timeLeft = 30;
  let gameTimer = null;
  let animId = null;

  // Player Basket
  const player = {
    x: width / 2,
    y: height - 40,
    width: 90,
    height: 16,
    speed: 8
  };

  let items = [];

  // Controls
  const keys = { left: false, right: false };
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = true;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = true;
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') keys.left = false;
    if (e.key === 'ArrowRight' || e.key === 'd') keys.right = false;
  });

  // Touch / Mouse Position Tracking
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left;
  });

  canvas.parentElement.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      player.x = e.touches[0].clientX - rect.left;
    }
  });

  const startBtn = document.getElementById('startGameBtn');
  const gameOverlay = document.getElementById('gameOverlay');
  const gameScoreEl = document.getElementById('gameScore');
  const gameTimerEl = document.getElementById('gameTimer');
  const gameHighScoreEl = document.getElementById('gameHighScore');

  if (gameHighScoreEl) gameHighScoreEl.textContent = highScore;

  function spawnItem() {
    const types = ['cyan', 'cyan', 'cyan', 'gold', 'bomb'];
    const type = types[Math.floor(Math.random() * types.length)];
    items.push({
      x: Math.random() * (width - 30) + 15,
      y: -20,
      radius: type === 'gold' ? 14 : 12,
      speed: Math.random() * 2.5 + 3.5,
      type: type
    });
  }

  function startGame() {
    isPlaying = true;
    score = 0;
    combo = 0;
    timeLeft = 30;
    items = [];
    player.x = width / 2;

    if (gameOverlay) gameOverlay.style.display = 'none';
    if (gameScoreEl) gameScoreEl.textContent = '0';
    if (gameTimerEl) gameTimerEl.textContent = '30s';

    clearInterval(gameTimer);
    gameTimer = setInterval(() => {
      timeLeft--;
      if (gameTimerEl) gameTimerEl.textContent = `${timeLeft}s`;

      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);

    gameLoop();
  }

  function endGame() {
    isPlaying = false;
    clearInterval(gameTimer);
    cancelAnimationFrame(animId);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('cyanGameHighScore', highScore.toString());
      if (gameHighScoreEl) gameHighScoreEl.textContent = highScore;
    }

    if (gameOverlay) {
      gameOverlay.style.display = 'flex';
      gameOverlay.querySelector('h3').textContent = 'GAME OVER!';
      gameOverlay.querySelector('p').innerHTML = `Skor Akhir: <strong style="color:#00F2FE">${score}</strong><br>High Score: ${highScore}`;
    }
  }

  function gameLoop() {
    if (!isPlaying) return;

    ctx.clearRect(0, 0, width, height);

    // Update Player position
    if (keys.left) player.x -= player.speed;
    if (keys.right) player.x += player.speed;
    player.x = Math.max(player.width / 2, Math.min(width - player.width / 2, player.x));

    // Render Player Basket
    ctx.fillStyle = '#00F2FE';
    ctx.shadowColor = '#00F2FE';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(player.x - player.width / 2, player.y, player.width, player.height, 8);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Random Spawn
    if (Math.random() < 0.06) spawnItem();

    // Update & Render Falling Items
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed;

      // Collision Detection with Player
      if (
        item.y + item.radius >= player.y &&
        item.y - item.radius <= player.y + player.height &&
        item.x >= player.x - player.width / 2 &&
        item.x <= player.x + player.width / 2
      ) {
        if (item.type === 'cyan') {
          combo++;
          score += 100 * (1 + Math.floor(combo / 5) * 0.5);
          playSound('catch');
        } else if (item.type === 'gold') {
          combo += 2;
          score += 350;
          playSound('catch');
        } else if (item.type === 'bomb') {
          combo = 0;
          score = Math.max(0, score - 200);
          playSound('bomb');
        }

        if (gameScoreEl) gameScoreEl.textContent = Math.floor(score).toString();
        items.splice(i, 1);
        continue;
      }

      // Missed floor
      if (item.y > height + 20) {
        items.splice(i, 1);
        continue;
      }

      // Render Item
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
      if (item.type === 'cyan') {
        ctx.fillStyle = '#00F2FE';
        ctx.shadowColor = '#00F2FE';
        ctx.shadowBlur = 10;
      } else if (item.type === 'gold') {
        ctx.fillStyle = '#FFD700';
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 12;
      } else {
        ctx.fillStyle = '#FF2A85';
        ctx.shadowColor = '#FF2A85';
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    animId = requestAnimationFrame(gameLoop);
  }

  if (startBtn) startBtn.addEventListener('click', startGame);
})();
