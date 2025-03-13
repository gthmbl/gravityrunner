document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const ball = document.getElementById("ball");
    let gravity = 2;
    let velocityY = 0;
    let ballY = 200;
    let screenSpeed = 2;
    let stuck = false;
    const obstacles = [];

    const ballX = 400;
    ball.style.left = ballX + "px";

    document.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            gravity = -gravity;
        }
    });

    function createObstacle() {
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
    
        // Bigger obstacles
        let width = Math.random() * 80 + 50;  // Between 50px and 130px
        let height = Math.random() * 80 + 50; // Between 50px and 130px
    
        obstacle.style.width = width + "px";
        obstacle.style.height = height + "px";
    
        // Randomly place on floor or ceiling
        const isCeiling = Math.random() < 0.5; 
        obstacle.style.top = isCeiling ? "0px" : `${400 - height}px`; // Ceiling or floor
        obstacle.style.left = "800px"; // Start off the right side
    
        gameContainer.appendChild(obstacle);
        obstacles.push(obstacle);
    }
    
    // Increase spawn rate
    if (Math.random() < 0.05) { // More frequent obstacles
        createObstacle();
    }
    

    function updateGame() {
        if (!stuck) {
            velocityY += gravity;
            ballY += velocityY;
        } else {
            ball.style.left = parseInt(ball.style.left) - screenSpeed + "px";
        }

        const floorY = 400 - 34;
        if (ballY >= floorY) {
            ballY = floorY;
            velocityY = 0;
        }

        if (ballY <= 0) {
            ballY = 0;
            velocityY = 0;
        }

        ball.style.top = ballY + "px";

        // Move obstacles left
        obstacles.forEach((obstacle, index) => {
            let obstacleX = parseInt(obstacle.style.left) - screenSpeed;
            obstacle.style.left = obstacleX + "px";

            // Remove obstacle if off-screen
            if (obstacleX < -100) {
                gameContainer.removeChild(obstacle);
                obstacles.splice(index, 1);
            }
        });

        // Spawn obstacles at intervals
        if (Math.random() < 0.02) { // Small chance per frame to spawn
            createObstacle();
        }

        screenSpeed += 0.0005;

        requestAnimationFrame(updateGame);
    }

    updateGame();
});
