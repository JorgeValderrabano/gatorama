// =====================================================================
// GAME STATE
// =====================================================================
const state = {
  cards: [],
  flipped: [],
  matched: new Set(),
  moves: 0,
  streak: 0,
  maxStreak: 0,
  startTime: null,
  endTime: null,
  locked: false,
  timerInterval: null,
  started: false,
  timeLimit: 90,                 // 1 minute 30 seconds
  timeRemaining: 90,             // current countdown remaining
  gameOver: false                // true when time runs out
};

const audio = new AudioEngine();

// =====================================================================
// GAME LOGIC
// =====================================================================
function initGame() {
  state.cards = [];
  state.flipped = [];
  state.matched = new Set();
  state.moves = 0;
  state.streak = 0;
  state.maxStreak = 0;
  state.startTime = null;
  state.endTime = null;
  state.locked = false;
  state.started = false;
  state.timeRemaining = state.timeLimit;
  state.gameOver = false;
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }

  // Stop any lingering timeout song from a previous game
  audio.stopTimeoutSong();

  // Hide time-out modal if visible
  document.getElementById('timeout-modal')?.classList.remove('show');

  // 8 cats × 2 = 16 cards
  const indices = [];
  for (let i = 0; i < 8; i++) indices.push(i, i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  state.cards = indices;

  renderBoard();
  updateStats();
  updateTimerDisplay(state.timeLimit);
  document.getElementById('time').classList.remove('time-warning', 'time-critical');

  // Show all cards face up for 2 seconds at the start
  showAllCardsBriefly();
}

function showAllCardsBriefly() {
  // Lock clicks during the preview
  state.locked = true;
  // Flip all cards face up
  document.querySelectorAll('.card-container').forEach(card => {
    card.classList.add('flipped');
  });
  // After 2 seconds, flip them back and unlock
  setTimeout(() => {
    document.querySelectorAll('.card-container').forEach(card => {
      card.classList.remove('flipped');
    });
    state.locked = false;
  }, 2000);
}

