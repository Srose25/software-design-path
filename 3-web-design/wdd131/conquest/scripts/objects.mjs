const SHIP_STATS = {
    width: 32,
    height: 32,
    speed: 250,
    fireRate: 200,   // ms between shots
    sprite: "assets/images/sprites/spaceship.png"
};

const BULLET_STATS = {
    width: 6,
    height: 6,
    speed: 500,
    damage: 1,
    sprite: "assets/images/sprites/bullet.png"
};

const METEOR_STATS = {
    small: {
        width: 32,
        height: 32,
        hp: 2,
        speed: 200,
        scoreValue: 100,
        sprite: "assets/images/sprites/meteor1.png"
    },
    medium: {
        width: 48,
        height: 48,
        hp: 4,
        speed: 100,
        scoreValue: 200,
        sprite: "assets/images/sprites/meteor2.png"
    },
    large: {
        width: 96,
        height: 96,
        hp: 8,
        speed: 50,
        scoreValue: 500,
        sprite: "assets/images/sprites/meteor3.png"
    }
};

const DIFFICULTY = {
    easy: {
        spawnInterval: 1500,   // ms between meteor spawns
        speedMultiplier: 1.0,
        maxMeteors: 4,
        distribution: { small: 0.7, medium: 0.25, large: 0.05 },
        scoreMultiplier: 1
    },
    medium: {
        spawnInterval: 1000,
        speedMultiplier: 1.2,
        maxMeteors: 8,
        distribution: { small: 0.5, medium: 0.35, large: 0.15 },
        scoreMultiplier: 1.2
    },
    hard: {
        spawnInterval: 700,
        speedMultiplier: 1.5,
        maxMeteors: 12,
        distribution: { small: 0.3, medium: 0.5, large: 0.2 },
        scoreMultiplier: 1.5
    }
};

const SOUNDS = {
    music: {
        cosmically: "assets/sounds/cosmically.mp3",
        conquest: "assets/sounds/CONQUEST.mp3",
        beyond: "assets/sounds/beyond.mp3"
    },
    sfx: {
        fire: "assets/sounds/fire.mp3",
        hit: "assets/sounds/hit.mp3",
        destroyed: "assets/sounds/destroyed.mp3",
        gameover: "assets/sounds/game-over.mp3"
    }
};


const THEMES = {
  light: {
    main: "#ffffff",
    primary: "#91d6a8",
    secondary: "#0d7575",
    accent1: "#022122",
    accent2: "#dbf9f0"
  },
  dark: {
    main: "#555b5a",
    primary: "#979797",
    secondary: "#434343",
    accent1: "#242424",
    accent2: "#00ffea"
  },
  contrast: {
    main: "#000000",
    primary: "#f7ff00",
    secondary: "#000000",
    accent1: "#ffffff",
    accent2: "#00ffea"
  },
  gameboy: {
    main: "#2f5d32",
    primary: "#03a709",
    secondary: "#084f00",
    accent1: "#003204",
    accent2: "#00ff15"
  }
};


export const gameState = {
    player: null,
    enemies: [],
    bullets: [],
    score: 0,
    level: 1,
    running: true,
};

export {
    SHIP_STATS,
    METEOR_STATS,
    BULLET_STATS,
    DIFFICULTY,
    SOUNDS
};

export default THEMES;