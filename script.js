document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const ball = document.getElementById("ball");
    let gravity = 2;
    let velocityY = 0;
    let ballY = 200;
    let screenSpeed = 2;
    const obstacles = [];
    let stuck = false;
    
    const ballX = 400;
    let ballCurrentX = ballX;
    
    const verticalThreshold = 5; // Tolerance for vertical collisions
    
    document.addEventListener("keydown", function (event) {
        if (event.code === "Space") {
            gravity = -gravity;
            stuck = false; // Allow the ball to escape side collisions
        }
    });
    
    function createObstacle() {
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
    
        let width = Math.random() * 80 + 30;
        let height = Math.random() * 80 + 100;
    
        obstacle.style.width = width + "px";
        obstacle.style.height = height + "px";
    
        const isCeiling = Math.random() < 0.5;
        obstacle.style.top = isCeiling ? "0px" : `${400 - height}px`;
        obstacle.style.left = "800px";
    
        gameContainer.appendChild(obstacle);
        obstacles.push(obstacle);
    }
    
    function updateGame() {
        // Update vertical movement
        velocityY += gravity;
        ballY += velocityY;
    
        const floorY = 400 - 34;
        if (ballY >= floorY) {
            ballY = floorY;
            velocityY = 0;
        }
        if (ballY <= 0) {
            ballY = 0;
            velocityY = 0;
        }
    
        let ballRect = ball.getBoundingClientRect();
        stuck = false;
        let rolling = false;
    
        obstacles.forEach((obstacle) => {
            let obstacleRect = obstacle.getBoundingClientRect();
    
            // Check for any collision overlap
            if (
                ballRect.left < obstacleRect.right &&
                ballRect.right > obstacleRect.left &&
                ballRect.top < obstacleRect.bottom &&
                ballRect.bottom > obstacleRect.top
            ) {
                // Calculate vertical differences
                let diffTop = Math.abs(ballRect.bottom - obstacleRect.top);
                let diffBottom = Math.abs(ballRect.top - obstacleRect.bottom);
    
                // If falling (gravity > 0) and nearly touching the top of the obstacle:
                if (gravity > 0 && diffTop < verticalThreshold) {
                    ballY = obstacleRect.top - ballRect.height;
                    velocityY = 0;
                    rolling = true;
                }
                // If rising (gravity < 0) and nearly touching the bottom of the obstacle:
                else if (gravity < 0 && diffBottom < verticalThreshold) {
                    ballY = obstacleRect.bottom;
                    velocityY = 0;
                    rolling = true;
                }
                // Otherwise, treat as a side collision:
                else {
                    stuck = true;
                    ballCurrentX = obstacleRect.left - ballRect.width;
                }
            }
        });
    
        // If rolling on top or bottom of an obstacle, move right with the obstacle instead of left
        if (rolling) {
            ballCurrentX -= screenSpeed; // Ball stays aligned with moving obstacle
        }
    
        // If stuck, ball is pushed left with the obstacle
        if (stuck) {
            ballCurrentX -= screenSpeed;
        }
        // If not stuck, gradually return to the center if off-center
        else if (ballCurrentX < ballX) {
            ballCurrentX += 2; // Adjust return speed as needed
            if (ballCurrentX > ballX) ballCurrentX = ballX;
        }
    
        ball.style.left = ballCurrentX + "px";
    
        // If the ball is pushed off-screen, game over
        if (ballCurrentX <= 0) {
            alert("Game Over! You got stuck behind an obstacle.");
            location.reload();
        }
    
        ball.style.top = ballY + "px";
    
        obstacles.forEach((obstacle, index) => {
            let obstacleX = parseInt(obstacle.style.left) - screenSpeed;
            obstacle.style.left = obstacleX + "px";
    
            if (obstacleX < -150) {
                gameContainer.removeChild(obstacle);
                obstacles.splice(index, 1);
            }
        });
    
        screenSpeed += 0.0005;
    
        requestAnimationFrame(updateGame);
    }
    
    updateGame();
    
    setInterval(() => {
        if (Math.random() < 0.3) {
            createObstacle();
        }
    }, 1000);
    
    // Increase obstacle speed every 10 seconds
    setInterval(() => {
        screenSpeed += 0.5; // Increase speed gradually per level
        console.log("New Level! Speed increased to:", screenSpeed);
    }, 10000);
});

