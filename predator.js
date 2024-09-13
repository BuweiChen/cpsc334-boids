import { Bird } from "./bird.js";

export class Predator extends Bird {
  constructor(x, y, speed, turnRate, color, size) {
    super(x, y, speed, turnRate, color, size);
  }

  // Predator-specific update method
  update() {
    // Predator moves similarly to birds but faster and with a slower turn rate
    this.position.x += this.velocity.x * 1.5; // Faster speed
    this.position.y += this.velocity.y * 1.5;

    // Screen boundaries collision
    this.boundaries();
  }

  // Method to draw the predator (make it red and bigger)
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size + 10, 0, 2 * Math.PI); // Larger size
    ctx.fillStyle = "red"; // Predator is red
    ctx.fill();
  }
}
