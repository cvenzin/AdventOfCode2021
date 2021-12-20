import {
    getLines
} from '../modules/input.js';

const lines = getLines('day19');

function part1And2() {
    const scanners = getScanners();
    scanners.forEach(scanner => {
        setAllRotations(scanner);
    });
    scanners.forEach(scanner => {
        setAllVectors(scanner);
    });
    const scanner0map = scanners[0].rotations[0];
    const scanner0Set = new Set();
    scanner0map.forEach(c => {
        scanner0Set.add(`${c}`);
    });
    const queue = [];
    for (let i = 1; i < scanners.length; i++) {
        queue.push(scanners[i]);
    }
    let mapVectorToCoordinate = getMapVectorToCoordinate(scanner0Set);
    const scannerPositions = [];
    while (queue.length > 0) {
        const scanner = queue.shift();
        let match = false;
        for (let i = 0; i < scanner.rotations.length; i++) {
            const [matched, offsetX, offsetY, offsetZ] = hasMatch(mapVectorToCoordinate, scanner.vectors[i]);
            match = matched;
            if (match) {
                for (let j = 0; j < scanner.rotations[i].length; j++) {
                    scanner0Set.add(`${scanner.rotations[i][j][0] + offsetX},${scanner.rotations[i][j][1] + offsetY},${scanner.rotations[i][j][2] + offsetZ}`);
                }
                mapVectorToCoordinate = getMapVectorToCoordinate(scanner0Set);
                scannerPositions.push([offsetX, offsetY, offsetZ]);
                break;
            }
        }

        if (!match) {
            queue.push(scanner);
        }
    }
    let maxDistance = 0;
    for (let i = 0; i < scannerPositions.length; i++) {
        for (let j = 0; j < scannerPositions.length; j++) {
            const a = scannerPositions[i];
            const b = scannerPositions[j];
            const d = Math.abs(b[0] - a[0]) + Math.abs(b[1] - a[1]) + Math.abs(b[2] - a[2]);
            if (d > maxDistance) {
                maxDistance = d;
            }
        }
    }
    return `beacons: ${scanner0Set.size}, largestDistance: ${maxDistance}`;
}
console.log(part1And2());

function getMapVectorToCoordinate(scanner0Set) {
    const scanner0Coordinates = [...scanner0Set.keys()].map(k => k.split(',').map(Number));
    const scanner0Vectors = getVectors(scanner0Coordinates);
    const mapVectorToCoordinate = new Map();
    for (let i = 0; i < scanner0Vectors.length; i++) {
        mapVectorToCoordinate.set(`${scanner0Vectors[i][0]}`, scanner0Vectors[i][1]);
    }
    return mapVectorToCoordinate;
}

function hasMatch(mapVectorToCoordinate, scannerXVectors) {
    let count = 0;
    for (let i = 0; i < scannerXVectors.length; i++) {
        const key = `${scannerXVectors[i][0]}`;
        if (mapVectorToCoordinate.has(key)) {
            count++;
            if (count === 12) {
                const a = mapVectorToCoordinate.get(key);
                const b = scannerXVectors[i][1];
                const offsetX = a[0] - b[0];
                const offsetY = a[1] - b[1];
                const offsetZ = a[2] - b[2];
                return [true, offsetX, offsetY, offsetZ];
            }
        }
    }
    return [false, 0, 0, 0];
}

function getVectors(rotation) {
    const vectors = [];
    for (let i = 0; i < rotation.length; i++) {
        for (let j = 0; j < rotation.length; j++) {
            if (i === j) {
                continue;
            }
            const v = getVector(rotation[i], rotation[j]);
            vectors.push([v, rotation[i], rotation[j]]);
        }
    }
    return vectors;
}

function getVector(p1, p2) {
    return `${p1[0] - p2[0]},${p1[1] - p2[1]},${p1[2] - p2[2]}`;
}

function getScanners() {
    const scanners = [];
    let scanner = null;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('---')) {
            scanner = {
                id: lines[i].split(' ')[2],
                rotations: [
                    []
                ]
            };
        } else if (lines[i] !== '') {
            scanner.rotations[0].push(lines[i].split(',').map(Number));
        } else {
            scanners.push(scanner);
        }

    }
    scanners.push(scanner);
    return scanners;
}

function setAllRotations(scanner) {
    const input = scanner.rotations[0];
    let rotation = [];
    for (let i = 1; i < 24; i++) {
        for (let j = 0; j < input.length; j++) {
            rotation.push(rotate(input[j], i));
        }
        scanner.rotations.push(rotation);
        rotation = [];
    }
}

function setAllVectors(scanner) {
    scanner.vectors = [];
    for (let i = 0; i < scanner.rotations.length; i++) {
        scanner.vectors.push(getVectors(scanner.rotations[i]));
    }
}

// got from reddit
function rotate(pos, rot) {
    let [x, y, z] = pos;
    // First, let's make Action 3 modulo 4.
    switch (rot % 4) {
        case 1:
            x = -x;
            y = -y;
            break;
        case 2:
            y = -y;
            z = -z;
            break;
        case 3:
            x = -x;
            z = -z;
            break;
    }
    // Then, let's make Action 1 the rotation divided by 4, floored, modulo 3.
    switch (Math.floor(rot / 4) % 3) {
        case 1: {
            const a = z;
            z = y;
            y = x;
            x = a;
            break;
        }
        case 2: {
            const a = x;
            x = y;
            y = z;
            z = a;
            break;
        }
    }
    // Finally, Action 2 (for the other three possible "orders" of x, y, and z) should check if the rotation is 12 or greater.
    // It doesn't matter if we pick the first, second or third slot to be negated, as long as we stick with it,
    // because Action 3 will cycle through those slots - notice the examples for Action 2 can be transformed to each other in such a way.
    if (rot > 11) {
        x = -x;
        const a = y;
        y = z;
        z = a;
    }
    return [x, y, z];
}