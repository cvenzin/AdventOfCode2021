import {
    getLines
} from '../modules/input.js';
import * as PImage from 'pureimage';
import * as fs from 'fs';

const lines = getLines('2018_day17');

function part1() {
    const map = getMap();
    map.set('500,0', '+');
    compute(map);
    printMap(map);
    return countWater(map);
}
console.log(part1());

function compute(map) {
    let scanLinePositionY = 0;
    const waterfalls = new Set();
    waterfalls.add(500);
    let fillingWaterFall = -1;
    let iteration = 0; // debugging
    const maxY = getMinMax(map)[3];
    while (scanLinePositionY < maxY && iteration < Infinity) {
        iteration++;
        let fillUp = false;
        for (const waterfallPositionX of waterfalls.keys()) {
            if (scanLinePositionY === maxY) {
                continue;
            }
            if (isSand(map, waterfallPositionX, scanLinePositionY + 1, maxY)) {
                if (!isSand(map, waterfallPositionX, scanLinePositionY - 1, maxY) || scanLinePositionY === 0) {
                    setWater(map, waterfallPositionX, scanLinePositionY + 1);
                }
            } else if (isClay(map, waterfallPositionX, scanLinePositionY + 1)) {
                fillUp = true;
                fillingWaterFall = waterfallPositionX;
                let x = waterfallPositionX;
                setWater(map, x, scanLinePositionY);
                while (!isClay(map, ++x, scanLinePositionY)) {
                    if (isSand(map, x, scanLinePositionY + 1, maxY)) {
                        fillUp = false;
                        fillingWaterFall = -1;
                        waterfalls.delete(waterfallPositionX);
                        if (!waterfalls.has(x - 1)) {
                            waterfalls.add(x);
                            setWater(map, x, scanLinePositionY);
                            setWater(map, x, scanLinePositionY + 1);
                        }
                        break;
                    }
                    setWater(map, x, scanLinePositionY);
                }
                x = waterfallPositionX;
                while (!isClay(map, --x, scanLinePositionY)) {
                    if (isSand(map, x, scanLinePositionY + 1, maxY)) {
                        fillUp = false;
                        fillingWaterFall = -1;
                        waterfalls.delete(waterfallPositionX);
                        if (!waterfalls.has(x + 1)) {
                            waterfalls.add(x);
                            setWater(map, x, scanLinePositionY);
                            setWater(map, x, scanLinePositionY + 1);
                        }
                        break;
                    }
                    setWater(map, x, scanLinePositionY);
                }
                break;
            } else if (fillingWaterFall === waterfallPositionX) {
                fillUp = true;
                let x = waterfallPositionX;
                setWater(map, x, scanLinePositionY);
                while (!isClay(map, ++x, scanLinePositionY)) {
                    if (isSand(map, x, scanLinePositionY + 1, maxY)) {
                        fillUp = false;
                        fillingWaterFall = -1;
                        waterfalls.delete(waterfallPositionX);
                        if (!waterfalls.has(x - 1)) {
                            waterfalls.add(x);
                            setWater(map, x, scanLinePositionY);
                            setWater(map, x, scanLinePositionY + 1);
                        }
                        break;
                    }
                    setWater(map, x, scanLinePositionY);
                }
                x = waterfallPositionX;
                while (!isClay(map, --x, scanLinePositionY)) {
                    if (isSand(map, x, scanLinePositionY + 1, maxY)) {
                        fillUp = false;
                        fillingWaterFall = -1;
                        waterfalls.delete(waterfallPositionX);
                        if (!waterfalls.has(x + 1)) {
                            waterfalls.add(x);
                            setWater(map, x, scanLinePositionY);
                            setWater(map, x, scanLinePositionY + 1);
                        }
                        break;
                    }
                    setWater(map, x, scanLinePositionY);
                }
                break;
            }
        }
        if (fillUp) {
            scanLinePositionY--;
        } else {
            scanLinePositionY++;
        }
    }
}

function setWater(map, x, y) {
    map.set(`${x},${y}`, '|');
}

function isSand(map, x, y, maxY) {
    return !map.get(`${x},${y}`) && y <= maxY;
}

function isClay(map, x, y) {
    return map.get(`${x},${y}`) === '#';
}

function getMinMax(map) {
    const data = [...map.keys()].map(k => k.split(',').map(Number));
    const minX = Math.min(...data.map(k => k[0]));
    const maxX = Math.max(...data.map(k => k[0]));
    const minY = Math.min(...data.map(k => k[1]));
    const maxY = Math.max(...data.map(k => k[1]));
    return [minX, minY, maxX, maxY];
}

function printMap(map) {
    const [minX, minY, maxX, maxY] = getMinMax(map);
    const img = PImage.make(maxX - minX + 1, maxY - minY + 1);
    const ctx = img.getContext('2d');
    ctx.fillStyle = 'sandybrown';
    ctx.fillRect(0, 0, maxX - minX + 1, maxY - minY + 1);
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            const v = map.get(`${x},${y}`);
            if (v === '#') {
                ctx.fillStyle = 'black';
                ctx.fillRect(x - minX, y, 1, 1);
            } else if (v === '|') {
                ctx.fillStyle = 'blue';
                ctx.fillRect(x - minX, y, 1, 1);
            } else if (v === '+') {
                ctx.fillStyle = 'red';
                ctx.fillRect(x - minX, y, 1, 1);
            }
        }
    }
    PImage.encodePNGToStream(img, fs.createWriteStream('source/2018_day17/out.png')).then(() => {
        console.log('wrote out the png file to out.png');
    }).catch(e => {
        console.error(e);
        console.log('there was an error writing');
    });
}

function countWater(map) {
    const [minX, , maxX, ] = getMinMax(map);
    const data = [...map.entries()].filter(e => e[1] === '#').map(e => e[0]).map(k => k.split(',').map(Number));
    const minY = Math.min(...data.map(k => k[1]));
    const maxY = Math.max(...data.map(k => k[1]));
    let water = 0;
    for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
            if (map.get(`${x},${y}`) === '|') {
                water++;
            }
        }
    }
    return water;
}

function getMap() {
    const map = new Map();
    lines.forEach(l => {
        const split = l.split(', ');
        if (split[0][0] === 'x') {
            const x = Number(split[0].split('=')[1]);
            const ys = split[1].split('=')[1].split('..');
            for (let i = Number(ys[0]); i <= Number(ys[1]); i++) {
                map.set(`${x},${i}`, '#');
            }
        } else {
            const y = Number(split[0].split('=')[1]);
            const xs = split[1].split('=')[1].split('..');
            for (let i = Number(xs[0]); i <= Number(xs[1]); i++) {
                map.set(`${i},${y}`, '#');
            }
        }
    });
    return map;
}