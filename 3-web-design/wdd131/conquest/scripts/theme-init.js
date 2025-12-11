import THEMES from "./objects.mjs";

const savedTheme = localStorage.getItem("theme");

if (savedTheme && THEMES[savedTheme]) {
    const t = THEMES[savedTheme];

    document.documentElement.style.setProperty("--main-background-color", t.main);
    document.documentElement.style.setProperty("--primary-color", t.primary);
    document.documentElement.style.setProperty("--secondary-color", t.secondary);
    document.documentElement.style.setProperty("--accent1-color", t.accent1);
    document.documentElement.style.setProperty("--accent2-color", t.accent2);
}