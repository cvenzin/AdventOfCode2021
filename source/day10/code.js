import {
    getLines
} from '../modules/input.js'

const lines = getLines('day10');

const openingChars = ['(', '{', '[', '<'];
const closingChars = [')', '}', ']', '>'];
const errorScoreTable = {
    ')': 3,
    '}': 1197,
    ']': 57,
    '>': 25137
};
const autoCompleteScoreTable = {
    ')': 1,
    '}': 3,
    ']': 2,
    '>': 4
};

function part1() {
    let points = 0;
    lines.forEach(l => {
        const chars = l.split('');
        const stack = [];
        for (let char of chars) {
            const index = closingChars.indexOf(char);
            if (index > -1) {
                if (stack.length > 0 && stack[stack.length - 1] === openingChars[index]) {
                    stack.pop();
                } else {
                    points += errorScoreTable[char];
                    break;
                }
            } else {
                stack.push(char);
            }
        }
    });
    return points;
}
console.log(part1());

function part2() {
    const scores = [];
    loop1:
        for (let l of lines) {
            const chars = l.split('');
            const stack = [];
            for (let char of chars) {
                const index = closingChars.indexOf(char);
                if (index > -1) {
                    if (stack.length > 0 && stack[stack.length - 1] === openingChars[index]) {
                        stack.pop();
                    } else {
                        continue loop1;
                    }
                } else {
                    stack.push(char);
                }
            }

            let score = 0;
            while (stack.length > 0) {
                const v = stack.pop();
                const i = openingChars.indexOf(v);
                score *= 5;
                score += autoCompleteScoreTable[closingChars[i]];
            }
            scores.push(score);
        };
    return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)];
}
console.log(part2());