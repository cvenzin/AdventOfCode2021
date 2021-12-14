import {
    getLines
} from '../modules/input.js';

const lines = getLines('day14');

function part1() {
    return compute(10);
}
console.log(part1());

function part2() {
    return compute(40);
}
console.log(part2());


function compute(steps) {
    const template = lines[0];
    const rules = getRules();
    const map = new Map();
    for (let i = 0; i < template.length - 1; i++) {
        const key = `${template[i]}${template[i + 1]}`;
        map.set(key, (map.get(key) || 0) + 1);
    }
    const mapCount = new Map();
    for (let i = 0; i < template.length; i++) {
        mapCount.set(template[i], (mapCount.get(template[i]) || 0) + 1);
    }
    for (let i = 0; i < steps; i++) {
        const mapCopy = new Map(map);
        [...map.keys()].forEach(ab => {
            const x = rules.get(ab);
            const ax = `${ab[0]}${x}`;
            const xb = `${x}${ab[1]}`;
            const count = mapCopy.get(ab);
            map.set(ab, map.get(ab) - count);
            map.set(ax, (map.get(ax) || 0) + count);
            map.set(xb, (map.get(xb) || 0) + count);
            mapCount.set(x, (mapCount.get(x) || 0) + count);
        });
    }

    const values = [...mapCount.entries()];
    values.sort((a, b) => a[1] - b[1]);
    return values[values.length - 1][1] - values[0][1];
}

function getRules() {
    const rules = new Map();
    lines.forEach(l => {
        if (l.includes(' -> ')) {
            const s = l.split(' -> ');
            rules.set(s[0], s[1]);
        }
    });
    return rules;
}