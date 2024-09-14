
class Predator extends Bird {
  constructor(x, y, speed, turnRate, color, size) {
    super(x, y, speed, turnRate, color, size);
  }

  draw(ctx) {
    ctx.save(); // Save the current context state

    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.angle);

    // Draw the predator as a larger triangle pointing in the direction of velocity
    ctx.beginPath();
    ctx.moveTo(0, -this.size - 10); // Top of the triangle (larger)
    ctx.lineTo(this.size / 2 + 10, this.size + 10); // Bottom-right of the triangle
    ctx.lineTo(-this.size / 2 - 10, this.size + 10); // Bottom-left of the triangle
    ctx.closePath();
    ctx.fillStyle = "red";
    ctx.fill();

    ctx.restore(); // Restore the original context state
  }
}
