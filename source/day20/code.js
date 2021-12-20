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
    const xyValues = [...image.keys()].map(key => key.split(',').map(Number));
    const yValues = xyValues.map(v => v[1]);
    const xValues = xyValues.map(v => v[0]);
    let minX = Math.min(...xValues);
    let minY = Math.min(...yValues);
    let maxX = Math.max(...xValues);
    let maxY = Math.max(...yValues);
    let outOfBoundsValue = '0';
    const startsWithHash = algorithm[0] === '#';
    for (let i = 0; i < iterations; i++) {
        [image, outOfBoundsValue, minX, minY, maxX, maxY] = enhance(image, outOfBoundsValue, minX, minY, maxX, maxY, startsWithHash);
    }
    return image.size;
}

function enhance(image, outOfBoundsValue, minX, minY, maxX, maxY, startsWithHash) {
    const enhancedImage = new Set();
    for (let y = minY - 1; y <= maxY + 1; y++) {
        for (let x = minX - 1; x <= maxX + 1; x++) {
            if (isLit(x, y, minX, minY, maxX, maxY, image, outOfBoundsValue)) {
                enhancedImage.add(`${x},${y}`);
            }
        }
    }
    return [enhancedImage, startsWithHash && outOfBoundsValue === '0' ? '1' : '0', --minX, --minY, ++maxX, ++maxY];
}

function isLit(x, y, minX, minY, maxX, maxY, image, outOfBoundsValue) {
    let binary = '';
    for (let y1 = y - 1; y1 <= y + 1; y1++) {
        for (let x1 = x - 1; x1 <= x + 1; x1++) {
            if (x1 >= minX && x1 <= maxX && y1 >= minY && y1 <= maxY) {
                binary += image.has(`${x1},${y1}`) ? '1' : '0';
            } else {
                binary += outOfBoundsValue;
            }
        }
    }
    return algorithm[parseInt(binary, 2)] === '#';
}

function getImage() {
    const image = new Set();
    for (let y = 2; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            if (lines[y][x] === '#') {
                image.add(`${x},${y - 2}`);
            }
        }
    }
    return image;
}