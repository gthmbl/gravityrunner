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
            stuck = false;
        }
    });

    function createObstacle() {
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
    
        let width = Math.random() * 80 + 50;
        let height = Math.random() * 80 + 50;
    
        obstacle.style.width = width + "px";
        obstacle.style.height = height + "px";
    
        const isCeiling = Math.random() < 0.5;
        obstacle.style.top = isCeiling ? "0px" : `${400 - height}px`;
        obstacle.style.left = "800px";
    
        gameContainer.appendChild(obstacle);
        obstacles.push(obstacle);
    }
    
    function updateGame() {
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
                
                // Ensure ball can roll off naturally when on top of an obstacle
                if (
                    (gravity > 0 && ballY === obstacleRect.top - ballRect.height) ||
                    (gravity < 0 && ballY === obstacleRect.bottom)
                ) {
                    stuck = false;
                    velocityY += gravity;
                }
                
                // Prevent passing through obstacles from the sides
                if (
                    ballRect.right > obstacleRect.left && ballRect.left < obstacleRect.right &&
                    !(ballRect.bottom === obstacleRect.top || ballRect.top === obstacleRect.bottom)
                ) {
                    ball.style.left = obstacleRect.left - ballRect.width + "px";
                    stuck = true;
                }
            }
        });
    
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
        if (Math.random() < 0.2) {
            createObstacle();
        }
    }, 1000);
});
  