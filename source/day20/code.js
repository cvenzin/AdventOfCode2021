import {
    getLines
} from '../modules/input.js';

const lines = getLines('day20');
const algorithm = lines[0];

function part1() {
    return getLitCount(2);
}
console.log(part1());

function part2() {
    return getLitCount(50);
}
console.log(part2());

function getLitCount(iterations) {
    let image = getImage();
    let outOfBoundsValue = '0';
    for (let i = 0; i < iterations; i++) {
        [image, outOfBoundsValue] = enhance(image, outOfBoundsValue);
    }
    return image.size;
}

// debugging
// eslint-disable-next-line no-unused-vars
function printImage(image) {
    const xyValues = [...image.keys()].map(xyFromKey);
    const yValues = xyValues.map(v => v[1]);
    const xValues = xyValues.map(v => v[0]);
    const minX = Math.min(...xValues);
    const minY = Math.min(...yValues);
    const maxX = Math.max(...xValues);
    const maxY = Math.max(...yValues);
    let text = '';
    for (let y = minY; y <= maxY; y++) {
        let line = '';
        for (let x = minX; x <= maxX; x++) {
            line += image.has(getKey(x, y)) ? '#' : '.';
        }
        text += `${line}\n`;
    }
    console.log(text);
}

function enhance(image, outOfBoundsValue) {
    const enhancedImage = new Set();
    const xyValues = [...image.keys()].map(xyFromKey);
    const yValues = xyValues.map(v => v[1]);
    const xValues = xyValues.map(v => v[0]);
    const minX = Math.min(...xValues);
    const minY = Math.min(...yValues);
    const maxX = Math.max(...xValues);
    const maxY = Math.max(...yValues);
    for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
            const binary = getBinary(x, y, minX, minY, maxX, maxY, image, outOfBoundsValue);
            const index = getNumberFromBinary(binary);
            if (algorithm[index] === '#') {
                enhancedImage.add(getKey(x, y));
            }
        }
    }
    return [enhancedImage, algorithm[0] === '#' && outOfBoundsValue === '0' ? '1' : '0'];
}

function getImage() {
    const image = new Set();
    for (let y = 2; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            if (lines[y][x] === '#') {
                image.add(getKey(x, y - 2));
            }
        }
    }
    return image;
}

function getBinary(x, y, minX, minY, maxX, maxY, image, outOfBoundsValue) {
    let binary = '';
    for (let y1 = y - 1; y1 <= y + 1; y1++) {
        for (let x1 = x - 1; x1 <= x + 1; x1++) {
            if (x1 >= minX && x1 <= maxX && y1 >= minY && y1 <= maxY) {
                binary += image.has(getKey(x1, y1)) ? '1' : '0';
            } else {
                binary += outOfBoundsValue;
            }
        }
    }
    return binary;
}

function getNumberFromBinary(binary) {
    return parseInt(binary, 2);
}

function getKey(x, y) {
    return `${x},${y}`;
}

function xyFromKey(key) {
    return key.split(',').map(Number);
}