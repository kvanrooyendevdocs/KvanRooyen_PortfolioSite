const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const dots = [];
const mouse = { x: canvas.width / 2, y: canvas.height / 2, down: false };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener("mousedown", () => (mouse.down = true));
window.addEventListener("mouseup", () => (mouse.down = false));

window.addEventListener("click", (e) => {
  for (let i = 0; i < 10; i++) {
    dots.push({
      x: e.clientX,
      y: e.clientY,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      r: 2 + Math.random() * 3
    });
  }
});

function step() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background fade (nice feel)
  ctx.fillStyle = "rgba(11, 12, 16, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Physics
  for (const d of dots) {
    if (mouse.down) {
      const dx = mouse.x - d.x;
      const dy = mouse.y - d.y;
      const dist = Math.max(20, Math.hypot(dx, dy));
      const pull = 1200 / (dist * dist); // inverse-square
      d.vx += (dx / dist) * pull;
      d.vy += (dy / dist) * pull;
    }

    // gravity
    d.vy += 0.06;

    // integrate
    d.x += d.vx;
    d.y += d.vy;

    // friction
    d.vx *= 0.99;
    d.vy *= 0.99;

    // bounce walls
    if (d.x < 0 || d.x > canvas.width) d.vx *= -0.9;
    if (d.y < 0 || d.y > canvas.height) d.vy *= -0.9;

    d.x = Math.max(0, Math.min(canvas.width, d.x));
    d.y = Math.max(0, Math.min(canvas.height, d.y));

    // draw
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(232, 232, 232, 0.9)";
    ctx.fill();
  }

  requestAnimationFrame(step);
}
step();
