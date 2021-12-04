import {
    getLines
} from '../modules/input.js'

const lines = getLines('day03');

function part1() {
    const ones = new Array(lines[0].length).fill(0);
    lines.forEach(l => {
        for (let i = 0; i < l.length; i++) {
            if (l[i] === '1') {
                ones[i] += 1;
            }
        }
    });
    const gammaRate = getRate('gamma', ones);
    const epsilonRate = getRate('epsilon', ones);
    return getNumberOfBinary(gammaRate) * getNumberOfBinary(epsilonRate);
}
console.log(part1());

function getRate(rateName, ones) {
    let rate = '';
    ones.forEach(o => {
        if (rateName === 'gamma' ? o < lines.length / 2 : o > lines.length / 2) {
            rate += '1';
        } else {
            rate += '0';
        }
    });
    return rate;
}

function getNumberOfBinary(binary) {
    return parseInt(binary, 2);
}

function part2() {
    const oxygenGeneratorRating = getRating([...lines], 0, false);
    const co2scrubberRating = getRating([...lines], 0, true);
    return getNumberOfBinary(oxygenGeneratorRating) * getNumberOfBinary(co2scrubberRating);
}
console.log(part2());

function getRating(lines, index, inverse) {
    if (index === lines[0].length || lines.length < 2) {
        return lines[0];
    }
    let ones = 0;
    lines.forEach(l => {
        if (l[index] === '1') {
            ones++;
        }
    });
    if (inverse ? ones < lines.length / 2 : ones >= lines.length / 2) {
        lines = filterLines(lines, '1', index);
    } else {
        lines = filterLines(lines, '0', index);
    }
    return getRating(lines, index + 1, inverse);
}

function filterLines(lines, bit, index) {
    return lines.filter(l => l[index] === bit);
}