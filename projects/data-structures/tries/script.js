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

class TrieNode {
    constructor(char) {
        this.char = char;
        this.children = {};
        this.isEndOfWord = false;
        this.x = 0;
        this.y = 0;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

class TrieVisualizer {
    constructor() {
        this.svg = document.getElementById('trie-svg');
        this.messageBox = document.getElementById('message-box');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.root = new TrieNode('*');
        this.isAnimating = false;
        this.shouldStop = false;
        this.nodeRadius = 18;

        this.reset();
        this.setupEventListeners();
    }

    reset() {
        this.root = new TrieNode('*');
        this.insert("cat", false);
        this.insert("car", false);
        this.insert("dog", false);
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
            this.setMessage('Trie reset.');
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
            { type: 'insert', word: 'cow' },
            { type: 'search', word: 'cat' },
            { type: 'search', word: 'cab' }
        ];

        for (const op of operations) {
            if (this.shouldStop) break;

            switch (op.type) {
                case 'insert':
                    await this.insert(op.word);
                    break;
                case 'search':
                    await this.search(op.word);
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
        const minSpacing = 50; // Minimum space between leaves

        const assignX = (n, level) => {
            n.y = 40 + level * 60; // Fixed Y based on level

            const childrenKeys = Object.keys(n.children).sort();

            if (childrenKeys.length === 0) {
                // Leaf node
                n.x = nextX;
                nextX += minSpacing;
            } else {
                // Internal node
                childrenKeys.forEach(key => {
                    assignX(n.children[key], level + 1);
                });

                // Center parent above children
                const firstChild = n.children[childrenKeys[0]];
                const lastChild = n.children[childrenKeys[childrenKeys.length - 1]];
                n.x = (firstChild.x + lastChild.x) / 2;
            }
        };

        assignX(node, 0);

        // 2. Center the tree in the viewport
        const treeCenter = node.x;
        const screenCenter = width / 2;
        const offsetX = screenCenter - treeCenter;

        const applyOffset = (n) => {
            n.x += offsetX;
            Object.keys(n.children).forEach(key => {
                applyOffset(n.children[key]);
            });
        };

        applyOffset(node);
    }

    render() {
        this.svg.innerHTML = '';
        const width = this.svg.clientWidth;

        this.calculatePositions(this.root, width);
        this.drawTrie(this.root);
    }

    drawTrie(node) {
        if (!node) return;

        Object.keys(node.children).forEach(key => {
            const child = node.children[key];
            this.drawLine(node.x, node.y, child.x, child.y);
            this.drawTrie(child);
        });

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
        if (node.isEndOfWord) {
            circle.classList.add('node-end');
        }

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y + 1);
        text.textContent = node.char;

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
            await this.sleep(400);
            if (type === 'highlight') g.classList.remove(`node-${type}`);
        }
    }

    async insert(word, animate = true) {
        if (animate) this.setMessage(`Inserting "${word}"...`);

        let current = this.root;
        if (animate) await this.highlightNode(current);

        for (let char of word) {
            if (!current.children[char]) {
                current.children[char] = new TrieNode(char);
                this.render();
                if (animate) {
                    await this.highlightNode(current.children[char], 'new');
                }
            }
            current = current.children[char];
            if (animate) await this.highlightNode(current);
        }

        current.isEndOfWord = true;
        this.render();

        if (animate) {
            playTone(600, 0.2, 'triangle');
            this.setMessage(`Inserted "${word}".`);
        }
    }

    async search(word) {
        this.setMessage(`Searching for "${word}"...`);

        let current = this.root;
        await this.highlightNode(current);

        for (let char of word) {
            if (!current.children[char]) {
                this.setMessage(`Prefix "${char}" not found.`);
                playTone(200, 0.3, 'sawtooth');
                return;
            }
            current = current.children[char];
            await this.highlightNode(current);
        }

        if (current.isEndOfWord) {
            await this.highlightNode(current, 'found');
            this.setMessage(`Found word "${word}"!`);
        } else {
            this.setMessage(`"${word}" is a prefix, but not a complete word.`);
            playTone(300, 0.3, 'sine');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new TrieVisualizer();
});
