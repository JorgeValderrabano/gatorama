// =====================================================================
// CONFETTI SYSTEM
// =====================================================================
class ConfettiSystem {
  constructor() {
    this.canvas = document.getElementById('confetti-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst() {
    const colors = ['#ff8a5c', '#ffb4a2', '#ffd166', '#ef476f', '#88c5a4', '#f5ebd6'];
    const shapes = ['rect', 'circle', 'star'];

    // Multi-burst sequence
    for (let burst = 0; burst < 4; burst++) {
      setTimeout(() => {
        const cx = this.canvas.width / 2 + (Math.random() - 0.5) * 250;
        const cy = this.canvas.height * 0.4 + (Math.random() - 0.5) * 100;

        for (let i = 0; i < 70; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 7 + Math.random() * 16;
          this.particles.push({
            x: cx, y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 4,
            gravity: 0.28,
            size: 5 + Math.random() * 9,
            color: colors[Math.floor(Math.random() * colors.length)],
            shape: shapes[Math.floor(Math.random() * shapes.length)],
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.35,
            life: 1,
            decay: 0.004 + Math.random() * 0.005,
            flutter: Math.random() * Math.PI * 2
          });
        }
      }, burst * 250);
    }

    if (!this.animating) {
      this.animating = true;
      this.animate();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = this.particles.filter(p => p.life > 0 && p.y < this.canvas.height + 80);

    this.particles.forEach(p => {
      p.flutter += 0.1;
      p.x += p.vx + Math.sin(p.flutter) * 0.5;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.992;
      p.rotation += p.rotSpeed;
      p.life -= p.decay;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.globalAlpha = Math.min(1, p.life * 1.5);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
      } else if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'star') {
        this.drawStar(0, 0, p.size/2);
      }

      this.ctx.restore();
    });

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.animate());
    } else {
      this.animating = false;
    }
  }

  drawStar(x, y, r) {
    this.ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const sx = x + Math.cos(angle) * r;
      const sy = y + Math.sin(angle) * r;
      if (i === 0) this.ctx.moveTo(sx, sy);
      else this.ctx.lineTo(sx, sy);
    }
    this.ctx.closePath();
    this.ctx.fill();
  }
}

const confetti = new ConfettiSystem();
function triggerConfetti() { confetti.burst(); }
