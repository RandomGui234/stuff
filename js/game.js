// Flappy Bird

class Game {
  constructor() {
    this.score = 0;
    this.best = localStorage.getItem("best");
    this.state = "menu"; // 'menu' | 'running' | 'gameover'
  }

  start() {
    this.score = 0;
    this.state = "running";
    wallsManager.reset();
    player.reset();

    if (this.best === null) {
      this.best = 0;
    }
  }

  endGame() {
    this.state = "gameover";
    if (this.score > this.best) {
      this.best = this.score;
      localStorage.setItem("best", this.best);
    }
  }

  inMenu() {
    return this.state === "menu";
  }
  isRunning() {
    return this.state === "running";
  }
  inGameOver() {
    return this.state === "gameover";
  }

  drawFrame() {
    // score display

    ctx.fillStyle = "lightgreen";
    ctx.fillRect(40, 60, 120, 75);

    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.strokeRect(38, 58, 120, 75);

    ctx.fillStyle = "black";
    ctx.font = "24px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Best: " + this.best, 45, 125);
    ctx.fillText("Score: " + this.score, 45, 90);

    if (this.inMenu()) {
      ctx.fillStyle = "lightgreen";
      ctx.fillRect(cnv.width / 2 - 210, cnv.height / 4, 425, 300);

      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.strokeRect(cnv.width / 2 - 210, cnv.height / 4, 425, 300);

      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.font = "64px sans-serif";
      ctx.fillText("Flappy Clone", cnv.width / 2, cnv.height / 2 - 80);
      ctx.font = "28px sans-serif";
      ctx.fillText("Click to Start", cnv.width / 2, cnv.height / 2 - 20);
    }

    if (this.inGameOver()) {
      ctx.fillStyle = "lightgreen";
      ctx.fillRect(cnv.width / 2 - 210, cnv.height / 3, 425, 300);

      ctx.strokeStyle = "black";
      ctx.lineWidth = 4;
      ctx.strokeRect(cnv.width / 2 - 210, cnv.height / 3, 425, 300);

      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.font = "64px sans-serif";
      ctx.fillText("Game Over", cnv.width / 2, cnv.height / 2 - 80);
      ctx.font = "28px sans-serif";
      ctx.fillText("Score: " + this.score, cnv.width / 2, cnv.height / 2 - 20);
      ctx.fillText("Best: " + this.best, cnv.width / 2, cnv.height / 2 + 20);
      ctx.font = "20px sans-serif";
      ctx.fillText("Click to Restart", cnv.width / 2, cnv.height / 2 + 60);
    }
  }
}

let charImg = document.createElement("img");
charImg.src = "bird.png";

class Player {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.round(cnv.width * 0.18);
    this.y = Math.round(cnv.height / 2 - 25);
    this.w = 70;
    this.h = 50;
    this.color = "#ffcc00";
    this.dy = 0;
    this.a = 0.4; // gravity
    this.jumpSpeed = -6;
  }

  draw() {
    ctx.drawImage(charImg, this.x, this.y, this.w, this.h);
  }

  move() {
    this.dy += this.a;
    this.y += this.dy;

    // check ground
    if (this.y + this.h >= cnv.height) {
      game.endGame(); // GAME OVER
    }

    // check ceiling
    if (this.y <= 0) {
      game.endGame(); // GAME OVER
    }
  }
}

let topPipeImg = document.createElement("img");
topPipeImg.src = "top.png";

let bottomPipeImg = document.createElement("img");
bottomPipeImg.src = "bottom.png";

class Wall {
  constructor(x) {
    this.w = 80;
    this.gap = 150;
    this.x = x || cnv.width + 100;
    this.resetHeight();
    this.speed = 3; // base speed
    this.passed = false;
  }

  resetHeight() {
    const minTop = 40;
    const maxTop = Math.max(80, cnv.height - this.gap - 80);
    this.topHeight = randomInt(minTop, maxTop);
    this.passed = false;
  }

  draw() {
    ctx.drawImage(topPipeImg, this.x, 0, this.w, this.topHeight);
    let bottomY = this.topHeight + this.gap;
    ctx.drawImage(bottomPipeImg, this.x, bottomY, this.w, cnv.height - bottomY);
  }

  move() {
    this.x -= this.speed;
  }

  offscreen() {
    return this.x + this.w < 0;
  }

  collidesWithPlayer(p) {
    const px1 = p.x,
      py1 = p.y,
      pw = p.w,
      ph = p.h;
    const wx1 = this.x,
      ww = this.w;
    const topH = this.topHeight;
    const bottomY = topH + this.gap;

    // check top
    if (px1 < wx1 + ww && px1 + pw > wx1 && py1 < topH) {
      return true;
    }
    // check bottom
    if (px1 < wx1 + ww && px1 + pw > wx1 && py1 + ph > bottomY) {
      return true;
    }
    return false;
  }
}

class WallsManager {
  constructor(num = 3, spacing = 300) {
    this.walls = [];
    this.num = num;
    this.spacing = spacing;
    this.baseSpeed = 3;
    this.init();
  }

  init() {
    this.walls = [];
    for (let i = 0; i < this.num; i++) {
      let x = cnv.width + i * this.spacing;
      this.walls.push(new Wall(x));
    }
  }

  reset() {
    this.init();
    for (let i = 0; i < this.walls.length; i++) {
      this.walls[i].speed = this.baseSpeed;
    }
  }

  draw() {
    for (let i = 0; i < this.walls.length; i++) {
      this.walls[i].draw();
    }
  }

  update(player, game) {
    for (let i = 0; i < this.walls.length; i++) {
      let w = this.walls[i];

      if (game.isRunning()) {
        w.move();
      }

      // scoring
      if (!w.passed && w.x + w.w < player.x) {
        w.passed = true;
        game.score++;

        // speed up every 10 points
        if (game.score % 10 === 0) {
          for (let i = 0; i < this.walls.length; i++) {
            this.walls[i].speed += 1;
          }
        }
      }

      // collision
      if (w.collidesWithPlayer(player)) {
        game.endGame();
      }

      // recycle wall
      if (w.offscreen()) {
        let rightmostX = this.walls[0].x;
        for (let k = 1; k < this.walls.length; k++) {
          if (this.walls[k].x > rightmostX) {
            rightmostX = this.walls[k].x;
          }
        }
        w.x = rightmostX + this.spacing;
        w.resetHeight();
      }
    }
  }
}

function runGame() {
  let bgImg = document.createElement("img");
  bgImg.src = "bg.avif";

  // draw background
  ctx.fillStyle = "#0099CB";
  ctx.fillRect(0, 0, cnv.width, cnv.height);

  ctx.drawImage(bgImg, 0, 5, cnv.width, cnv.height);

  // game elements
  wallsManager.draw();
  player.draw();

  if (game.isRunning()) {
    player.move();
    wallsManager.update(player, game);
  }

  // draw UI/menus/overlays
  game.drawFrame();
}
