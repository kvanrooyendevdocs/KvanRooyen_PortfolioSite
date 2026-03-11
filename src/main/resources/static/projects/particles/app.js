// canvas set up, the HTML element, and ctx is the 2D drawing tool used to draw shapes
// canvas = paper, ctx = pen
const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

//makes the canvas match the browser size
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

const particles = [];
//keeps track of the mouse position
const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2
};
//listens for the mouse moving around
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

//every frame create 6 random particles
//using random spreads out where they are and what speed
function spawn() {
  for (let i = 0; i < 6; i++) {
    const life = 80 + Math.random() * 40;

    particles.push({
      x: mouse.x,
      y: mouse.y,
      vx: (Math.random() - 0.5) * 2.2,
      vy: -2.5 - Math.random() * 2.5,
      //how many frames the particle should live
      life: life,
      maxLife: life,
      r: 1 + Math.random() * 2,
      hue: 180 + Math.random() * 40
    });
  }
}


function step() {
  // trail effect
  //instead of clearing immediately it becomes gradual
  ctx.fillStyle = "rgba(11, 12, 16, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  spawn();

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    //updates particles each frame to make it look like gravity. Goes up then down
    p.vy += 0.04;           // gravity
    //simulates air resistane and a slow down
    p.vx *= 0.995;          // drag
    p.vy *= 0.995;
    //core movement formula, updates positions
    p.x += p.vx;
    p.y += p.vy;
    //count down
    p.life -= 1;

    const alpha = p.life / p.maxLife;
    //actual drawing of particle
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`;
    ctx.fill();

    //removes dead particles when life reaches zero, or it reaches out of screen
    if (p.life <= 0 || p.y > canvas.height + 50) {
      particles.splice(i, 1);
    }
  }

  //imporvements: opacity depends on remaining life? fades as it dies
  //could add color variations
  //only spawn on click not moving?

  requestAnimationFrame(step);
}
step();