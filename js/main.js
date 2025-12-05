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

function jump() {
  if (game.isRunning()) {
    player.dy = player.jumpSpeed;
  }
}

document.addEventListener("mousedown", jump);
document.addEventListener("touchstart", gameKey);
document.addEventListener("keydown", gameKey);
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    if (game.isRunning()) {
      player.dy = player.jumpSpeed;
    }
  }
});

function gameKey(e) {
  if (game.inGameOver() && e.code === "Enter") {
    game.start();
    return;
  }

  if (game.inMenu() && e.code === "Enter") {
    game.start();
    return;
  }
}
