import {
    getLines
} from '../modules/input.js'

const lines = getLines('day09');

const grid = [];
lines.forEach(l => {
    grid.push(l.split('').map(Number));
});

function part1() {
    return findLowPoints().map(lp => grid[lp[0]][lp[1]] + 1).reduce((a, b) => a + b);
}
console.log(part1());

function part2() {
    const sizes = findLowPoints().map(lp => getBasinSize(lp[0], lp[1], new Map())).sort((a, b) => b - a);
    return sizes[0] * sizes[1] * sizes[2];
}
console.log(part2());

function findLowPoints() {
    const lowPoints = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (isLowPoint(i, j, grid)) {
                lowPoints.push([i, j]);
            }
        }
    }
    return lowPoints;
}

function isLowPoint(x, y) {
    const height = grid[x][y];
    const neighbors = getNeighbors(x, y);
    for (let i = 0; i < neighbors.length; i++) {
        const x1 = neighbors[i][0];
        const y1 = neighbors[i][1];
        if (x1 >= 0 && x1 < grid.length && y1 >= 0 && y1 < grid[0].length) {
            if (grid[x1][y1] <= height) {
                return false;
            }
        }
    }
    return true;
}

function getBasinSize(x, y, visitedLocations) {
    let size = 1;
    visitedLocations.set([x, y].toString(), true);
    const neighbors = getNeighbors(x, y);
    for (let i = 0; i < neighbors.length; i++) {
        const x1 = neighbors[i][0];
        const y1 = neighbors[i][1];
        if (x1 >= 0 && x1 < grid.length && y1 >= 0 && y1 < grid[0].length) {
            if (grid[x1][y1] !== 9 && !visitedLocations.get([x1, y1].toString())) {
                size += getBasinSize(x1, y1, visitedLocations);
            }
        }
    }
    return size;
}

function getNeighbors(x, y) {
    return [
        [x - 1, y],
        [x, y + 1],
        [x + 1, y],
        [x, y - 1]
    ];
}