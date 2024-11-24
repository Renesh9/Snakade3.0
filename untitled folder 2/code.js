
const GRID_SIZE = 20;
const GAME_SPEED = 100;
const INITIAL_SNAKE_LENGTH = 4;

class SnakeGame {
    constructor() {
       
        this.gameArea = document.getElementById('gameArea');
        this.currentScore = document.getElementById('currentScore');
        this.highScore = document.getElementById('highScore');
        this.startBtn = document.getElementById('startGame');
        this.pauseBtn = document.getElementById('pauseGame');
        this.resetBtn = document.getElementById('resetGame');
        

        this.gameArea.style.width = '400px';
        this.gameArea.style.height = '400px';
        this.gameArea.style.border = '2px solid #333';
        this.gameArea.style.position = 'relative';
        this.gameArea.style.backgroundColor = '#f0f0f0';
        
        
        this.snake = [];
        this.food = null;
        this.direction = 'right';
        this.nextDirection = 'right';
        this.score = 0;
        this.gameLoop = null;
        this.isPaused = false;
        this.isGameOver = true;
        
        this.bindControls();
        this.bindButtons();
        
        
        this.setupInitialState();
    }
    
    setupInitialState() {
        
        this.gameArea.innerHTML = '';
        this.currentScore.textContent = '0';
        
       
        this.snake = [];
        for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
            this.snake.push({
                x: Math.floor(GRID_SIZE / 2) - i,
                y: Math.floor(GRID_SIZE / 2)
            });
        }
        
       
        this.snake.forEach(segment => {
            const element = this.createGameElement('snake');
            this.positionElement(element, segment);
        });
    }
    
    startGame() {
        if (!this.isGameOver) return;
        
        
        this.isGameOver = false;
        this.isPaused = false;
        this.score = 0;
        this.currentScore.textContent = '0';
        this.direction = 'right';
        this.nextDirection = 'right';
        
     
        this.gameArea.innerHTML = '';
        
       
        this.snake = [];
        for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
            this.snake.push({
                x: Math.floor(GRID_SIZE / 2) - i,
                y: Math.floor(GRID_SIZE / 2)
            });
        }
        
        
        this.snake.forEach(segment => {
            const element = this.createGameElement('snake');
            this.positionElement(element, segment);
        });
        
        
        this.createFood();
        
        
        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => {
            if (!this.isPaused && !this.isGameOver) {
                this.moveSnake();
            }
        }, GAME_SPEED);
        
       
        this.startBtn.textContent = 'Restart';
        this.pauseBtn.disabled = false;
    }
    
    createGameElement(className) {
        const element = document.createElement('div');
        element.className = className;
        element.style.width = `${400 / GRID_SIZE}px`;
        element.style.height = `${400 / GRID_SIZE}px`;
        element.style.position = 'absolute';
        element.style.borderRadius = '50%';
        
        if (className === 'snake') {
            element.style.backgroundColor = '#4CAF50';
        } else if (className === 'food') {
            element.style.backgroundColor = '#FF4081';
        }
        
        this.gameArea.appendChild(element);
        return element;
    }
    
    positionElement(element, position) {
        element.style.left = `${(position.x * 400) / GRID_SIZE}px`;
        element.style.top = `${(position.y * 400) / GRID_SIZE}px`;
    }
    
    createFood() {
        if (this.food) {
            const foodElement = this.gameArea.querySelector('.food');
            if (foodElement) foodElement.remove();
        }
        
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE)
            };
        } while (this.snake.some(segment => segment.x === position.x && segment.y === position.y));
        
        this.food = position;
        const foodElement = this.createGameElement('food');
        this.positionElement(foodElement, position);
    }
    
    moveSnake() {
        
        this.direction = this.nextDirection;
        
        
        const head = { ...this.snake[0] };
        switch (this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        
      
        if (this.checkCollision(head)) {
            this.gameOver();
            return;
        }
        
        
        this.snake.unshift(head);
        
        
        if (this.food && head.x === this.food.x && head.y === this.food.y) {
            
            this.createFood();
            
           
            this.score += 10;
            this.currentScore.textContent = this.score;
            
          
            const currentHigh = parseInt(this.highScore.textContent) || 0;
            if (this.score > currentHigh) {
                this.highScore.textContent = this.score;
            }
        } else {
            
            this.snake.pop();
        }
        
        
        this.gameArea.innerHTML = '';
        this.snake.forEach(segment => {
            const element = this.createGameElement('snake');
            this.positionElement(element, segment);
        });
        
       
        if (this.food) {
            const foodElement = this.createGameElement('food');
            this.positionElement(foodElement, this.food);
        }
    }
    
    checkCollision(position) {
       
        if (position.x < 0 || position.x >= GRID_SIZE || 
            position.y < 0 || position.y >= GRID_SIZE) {
            return true;
        }
        
        
        return this.snake.slice(1).some(segment => 
            segment.x === position.x && segment.y === position.y);
    }
    
    gameOver() {
        this.isGameOver = true;
        clearInterval(this.gameLoop);
        alert(`Game Over! Your score: ${this.score}`);
        this.setupInitialState();
        this.startBtn.textContent = 'Start Game';
        this.pauseBtn.disabled = true;
    }
    
    bindControls() {
        
        document.addEventListener('keydown', (e) => {
            if (this.isGameOver) return;
            
            switch (e.key) {
                case 'ArrowUp':
                    if (this.direction !== 'down') this.nextDirection = 'up';
                    break;
                case 'ArrowDown':
                    if (this.direction !== 'up') this.nextDirection = 'down';
                    break;
                case 'ArrowLeft':
                    if (this.direction !== 'right') this.nextDirection = 'left';
                    break;
                case 'ArrowRight':
                    if (this.direction !== 'left') this.nextDirection = 'right';
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
        });
       

        const upBtn = document.getElementById('upBtn');
        const downBtn = document.getElementById('downBtn');
        const leftBtn = document.getElementById('leftBtn');
        const rightBtn = document.getElementById('rightBtn');
        
        if (upBtn) upBtn.addEventListener('click', () => {
            if (this.direction !== 'down') this.nextDirection = 'up';
        });
        if (downBtn) downBtn.addEventListener('click', () => {
            if (this.direction !== 'up') this.nextDirection = 'down';
        });
        if (leftBtn) leftBtn.addEventListener('click', () => {
            if (this.direction !== 'right') this.nextDirection = 'left';
        });
        if (rightBtn) rightBtn.addEventListener('click', () => {
            if (this.direction !== 'left') this.nextDirection = 'right';
        });
    }
    
    bindButtons() {
        // Start button
        this.startBtn.addEventListener('click', () => {
            this.startGame();
        });
        
        // Pause button
        this.pauseBtn.addEventListener('click', () => {
            this.togglePause();
        });
        
        // Reset button
        this.resetBtn.addEventListener('click', () => {
            this.gameOver();
            this.setupInitialState();
        });
        
        // Initially disable pause button
        this.pauseBtn.disabled = true;
    }
    
    togglePause() {
        if (!this.isGameOver) {
            this.isPaused = !this.isPaused;
            this.pauseBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new SnakeGame();
});