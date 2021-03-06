import {
    getLines
} from '../modules/input.js';

const lines = getLines('day01');
const numbers = lines.map(n => Number(n));

function part1() {
    return countIncreases(numbers);
}
console.log(part1());

function part2() {
    const sums = [];
    for (let i = 0; i < numbers.length; i++) {
        if (i + 1 < numbers.length) {
            sums.push(numbers[i] + numbers[i + 1] + numbers[i + 2]);
        }
    }
    return countIncreases(sums);
}
console.log(part2());

function countIncreases(n) {
    let increases = 0;
    for (let i = 1; i < n.length; i++) {
        const previousNumber = n[i - 1];
        if (n[i] > previousNumber) {
            increases++;
        }
    }
    return increases;
}