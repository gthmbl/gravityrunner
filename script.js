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
            stuck = false; // Allow movement when gravity is toggled
        }
    });

    function createObstacle() {
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
    
        let width = Math.random() * 80 + 50;  // Between 50px and 130px
        let height = Math.random() * 80 + 50; // Between 50px and 130px
    
        obstacle.style.width = width + "px";
        obstacle.style.height = height + "px";
    
        const isCeiling = Math.random() < 0.5; 
        obstacle.style.top = isCeiling ? "0px" : `${400 - height}px`; // Ceiling or floor
        obstacle.style.left = "800px"; // Start off the right side
    
        gameContainer.appendChild(obstacle);
        obstacles.push(obstacle);
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
    
        let ballRect = ball.getBoundingClientRect();
        obstacles.forEach((obstacle) => {
            let obstacleRect = obstacle.getBoundingClientRect();
    
            if (
                ballRect.left < obstacleRect.right &&
                ballRect.right > obstacleRect.left &&
                ballRect.top < obstacleRect.bottom &&
                ballRect.bottom > obstacleRect.top
            ) {
                if (gravity > 0 && ballRect.bottom > obstacleRect.top) {
                    ballY = obstacleRect.top - ballRect.height; 
                    velocityY = 0;
                }
                if (gravity < 0 && ballRect.top < obstacleRect.bottom) {
                    ballY = obstacleRect.bottom; 
                    velocityY = 0;
                }
                
                // Prevent moving through obstacles
                if (ballRect.right > obstacleRect.left) {
                    ball.style.left = obstacleRect.left - ballRect.width + "px";
                    stuck = true;
                }
            }
        });
    
        // If ball is stuck and reaches the left edge, trigger Game Over
        if (parseInt(ball.style.left) <= 0) {
            alert("Game Over! You got stuck behind an obstacle.");
            location.reload();
        }
    
        ball.style.top = ballY + "px";
    
        obstacles.forEach((obstacle, index) => {
            let obstacleX = parseInt(obstacle.style.left) - screenSpeed;
            obstacle.style.left = obstacleX + "px";
    
            if (obstacleX < -100) {
                gameContainer.removeChild(obstacle);
                obstacles.splice(index, 1);
            }
        });
    
        screenSpeed += 0.0005;
    
        requestAnimationFrame(updateGame);
    }
    
    updateGame();

    setInterval(() => {
        if (Math.random() < 0.05) {
            createObstacle();
        }
    }, 1000);
});
