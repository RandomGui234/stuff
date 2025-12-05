// Setup and input handling for Flappy Bird game

let cnv = document.getElementById("my-canvas");
let ctx = cnv.getContext("2d");

function resizeCanvas() {
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// create instances
let game = new Game();
let player = new Player();
let wallsManager = new WallsManager(8, 560);

function draw() {
  runGame();
  requestAnimationFrame(draw);
}
window.addEventListener("load", draw);

document.addEventListener("mousedown", jump);

function jump() {
  if (game.isRunning()) {
    player.dy = player.jumpSpeed;
  }
}

document.addEventListener("touchstart", gameKey);
document.addEventListener("mousedown", gameKey);

function gameKey() {
  if (game.inGameOver() || game.inMenu()) {
    game.start();
    return;
  }

  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      if (game.isRunning()) {
        player.dy = player.jumpSpeed;
      }
    }
  });

  if (game.inMenu() && e.code === "Enter") {
    game.start();
    return;
  }
}
