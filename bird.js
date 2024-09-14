class Bird {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.dx = Math.random() * 10 - 5;
    this.dy = Math.random() * 10 - 5;
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
    const turnFactor = 0.3;

    if (bird.x < margin) {
      bird.dx += turnFactor;
    }
    if (bird.x > width - margin) {
      bird.dx -= turnFactor;
    }
    if (bird.y < margin) {
      bird.dy += turnFactor;
    }
    if (bird.y > height - margin) {
      bird.dy -= turnFactor;
    }
  }

  flyTowardsCenter(birds) {
    let bird = this;
    const centeringFactor = 0.002; // adjust velocity by this %

    let centerX = 0;
    let centerY = 0;
    let numNeighbors = 0;

    for (let otherbird of birds) {
      if (bird.distance(otherbird) < visualRange) {
        centerX += otherbird.x;
        centerY += otherbird.y;
        numNeighbors += 1;
      }
    }

    if (numNeighbors) {
      centerX = centerX / numNeighbors;
      centerY = centerY / numNeighbors;

      bird.dx += (centerX - bird.x) * centeringFactor;
      bird.dy += (centerY - bird.y) * centeringFactor;
    }
  }

  avoidOthers(birds) {
    let bird = this;
    const minDistance = 20; // The distance to stay away from other birds
    const avoidFactor = 0.02; // Adjust velocity by this %
    let moveX = 0;
    let moveY = 0;
    for (let otherbird of birds) {
      if (otherbird !== bird) {
        if (bird.distance(otherbird) < minDistance) {
          moveX += bird.x - otherbird.x;
          moveY += bird.y - otherbird.y;
        }
      }
    }

    bird.dx += moveX * avoidFactor;
    bird.dy += moveY * avoidFactor;
  }

  matchVelocity(birds) {
    let bird = this;
    const matchingFactor = 0.02; // Adjust by this % of average velocity

    let avgDX = 0;
    let avgDY = 0;
    let numNeighbors = 0;

    for (let otherbird of birds) {
      if (bird.distance(otherbird) < visualRange) {
        avgDX += otherbird.dx;
        avgDY += otherbird.dy;
        numNeighbors += 1;
      }
    }

    if (numNeighbors) {
      avgDX = avgDX / numNeighbors;
      avgDY = avgDY / numNeighbors;

      bird.dx += (avgDX - bird.dx) * matchingFactor;
      bird.dy += (avgDY - bird.dy) * matchingFactor;
    }
  }

  limitSpeed() {
    let bird = this;
    const speedLimit = 8;

    const speed = Math.sqrt(bird.dx * bird.dx + bird.dy * bird.dy);
    if (speed > speedLimit) {
      bird.dx = (bird.dx / speed) * speedLimit;
      bird.dy = (bird.dy / speed) * speedLimit;
    }
  }

  update(birds) {
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
    console.log(this.x, this.y);
  }

  drawbird(ctx, DRAW_TRAIL) {
    let bird = this;
    const angle = Math.atan2(bird.dy, bird.dx);
    ctx.translate(bird.x, bird.y);
    ctx.rotate(angle);
    ctx.translate(-bird.x, -bird.y);
    ctx.fillStyle = "#558cf4";
    ctx.beginPath();
    ctx.moveTo(bird.x, bird.y);
    ctx.lineTo(bird.x - 15, bird.y + 5);
    ctx.lineTo(bird.x - 15, bird.y - 5);
    ctx.lineTo(bird.x, bird.y);
    ctx.fill();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (DRAW_TRAIL) {
      ctx.strokeStyle = "#558cf466";
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
