import {
    getLines
} from '../modules/input.js'

const lines = getLines('day07');
const crabPositions = lines[0].split(',').map(Number).sort((a, b) => a - b);

function part1() {
    return compute(0);
}
console.log(part1());

function part2() {
    return compute(1);
}
console.log(part2());

function compute(movingCost) {
    const index = Math.floor(crabPositions.reduce((a, b) => a + b) / crabPositions.length);
    let fuel = Number.MAX_SAFE_INTEGER;
    fuel = getCheapestFuel(fuel, false, index, movingCost);
    fuel = getCheapestFuel(fuel, true, index - 1, movingCost);
    return fuel;
}

function getCheapestFuel(fuel, left, index, movingCost) {
    while (true) {
        const cost = getFuelCost(index, movingCost);
        if (cost < fuel) {
            fuel = cost;
            left ? index-- : index++;
        } else {
            return fuel;
        }
    }
}

function getFuelCost(position, movingCost) {
    return crabPositions.map(c => {
        let moves = Math.abs(position - c);
        let value = 0;
        let cost = 1;
        while (moves) {
            moves--;
            value += cost;
            cost += movingCost;
        }
        return value;
    }).reduce((a, b) => a + b);
}