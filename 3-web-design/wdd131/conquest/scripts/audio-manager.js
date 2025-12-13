const sounds = {};
let musicVolume = 0.5;
let sfxVolume = 0.5;
let currentMusic = null;

export const audioManager = {
    load(soundMap) {
        for (const key in soundMap) {
            const audio = new Audio(soundMap[key]);
            audio.preload = "auto";
            sounds[key] = audio;
        }
    },

    playSfx(name) {
        const sound = sounds[name];
        if (!sound) return;

        const clone = sound.cloneNode();
        clone.volume = sfxVolume;
        clone.play();
    },

    playBackgroundLoop(name) {
        if (currentMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        }

        const music = sounds[name];
        if (!music) return;

        music.loop = true;
        music.volume = musicVolume;
        music.play();

        currentMusic = music;
    },

    setMusicVolume(value) {
        musicVolume = value;
        if (currentMusic) currentMusic.volume = value;
    },

    setSfxVolume(value) {
        sfxVolume = value;
    },

    stopMusic() {
        if (currentMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
            currentMusic = null;
        }
    }
};
