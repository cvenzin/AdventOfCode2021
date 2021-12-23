import {
    getLines
} from '../modules/input.js';

const lines = getLines('day22');

function part1() {
    const instructions = getInstructions();
    return applyInstructionsSlow(instructions);
}
console.log(part1());

function part2() {
    const instructions = getInstructions();
    return applyInstructionsFast(instructions);
}
console.log(part2());

function applyInstructionsSlow(instructions) {
    const set = new Set();
    instructions.forEach(i => {
        for (let x = i[1]; x <= i[2] && x <= 50 && x >= -50; x++) {
            for (let y = i[3]; y <= i[4] && y <= 50 && y >= -50; y++) {
                for (let z = i[5]; z <= i[6] && z <= 50 && z >= -50; z++) {
                    const key = [x, y, z].toString();
                    if (i[0]) {
                        set.add(key);
                    } else {
                        set.delete(key);
                    }
                }
            }
        }
    });
    return set.size;
}

function applyInstructionsFast(instructions) {
    let nonIntersectingCubes = [];
    for (const instruction of instructions) {
        const isAdd = instruction.shift();
        const cube = instruction;
        const [minX, maxX, minY, maxY, minZ, maxZ] = cube;
        for (let i = 0; i < nonIntersectingCubes.length; i++) {
            if (intersect(cube, nonIntersectingCubes[i])) {
                const [minX2, maxX2, minY2, maxY2, minZ2, maxZ2] = nonIntersectingCubes[i];
                // cube splitting algo from reddit
                if (minX > minX2) {
                    nonIntersectingCubes.push([minX2, minX - 1, minY2, maxY2, minZ2, maxZ2]);
                }
                if (maxX < maxX2) {
                    nonIntersectingCubes.push([maxX + 1, maxX2, minY2, maxY2, minZ2, maxZ2]);
                }
                if (minY > minY2) {
                    nonIntersectingCubes.push([Math.max(minX2, minX), Math.min(maxX2, maxX), minY2, minY - 1, minZ2, maxZ2]);
                }
                if (maxY < maxY2) {
                    nonIntersectingCubes.push([Math.max(minX2, minX), Math.min(maxX2, maxX), maxY + 1, maxY2, minZ2, maxZ2]);
                }
                if (minZ > minZ2) {
                    nonIntersectingCubes.push([Math.max(minX2, minX), Math.min(maxX2, maxX), Math.max(minY2, minY), Math.min(maxY2, maxY), minZ2, minZ - 1]);
                }
                if (maxZ < maxZ2) {
                    nonIntersectingCubes.push([Math.max(minX2, minX), Math.min(maxX2, maxX), Math.max(minY2, minY), Math.min(maxY2, maxY), maxZ + 1, maxZ2]);
                }
                nonIntersectingCubes[i] = null;
            }
        }
        nonIntersectingCubes = nonIntersectingCubes.filter(c => c);
        if (isAdd) {
            nonIntersectingCubes.push([Math.min(minX, maxX), Math.max(minX, maxX), Math.min(minY, maxY), Math.max(minY, maxY), Math.min(minZ, maxZ), Math.max(minZ, maxZ)]);
        }
    }
    return nonIntersectingCubes.map(getVolume).reduce((a, b) => a + b);
}

function intersect(cube1, cube2) {
    return !(cube1[0] > cube2[1] || cube1[1] < cube2[0] || cube1[2] > cube2[3] || cube1[3] < cube2[2] || cube1[4] > cube2[5] || cube1[5] < cube2[4]);
}

function getVolume(cube) {
    return (Math.abs(cube[0] - cube[1]) + 1) * (Math.abs(cube[2] - cube[3]) + 1) * (Math.abs(cube[4] - cube[5]) + 1);
}

function getInstructions() {
    const instructions = [];
    lines.forEach(l => {
        const values = l.match(/-?\d+/g).map(Number);
        instructions.push([l.startsWith('on'), ...values]);
    });
    return instructions;
}