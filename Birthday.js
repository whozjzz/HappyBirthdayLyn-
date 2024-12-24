// Select canvas and context
const fireworksCanvas = document.getElementById('fireworks');
const fireworksCtx = fireworksCanvas.getContext('2d');

// Set canvas size
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

// Colors for fireworks
const colors = ['#ff0044', '#ff8000', '#ffff00', '#00ff00', '#00ffff', '#8000ff'];

// Firework constructor
function Firework(x, y) {
  this.x = x;
  this.y = y;
  this.speedX = Math.random() * 6 - 3;
  this.speedY = Math.random() * -8 - 4;
  this.alpha = 1;
  this.color = colors[Math.floor(Math.random() * colors.length)];
  this.particles = [];
  this.trail = [];
  this.exploded = false;
  this.peakY = Math.random() * fireworksCanvas.height / 3 + fireworksCanvas.height / 3;
  this.explosionSize = Math.random() * 30 + 50;

  this.explode = function () {
    if (this.exploded) return;
    this.exploded = true;

    const particleCount = 150 + Math.floor(Math.random() * 100);
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(new Particle(this.x, this.y, this.color, this.explosionSize));
    }
  };

  this.addTrail = function () {
    const trailParticle = {
      x: this.x,
      y: this.y,
      size: Math.random() * 2 + 1,
      alpha: 1,
      speedX: Math.random() * 2 - 1,
      speedY: Math.random() * -2 - 1
    };
    this.trail.push(trailParticle);
  };

  this.update = function () {
    if (this.y <= this.peakY) {
      this.explode();
    }

    if (!this.exploded) {
      this.x += this.speedX;
      this.y += this.speedY;
      this.addTrail();
    } else {
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
      }
    }

    // Draw trail particles
    for (let i = 0; i < this.trail.length; i++) {
      const trailParticle = this.trail[i];
      trailParticle.x += trailParticle.speedX;
      trailParticle.y += trailParticle.speedY;
      trailParticle.alpha -= 0.02;

      fireworksCtx.beginPath();
      fireworksCtx.arc(trailParticle.x, trailParticle.y, trailParticle.size, 0, Math.PI * 2);
      fireworksCtx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${trailParticle.alpha})`;
      fireworksCtx.fill();
    }

    // Draw explosion particles
    if (this.exploded) {
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].draw();
      }
    }
  };
}

// Particle constructor
function Particle(x, y, color, explosionSize) {
  this.x = x;
  this.y = y;
  this.speedX = Math.random() * 6 - 3;
  this.speedY = Math.random() * 6 - 3;
  this.color = color;
  this.size = Math.random() * 3 + 2;
  this.alpha = 1;
  this.gravity = 0.05;
  this.friction = 0.99;

  this.update = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.speedX *= this.friction;
    this.speedY *= this.friction;
    this.alpha -= 0.02;
  };

  this.draw = function () {
    fireworksCtx.beginPath();
    fireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    fireworksCtx.fillStyle = `rgba(${parseInt(this.color.slice(1, 3), 16)}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(this.color.slice(5, 7), 16)}, ${this.alpha})`;
    fireworksCtx.fill();
  };
}

// Array to hold fireworks
let fireworks = [];
let fireworksAnimationStarted = false;

// Create random fireworks
function createFireworks() {
  const x = Math.random() * fireworksCanvas.width;
  const y = fireworksCanvas.height;
  const firework = new Firework(x, y);
  fireworks.push(firework);
}

// Animation loop for fireworks
function animateFireworks() {
  fireworksCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

  for (let i = 0; i < fireworks.length; i++) {
    fireworks[i].update();
  }

  requestAnimationFrame(animateFireworks);
}

// Trigger fireworks on "Happy Birthday" text click
document.querySelector('.neon-button').addEventListener('click', () => {
  document.body.style.backgroundColor = 'black'; // Change background color

  // Start fireworks animation
  if (!fireworksAnimationStarted) {
    fireworksAnimationStarted = true;
    setInterval(createFireworks, 700);
    animateFireworks();
  }
});
