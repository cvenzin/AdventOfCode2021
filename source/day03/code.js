import {
    getLines
} from '../modules/input.js'

const lines = getLines('day03');

function part1() {
    const ones = new Array(lines[0].length).fill(0);
    lines.forEach(l => {
        for (let i = 0; i < l.length; i++) {
            if (l[i] === '1') {
                ones[i] += 1;
            }
        }
    });
    const gammaRate = getRate('gamma', ones);
    const epsilonRate = getRate('epsilon', ones);
    return getNumberOfBinary(gammaRate) * getNumberOfBinary(epsilonRate);
}
console.log(part1());

function getRate(rateName, ones) {
    let rate = '';
    ones.forEach(o => {
        if (rateName === 'gamma' ? o < lines.length / 2 : o > lines.length / 2) {
            rate += '1';
        } else {
            rate += '0';
        }
    });
    return rate;
}

function getNumberOfBinary(binary) {
    return parseInt(binary, 2);
}
// function part2() {
//     const position = [0, 0, 0];
//     commands.forEach(command => {
//         if (command[0] === 'forward') {
//             position[0] += command[1];
//             position[1] += position[2] * command[1];
//         } else if (command[0] === 'up') {
//             position[2] -= command[1];
//         } else if (command[0] === 'down') {
//             position[2] += command[1];
//         }
//     });
//     return position[0] * position[1];
// }
// console.log(part2());