import {
    getLines
} from '../modules/input.js'

const lines = getLines('day12');
const caveSystem = getCaveSystem(lines);

function part1() {
    return findPaths(caveSystem.get('start'), caveSystem, new Map(), 1);
}
console.log(part1());

function part2() {
    return findPaths(caveSystem.get('start'), caveSystem, new Map(), 2);
}
console.log(part2());

function findPaths(cave, caveSystem, map, allowedSmallCaveVisits) {
    let paths = 0;
    for (let childCaveName of cave.values()) {
        const newMap = new Map(map);
        if (childCaveName === 'start') {
            continue;
        } else if (childCaveName === 'end') {
            paths++;
        } else if (isSmallCave(childCaveName)) {
            let visits = newMap.get(childCaveName) || 0;
            if (visits === 0 || (visits < allowedSmallCaveVisits && [...newMap.values()].every(v => v < allowedSmallCaveVisits))) {
                newMap.set(childCaveName, ++visits);
                paths += findPaths(caveSystem.get(childCaveName), caveSystem, newMap, allowedSmallCaveVisits);
            }
        } else {
            paths += findPaths(caveSystem.get(childCaveName), caveSystem, newMap, allowedSmallCaveVisits);
        }
    }
    return paths;
}

function isSmallCave(caveName) {
    if (caveName === 'start' || caveName === 'end') {
        return false;
    }
    if (caveName.toUpperCase() === caveName) {
        return false;
    }
    return true;
}

function getCaveSystem(lines) {
    const map = new Map();
    lines.forEach(l => {
        const s = l.split('-');
        const s1 = s[0];
        const s2 = s[1];
        if (!map.get(s1)) {
            map.set(s1, new Set());
        }
        map.get(s1).add(s2);

        if (!map.get(s2)) {
            map.set(s2, new Set());
        }
        map.get(s2).add(s1);
    });
    return map;
}