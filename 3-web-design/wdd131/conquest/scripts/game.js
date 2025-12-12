//Blurb Values
const infoToggle = document.getElementById('infoToggle');
const infoPanel = document.getElementById('infoPanel');

//Blurb Function
infoToggle.addEventListener('click', () => {
    const panelStyle = window.getComputedStyle(infoPanel);
    const isHidden = panelStyle.display === 'none';

    if (isHidden) {
        infoPanel.style.display = 'block';
        infoToggle.setAttribute("aria-expanded", "true");
    } else {
        infoPanel.style.display = 'none';
        infoToggle.setAttribute("aria-expanded", "false");
    }
});

//Play Now Text
const overlay = document.getElementById("gameOverlay");

overlay.addEventListener("click", () => {
    overlay.style.display = "none";
    startGame(); // this will run the game loop
});


//Init Background
import { startBackgroundAnimation } from "./game-bg.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = 710;
canvas.height = 510;

const gameCtx = canvas.getContext("2d");

startBackgroundAnimation(gameCtx, canvas.width, canvas.height);


//Full Screen
const fullscreenBtn = document.getElementById("fullscreen");
const exitBtn = document.getElementById("exitFullscreen");

fullscreenBtn.addEventListener("click", () => {
    document.body.classList.add("fullscreen-active");
    startGame(); //full screen will also automatically start the game
});

exitBtn.addEventListener("click", () => {
    document.body.classList.remove("fullscreen-active");
});

// Allow ESC to exit full screen mode
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        document.body.classList.remove("fullscreen-active");
    }
});




/*CONQUEST*/



//-----------
//Start Game-
//-----------

import { gameState } from "./objects.mjs";
import { SHIP_STATS, DIFFICULTY, SOUNDS } from "./objects.mjs";
import { startGameLoop } from "./game-loop.js";

let spawnTimer = 0;
let timeSurvived = 0;
let lastShotTime = 0;

// Load settings
const settings = {
    musicVolume: parseFloat(localStorage.getItem("musicVolume")) || 0.5,
    sfxVolume: parseFloat(localStorage.getItem("sfxVolume")) || 0.5,
    difficulty: localStorage.getItem("difficulty") || "normal"
};

//Start Game
function startGame() {

    function update(deltaTime) {
        if (gameState.gameOver) return;

        //survival time
        gameState.timeElapsed += deltaTime;

        //player
        updatePlayer(deltaTime);

        //bullets
        updateBullets(deltaTime);

        //Spawn Meteors
        spawnMeteors(deltaTime);

        //Update Meteors
        updateMeteors(deltaTime);

        //collisions
        checkCollisions();

        if (playerDead) {
            endGame();
        }
    }

    function render() {
        //clear screen
        gameCtx.clearRect(0, 0, canvas.width, canvas.height);

        //draw player
        renderPlayer();

        //draw bullets
        renderBullets();

        //draw meteors
        renderMeteors();
    }

    //Load and apply settings
    const settings = loadSettingsFromStorage();
    applyDifficulty(settings.difficulty);
    audioManager.setMusicVolume(settings.musicVolume);
    audioManager.setSfxVolume(settings.sfxVolume);

    //Reset game state
    gameState.asteroids = [];
    gameState.shots = [];
    gameState.score = 0;
    gameState.timeElapsed = 0;
    gameState.gameOver = false;

    //Start background music
    audioManager.playBackgroundLoop(SOUNDS.music("conquest"));

    //Start the game loop
    startGameLoop(update, render);
}


function applyDifficulty(difficulty) {
    switch (difficulty) {
        case "easy":
            gameState.spawnRate = 2000; // slower
            gameState.asteroidHP = 2;
            break;

        case "normal":
            gameState.spawnRate = 1500;
            gameState.asteroidHP = 3;
            break;

        case "hard":
            gameState.spawnRate = 900;  // faster
            gameState.asteroidHP = 4;
            break;
    }
}

//----------------
//UPDATE FUNCTIONS
//----------------

//inputs
const keys = {
    left: false,
    right: false,
    shoot: false
};

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
    if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
    if (e.key === " " || e.key === "click") keys.shoot = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
    if (e.key === " " || e.key === "click") keys.shoot = false;
});


