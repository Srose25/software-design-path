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
canvas.width = 800;
canvas.height = 600;

const gameCtx = canvas.getContext("2d");

startBackgroundAnimation(gameCtx, canvas.width, canvas.height);

//Full Screen
const fullscreen = document.getElementById("fullscreen");

fullscreen.addEventListener("click", () => {
    document.body.classList.toggle("fullscreen-active");
});
