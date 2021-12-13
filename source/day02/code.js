import {
    getLines
} from '../modules/input.js';

const lines = getLines('day02');
const commands = lines.map(l => {
    const s = l.split(' ');
    return [s[0], Number(s[1])];
});

function part1() {
    const position = [0, 0];
    commands.forEach(command => {
        if (command[0] === 'forward') {
            position[0] += command[1];
        } else if (command[0] === 'up') {
            position[1] -= command[1];
        } else if (command[0] === 'down') {
            position[1] += command[1];
        }
    });
    return position[0] * position[1];
}
console.log(part1());

function part2() {
    const position = [0, 0, 0];
    commands.forEach(command => {
        if (command[0] === 'forward') {
            position[0] += command[1];
            position[1] += position[2] * command[1];
        } else if (command[0] === 'up') {
            position[2] -= command[1];
        } else if (command[0] === 'down') {
            position[2] += command[1];
        }
    });
    return position[0] * position[1];
}
console.log(part2());