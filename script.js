// Created by Bonny Sithole

// Dynamically adjust canvas size
const canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.95;
const ctx = canvas.getContext("2d");

// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Animation Variables
const FPS = 40;
const jump_amount = -10;
const max_fall_speed = +10;
const acceleration = 1;
const pipe_speed = -2;
let game_mode = "prestart";
let time_game_last_running;
let bottom_bar_offset = 0;
let pipes = [];

// Sprite Class
function MySprite(img_url) {
  this.x = 0;
  this.y = 0;
  this.visible = true;
  this.velocity_x = 0;
  this.velocity_y = 0;
  this.MyImg = new Image();
  this.MyImg.src = img_url || "";
  this.angle = 0;
  this.flipV = false;
  this.flipH = false;
}

MySprite.prototype.Do_Frame_Things = function () {
  ctx.save();
  ctx.translate(this.x + this.MyImg.width / 2, this.y + this.MyImg.height / 2);
  ctx.rotate((this.angle * Math.PI) / 180);
  if (this.flipV) ctx.scale(1, -1);
  if (this.flipH) ctx.scale(-1, 1);
  if (this.visible)
    ctx.drawImage(this.MyImg, -this.MyImg.width / 2, -this.MyImg.height / 2);
  this.x += this.velocity_x;
  this.y += this.velocity_y;
  ctx.restore();
};

// Input Handlers
function Got_Player_Input(MyEvent) {
  switch (game_mode) {
    case "prestart": {
      game_mode = "running";
      break;
    }
    case "running": {
      bird.velocity_y = jump_amount;
      break;
    }
    case "over":
      if (new Date() - time_game_last_running > 1000) {
        reset_game();
        game_mode = "running";
        break;
      }
  }
  MyEvent.preventDefault();
}

addEventListener("touchstart", Got_Player_Input);
addEventListener("mousedown", Got_Player_Input);
addEventListener("keydown", Got_Player_Input);

// Bird Falling Logic
function make_bird_slow_and_fall() {
  if (bird.velocity_y < max_fall_speed) {
    bird.velocity_y += acceleration;
  }
  if (bird.y > canvas.height - bird.MyImg.height || bird.y < 0) {
    bird.velocity_y = 0;
    game_mode = "over";
  }
}

// Pipe Logic
function add_pipe(x_pos, top_of_gap, gap_width) {
  const top_pipe = new MySprite();
  top_pipe.MyImg = pipe_piece;
  top_pipe.x = x_pos;
  top_pipe.y = top_of_gap - pipe_piece.height;
  top_pipe.velocity_x = pipe_speed;
  pipes.push(top_pipe);

  const bottom_pipe = new MySprite();
  bottom_pipe.MyImg = pipe_piece;
  bottom_pipe.flipV = true;
  bottom_pipe.x = x_pos;
  bottom_pipe.y = top_of_gap + gap_width;
  bottom_pipe.velocity_x = pipe_speed;
  pipes.push(bottom_pipe);
}

// Bird Tilt Animation
function make_bird_tilt_appropriately() {
  bird.angle = bird.velocity_y < 0 ? -15 : Math.min(bird.angle + 4, 70);
}

// Draw Pipes
function show_the_pipes() {
  for (const pipe of pipes) {
    pipe.Do_Frame_Things();
  }
}

// Game End Logic
function check_for_end_game() {
  for (const pipe of pipes) {
    if (ImagesTouching(bird, pipe)) game_mode = "over";
  }
}

// Text Displays
function display_intro_instructions() {
  ctx.font = "25px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Press, touch or click to start", canvas.width / 2, canvas.height / 4);
  ctx.fillText("Created by Bonny Sithole", canvas.width / 2, canvas.height / 3);
}

function display_game_over() {
  let score = 0;
  for (const pipe of pipes) {
    if (pipe.x < bird.x) score += 0.5;
  }
  ctx.font = "30px Arial";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, 100);
  ctx.fillText("Score: " + score, canvas.width / 2, 150);
  ctx.font = "20px Arial";
  ctx.fillText("Click, touch, or press to play again", canvas.width / 2, 300);
}

// Reset Game
function reset_game() {
  bird.y = canvas.height / 2;
  bird.angle = 0;
  pipes = [];
  add_all_my_pipes();
}

function add_all_my_pipes() {
  add_pipe(500, 100, 140);
  add_pipe(800, 50, 140);
  add_pipe(1000, 250, 140);
  add_pipe(1200, 150, 120);
}

// Sprite Initialization
const pipe_piece = new Image();
pipe_piece.onload = add_all_my_pipes;
pipe_piece.src = "http://s2js.com/img/etc/flappypipe.png";

const bird = new MySprite("http://s2js.com/img/etc/flappybird.png");
bird.x = canvas.width / 3;
bird.y = canvas.height / 2;

// Game Frame
function Do_a_Frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bird.Do_Frame_Things();

  switch (game_mode) {
    case "prestart":
      display_intro_instructions();
      break;
    case "running":
      time_game_last_running = new Date();
      show_the_pipes();
      make_bird_tilt_appropriately();
      make_bird_slow_and_fall();
      check_for_end_game();
      break;
    case "over":
      make_bird_slow_and_fall();
      display_game_over();
      break;
  }
}

setInterval(Do_a_Frame, 1000 / FPS);
