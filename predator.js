class Predator extends Bird {
  constructor(width, height) {
    super(
      width,
      height,
      150,
      6,
      0.8,
      0.001,
      -0.02,
      0,
      150,
      0,
      (1.75 * Math.min(width, height)) / 600,
      "#FF0000"
    );
  }

  avoidOthers(birds) {
    let bird = this;
    let moveX = 0;
    let moveY = 0;
    for (let otherbird of birds) {
      if (otherbird !== bird) {
        if (bird.distance(otherbird) < this.minDistance) {
          moveX += bird.x - otherbird.x;
          moveY += bird.y - otherbird.y;
        }
      }
    }

    bird.dx += moveX * this.avoidFactor;
    bird.dy += moveY * this.avoidFactor;
  }

  avoidPredator(predator) {
    return;
  }

  update(birds, predator) {
    // Update the velocities according to each rule
    this.flyTowardsCenter(birds);
    this.avoidOthers(birds);
    this.matchVelocity(birds);
    this.limitSpeed();
    this.keepWithinBounds();

    // Update the position based on the current velocity
    this.x += this.dx;
    this.y += this.dy;
    this.history.push([this.x, this.y]);
    this.history = this.history.slice(-30);
  }
}
