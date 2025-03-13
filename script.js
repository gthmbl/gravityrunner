document.addEventListener("DOMContentLoaded", function () {
    const ball = document.getElementById("ball");
    let gravity = 2; // Controls gravity direction (down = positive, up = negative)
    let velocityY = 0;
    let ballY = 200;
    let screenSpeed = 2; // How fast the screen moves left
    let stuck = false; // Tracks if the ball is stuck behind an obstacle

    // Set the ball's X position to the middle of the screen
    const ballX = 400; // Half of 800px game container
    ball.style.left = ballX + "px";

    // Toggle gravity on Space Bar
    document.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            gravity = -gravity; // Reverse gravity
        }
    });

    function updateGame() {
        if (!stuck) {
            // Apply gravity
            velocityY += gravity;
            ballY += velocityY;
        } else {
            // If stuck, move left with screen speed
            ball.style.left = parseInt(ball.style.left) - screenSpeed + "px";
        }

        // Ensure ball stays within screen bounds
        const floorY = 400 - 34; // Floor position (container height - ball height)
        if (ballY >= floorY) {
            ballY = floorY;  // Ensures ball bottom sits exactly on the white line
            velocityY = 0;
        }
        
        
        const ceilingY = 0; // Ceiling position (for when gravity is reversed)
        if (ballY <= ceilingY) {
            ballY = ceilingY;
            velocityY = 0;
        }

        // Update ball position
        ball.style.top = ballY + "px";

        // Increase screen speed over time
        screenSpeed += 0.0005;

        requestAnimationFrame(updateGame);
    }

    updateGame();
});
