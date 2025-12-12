export function startBackgroundAnimation(ctx, width, height) {
    const stars = Array.from({ length: 50 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.5 + Math.random() * 1.5
    }));

    function updateStars(dt) {
        for (const s of stars) {
            s.y += s.speed;
            if (s.y > height) {
                s.y = 0;
                s.x = Math.random() * width;
            }
        }
    }

    function drawStars() {
        ctx.fillStyle = "#ffffff";
        for (const s of stars) {
            ctx.fillRect(s.x, s.y, 2, 2);
        }
    }

    let last = performance.now();
    function loop(now) {
        const dt = now - last;
        last = now;

        ctx.clearRect(0, 0, width, height);

        updateStars(dt);
        drawStars();

        requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);
}
