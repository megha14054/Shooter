// Get the canvas and its context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set up the player's spaceship
const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 5,
};

// Set up enemy spaceships
const enemies = [];
const enemySpeed = 2;
const enemySpawnInterval = 1000; // In milliseconds
let lastSpawnTime = 0;

// Set up player bullets
const bullets = [];
const bulletSpeed = 7;

// Power-up variables
const powerupWidth = 100;
const powerupHeight = 10;
const powerups = [];

// Power-up progress bar
const powerupDuration = 5000; // In milliseconds
let powerupProgress = 0;
let isPowerupActive = false;

// Level variables
let level = 1;
let maxEnemies = 5;

// Game state variables
let score = 0;
let isGameOver = false;

// Event listener for player controls
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    player.x -= player.speed;
  } else if (event.key === "ArrowRight") {
    player.x += player.speed;
  } else if (event.key === " ") {
    // Spacebar key for shooting
    if (!isGameOver) {
      bullets.push({
        x: player.x + player.width / 2,
        y: player.y,
        width: 5,
        height: 10,
      });
    }
  }
});

// Function to create power-ups at random positions
function createPowerup() {
  const randomX = Math.random() * (canvas.width - powerupWidth);
  powerups.push({
    x: randomX,
    y: 10,
    width: powerupWidth,
    height: powerupHeight,
  });
}

// Function to check for collisions between the player and power-ups
function checkPowerupCollision() {
  powerups.forEach((powerup, index) => {
    if (
      player.x < powerup.x + powerup.width &&
      player.x + player.width > powerup.x &&
      player.y < powerup.y + powerup.height &&
      player.y + player.height > powerup.y
    ) {
      powerups.splice(index, 1); // Remove the power-up
      activatePowerup();
    }
  });
}

// Function to activate power-up
function activatePowerup() {
  isPowerupActive = true;
  player.speed = 8; // Increase the player's speed during the power-up
}

// Function to create enemies at random positions
function createEnemy() {
  const randomX = Math.random() * (canvas.width - 40);
  enemies.push({
    x: randomX,
    y: 0,
    width: 40,
    height: 40,
  });
}

// Update function for game logic
function update() {
  if (isGameOver) return;

  // Move bullets
  bullets.forEach((bullet, index) => {
    bullet.y -= bulletSpeed;
    if (bullet.y < 0) {
      bullets.splice(index, 1); // Remove bullets that are off-screen
    }
  });

  // Move enemies
  enemies.forEach((enemy, index) => {
    enemy.y += enemySpeed;
    if (enemy.y > canvas.height) {
      // Remove enemies that have passed the screen
      enemies.splice(index, 1);
    }

    // Check for collisions with player
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      isGameOver = true;
    }
  });

  // Check for collisions between bullets and enemies
  bullets.forEach((bullet, bulletIndex) => {
    enemies.forEach((enemy, enemyIndex) => {
      if (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
      ) {
        bullets.splice(bulletIndex, 1); // Remove the bullet
        enemies.splice(enemyIndex, 1); // Remove the enemy
        score += 10;
      }
    });
  });

  // Check for collisions with power-ups
  checkPowerupCollision();

  // Update power-up progress bar
  if (isPowerupActive) {
    powerupProgress += deltaTime;
    if (powerupProgress >= powerupDuration) {
      powerupProgress = 0;
      isPowerupActive = false;
      player.speed = 5; // Reset player speed after power-up duration ends
    }
  }

  // Increase level difficulty
  if (score >= level * 100) {
    level++;
    maxEnemies += 2; // Increase the maximum number of enemies for the next level
  }

  // Spawn new enemies at regular intervals
  const currentTime = Date.now();
  if (currentTime - lastSpawnTime > enemySpawnInterval) {
    createEnemy();
    lastSpawnTime = currentTime;
  }

  // Create power-up at regular intervals
  if (Math.random() < 0.01) {
    createPowerup();
  }
}

// Render function for drawing on the canvas
function render() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player's spaceship
  ctx.fillStyle = "#00f";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw enemies
  ctx.fillStyle = "#f00";
  enemies.forEach((enemy) => {
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  });

  // Draw bullets
  ctx.fillStyle = "#fff";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });

  // Draw power-ups
  ctx.fillStyle = "#0f0";
  powerups.forEach((powerup) => {
    ctx.fillRect(powerup.x, powerup.y, powerup.width, powerup.height);
  });

  // Display the score
  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // Display game over message
  if (isGameOver) {
    ctx.fillStyle = "#fff";
    ctx.font = "bold 48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 120, canvas.height / 2);
  }
}

// Game loop to continuously update and render the game
let lastUpdateTime = Date.now();
function gameLoop() {
  const currentTime = Date.now();
  deltaTime = currentTime - lastUpdateTime;
  lastUpdateTime = currentTime;

  update();
  render();

  if (!isGameOver) {
    requestAnimationFrame(gameLoop);
  }
}

// Start the game loop
gameLoop();
