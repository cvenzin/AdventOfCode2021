import {
    getLines
} from '../modules/input.js';

const lines = getLines('day25');

function part1() {
    let map = getMap();
    // eslint-disable-next-line no-unused-vars
    const [minX, minY, maxX, maxY] = getMinMax(map);
    let moved = true;
    let steps = 0;
    while(moved){
        [moved, map] = step(map, maxX, maxY);
        steps++;
    }
    return steps;
}
console.log(part1());

function step(map, maxX, maxY) {
    let moved = false;
    let newMap = new Map(map);
    for (const [key, value] of map) {
        if (value === '>') {
            const coord = key.split(',').map(Number);
            const nextX = (coord[0] + 1) % (maxX + 1);
            const nextY = coord[1];
            if(!map.has(`${nextX},${nextY}`)){
                newMap.set(`${nextX},${nextY}`, '>');
                newMap.delete(key);
                moved = true;
            }
        }
    }
    map = newMap;
    newMap = new Map(map);
    for (const [key, value] of map) {
        if (value === 'v') {
            const coord = key.split(',').map(Number);
            const nextX = coord[0];
            const nextY = (coord[1] + 1) % (maxY + 1);
            if(!map.has(`${nextX},${nextY}`)){
                newMap.set(`${nextX},${nextY}`, 'v');
                newMap.delete(key);
                moved = true;
            }
        }
    }
    return [moved, newMap];
}

function getMap() {
    const map = new Map();
    for (let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[0].length; x++) {
            if (lines[y][x] === '>' || lines[y][x] === 'v') {
                map.set(`${x},${y}`, lines[y][x]);
            }
        }
    }
    return map;
}

function print(map) {
    let text = '';
    const [minX, minY, maxX, maxY] = getMinMax(map);
    for (let y = minY; y <= maxY; y++) {
        let line = '';
        for (let x = minX; x <= maxX; x++) {
            line += map.get(`${x},${y}`) || '.';
        }
        text += `${line}\n`;
    }
    console.log(text);
}

function getMinMax(map) {
    const data = [...map.keys()].map(k => k.split(',').map(Number));
    const minX = Math.min(...data.map(k => k[0]));
    const maxX = Math.max(...data.map(k => k[0]));
    const minY = Math.min(...data.map(k => k[1]));
    const maxY = Math.max(...data.map(k => k[1]));
    return [minX, minY, maxX, maxY];
}