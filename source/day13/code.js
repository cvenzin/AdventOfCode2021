import {
    getLines
} from '../modules/input.js';

const lines = getLines('day13');

function part1() {
    const coords = getCoordinates();
    const folds = getFolds();
    return doFold(coords, folds[0]).length;
}
console.log(part1());

function part2() {
    let coords = getCoordinates();
    const folds = getFolds();
    folds.forEach(f => {
        coords = doFold(coords, f);
    });

    const maxX = Math.max(...coords.map(c => c[0]));
    const maxY = Math.max(...coords.map(c => c[1]));
    let text = '';
    for (let j = 0; j < maxY + 1; j++) {
        let line = '';
        for (let i = 0; i < maxX + 1; i++) {
            if (coords.some(c => c[0] === i && c[1] === j)) {
                line += '#';
            } else {
                line += '.';
            }
        }
        text += `${line}\n`;
    }
    return text;
}
console.log(part2());

function doFold(coords, fold) {
    const i = fold[0] !== null ? 0 : 1;
    const index = fold[i];
    const foldResult = coords.filter(c => c[i] < index);
    const coordsToFold = coords.filter(c => c[i] > index);
    const foldedCoords = coordsToFold.map(c => i === 1 ? [c[0], (index - 1) - (c[i] - index - 1)] : [(index - 1) - (c[i] - index - 1), c[1]]);
    foldedCoords.forEach(fc => {
        if (!foldResult.some(c => c[0] === fc[0] && c[1] === fc[1])) {
            foldResult.push(fc);
        }
    });
    return foldResult;
}

function getCoordinates() {
    const coordinates = [];
    for (const l of lines) {
        if (l === '') {
            break;
        }
        coordinates.push(l.split(',').map(Number));
    }
    return coordinates;
}

function getFolds() {
    const folds = [];
    for (const l of lines) {
        if (l.startsWith('fold along')) {
            const s = l.split('fold along ')[1].split('=');
            if (s[0] === 'x') {
                folds.push([Number(s[1]), null]);
            } else {
                folds.push([null, Number(s[1])]);
            }
        }
    }
    return folds;
}