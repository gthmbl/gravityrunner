document.addEventListener("DOMContentLoaded", function () {
    const ball = document.getElementById("ball");
    let gravity = 2; // Controls gravity direction (down = positive, up = negative)
    let velocityY = 0;
    let velocityX = 2; // Ball always moves right
    let ballY = 200;
    let screenSpeed = 2; // How fast the screen moves left

    // Toggle gravity on Space Bar
    document.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            gravity = -gravity; // Reverse gravity
        }
    });

    function updateGame() {
        // Apply gravity
        velocityY += gravity;
        ballY += velocityY;

        // Ensure ball stays within screen bounds
        if (ballY < 0) {
            ballY = 0;
            velocityY = 0;
        }
        if (ballY > 370) {  // 400px container - 30px ball
            ballY = 370;
            velocityY = 0;
        }

        // Move the ball right
        let ballX = parseInt(ball.style.left || 100);
        ballX += velocityX;

        // Update ball position
        ball.style.top = ballY + "px";
        ball.style.left = ballX + "px";

        // Increase screen speed over time
        screenSpeed += 0.0005;

        requestAnimationFrame(updateGame);
    }

    updateGame();
});
