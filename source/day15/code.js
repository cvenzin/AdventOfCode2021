import {
    getLines
} from '../modules/input.js';

const lines = getLines('day15');

function part1() {
    return compute(1);
}
console.log(part1());

function part2() {
    return compute(5);
}
console.log(part2());

function compute(factor) {
    const graph = getGraph(factor);
    return getShortestPath(graph, '0,0', `${lines.length * factor - 1},${lines[0].length * factor - 1}`);
}

function getShortestPath(graph, startId, destinationId) {
    const startNode = graph.get(startId);
    const updatedNodes = new Map();
    startNode.distance = 0;
    updatedNodes.set(startNode.id, 0);
    
    while (graph.size > 0) {
        const node = findNodeWithShortestDistance(graph, updatedNodes);
        graph.delete(node.id);
        updatedNodes.delete(node.id);
        for (let i = 0; i < node.neighbors.length; i++) {
            const neighbor = node.neighbors[i];
            if (graph.has(neighbor.id)) {
                const dist = node.distance + neighbor.risk;
                if (dist < neighbor.distance) {
                    neighbor.distance = dist;
                    updatedNodes.set(neighbor.id, neighbor.distance);
                    if (neighbor.id === destinationId) {
                        return neighbor.distance;
                    }
                }
            }
        }
    }
}

function findNodeWithShortestDistance(graph, updatedNodes) {
    let resultNode = null;
    let distance = Number.MAX_SAFE_INTEGER;
    const nodes = updatedNodes.entries();
    for (const [k, d] of nodes) {
        if (d < distance) {
            distance = d;
            resultNode = graph.get(k);
        }
    }
    return resultNode;
}

function getGraph(factor) {
    const map = new Map();
    const lx = lines.length * factor;
    const ly = lines[0].length * factor;
    for (let i = 0; i < lx; i++) {
        for (let j = 0; j < ly; j++) {
            const node = getNode(i, j, map);
            getNeighbors(i, j).forEach(n => {
                if (n[0] > -1 && n[0] < lx && n[1] > -1 && n[1] < ly) {
                    node.neighbors.push(getNode(n[0], n[1], map));
                }
            });
        }
    }
    return map;
}

function getNode(i, j, map) {
    const id = `${i},${j}`;
    const node = map.get(id) || {
        id,
        risk: getRisk(i, j),
        neighbors: [],
        distance: Number.MAX_SAFE_INTEGER
    };
    map.set(id, node);
    return node;
}

function getRisk(i, j) {
    if (i < lines.length && j < lines[0].length) {
        return Number(lines[i][j]);
    } else {
        const indexX = i % lines.length;
        const indexY = j % lines[0].length;
        const increaseX = Math.floor(i / lines.length);
        const increaseY = Math.floor(j / lines[0].length);
        const risk = Number(lines[indexX][indexY]) + increaseX + increaseY;
        if (risk > 9) {
            return risk % 9 || 1;
        }
        return risk;
    }
}

function getNeighbors(x, y) {
    return [
        [x - 1, y],
        [x, y + 1],
        [x + 1, y],
        [x, y - 1]
    ];
}