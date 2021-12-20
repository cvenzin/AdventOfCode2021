import {
    getLines
} from '../modules/input.js';

const lines = getLines('day19');

function part1And2() {
    const scanners = getScanners();
    const scanner0rotation = scanners[0].rotations[0];
    const allScannerSet = new Set(scanner0rotation.map(c => c.toString()));
    const queue = [...scanners];
    let mapVectorToCoordinate = getMapVectorToCoordinate(allScannerSet);
    const scannerPositions = [];
    while (queue.length > 0) {
        const scanner = queue.shift();
        let match = false;
        for (let i = 0; i < 24; i++) {
            setRotation(scanner, i);
            setVectors(scanner, i);
            const [matched, offsetX, offsetY, offsetZ] = hasMatch(mapVectorToCoordinate, scanner.vectors[i]);
            match = matched;
            if (match) {
                for (let j = 0; j < scanner.rotations[i].length; j++) {
                    allScannerSet.add(`${scanner.rotations[i][j][0] + offsetX},${scanner.rotations[i][j][1] + offsetY},${scanner.rotations[i][j][2] + offsetZ}`);
                }
                mapVectorToCoordinate = getMapVectorToCoordinate(allScannerSet);
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
            const to = scannerPositions[i];
            const from = scannerPositions[j];
            const distance = Math.abs(from[0] - to[0]) + Math.abs(from[1] - to[1]) + Math.abs(from[2] - to[2]);
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        }
    }
    return `beacons: ${allScannerSet.size}, largestDistance: ${maxDistance}`;
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
                const from = mapVectorToCoordinate.get(key);
                const to = scannerXVectors[i][1];
                const offsetX = from[0] - to[0];
                const offsetY = from[1] - to[1];
                const offsetZ = from[2] - to[2];
                return [true, offsetX, offsetY, offsetZ];
            }
        }
    }
    return [false, 0, 0, 0];
}

function setRotation(scanner, i) {
    if (scanner.rotations[i]) {
        return;
    }
    const rotation = [];
    const input = scanner.rotations[0];
    for (let j = 0; j < input.length; j++) {
        rotation.push(rotate(input[j], i));
    }
    scanner.rotations[i] = rotation;
}

function setVectors(scanner, i) {
    if (scanner.vectors[i]) {
        return;
    }
    scanner.vectors[i] = getVectors(scanner.rotations[i]);
}

function getVectors(rotation) {
    const vectors = [];
    for (let i = 0; i < rotation.length; i++) {
        for (let j = 0; j < rotation.length; j++) {
            if (i === j) {
                continue;
            }
            const vector = getVector(rotation[i], rotation[j]);
            vectors.push([vector, rotation[i], rotation[j]]);
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
                ],
                vectors: []
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