function updatePlayer(deltaTime) {

    const player = gameState.player;
    if (!player) return;

    // Movement input
    if (keys.left) {
        player.x -= SHIP_STATS.speed * deltaTime;
    }
    if (keys.right) {
        player.x += SHIP_STATS.speed * deltaTime;
    }

    // Clamp to screen boundaries
    player.x = Math.max(0, Math.min(canvas.width - SHIP_STATS.width, player.x));

    // Shooting
    if (keys.shoot) {
        fireBullet();
    }
}

function fireBullet() {

    const now = performance.now();
    if (now - lastShotTime < SHIP_STATS.fireRate) return;
    lastShotTime = now;

    const player = gameState.player;

    const bullet = {
        x: player.x + SHIP_STATS.width / 2 - BULLET_STATS.width / 2,
        y: player.y,
        width: BULLET_STATS.width,
        height: BULLET_STATS.height,
        speed: BULLET_STATS.speed
    };

    gameState.bullets.push(bullet);

    audioManager.playSfx("fire.mp3");
}


//meteors
function spawnMeteors(deltaTime) {
    spawnTimer += deltaTime * 1000;

    if (spawnTimer >= DIFFICULTY[settings.difficulty].spawnInterval) {
        spawnTimer = 0;

        // Pick size based on distribution probability
        const dist = DIFFICULTY[settings.difficulty].distribution;
        const r = Math.random();
        let type = "small";

        if (r < dist.small) type = "small";
        else if (r < dist.small + dist.medium) type = "medium";
        else type = "large";

        const data = METEOR_STATS[type];

        const meteor = {
            type,
            x: Math.random() * (canvas.width - data.width),
            y: -data.height,
            width: data.width,
            height: data.height,
            hp: data.hp,
            speed: data.speed * DIFFICULTY[settings.difficulty].speedMultiplier
        };

        gameState.enemies.push(meteor);
    }
}

function updateMeteors(deltaTime) {

    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const m = gameState.enemies[i];

        m.y += m.speed * deltaTime;

        // If meteor passes bottom, end game
        if (m.y > canvas.height) {
            endGame();
            return;
        }
    }
}


//bullets
function updateBullets(deltaTime) {

    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const b = gameState.bullets[i];

        b.y -= b.speed * deltaTime;

        if (b.y + b.height < 0) {
            gameState.bullets.splice(i, 1); // remove
        }
    }
}


//collisions
function checkCollisions() {

    for (let i = gameState.enemies.length - 1; i >= 0; i--) {

        const m = gameState.enemies[i];

        // Check against bullets
        for (let j = gameState.bullets.length - 1; j >= 0; j--) {

            const b = gameState.bullets[j];

            if (b.x < m.x + m.width &&
                b.x + b.width > m.x &&
                b.y < m.y + m.height &&
                b.y + b.height > m.y) {

                // Hit detected
                m.hp -= BULLET_STATS.damage;
                gameState.bullets.splice(j, 1); // remove bullet

                if (m.hp <= 0) {
                    gameState.score += METEOR_STATS[m.type].scoreValue;
                    // audioManager.playSfx("destroyed");
                    gameState.enemies.splice(i, 1);
                }

                break;
            }
        }
    }
}


//game over
function endGame() {
    console.log("GAME OVER");
    gameState.running = false;
    gameState.gameOver = true;

    audioManager.playSfx("game-over.mp3");

    // Optional: show restart overlay
    overlay.style.display = "block";
}


//----------------
//RENDER FUNCTIONS
//----------------

//player
function renderPlayer() {
    const p = gameState.player;
    gameCtx.drawImage(p.sprite, p.x, p.y, p.width, p.height);
}

//bullets
function renderBullets() {
    gameState.bullets.forEach(b => {
        gameCtx.fillStyle = "white";
        gameCtx.fillRect(b.x, b.y, b.width, b.height);
    });
}

//meteors
function renderMeteors() {
    gameState.enemies.forEach(m => {
        gameCtx.drawImage(m.sprite, m.x, m.y, m.width, m.height);
    });
}