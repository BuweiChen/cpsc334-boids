class Predator extends Bird {
  constructor(width, height) {
    super(width, height, 6, 0.25, 0.001, -0.02, 0, visualRange, 0, 1.75, "red");
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
}
