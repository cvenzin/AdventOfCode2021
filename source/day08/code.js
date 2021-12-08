import {
    getLines
} from '../modules/input.js'

const lines = getLines('day08');

function part1() {
    let count = 0;
    lines.forEach(l => {
        const digits = l.split(' | ')[1].split(' ');
        digits.forEach(d => {
            if (d.length === 2 || d.length === 3 || d.length === 4 || d.length === 7) {
                count++;
            }
        })
    });
    return count;
}
console.log(part1());

function part2() {
    const outputValues = [];
    lines.forEach(l => {
        const leftDigits = l.split(' | ')[0].split(' ');
        const definition = getDefinition(leftDigits);
        const rightDigits = l.split(' | ')[1].split(' ');
        const decodedDigits = [];
        rightDigits.forEach(d => {
            const values = d.split('');
            decodedDigits.push(definition.findIndex(d => arraysAreEqual(values, d)));
        });
        outputValues.push(Number(decodedDigits.join('')));
    });
    return outputValues.reduce((a, b) => a + b);
}
console.log(part2());

function getDefinition(digits) {
    const definition = [];
    const one = digits.find(d => d.length === 2);
    definition[1] = one.split('');
    const seven = digits.find(d => d.length === 3);
    definition[7] = seven.split('');
    const four = digits.find(d => d.length === 4);
    definition[4] = four.split('');
    const eight = digits.find(d => d.length === 7);
    definition[8] = eight.split('');

    // 2, 3, 5
    const length5 = digits.filter(d => d.length === 5);
    definition[3] = length5.find(d => inArray(definition[1], d.split(''))).split('');

    // 5 matches 4 better than 2
    const twoOrFives = length5.filter(l => l !== definition[3].join('')).map(l => ({
        matches: getArrayMatches(l.split(''), definition[4]),
        value: l
    }));

    if (twoOrFives[0].matches > twoOrFives[1].matches) {
        definition[5] = twoOrFives[0].value.split('');
        definition[2] = twoOrFives[1].value.split('');
    } else {
        definition[5] = twoOrFives[1].value.split('');
        definition[2] = twoOrFives[0].value.split('');
    }

    // 0, 6, 9
    const length6 = digits.filter(d => d.length === 6);
    length6.forEach(l => {
        const f = l.split('');
        if (inArray(definition[1], f) && inArray(definition[7], f) && !inArray(definition[5], f)) {
            definition[0] = f;
        } else if (inArray(definition[1], f) && inArray(definition[7], f) && inArray(definition[5], f)) {
            definition[9] = f;
        } else {
            definition[6] = f;
        }
    });
    return definition;
}

function inArray(arr1, arr2) {
    return arr1.every(i => arr2.includes(i));
}

function arraysAreEqual(arr1, arr2) {
    return arr1.every(i => arr2.includes(i)) && arr1.length === arr2.length;
}

function getArrayMatches(arr1, arr2) {
    return arr1.filter(a => arr2.includes(a)).length;
}