export class Bird {
  constructor(x, y, speed, turnRate, color, size) {
    this.position = { x, y };
    this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
    this.speed = speed;
    this.turnRate = turnRate;
    this.color = color;
    this.size = size;
    this.acceleration = { x: 0, y: 0 };
  }

  // Method to update the bird's position
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Screen boundaries collision
    this.boundaries();

    // Update velocity with acceleration (for smooth movement)
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;
  }

  // Method to handle screen boundaries
  boundaries() {
    if (this.position.x < 50 || this.position.x > window.innerWidth - 50) {
      this.velocity.x *= -1;
    }
    if (this.position.y < 50 || this.position.y > window.innerHeight - 50) {
      this.velocity.y *= -1;
    }
  }

  // Method to render the bird on the canvas
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// BirdFactory for creating birds with randomized attributes
export class BirdFactory {
  static createBird() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const speed = Math.random() * 2 + 1; // Random speed between 1 and 3
    const turnRate = Math.random() * 0.1 + 0.01; // Random turn rate
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color
    const size = Math.random() * 5 + 3; // Random size

    return new Bird(x, y, speed, turnRate, color, size);
  }
}
