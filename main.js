let width = 150;
let height = 150;
const numBirds = 100;
const visualRange = 100;
const DRAW_TRAIL = true;

let birds = [];

function initBirds() {
  for (let i = 0; i < numBirds; i++) {
    birds.push(BirdFactory.createBird(width, height));
  }
}

function animationLoop() {
  // Update each bird
  for (let bird of birds) {
    bird.update(birds);
  }

  // Clear the canvas and redraw all the birds in their current positions
  const ctx = document.getElementById("simulation").getContext("2d");
  ctx.clearRect(0, 0, width, height);
  for (let bird of birds) {
    bird.drawbird(ctx);
  }

  // Schedule the next frame
  window.requestAnimationFrame(animationLoop);
}

// Called initially and whenever the window resizes to update the canvas
// size and width/height variables.
function sizeCanvas() {
  const canvas = document.getElementById("simulation");
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.onload = () => {
  // Make sure the canvas always fills the whole window
  window.addEventListener("resize", sizeCanvas, false);
  sizeCanvas();

  // Randomly distribute the boids to start
  initBirds();

  // Schedule the main animation loop
  window.requestAnimationFrame(animationLoop);
};
