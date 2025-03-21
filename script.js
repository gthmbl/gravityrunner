document.addEventListener("DOMContentLoaded", function () {
    const gameContainer = document.getElementById("game-container");
    const ball = document.getElementById("ball");
    let gravity = 2; //controls vertical pull on ball. positive value pulls ball down, negative pulls upward
    let velocityY = 0; //vertical speed of ball, added with gravity creates acceleration 
    let ballY = 200; //vertical position of the ball begins at 200px from top 
    let screenSpeed = 2; //speed at which obstacles moves left across the screen 
    let obstacleFrequency = 0.3; // 30% an obstacle appears every second
    const obstacles = []; //array holding all active obstacles on the screen, removed when off the screen
    let stuck = false; //if ball is stuck, it moves with the obstacle horizontally
    let gamePaused = false; //if game's paused, it won't update
    
    const ballX = 400; // the neutral position the ball will always return to after escaping from an obstacle 
    let ballCurrentX = ballX; //tracks the balls current position 
    
    const verticalThreshold = 5; // checks if the ball is just barely touching the top or bottom of an obstacle by 5 pixels

    let level = 1; // Start at level 1
    let gameOver = false;
    
    // Create a corner display to show the current level
    const levelDisplay = document.createElement("div");
    levelDisplay.style.position = "absolute";
    levelDisplay.style.top = "10px";
    levelDisplay.style.left = "10px";
    levelDisplay.style.color = "white";
    levelDisplay.style.fontFamily = "Arial, sans-serif";
    levelDisplay.style.fontSize = "16px";
    levelDisplay.style.zIndex="9999";
    levelDisplay.innerText = "Level: " + level;
    gameContainer.appendChild(levelDisplay);
    
    document.addEventListener("keydown", function (event) { //checks for keys pressed by user
        if (event.code === "Space") {
            gravity = -gravity; //space bar reverses gravity when pressed
            stuck = false; // prevents ball from being glued to the side of an obstacle when gravity is reversed 
        }
        if (event.code === "KeyP") {
            if (!gameOver) {
            gamePaused = !gamePaused; // Toggle pause
            }
        }
        if (event.code === "KeyR") {
            location.reload(); // Restart game
        }
    });
    
    function createObstacle() { //creates new <div> in JS and applies CSS class "obstacle" to it, so it can be styled 
        const obstacle = document.createElement("div");
        obstacle.classList.add("obstacle");
    
        //randomly set obstacle's height and width between 50 and 130 pixels 
        let width = Math.random() * 80 + 50;
        let height = Math.random() * 80 + 50;
        
        //assigns the random dimension values to the CSS styling 
        obstacle.style.width = width + "px";
        obstacle.style.height = height + "px";

        //randomly decides if the obstacle is spawned on the top or bottom or screen with 50/50 probability of either.
        //if ceiling is true, it'll place it at top: 0px ---- if false it's place it at 400 - height 
        const isCeiling = Math.random() < 0.5;
        obstacle.style.top = isCeiling ? "0px" : `${400 - height}px`;
        obstacle.style.left = "800px"; //spawns obstacle at the right of the screen x=800, ready to scroll left into view. 
    
        gameContainer.appendChild(obstacle); //adds the newly created obstacle to the game-=container in the DOM, and keeps track of it in the obstacle array 
        obstacles.push(obstacle);
    }
    
    // before doing anything check if the game is paused
    function updateGame() {
        if (gamePaused || gameOver) {
            requestAnimationFrame(updateGame);
            return;
        }
    
        // Update vertical movement
        velocityY += gravity; // apply gravity to the ball's vertical velocity and update it's vertical position using that velocity 
        ballY += velocityY;
    
        const floorY = 400 - 34; // iof the ball goes below the floor, reset it above the floor and set vertical velocity to zero 
        if (ballY >= floorY) {
            ballY = floorY;
            velocityY = 0;
        }
        if (ballY <= 0) { // if the ball goes through the ceiling, set it back to 0px and reset speed so it stays on the ceiling. 
            ballY = 0;
            velocityY = 0;
        }
    
        let ballRect = ball.getBoundingClientRect(); // ball's current position and size in the browser window 
        stuck = false; //reset stuck=false each frame unless a side collision is detected
        let rolling = false; //indicates whether ball is rolling on top or below an obstacle. 
    
        obstacles.forEach((obstacle) => {
            let obstacleRect = obstacle.getBoundingClientRect(); // find the position and size of each obstacle on the screen 
    
            // Checks if the ball's rectangle overlaps with the rectangles of any of the obstacles, indicating a collision
            if (
                ballRect.left < obstacleRect.right &&
                ballRect.right > obstacleRect.left &&
                ballRect.top < obstacleRect.bottom &&
                ballRect.bottom > obstacleRect.top
            ) {
                // calculates how far the ball's bottom/top is to the obstacle's top/bottom in order to differentiate a vertical or side collision
                let diffTop = Math.abs(ballRect.bottom - obstacleRect.top);
                let diffBottom = Math.abs(ballRect.top - obstacleRect.bottom);
    
                // If the ball is moving down (gravity > 0) and the difference to the obstacle’s top is tiny (less than verticalThreshold), we place the ball on top of the obstacle, stop vertical motion, and set rolling = true.
                if (gravity > 0 && diffTop < verticalThreshold) {
                    ballY = obstacleRect.top - ballRect.height;
                    velocityY = 0;
                    rolling = true;
                }
                // If the ball is moving up (gravity < 0) and the difference to the obstacle’s bottom is tiny, do the opposite (place the ball under the obstacle).
                else if (gravity < 0 && diffBottom < verticalThreshold) {
                    ballY = obstacleRect.bottom;
                    velocityY = 0;
                    rolling = true;
                }
                // If neither of those apply, we treat it as a side collision—meaning the ball is now “stuck” and must move horizontally with the obstacle. We adjust ballCurrentX so it sits just to the left of the obstacle’s side.
                else {
                    stuck = true;
                    ballCurrentX = obstacleRect.left - ballRect.width;
                }
            }
        });
    
        //If we decided the ball is rolling on top/bottom of an obstacle, we move the ball left at the same rate the obstacle is moving left (so it “sticks” to that obstacle’s top/bottom).
        // If rolling on top or bottom of an obstacle, move right with the obstacle instead of left
        if (rolling) {
            ballCurrentX -= screenSpeed; // Ball stays aligned with moving obstacle
        }
    
        // If stuck, ball is pushed left with the obstacle
        if (stuck) {
            ballCurrentX -= screenSpeed;
        }
        //if not stuck, the ball tries to move back toward its ideal position ballX (e.g., if it got pushed left, it slides back toward the middle).
        else if (ballCurrentX < ballX) {
            ballCurrentX += 2; // Adjust return speed as needed
            if (ballCurrentX > ballX) ballCurrentX = ballX;
        }
        
        //apply the new horizontal position to the ball's CSS 
        ball.style.left = ballCurrentX + "px";
    
        // If the ball’s left edge is at or past the left boundary (x <= 0), we consider that “off-screen” → game over.
        if (ballCurrentX <= 0) {
            gameOver = true;
            gamePaused = true; 

            const gameOverMessage = document.createElement("div"); //Create gameover message as a new <div> with styling
            gameOverMessage.innerText = "GAME OVER\n  Press 'R' to try again";                                       
            gameOverMessage.style.position = "absolute";
            gameOverMessage.style.top = "50%";
            gameOverMessage.style.left = "50%";
            gameOverMessage.style.transform = "translate(-50%, -50%)";
            gameOverMessage.style.color = "white";
            gameOverMessage.style.fontSize = "24px";
            gameOverMessage.style.background = "rgba(0, 0, 0, 0.7)";
            gameOverMessage.style.padding = "20px";
            gameOverMessage.style.borderRadius = "10px";
            gameOverMessage.style.textAlign = "center";
            gameContainer.appendChild(gameOverMessage);
            gamePaused = true; // Pause the game to prevent further updates
            document.addEventListener("keydown", function (event) { //restart game if user pressed R key 
                if (event.code === "KeyR") {
                    location.reload();
                }
            }, { once: true });
        }
        //apply the ball's new horizontal position to it's CSS style
        ball.style.top = ballY + "px";

        //for every obstacle shfft left by screen speed 
        obstacles.forEach((obstacle, index) => {
            let obstacleX = parseInt(obstacle.style.left) - screenSpeed;
            obstacle.style.left = obstacleX + "px";
    
            // If an obstacle goes completely off screen (here, less than -150 px left), we remove it from the DOM and from our obstacles array (so it no longer takes up space or memory)
            if (obstacleX < -150) {
                gameContainer.removeChild(obstacle);
                obstacles.splice(index, 1);
            }
        });
    

        // gradually and continuously speed up obstacle movement to increase difficulty the longer you play 
        screenSpeed += 0.0005;
    
        requestAnimationFrame(updateGame); //schedules next animation frame so updateGame runs again and  the game continues on a loop 
    }
    
    updateGame(); //kicks of game loop for first time 
    
    //Purpose: Every second, a random number is compared to obstacleFrequency. If it’s lower, we spawn a new obstacle. This is how obstacles appear regularly.
    setInterval(() => {
        if (Math.random() < obstacleFrequency) {
            createObstacle();
        }
    }, 1000);
    
    // Increase obstacle speed and spawn rate every 10 seconds
    setInterval(() => {
        if (gamePaused || gameOver) return;

        screenSpeed += 0.5; // Increase speed gradually per level
        obstacleFrequency = Math.min(obstacleFrequency + 0.2, 1.0); // increase the frequency of obstacles by 0.2, but exceeed 10 

        level++;
        levelDisplay.innerText = "Level: " + level;

        console.log("New Level! Speed increased to:", screenSpeed, "Obstacle Frequency:", obstacleFrequency); //logs message in console with spawn rate and new speed
    }, 10000);
});