function renderBoard() {
  const grid = document.getElementById('card-grid');
  grid.innerHTML = '';
  state.cards.forEach((catIndex, i) => {
    const card = document.createElement('div');
    card.className = 'card-container';
    card.dataset.index = i;
    card.dataset.cat = catIndex;
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back">
          <div class="card-back-silhouette">${catSilhouetteSVG()}</div>
          <div class="card-back-mark">Miau</div>
        </div>
        <div class="card-face card-front">
          ${buildCatSVG(CATS[catIndex])}
          <div class="card-name">${CATS[catIndex].name}</div>
        </div>
      </div>
    `;
    card.addEventListener('click', () => handleCardClick(i));
    grid.appendChild(card);
  });
}

function handleCardClick(index) {
  if (state.locked) return;
  if (state.matched.has(index)) return;
  if (state.flipped.includes(index)) return;
  if (state.flipped.length >= 2) return;
  if (state.gameOver) return;           // no clicks after timeout

  // Start game on first click
  if (!state.started) {
    state.started = true;
    state.startTime = Date.now();
    state.timerInterval = setInterval(updateTimer, 1000);
    audio.startMusic();
  }

  audio.playFlip();
  state.flipped.push(index);

  const cardEl = document.querySelector(`[data-index="${index}"]`);
  cardEl.classList.add('flipped');

  if (state.flipped.length === 2) {
    state.moves++;
    updateStats();
    state.locked = true;

    const [a, b] = state.flipped;
    if (state.cards[a] === state.cards[b]) {
      setTimeout(() => onMatch(a, b), 700);
    } else {
      setTimeout(() => onMiss(a, b), 1100);
    }
  }
}

function onMatch(a, b) {
  state.matched.add(a);
  state.matched.add(b);
  state.streak++;
  state.maxStreak = Math.max(state.maxStreak, state.streak);

  audio.playChime();

  if (state.streak >= 2) {
    setTimeout(() => audio.playStreak(state.streak), 150);
    showStreakBanner(state.streak);
  }

  // Float-fade + sparkles
  [a, b].forEach(idx => {
    const cardEl = document.querySelector(`[data-index="${idx}"]`);
    createMatchEffects(cardEl);
    setTimeout(() => cardEl.classList.add('matched'), 50);
  });

  state.flipped = [];
  state.locked = false;
  updateStats();

  // Win check
  if (state.matched.size === state.cards.length) {
    setTimeout(onWin, 1300);
  }
}

function onMiss(a, b) {
  audio.playMiss();

  [a, b].forEach(idx => {
    const cardEl = document.querySelector(`[data-index="${idx}"]`);
    cardEl.classList.add('shake');
  });

  setTimeout(() => {
    [a, b].forEach(idx => {
      const cardEl = document.querySelector(`[data-index="${idx}"]`);
      cardEl.classList.remove('shake', 'flipped');
    });
    state.flipped = [];
    state.locked = false;
    state.streak = 0;
    updateStats();
  }, 700);
}

function createMatchEffects(cardEl) {
  // Ripple
  const ripple = document.createElement('div');
  ripple.className = 'ripple';
  cardEl.appendChild(ripple);
  setTimeout(() => ripple.remove(), 900);

  // Sparkles
  for (let i = 0; i < 6; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    const angle = (i / 6) * Math.PI * 2;
    const dist = 30 + Math.random() * 20;
    sparkle.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
    sparkle.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
    sparkle.style.background = `radial-gradient(circle, ${i % 2 === 0 ? '#ffd166' : '#ff8a5c'}, transparent)`;
    sparkle.style.borderRadius = '50%';
    sparkle.style.boxShadow = `0 0 12px ${i % 2 === 0 ? '#ffd166' : '#ff8a5c'}`;
    cardEl.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
}

function showStreakBanner(streak) {
  const banner = document.getElementById('streak-banner');
  const text = document.getElementById('streak-text');
  const sub = document.getElementById('streak-sub');

  const messages = {
    2: 'DOBLE!', 3: 'TRIPLE!', 4: 'CUADRUPLE!', 5: 'PURR-FECTO!',
    6: 'MEGA RACHA!', 7: 'IMPARABLE!', 8: 'LEGENDARIO!'
  };
  const msg = messages[Math.min(streak, 8)] || `${streak}× COMBO!`;
  text.textContent = msg;
  sub.textContent = `+${streak * 100} bonus`;

  banner.classList.remove('show');
  void banner.offsetWidth;
  banner.classList.add('show');
}

function updateStats() {
  document.getElementById('moves').textContent = state.moves;
  document.getElementById('matches').textContent = state.matched.size / 2;
  document.getElementById('streak').textContent = state.streak;

  const flame = document.getElementById('streak-flame');
  if (state.streak >= 2) flame.classList.add('active');
  else flame.classList.remove('active');
}

function updateTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById('time').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateTimer() {
  if (!state.started || state.gameOver) return;

  state.timeRemaining--;

  // Update display
  updateTimerDisplay(state.timeRemaining);

  // Warning colors
  const timeEl = document.getElementById('time');
  timeEl.classList.remove('time-warning', 'time-critical');
  if (state.timeRemaining <= 15) {
    timeEl.classList.add('time-critical');
  } else if (state.timeRemaining <= 30) {
    timeEl.classList.add('time-warning');
  }

  // Time-out!
  if (state.timeRemaining <= 0) {
    onTimeout();
  }
}

function onTimeout() {
  state.gameOver = true;
  state.endTime = Date.now();

  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }

  audio.stopMusic();
  audio.playTimeoutSong();

  // Populate timeout modal
  document.getElementById('timeout-matches').textContent = state.matched.size / 2;
  document.getElementById('timeout-streak').textContent = state.maxStreak;

  // Show timeout modal
  setTimeout(() => {
    document.getElementById('timeout-modal').classList.add('show');
  }, 600);
}

function onWin() {
  state.endTime = Date.now();
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }

  audio.playWin();

  // Star calculation
  const moves = state.moves;
  let stars = 1;
  if (moves <= 12) stars = 3;
  else if (moves <= 18) stars = 2;

  const elapsed = state.timeLimit - state.timeRemaining;
  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

  document.getElementById('final-moves').textContent = moves;
  document.getElementById('final-time').textContent = timeStr;
  document.getElementById('final-streak').textContent = state.maxStreak;

  // Star rendering
  const container = document.getElementById('stars-container');
  container.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.innerHTML = `
      <svg width="48" height="48" viewBox="0 0 24 24" fill="${i < stars ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    `;
    star.classList.add(i < stars ? 'filled' : 'empty');
    container.appendChild(star);
    setTimeout(() => star.classList.add('show'), 400 + i * 220);
  }

  // Title + message
  const titles = ['Buen intento!', 'Buen trabajo!', 'Purr-fecto!', 'Purr-fecto!'];
  const messages = [
    'Los gatitos aprecian tu esfuerzo.',
    'Encontraste a todos los gatitos!',
    'Una muestra maestra de memoria felina!',
    'Una muestra maestra de memoria felina!'
  ];
  document.getElementById('win-title').textContent = titles[stars];
  document.getElementById('win-message').textContent = messages[stars];

  setTimeout(() => {
    document.getElementById('win-modal').classList.add('show');
    triggerConfetti();
  }, 700);
}