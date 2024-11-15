// Canvas setup
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 620; // Fixed width
canvas.height = 480; // Fixed height

// Game Variables
let isPaused = false;
let isDarkMode = false;
let FPS = 40;
let pipes = [];
let gameMode = "prestart";
let timeGameLastRunning;
let bottomBarOffset = 0;
let bird;

// Pause Button Logic
document.getElementById("pauseButton").addEventListener("click", () => {
  isPaused = !isPaused;
});

// Dark Mode Toggle Logic
document.getElementById("darkModeToggle").addEventListener("click", () => {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle("dark-mode");
});

// Sprite Class
class Sprite {
  constructor(imgUrl) {
    this.x = 0;
    this.y = 0;
    this.visible = true;
    this.velocityX = 0;
    this.velocityY = 0;
    this.img = new Image();
    this.img.src = imgUrl || "";
    this.angle = 0;
    this.flipV = false;
    this.flipH = false;
  }

  draw() {
    if (!this.visible) return;
    ctx.save();
    ctx.translate(this.x + this.img.width / 2, this.y + this.img.height / 2);
    ctx.rotate((this.angle * Math.PI) / 180);
    if (this.flipV) ctx.scale(1, -1);
    if (this.flipH) ctx.scale(-1, 1);
    ctx.drawImage(
      this.img,
      -this.img.width / 2,
      -this.img.height / 2,
      this.img.width,
      this.img.height
    );
    ctx.restore();
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}

// Bird Initialization
function initializeBird() {
  bird = new Sprite("http://s2js.com/img/etc/flappybird.png");
  bird.x = canvas.width / 3;
  bird.y = canvas.height / 2;
  bird.velocityY = 0;
}

// Reset Game
function resetGame() {
  bird.y = canvas.height / 2;
  pipes = [];
  addPipes();
}

// Pipe Initialization
function addPipes() {
  const gap = 140;
  pipes.push(new Sprite("http://s2js.com/img/etc/flappypipe.png"));
  // Example adding more pipes at intervals
}

// Frame Updates
function gameLoop() {
  if (isPaused) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.update();
  bird.draw();

  requestAnimationFrame(gameLoop);
}

// Initialize Game
function startGame() {
  initializeBird();
  resetGame();
  gameLoop();
}

// Start the Game
startGame();
