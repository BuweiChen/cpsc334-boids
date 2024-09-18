// TODO: make predator have more vision, have some sort of reproductive mechanism for prey

let width = 150;
let height = 150;
const numBirds = 100;
const DRAW_TRAIL = true;

let prey_birds = [];
let all_birds;

function initBirds() {
  for (let i = 0; i < numBirds; i++) {
    prey_birds.push(BirdFactory.createBird(width, height));
  }
  all_birds = prey_birds.slice();
  all_birds.push(new Predator(width, height));
}

function animationLoop() {
  // Update each bird
  for (let bird of all_birds) {
    bird.update(prey_birds, all_birds[all_birds.length - 1]);
  }

  // Clear the canvas and redraw all the birds in their current positions
  const ctx = document.getElementById("simulation").getContext("2d");
  ctx.clearRect(0, 0, width, height);
  for (let bird of all_birds) {
    bird.drawbird(ctx);
  }

  prey_birds = prey_birds.filter((bird) => !bird.dead);

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

  initBirds();

  console.log(width, height);

  // Schedule the main animation loop
  window.requestAnimationFrame(animationLoop);
};
