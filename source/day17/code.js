import {
    getLines
} from '../modules/input.js';

const lines = getLines('day17');

function part1And2() {
    const targetArea = getTargetArea();
    const data = [...targetArea.keys()].map(k => k.split(',').map(Number));
    const maxX = Math.max(...data.map(k => k[0]));
    const minX = Math.min(...data.map(k => k[0]));
    const minY = Math.min(...data.map(k => k[1]));

    let xLow = 0;
    let xHigh = 0;
    let yLow = 0;
    let yHigh = 0;

    if (minX > 0) {
        xHigh = maxX;
        xLow = 0;
    }
    if (maxX < 0) {
        xHigh = 0;
        xLow = minX;
    }
    yHigh = Math.abs(minY);
    yLow = minY;

    console.log('bounds:', xLow, xHigh, yLow, yHigh);
    console.log('shots:', (xLow + xHigh) * (Math.abs(yLow) + yHigh));
    let maxHeight = 0;
    let hits = 0;
    for (let x = xLow; x <= xHigh; x++) {
        for (let y = yLow; y <= yHigh; y++) {
            const maxShotHeight = shoot(targetArea, [x, y], maxX, minY);
            if (typeof maxShotHeight === 'number') {
                if (maxShotHeight > maxHeight) {
                    maxHeight = maxShotHeight;
                }
                hits++;
            }
        }
    }
    return `highestPosition: ${maxHeight}\nhits: ${hits}`;
}
console.log(part1And2());

function shoot(targetArea, velocity, maxX, minY) {
    const coordinate = [0, 0];
    let maxHeight = 0;
    while (coordinate[0] <= maxX && coordinate[1] >= minY) {
        if (targetArea.get(coordinate.join(',')) === 'T') {
            return maxHeight;
        }
        coordinate[0] += velocity[0];
        coordinate[1] += velocity[1];
        if (velocity[0] < 0) {
            velocity[0]++;
        } else if (velocity[0] > 0) {
            velocity[0]--;
        }
        velocity[1]--;
        if (coordinate[1] > maxHeight) {
            maxHeight = coordinate[1];
        }
    }
}

function getTargetArea() {
    const map = new Map();
    const split = lines[0].split(', ');
    const xRange = split[0].split('=')[1].split('..').map(Number);
    const yRange = split[1].split('=')[1].split('..').map(Number);
    for (let x = xRange[0]; x <= xRange[1]; x++) {
        for (let y = yRange[0]; y <= yRange[1]; y++) {
            map.set(`${x},${y}`, 'T');
        }
    }
    return map;
}