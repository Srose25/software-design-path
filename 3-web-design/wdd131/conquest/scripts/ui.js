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


