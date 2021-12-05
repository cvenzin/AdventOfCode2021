import {
    getLines
} from '../modules/input.js'

const lines = getLines('day05');

const lineSegments = [];
lines.forEach(l => {
    const s = l.split(' -> ');
    const lineSegment = {
        start: s[0].split(',').map(Number),
        end: s[1].split(',').map(Number)
    };
    lineSegments.push(lineSegment);
});

function part1() {
    const vhLines = lineSegments.filter(ls => ls.start[0] === ls.end[0] || ls.start[1] === ls.end[1]);
    return solve(vhLines);
}
console.log(part1());

function part2() {
    return solve(lineSegments);
}
console.log(part2());

function solve(lineSegments){
    const map = new Map();
    lineSegments.forEach(l => {
        drawLine(l, map);
    });
    return Array.from(map.values()).filter(v => v > 1).length;
}

function drawLine(line, map) {
    const end = line.end;
    const currentPoint = [...line.start];
    updateMap(currentPoint, map);
    while (currentPoint[0] !== end[0] || currentPoint[1] !== end[1]) {
        if (currentPoint[0] < end[0]) {
            currentPoint[0]++;
        } else if (currentPoint[0] > end[0]) {
            currentPoint[0]--;
        }
        if (currentPoint[1] < end[1]) {
            currentPoint[1]++;
        } else if (currentPoint[1] > end[1]) {
            currentPoint[1]--;
        }
        updateMap(currentPoint, map);
    }
}

function updateMap(point, map) {
    const key = point.toString();
    const value = map.get(key) || 0;
    map.set(key, value + 1);
}