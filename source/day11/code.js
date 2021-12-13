import {
    getLines
} from '../modules/input.js';

const lines = getLines('day11');

function part1() {
    const grid = getGrid(lines);
    let flashes = 0;
    for (let i = 0; i < 100; i++) {
        flashes += step(grid, new Map());
    }
    return flashes;
}
console.log(part1());

function part2() {
    const grid = getGrid(lines);
    let steps = 1;
    while (step(grid, new Map()) !== (grid.length * grid[0].length)) {
        steps++;
    }
    return steps;
}
console.log(part2());

function step(grid, map) {
    increaseByOne(grid);
    const flashes = getFlashCount(grid, map);
    reset(grid);
    return flashes;
}

function increaseByOne(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            grid[i][j]++;
        }
    }
}

function getFlashCount(grid, map) {
    let flashes = 0;
    let hasFlash = true;
    while (hasFlash) {
        hasFlash = false;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                const key = `${i},${j}`;
                if (grid[i][j] > 9 && !map.get(key)) {
                    map.set(key, true);
                    flashes++;
                    hasFlash = true;
                    getNeighbors(i, j).forEach(n => {
                        if (n[0] > -1 && n[1] > -1 && n[0] < grid.length && n[1] < grid[i].length) {
                            grid[n[0]][n[1]]++;
                        }
                    });
                }
            }
        }
    }
    return flashes;
}

function reset(grid) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] > 9) {
                grid[i][j] = 0;
            }
        }
    }
}

function getGrid(ls) {
    const grid = [];
    ls.forEach(l => {
        grid.push(l.split('').map(Number));
    });
    return grid;
}

function getNeighbors(x, y) {
    const neighbors = [];
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            neighbors.push([x + i, y + j]);
        }
    }
    return neighbors;
}