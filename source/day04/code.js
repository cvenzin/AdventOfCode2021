import {
    getLines
} from '../modules/input.js'

const lines = getLines('day04');
const drawnNumbers = lines[0].split(',').map(Number);
const originalBoards = [];

for (let i = 2; i < lines.length - 4; i += 6) {
    const board = [];
    for (let j = i; j < i + 5; j++) {
        const boardLine = lines[j].split(' ').filter(l => l !== '').map(Number);
        board.push(boardLine);
    }
    originalBoards.push(board);
}


function part1() {
    const boards = JSON.parse(JSON.stringify(originalBoards));
    for (let i = 0; i < drawnNumbers.length; i++) {
        updateBoards(boards, drawnNumbers[i]);
        for (let j = 0; j < boards.length; j++) {
            if (boardHasWon(boards[j])) {
                return getScore(boards[j]) * drawnNumbers[i];
            }
        }
    }
    return 'no winner';
}
console.log(part1());

function part2() {
    const boards = JSON.parse(JSON.stringify(originalBoards));
    const winningBoards = [];
    loop1:
        for (let i = 0; i < drawnNumbers.length; i++) {
            updateBoards(boards, drawnNumbers[i]);
            for (let j = 0; j < boards.length; j++) {
                if (!winningBoards.find(w => w[0] === boards[j]) && boardHasWon(boards[j])) {
                    winningBoards.push([boards[j], drawnNumbers[i]]);
                    if (winningBoards.length === boards.length) {
                        break loop1;
                    }
                }
            }
        }
    const lastWinner = winningBoards.pop();
    return getScore(lastWinner[0]) * lastWinner[1];
}
console.log(part2());


function boardHasWon(board) {
    for (let i = 0; i < board.length; i++) {
        if (board[i].every(n => n === null)) {
            return true;
        }
        if (board.every(n => n[i] === null)) {
            return true;
        }
    }
    return false;
}

function updateBoards(boards, number) {
    boards.forEach(board => {
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === number) {
                    board[i][j] = null;
                }
            }
        }
    });
}

function getScore(board) {
    let score = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] !== null) {
                score += board[i][j];
            }
        }
    }
    return score;
}