// =====================================================================
// BACKGROUND ATMOSPHERE
// =====================================================================
function createPawPrints() {
  const container = document.getElementById('paws-container');
  const pawSvg = `
    <svg viewBox="0 0 32 32" fill="currentColor" width="32" height="32">
      <ellipse cx="16" cy="22" rx="7" ry="6"/>
      <ellipse cx="8" cy="14" rx="3" ry="4"/>
      <ellipse cx="14" cy="8" rx="3" ry="4"/>
      <ellipse cx="20" cy="8" rx="3" ry="4"/>
      <ellipse cx="26" cy="14" rx="3" ry="4"/>
    </svg>
  `;

  for (let i = 0; i < 14; i++) {
    const paw = document.createElement('div');
    paw.className = 'paw';
    paw.innerHTML = pawSvg;
    paw.style.left = (Math.random() * 100) + '%';
    paw.style.animationDuration = (18 + Math.random() * 16) + 's';
    paw.style.animationDelay = (Math.random() * 22) + 's';
    const scale = 0.4 + Math.random() * 1.1;
    paw.style.transform = `scale(${scale})`;
    container.appendChild(paw);
  }

  // Glowing orbs
  const orbColors = [
    'rgba(255, 138, 92, 0.5)',
    'rgba(255, 209, 102, 0.4)',
    'rgba(239, 71, 111, 0.35)',
    'rgba(136, 197, 164, 0.3)'
  ];
  for (let i = 0; i < 6; i++) {
    const orb = document.createElement('div');
    orb.className = 'orb';
    const size = 60 + Math.random() * 120;
    orb.style.width = size + 'px';
    orb.style.height = size + 'px';
    orb.style.background = `radial-gradient(circle, ${orbColors[i % orbColors.length]}, transparent 70%)`;
    orb.style.left = (Math.random() * 100) + '%';
    orb.style.top = (Math.random() * 100) + '%';
    orb.style.animationDuration = (15 + Math.random() * 12) + 's';
    orb.style.animationDelay = (Math.random() * 8) + 's';
    container.appendChild(orb);
  }
}

// =====================================================================
// EVENT WIRING
// =====================================================================
document.getElementById('restart-btn').addEventListener('click', () => {
  document.getElementById('win-modal').classList.remove('show');
  document.getElementById('timeout-modal').classList.remove('show');
  setTimeout(initGame, 200);
});

document.getElementById('play-again-btn').addEventListener('click', () => {
  document.getElementById('win-modal').classList.remove('show');
  setTimeout(initGame, 300);
});

document.getElementById('timeout-play-again-btn').addEventListener('click', () => {
  document.getElementById('timeout-modal').classList.remove('show');
  setTimeout(initGame, 300);
});

let soundEnabled = true;
document.getElementById('sound-btn').addEventListener('click', () => {
  soundEnabled = !soundEnabled;
  audio.setMuted(!soundEnabled);
  document.getElementById('sound-on-icon').style.display = soundEnabled ? 'block' : 'none';
  document.getElementById('sound-off-icon').style.display = soundEnabled ? 'none' : 'block';
});

// =====================================================================
// INITIALIZE
// =====================================================================
createPawPrints();
initGame();
