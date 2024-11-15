const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("start-btn");
const themeToggle = document.getElementById("theme-toggle");
const highScoreDisplay = document.getElementById("high-score");

let highScore = localStorage.getItem("highScore") || 0;
highScoreDisplay.textContent = highScore;

const birdImage = new Image();
birdImage.src = "bird.png"; // Replace with your bird sprite

const pipeImage = new Image();
pipeImage.src = "pipe.png"; // Replace with your pipe sprite

const backgroundDay = "day-background.png"; // Replace with a day theme image
const backgroundNight = "night-background.png"; // Replace with a night theme image

const flapSound = new Audio("flap.mp3");
const crashSound = new Audio("crash.mp3");
const scoreSound = new Audio("score.mp3");

// Game variables
let bird = { x: 50, y: 150, width: 30, height: 30, velocity: 0 };
let pipes = [];
let gameInterval;
let gameRunning = false;
let score = 0;
let level = 1;

// Dynamic canvas resizing
function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth * 0.8, 600); // Max width: 600px
  canvas.height = Math.min(window.innerHeight * 0.8, 400); // Max height: 400px
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Game mechanics
function resetGame() {
  bird.y = canvas.height / 2;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  level = 1;
}

function startGame() {
  overlay.style.display = "none";
  gameRunning = true;
  resetGame();
  gameInterval = setInterval(gameLoop, 1000 / 60);
}

function stopGame() {
  gameRunning = false;
  clearInterval(gameInterval);
  updateHighScore();
  showOverlay();
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("highScore", highScore);
    highScoreDisplay.textContent = highScore;
  }
}

function spawnPipe() {
  const gap = 100 - level * 2; // Decrease gap size as level increases
  const pipeTopHeight = Math.random() * (canvas.height - gap);
  pipes.push({
    x: canvas.width,
    y: pipeTopHeight,
    width: 50,
    height: pipeTopHeight,
    gap,
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background (toggle theme)
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bird
  bird.velocity += 0.5; // Gravity
  bird.y += bird.velocity;
  ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);

  // Pipes
  pipes.forEach((pipe) => {
    pipe.x -= 2 + level * 0.5; // Increase speed with level
    ctx.drawImage(pipeImage, pipe.x, 0, pipe.width, pipe.y);
    ctx.drawImage(
      pipeImage,
      pipe.x,
      pipe.y + pipe.gap,
      pipe.width,
      canvas.height - pipe.y - pipe.gap
    );

    // Collision detection
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.y || bird.y + bird.height > pipe.y + pipe.gap)
    ) {
      crashSound.play();
      stopGame();
    }

    // Score
    if (pipe.x + pipe.width === bird.x) {
      score += 1;
      scoreSound.play();
      if (score % 10 === 0) level++;
    }
  });

  pipes = pipes.filter((pipe) => pipe.x > -pipe.width); // Remove off-screen pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    spawnPipe();
  }

  // End game if bird touches boundaries
  if (bird.y < 0 || bird.y + bird.height > canvas.height) {
    crashSound.play();
    stopGame();
  }

  // Display score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Level: ${level}`, canvas.width - 80, 20);
}

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Event listeners
startBtn.addEventListener("click", startGame);
canvas.addEventListener("mousedown", () => (bird.velocity = -8)); // Jump
canvas.addEventListener("touchstart", () => (bird.velocity = -8)); // Mobile jump
