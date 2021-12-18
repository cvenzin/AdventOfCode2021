import {
    getLines
} from '../modules/input.js';

const snailfishNumbers = getLines('day18').map(JSON.parse);

export class Tree {
    constructor(element) {
        this.root = this.buildTree(null, element);
    }

    add(element) {
        const leftChild = this.root;
        this.root = new TreeNode();
        this.root.leftChild = leftChild;
        leftChild.parent = this.root;
        this.root.rightChild = new Tree(element).root;
        this.root.rightChild.parent = this.root;
    }

    buildTree(parent, element) {
        const node = new TreeNode();
        node.parent = parent;
        if (!Array.isArray(element)) {
            node.number = element;
            return node;
        }
        node.leftChild = this.buildTree(node, element[0]);
        node.rightChild = this.buildTree(node, element[1]);
        return node;
    }

    // debugging
    getDataAsArray(node) {
        if (!node) {
            return null;
        }
        if (node.number !== null) {
            return node.number;
        }
        return [this.getDataAsArray(node.leftChild), this.getDataAsArray(node.rightChild)].filter(e => e !== null);
    }

    // debugging
    getDataAsString() {
        return JSON.stringify(this.getDataAsArray(this.root));
    }

    reduce() {
        while (this.explode() || this.split());
    }

    split() {
        const stack = [this.root];
        while (stack.length > 0) {
            const node = stack.pop();
            if (node.number > 9) {
                node.leftChild = new TreeNode();
                node.leftChild.parent = node;
                node.leftChild.number = Math.floor(node.number / 2);
                node.rightChild = new TreeNode();
                node.rightChild.parent = node;
                node.rightChild.number = Math.ceil(node.number / 2);
                node.number = null;
                return 1;
            }
            if (node.rightChild) {
                stack.push(node.rightChild);
            }
            if (node.leftChild) {
                stack.push(node.leftChild);
            }
        }
        return 0;
    }

    explode() {
        const stack = [
            [this.root, 0]
        ];
        while (stack.length > 0) {
            const [node, depth] = stack.pop();
            if (depth === 4) {
                if (node.leftChild && node.rightChild) {
                    const leftIncrease = node.leftChild.number;
                    const rightIncrease = node.rightChild.number;
                    let nodeToCheck = node.parent;
                    let lastNodeChecked = node;
                    while (nodeToCheck) {
                        if (nodeToCheck.leftChild && nodeToCheck.leftChild !== lastNodeChecked) {
                            nodeToCheck = nodeToCheck.leftChild;
                            while (nodeToCheck.rightChild) {
                                nodeToCheck = nodeToCheck.rightChild;
                            }
                            nodeToCheck.number += leftIncrease;
                            break;
                        }
                        lastNodeChecked = nodeToCheck;
                        nodeToCheck = nodeToCheck.parent;
                    }
                    nodeToCheck = node.parent;
                    lastNodeChecked = node;
                    while (nodeToCheck) {
                        if (nodeToCheck.rightChild && nodeToCheck.rightChild !== lastNodeChecked) {
                            nodeToCheck = nodeToCheck.rightChild;
                            while (nodeToCheck.leftChild) {
                                nodeToCheck = nodeToCheck.leftChild;
                            }
                            nodeToCheck.number += rightIncrease;
                            break;
                        }
                        lastNodeChecked = nodeToCheck;
                        nodeToCheck = nodeToCheck.parent;
                    }
                    node.number = 0;
                    node.leftChild = null;
                    node.rightChild = null;
                    return 1;
                }
            }
            if (node.rightChild) {
                stack.push([node.rightChild, depth + 1]);
            }
            if (node.leftChild) {
                stack.push([node.leftChild, depth + 1]);
            }
        }
        return 0;
    }

    getMagnitude(node = this.root) {
        return node.number === null ? this.getMagnitude(node.leftChild) * 3 + this.getMagnitude(node.rightChild) * 2 : node.number;
    }
}

class TreeNode {
    constructor() {
        this.number = null;
        this.parent = null;
        this.leftChild = null;
        this.rightChild = null;
    }
}

function part1() {
    const tree = new Tree(snailfishNumbers[0]);
    for (let i = 1; i < snailfishNumbers.length; i++) {
        tree.add(snailfishNumbers[i]);
        tree.reduce();
    }
    return tree.getMagnitude();
}
console.log(part1());

function part2() {
    let maxMagnitude = 0;
    for (let i = 0; i < snailfishNumbers.length; i++) {
        for (let j = i; j < snailfishNumbers.length; j++) {
            if (i === j) {
                continue;
            }
            const tree = new Tree(snailfishNumbers[i]);
            tree.add(snailfishNumbers[j]);
            tree.reduce();
            const magnitude = tree.getMagnitude();
            maxMagnitude = magnitude > maxMagnitude ? magnitude : maxMagnitude;
        }
    }
    return maxMagnitude;
}
console.log(part2());