import {
    getLines
} from '../modules/input.js'

const lines = getLines('day06');
const fish = lines[0].split(',').map(Number);

function part1() {
    return computeFishCount(80, fish);
}
console.log(part1());

function part2() {
    return computeFishCount(256, fish);
}
console.log(part2());

function computeFishCount(days, fish) {
    // index is timer, value is number of fish
    const data = new Array(9).fill(0);
    fish.forEach(f => {
        data[f]++;
    });

    for (let i = 0; i < days; i++) {
        // move array to the left and update fish count
        const zeroTimerFish = data.shift();
        data.push(zeroTimerFish);
        data[6] += zeroTimerFish;
    }

    return data.reduce((a, b) => a + b);
}