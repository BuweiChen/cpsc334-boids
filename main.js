import { BirdFactory } from "./bird.js";
import { Predator } from "./predator.js";

const canvas = document.getElementById("simulation");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const birds = [];

// Create 50 birds
for (let i = 0; i < 50; i++) {
  birds.push(BirdFactory.createBird());
}

// Create the predator
const predator = new Predator(
  Math.random() * window.innerWidth,
  Math.random() * window.innerHeight,
  4, // Faster speed
  0.02, // Slower turn rate
  "red",
  15 // Larger size
);

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update and draw birds
  birds.forEach((bird) => {
    if (detectCollision(bird, predator)) {
      handleCollision(bird);
    }
    bird.update();
    bird.draw(ctx);
  });

  // Update and draw predator
  predator.update();
  predator.draw(ctx);

  requestAnimationFrame(loop);
}

// Start the simulation
loop();

function detectCollision(bird, predator) {
  const dist = Math.hypot(
    bird.position.x - predator.position.x,
    bird.position.y - predator.position.y
  );
  return dist < bird.size + predator.size;
}

function handleCollision(bird) {
  bird.velocity.x = 0; // Stop horizontal movement
  bird.velocity.y = Math.max(bird.velocity.y, 2); // Simulate gravity (minimum downward speed)
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
