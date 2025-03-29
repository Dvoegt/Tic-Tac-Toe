class TicTacToe {
    constructor() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = false;
        this.playerSymbol = '';
        this.computerSymbol = '';
        this.winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        
        this.initializeGame();
    }

    initializeGame() {
        // Player selection buttons
        document.getElementById('choose-x').addEventListener('click', () => this.startGame('X'));
        document.getElementById('choose-o').addEventListener('click', () => this.startGame('O'));
        
        // Cell click handlers
        document.querySelectorAll('[data-cell]').forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });
        
        // Restart button
        document.getElementById('restart-button').addEventListener('click', () => this.restartGame());
    }

    startGame(symbol) {
        this.playerSymbol = symbol;
        this.computerSymbol = symbol === 'X' ? 'O' : 'X';
        this.gameActive = true;
        document.getElementById('player-selection').classList.add('hidden');
        document.getElementById('game-container').classList.remove('hidden');
        
        // If computer is X, make first move
        if (this.computerSymbol === 'X') {
            this.makeComputerMove();
        }
    }

    handleCellClick(e) {
        const cell = e.target;
        const cellIndex = Array.from(cell.parentNode.children).indexOf(cell);
        
        if (this.board[cellIndex] !== '' || !this.gameActive) return;
        
        this.makeMove(cellIndex, this.playerSymbol);
        
        if (this.gameActive) {
            this.makeComputerMove();
        }
    }

    makeMove(index, symbol) {
        this.board[index] = symbol;
        document.querySelectorAll('[data-cell]')[index].textContent = symbol;
        
        if (this.checkWin(symbol)) {
            this.endGame(`${symbol === this.playerSymbol ? 'You' : 'Computer'} won!`);
        } else if (this.checkDraw()) {
            this.endGame('Game ended in a draw!');
        }
    }

    makeComputerMove() {
        const bestMove = this.findBestMove();
        this.makeMove(bestMove, this.computerSymbol);
    }

    findBestMove() {
        // First, check if computer can win
        const winningMove = this.findWinningMove(this.computerSymbol);
        if (winningMove !== -1) return winningMove;

        // Then, block player from winning
        const blockingMove = this.findWinningMove(this.playerSymbol);
        if (blockingMove !== -1) return blockingMove;

        // Try to take center
        if (this.board[4] === '') return 4;

        // Take corners
        const corners = [0, 2, 6, 8];
        const availableCorners = corners.filter(i => this.board[i] === '');
        if (availableCorners.length > 0) {
            return availableCorners[Math.floor(Math.random() * availableCorners.length)];
        }

        // Take any available space
        const availableSpaces = this.board.map((cell, index) => cell === '' ? index : -1)
            .filter(index => index !== -1);
        return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    }

    findWinningMove(symbol) {
        for (let i = 0; i < this.board.length; i++) {
            if (this.board[i] === '') {
                this.board[i] = symbol;
                if (this.checkWin(symbol)) {
                    this.board[i] = '';
                    return i;
                }
                this.board[i] = '';
            }
        }
        return -1;
    }

    checkWin(symbol) {
        return this.winningCombinations.some(combination => {
            return combination.every(index => {
                return this.board[index] === symbol;
            });
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }

    endGame(message) {
        this.gameActive = false;
        document.querySelector('.status').textContent = message;
    }

    restartGame() {
        this.board = Array(9).fill('');
        this.currentPlayer = 'X';
        this.gameActive = true;
        document.querySelectorAll('[data-cell]').forEach(cell => {
            cell.textContent = '';
        });
        document.querySelector('.status').textContent = 'Your turn!';
        
        // If computer is X, make first move
        if (this.computerSymbol === 'X') {
            this.makeComputerMove();
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new TicTacToe();
}); 