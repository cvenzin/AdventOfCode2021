import fs from 'fs'

export function getLines(day) {
    const input = fs.readFileSync(`source/${day}/input.txt`, 'utf-8');
    return input.split('\n').map(line => line.trim());
}