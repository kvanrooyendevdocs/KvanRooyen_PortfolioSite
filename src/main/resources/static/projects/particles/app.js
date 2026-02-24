const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const particles = [];
const mouse = { x: canvas.width/2, y: canvas.height/2 };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function spawn() {
  for (let i = 0; i < 6; i++) {
    particles.push({
      x: mouse.x,
      y: mouse.y,
      vx: (Math.random() - 0.5) * 2.2,
      vy: -2.5 - Math.random() * 2.5,
      life: 80 + Math.random() * 40,
      r: 1 + Math.random() * 2
    });
  }
}

function step() {
  // trail effect
  ctx.fillStyle = "rgba(11, 12, 16, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  spawn();

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.vy += 0.04;           // gravity
    p.vx *= 0.995;          // drag
    p.vy *= 0.995;
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(232,232,232,0.85)";
    ctx.fill();

    if (p.life <= 0 || p.y > canvas.height + 50) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(step);
}
step();