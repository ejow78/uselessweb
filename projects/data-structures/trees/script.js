// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration, type = 'sine') {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

class TreeVisualizer {
    constructor() {
        this.svg = document.getElementById('tree-svg');
        this.messageBox = document.getElementById('message-box');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.root = null;
        this.nodeRadius = 20;
        this.isAnimating = false;
        this.shouldStop = false;

        this.reset();
        this.setupEventListeners();
    }

    reset() {
        this.root = null;
        this.insert(50, false);
        this.insert(30, false);
        this.insert(70, false);
        this.insert(20, false);
        this.insert(40, false);
        this.insert(60, false);
        this.insert(80, false);
        this.render();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            if (this.isAnimating) return;
            this.runDemo();
        });

        this.resetBtn.addEventListener('click', () => {
            this.shouldStop = true;
            this.reset();
            this.setMessage('Tree reset.');
            this.isAnimating = false;
            this.startBtn.disabled = false;
        });
    }

    setMessage(msg) {
        this.messageBox.textContent = msg;
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async runDemo() {
        this.isAnimating = true;
        this.shouldStop = false;
        this.startBtn.disabled = true;

        const operations = [
            { type: 'insert', value: 25 },
            { type: 'insert', value: 75 },
            { type: 'search', value: 40 },
            { type: 'search', value: 90 }
        ];

        for (const op of operations) {
            if (this.shouldStop) break;

            switch (op.type) {
                case 'insert':
                    await this.insert(op.value);
                    break;
                case 'search':
                    await this.search(op.value);
                    break;
            }
            await this.sleep(1000);
        }

        if (!this.shouldStop) {
            this.setMessage('Demo completed.');
        }
        this.isAnimating = false;
        this.startBtn.disabled = false;
    }

    // Calculate positions (Leaf-Based Layout)
    calculatePositions(node, width) {
        if (!node) return;

        // 1. Assign X coordinates based on leaf order
        let nextX = 0;
        const minSpacing = 40; // Minimum space between leaves

        const assignX = (n, level) => {
            n.y = 40 + level * 60; // Fixed Y based on level

            // In a BST, left comes before right
            if (n.left) assignX(n.left, level + 1);

            if (!n.left && !n.right) {
                // Leaf node
                n.x = nextX;
                nextX += minSpacing;
            } else {
                // Internal node
                if (n.left && n.right) {
                    n.x = (n.left.x + n.right.x) / 2;
                } else if (n.left) {
                    n.x = n.left.x + 20; // Offset parent slightly right if only left child
                } else if (n.right) {
                    assignX(n.right, level + 1);
                    n.x = n.right.x - 20; // Offset parent slightly left if only right child
                }
            }

            if (n.right && n.left) assignX(n.right, level + 1);
        };

        // Modified traversal for BST inorder (Left -> Root -> Right) doesn't map 1:1 to layout X
        // Better approach for BST: In-order traversal assigns X coordinates?
        // Actually, standard Reingold-Tilford is complex. 
        // Let's stick to the "Leaf-Based" but adapted for Binary Tree:
        // Traverse Left -> Leaf -> Right is not quite right for X assignment if we want tight packing.
        // Let's use a simpler In-Order Traversal for X assignment. 
        // In a BST, the X coordinate corresponds to the In-Order index!

        let orderIndex = 0;
        const assignInOrderX = (n, level) => {
            if (!n) return;

            assignInOrderX(n.left, level + 1);

            n.x = orderIndex * 50; // 50px spacing per node
            n.y = 40 + level * 60;
            orderIndex++;

            assignInOrderX(n.right, level + 1);
        };

        assignInOrderX(node, 0);

        // 2. Center the tree in the viewport
        const treeWidth = (orderIndex - 1) * 50;
        const screenCenter = width / 2;
        const offsetX = screenCenter - (treeWidth / 2);

        const applyOffset = (n) => {
            if (!n) return;
            n.x += offsetX;
            applyOffset(n.left);
            applyOffset(n.right);
        };

        applyOffset(node);
    }

    render() {
        this.svg.innerHTML = '';
        const width = this.svg.clientWidth;

        this.calculatePositions(this.root, width);
        this.drawTree(this.root);
    }

    drawTree(node) {
        if (!node) return;

        if (node.left) {
            this.drawLine(node.x, node.y, node.left.x, node.left.y);
            this.drawTree(node.left);
        }
        if (node.right) {
            this.drawLine(node.x, node.y, node.right.x, node.right.y);
            this.drawTree(node.right);
        }

        this.drawNode(node);
    }

    drawLine(x1, y1, x2, y2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        this.svg.appendChild(line);
    }

    drawNode(node) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.id = `node-${node.id}`;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', node.x);
        circle.setAttribute('cy', node.y);
        circle.setAttribute('r', this.nodeRadius);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + 1);
        text.textContent = node.value;

        g.appendChild(circle);
        g.appendChild(text);
        this.svg.appendChild(g);
    }

    async highlightNode(node, type = 'highlight') {
        const g = document.getElementById(`node-${node.id}`);
        if (g) {
            g.classList.add(`node-${type}`);
            if (type === 'highlight') playTone(400, 0.1);
            if (type === 'found') playTone(800, 0.3, 'square');
            await this.sleep(500);
            if (type === 'highlight') g.classList.remove(`node-${type}`);
        }
    }

    async insert(value, animate = true) {
        if (animate) this.setMessage(`Inserting ${value}...`);

        const newNode = new Node(value);

        if (!this.root) {
            this.root = newNode;
            this.render();
            if (animate) {
                await this.highlightNode(this.root, 'new');
                this.setMessage(`Inserted ${value} as root.`);
            }
            return;
        }

        let current = this.root;
        while (true) {
            if (animate && !this.shouldStop) await this.highlightNode(current);

            if (value < current.value) {
                if (!current.left) {
                    current.left = newNode;
                    this.render();
                    if (animate) {
                        await this.highlightNode(newNode, 'new');
                        playTone(600, 0.2, 'triangle');
                        this.setMessage(`Inserted ${value} to the left of ${current.value}.`);
                    }
                    return;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    this.render();
                    if (animate) {
                        await this.highlightNode(newNode, 'new');
                        playTone(600, 0.2, 'triangle');
                        this.setMessage(`Inserted ${value} to the right of ${current.value}.`);
                    }
                    return;
                }
                current = current.right;
            }
        }
    }

    async search(value) {
        this.setMessage(`Searching for ${value}...`);

        let current = this.root;
        while (current) {
            if (this.shouldStop) return;
            await this.highlightNode(current);

            if (value === current.value) {
                await this.highlightNode(current, 'found');
                this.setMessage(`Found ${value}!`);
                return;
            }

            if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        this.setMessage(`${value} not found.`);
        playTone(200, 0.3, 'sawtooth');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new TreeVisualizer();
});
