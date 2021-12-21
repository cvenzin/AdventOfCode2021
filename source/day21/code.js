import {
    getLines
} from '../modules/input.js';

const lines = getLines('day21');

function part1() {
    const players = getPlayers();
    const queue = [...players];
    let previousRoll = [0, 0, 0];
    while (!players.find(p => p.score >= 1000)) {
        const currentPlayer = queue.shift();
        previousRoll = getNextRoll(previousRoll);
        currentPlayer.position = (currentPlayer.position + previousRoll[0]) % 10 || 10;
        currentPlayer.score += currentPlayer.position;
        queue.push(currentPlayer);
    }
    return players.find(p => p.score < 1000).score * previousRoll[2];
}
console.log(part1());

function part2() {
    const players = getPlayers();
    return getWins(players[0].position, players[1].position, 0, 0, 0, 0, 0, true, 0, new Map()).sort((a, b) => b - a)[0];
}
console.log(part2());

function getWins(position1, position2, score1, score2, roll3, roll2, roll1, isPlayer1Turn, rollCount, cache) {
    if (isPlayer1Turn && rollCount === 3) {
        position1 = (position1 + roll3 + roll2 + roll1) % 10 || 10;
        score1 += position1;
        if (score1 >= 21) {
            return [1, 0];
        }
        rollCount = 0;
        isPlayer1Turn = false;
    } else if (rollCount === 3) {
        position2 = (position2 + roll3 + roll2 + roll1) % 10 || 10;
        score2 += position2;
        if (score2 >= 21) {
            return [0, 1];
        }
        rollCount = 0;
        isPlayer1Turn = true;
    }
    rollCount++;
    const winners = [0, 0];
    for (let i = 1; i <= 3; i++) {
        const key = `${position1},${position2},${score1},${score2},${i},${roll3},${roll2},${isPlayer1Turn},${rollCount}`;
        let winnersOfUniverse = cache.get(key);
        if (!winnersOfUniverse) {
            winnersOfUniverse = getWins(position1, position2, score1, score2, i, roll3, roll2, isPlayer1Turn, rollCount, cache);
            cache.set(key, winnersOfUniverse);
        }
        winners[0] += winnersOfUniverse[0];
        winners[1] += winnersOfUniverse[1];
    }
    return winners;
}

function getNextRoll(previousRoll) {
    const a = (previousRoll[1] + 1) % 100 || 100;
    const b = (previousRoll[1] + 2) % 100 || 100;
    const c = (previousRoll[1] + 3) % 100 || 100;
    return [a + b + c, c, previousRoll[2] += 3];
}

function getPlayers() {
    const players = [];
    lines.forEach(l => {
        players.push({
            position: Number(l[l.length - 1]),
            score: 0
        });
    });
    return players;
}