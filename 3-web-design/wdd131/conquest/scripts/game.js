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

import { SHIP_STATS, BULLET_STATS, METEOR_STATS, DIFFICULTY, SOUNDS, gameState } from "./objects.mjs";
import { startGameLoop } from "./game-loop.js";
import { audioManager } from "./audio-manager.js";


const IMAGES = {
    ship: new Image(),
    bullet: new Image(),
    meteor1: new Image(),
    meteor2: new Image(),
    meteor3: new Image()
}

IMAGES.ship.src = SHIP_STATS.sprite;
IMAGES.bullet.src = BULLET_STATS.sprite;
IMAGES.meteor1.src = METEOR_STATS.small.sprite;
IMAGES.meteor2.src = METEOR_STATS.medium.sprite;
IMAGES.meteor3.src = METEOR_STATS.large.sprite;

audioManager.load({
    fire: SOUNDS.sfx.fire,
    hit: SOUNDS.sfx.hit,
    destroyed: SOUNDS.sfx.destroyed,
    gameover: SOUNDS.sfx.gameover,

    cosmically: SOUNDS.music.cosmically,
    beyond: SOUNDS.music.beyond,
    conquest: SOUNDS.music.conquest
})

let spawnTimer = 0;
let lastShotTime = 0;

// Load settings
const settings = {
    musicVolume: parseFloat(localStorage.getItem("musicVolume")) || 0.5,
    sfxVolume: parseFloat(localStorage.getItem("sfxVolume")) || 0.8,
    difficulty: localStorage.getItem("difficulty") || "easy",
    musicChoice: localStorage.getItem("musicChoice") || "cosmically"
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

        if (gameState.gameOver) return;
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
    applyDifficulty(settings.difficulty);
    audioManager.setMusicVolume(settings.musicVolume);
    audioManager.setSfxVolume(settings.sfxVolume);

    //Reset game state
    gameState.enemies = [];
    gameState.bullets = [];
    gameState.score = 0;
    gameState.level = 1;
    gameState.running = true;
    gameState.gameOver = false;

    gameState.player = {
    x: canvas.width / 2 - SHIP_STATS.width / 2,
    y: canvas.height - SHIP_STATS.height - 20,
    width: SHIP_STATS.width,
    height: SHIP_STATS.height,
    speed: SHIP_STATS.speed,
    sprite: IMAGES.ship
};

    //Start background music
    audioManager.playBackgroundLoop(settings.musicChoice);

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
    if (e.key === " ") keys.shoot = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
    if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
    if (e.key === " ") keys.shoot = false;
});

document.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
        keys.shoot = true;
    }
});

document.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
        keys.shoot = false;
    }
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
        speed: BULLET_STATS.speed,
        sprite: IMAGES.bullet
    };

    gameState.bullets.push(bullet);

    audioManager.playSfx("fire");
}


//meteors
function spawnMeteors(deltaTime) {
    spawnTimer += deltaTime * 1000;

    if (spawnTimer >= DIFFICULTY[settings.difficulty].spawnInterval) {
        spawnTimer = 0;

        const dist = DIFFICULTY[settings.difficulty].distribution;
        const r = Math.random();
        let type = "small";

        if (r < dist.small) type = "small";
        else if (r < dist.small + dist.medium) type = "medium";
        else type = "large";

        const data = METEOR_STATS[type];

        const sprite =
            type === "small"  ? IMAGES.meteor1 :
            type === "medium" ? IMAGES.meteor2 :
                                IMAGES.meteor3;

        const meteor = {
            type,
            x: Math.random() * (canvas.width - data.width),
            y: -data.height,
            width: data.width,
            height: data.height,
            hp: data.hp,
            speed: data.speed * DIFFICULTY[settings.difficulty].speedMultiplier,
            sprite
        };

        gameState.enemies.push(meteor);
    }
}


function updateMeteors(deltaTime) {
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const m = gameState.enemies[i];

        m.y += m.speed * deltaTime;

        // Despawn if it goes off screen
        if (m.y > canvas.height) {
            gameState.enemies.splice(i, 1);
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

    const p = gameState.player;
    if (!p) return;

    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
        const m = gameState.enemies[i];

        // --- Player vs Meteor ---
        if (
            p.x < m.x + m.width &&
            p.x + p.width > m.x &&
            p.y < m.y + m.height &&
            p.y + p.height > m.y
        ) {
            endGame();
            return;
        }

        // --- Bullet vs Meteor ---
        for (let j = gameState.bullets.length - 1; j >= 0; j--) {
            const b = gameState.bullets[j];

            if (
                b.x < m.x + m.width &&
                b.x + b.width > m.x &&
                b.y < m.y + m.height &&
                b.y + b.height > m.y
            ) {
                audioManager.playSfx("hit");
                m.hp -= BULLET_STATS.damage;
                gameState.bullets.splice(j, 1);

                if (m.hp <= 0) {
                    audioManager.playSfx("destroyed");
                    gameState.score += METEOR_STATS[m.type].scoreValue;
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
    audioManager.stopMusic();

    audioManager.playSfx("gameover");

    overlay.style.display = "flex";
}


//----------------
//RENDER FUNCTIONS
//----------------

//player
function renderPlayer() {
    const p = gameState.player;
    if (!p || !p.sprite.complete) return;

    gameCtx.drawImage(p.sprite, p.x, p.y, p.width, p.height);
}

//bullets
function renderBullets() {
    gameState.bullets.forEach(b => {
        if (!b.sprite.complete) return;
        gameCtx.drawImage(b.sprite, b.x, b.y, b.width, b.height);
    });
}

//meteors
function renderMeteors() {
    gameState.enemies.forEach(m => {
        if (!m.sprite.complete) return;
        gameCtx.drawImage(m.sprite, m.x, m.y, m.width, m.height);
    });
}
