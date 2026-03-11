const canvas = document.getElementById("c");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createLetters();
}

window.addEventListener("resize", resize);

const mouse = {
  x: -9999,
  y: -9999
};

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseleave", () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

const text = "MAGNET LETTERS";
const letters = [];
const spacing = 42;

//need this function as each letter is its own object and need to move independantly
function createLetters() {
  letters.length = 0;

  ctx.font = "bold 48px Arial";
  ctx.textBaseline = "middle";

  const totalWidth = text.length * spacing;
  const startX = canvas.width / 2 - totalWidth / 2;
  const y = canvas.height / 2;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    letters.push({
    //what do draw
      char: char,
     // current pos
      x: startX + i * spacing,
      y: y,
      //home pos / base pos
      baseX: startX + i * spacing,
      baseY: y,
      //movement speed
      vx: 0,
      vy: 0
    });
  }
}

function updateLetter(letter) {
//the actual magnet effect
  const dx = mouse.x - letter.x;
  const dy = mouse.y - letter.y;
  //uses pythag for a straight line distance from mouse to letter
  const distance = Math.hypot(dx, dy);

//how big area of effect
  const magnetRadius = 160;

//only react if the mouse is close enough
  if (distance < magnetRadius) {
  //increases magnet force the closer the mouse is
    const force = (magnetRadius - distance) / magnetRadius;

//here is what actually moves the letters in the effect.
    letter.vx -= (dx / distance) * force * 0.6;
    letter.vy -= (dy / distance) * force * 0.6;
  }

//what wrings them back to home position
  const returnStrength = 0.03;
  letter.vx += (letter.baseX - letter.x) * returnStrength;
  letter.vy += (letter.baseY - letter.y) * returnStrength;

//reduces speed each frame to smooth motion
  letter.vx *= 0.9;
  letter.vy *= 0.9;

  letter.x += letter.vx;
  letter.y += letter.vy;
}

function drawLetter(letter) {
  const dx = mouse.x - letter.x;
  const dy = mouse.y - letter.y;
  const distance = Math.hypot(dx, dy);

  let glow = 0;
  if (distance < 180) {
    glow = (180 - distance) / 180;
  }

  ctx.save();
  ctx.fillStyle = `rgba(232,232,232,${0.85 + glow * 0.15})`;
  ctx.shadowColor = "rgba(255,255,255,0.35)";
  ctx.shadowBlur = glow * 18;
  ctx.fillText(letter.char, letter.x, letter.y);
  ctx.restore();
}

function step() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 48px Arial";
  ctx.textBaseline = "middle";

  for (const letter of letters) {
    updateLetter(letter);
    drawLetter(letter);
  }

  requestAnimationFrame(step);
}

resize();
step();