export function startGameLoop(update, render) {
    let lastTime = performance.now();

    function loop(now) {
        const deltaTime = (now - lastTime) / 1000;
        lastTime = now;

        update(deltaTime);
        render();
        if (gameState.running) requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}
