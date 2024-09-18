const gravity = 0.2;

class Bird {
  constructor(
    width,
    height,
    visualRange = 125,
    speedLimit = 8,
    turnFactor = 0.8,
    centeringFactor = 0.002,
    avoidFactor = 0.02,
    pAvoidFactor = 0.01,
    minDistance = 20,
    matchingFactor = 0.02,
    size = Math.min(width, height) / 600,
    color = "#" +
      (0x1000000 + Math.random() * 0xffffff).toString(16).substring(1, 7)
  ) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.dx = Math.random() * 10 - 5;
    this.dy = Math.random() * 10 - 5;
    this.visualRange = visualRange;
    this.color = color;
    this.speedLimit = speedLimit;
    this.turnFactor = turnFactor;
    this.centeringFactor = centeringFactor;
    this.avoidFactor = avoidFactor;
    this.pAvoidFactor = pAvoidFactor;
    this.minDistance = minDistance;
    this.matchingFactor = matchingFactor;
    this.size = size;
    this.dead = false;
    this.history = [];
  }

  distance(bird2) {
    let bird1 = this;
    return Math.sqrt(
      (bird1.x - bird2.x) * (bird1.x - bird2.x) +
        (bird1.y - bird2.y) * (bird1.y - bird2.y)
    );
  }

  nClosestBirds(birds, n) {
    let bird = this;
    // Make a copy
    const sorted = birds.slice();
    // Sort the copy by distance from `bird`
    sorted.sort((a, b) => bird.distance(a) - bird.distance(b));
    // Return the `n` closest
    return sorted.slice(1, n + 1);
  }

  keepWithinBounds() {
    let bird = this;
    const margin = 200;

    if (bird.x < margin) {
      bird.dx += this.turnFactor;
    }
    if (bird.x > width - margin) {
      bird.dx -= this.turnFactor;
    }
    if (bird.y < margin) {
      bird.dy += this.turnFactor;
    }
    if (bird.y > height - margin) {
      bird.dy -= this.turnFactor;
    }
  }

  flyTowardsCenter(birds) {
    let bird = this;

    let centerX = 0;
    let centerY = 0;
    let numNeighbors = 0;

    for (let otherbird of birds) {
      if (bird.distance(otherbird) < this.visualRange) {
        centerX += otherbird.x;
        centerY += otherbird.y;
        numNeighbors += 1;
      }
    }

    if (numNeighbors) {
      centerX = centerX / numNeighbors;
      centerY = centerY / numNeighbors;

      bird.dx += (centerX - bird.x) * this.centeringFactor;
      bird.dy += (centerY - bird.y) * this.centeringFactor;
    }
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
    let moveX = 0;
    let moveY = 0;

    if (this.distance(predator) < this.visualRange) {
      moveX += this.x - predator.x;
      moveY += this.y - predator.y;
    }

    this.dx += moveX * this.pAvoidFactor;
    this.dy += moveY * this.pAvoidFactor;
  }

  matchVelocity(birds) {
    let bird = this;

    let avgDX = 0;
    let avgDY = 0;
    let numNeighbors = 0;

    for (let otherbird of birds) {
      if (bird.distance(otherbird) < this.visualRange) {
        avgDX += otherbird.dx;
        avgDY += otherbird.dy;
        numNeighbors += 1;
      }
    }

    if (numNeighbors) {
      avgDX = avgDX / numNeighbors;
      avgDY = avgDY / numNeighbors;

      bird.dx += (avgDX - bird.dx) * this.matchingFactor;
      bird.dy += (avgDY - bird.dy) * this.matchingFactor;
    }
  }

  limitSpeed() {
    let bird = this;

    const speed = Math.sqrt(bird.dx * bird.dx + bird.dy * bird.dy);
    if (speed > this.speedLimit) {
      bird.dx = (bird.dx / speed) * this.speedLimit;
      bird.dy = (bird.dy / speed) * this.speedLimit;
    }
  }

  update(birds, predator) {
    if (this.distance(predator) < 15 * this.size) {
      this.dead = true;
      this.color = "grey";
    }
    if (!this.dead) {
      // Update the velocities according to each rule
      this.flyTowardsCenter(birds);
      this.avoidOthers(birds);
      this.avoidPredator(predator);
      this.matchVelocity(birds);
      this.limitSpeed();
      this.keepWithinBounds();
    } else {
      this.dy += gravity;
    }

    // Update the position based on the current velocity
    this.x += this.dx;
    this.y += this.dy;
    this.history.push([this.x, this.y]);
    this.history = this.history.slice(-30);
  }

  drawbird(ctx) {
    let bird = this;
    const angle = Math.atan2(bird.dy, bird.dx);
    ctx.translate(bird.x, bird.y);
    ctx.rotate(angle);
    ctx.translate(-bird.x, -bird.y);
    // ctx.fillStyle = "#558cf4";
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(bird.x, bird.y);
    ctx.lineTo(bird.x - 15 * this.size, bird.y + 5 * this.size);
    ctx.lineTo(bird.x - 15 * this.size, bird.y - 5 * this.size);
    ctx.lineTo(bird.x, bird.y);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (DRAW_TRAIL) {
      ctx.lineWidth = 1.3 * this.size;
      ctx.strokeStyle = this.color + "90";
      ctx.beginPath();
      ctx.moveTo(bird.history[0][0], bird.history[0][1]);
      for (const point of bird.history) {
        ctx.lineTo(point[0], point[1]);
      }
      ctx.stroke();
    }
  }
}

// BirdFactory for creating birds with randomized attributes
class BirdFactory {
  static createBird(width, height) {
    // const x = Math.random() * width;
    // const y = Math.random() * height;
    // const dx = Math.random() * 10 - 5;
    // const dy = Math.random() * 10 - 5;
    // const history = [];

    return new Bird(width, height);
  }
}
