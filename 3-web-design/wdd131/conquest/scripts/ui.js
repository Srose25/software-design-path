//THEMES

import THEMES from "./objects.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const themeSelect = document.getElementById("themeSelect");

    //error handling
    if (!themeSelect) {
        console.warn("themeSelect not found on this page. Skipping theme logic.");
        return;
    }

    console.log("themeSelect FOUND:", themeSelect);

    themeSelect.addEventListener("change", () => {
        const val = themeSelect.value;
        localStorage.setItem("theme", val)
        applyTheme(val);
    });

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        themeSelect.value = savedTheme;
        applyTheme(savedTheme);
    }
});


function applyTheme(themeName) {
    const selectedTheme = THEMES[themeName];

    if (!selectedTheme) return;

    document.documentElement.style.setProperty("--main-background-color", selectedTheme.main);
    document.documentElement.style.setProperty("--primary-color", selectedTheme.primary);
    document.documentElement.style.setProperty("--secondary-color", selectedTheme.secondary);
    document.documentElement.style.setProperty("--accent1-color", selectedTheme.accent1);
    document.documentElement.style.setProperty("--accent2-color", selectedTheme.accent2);
}


//GAME SETTINGS

import { audioManager } from "./audio-manager.js";

const musicVolumeSlider = document.getElementById("music-volume");
const sfxVolumeSlider   = document.getElementById("sfx-volume");
const difficultySelect  = document.getElementById("difficulty");
const musicChoiceSelect = document.getElementById("music-choice");

function loadSettingsIntoUI() {
    const musicVolume = parseFloat(localStorage.getItem("musicVolume")) ?? 0.5;
    const sfxVolume   = parseFloat(localStorage.getItem("sfxVolume")) ?? 0.8;
    const difficulty  = localStorage.getItem("difficulty") ?? "easy";
    const musicChoice = localStorage.getItem("musicChoice") ?? "cosmically";

    musicVolumeSlider.value = Math.round(musicVolume * 100);
    sfxVolumeSlider.value   = Math.round(sfxVolume * 100);
    difficultySelect.value  = difficulty;
    musicChoiceSelect.value = musicChoice;

    // Apply immediately
    audioManager.setMusicVolume(musicVolume);
    audioManager.setSfxVolume(sfxVolume);
}

//music volume settings
musicVolumeSlider.addEventListener("input", () => {
    const volume = musicVolumeSlider.value / 100;
    localStorage.setItem("musicVolume", volume);
    audioManager.setMusicVolume(volume);
});

//sound effects volume
sfxVolumeSlider.addEventListener("input", () => {
    const volume = sfxVolumeSlider.value / 100;
    localStorage.setItem("sfxVolume", volume);
    audioManager.setSfxVolume(volume);
});

//difficulty settings
difficultySelect.addEventListener("change", () => {
    localStorage.setItem("difficulty", difficultySelect.value);
});

//music choice
musicChoiceSelect.addEventListener("change", () => {
    const choice = musicChoiceSelect.value;
    localStorage.setItem("musicChoice", choice);

    // Restart music immediately if something is already playing
    audioManager.playBackgroundLoop(choice);
});

loadSettingsIntoUI();