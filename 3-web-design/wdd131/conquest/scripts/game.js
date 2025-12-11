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