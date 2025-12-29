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

class GraphVisualizer {
    constructor() {
        this.svg = document.getElementById('graph-svg');
        this.messageBox = document.getElementById('message-box');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.isAnimating = false;
        this.shouldStop = false;
        this.nodeRadius = 20;

        // Adjacency List
        this.graph = {
            0: [1, 2],
            1: [0, 3, 4],
            2: [0, 5],
            3: [1],
            4: [1, 5],
            5: [2, 4]
        };

        // Dynamic Node Positions
        this.updatePositions();

        // Listen for resize
        window.addEventListener('resize', () => {
            this.updatePositions();
            this.render();
        });
    }

    updatePositions() {
        const width = this.svg.clientWidth;
        const height = this.svg.clientHeight;

        // Scale coordinates based on container size
        // Original reference: 800x400
        const scaleX = width / 800;
        const scaleY = height / 400;

        // Base positions (relative to 800x400)
        const basePositions = {
            0: { x: 400, y: 50 },
            1: { x: 250, y: 150 },
            2: { x: 550, y: 150 },
            3: { x: 150, y: 250 },
            4: { x: 350, y: 250 },
            5: { x: 650, y: 250 }
        };

        this.positions = {};
        for (const [id, pos] of Object.entries(basePositions)) {
            this.positions[id] = {
                x: pos.x * scaleX,
                y: pos.y * scaleY
            };
        }

        this.setupEventListeners();
        this.render();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            if (this.isAnimating) return;
            this.runDemo();
        });

        this.resetBtn.addEventListener('click', () => {
            this.shouldStop = true;
            this.render();
            this.setMessage('Graph reset.');
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

    render() {
        this.svg.innerHTML = '';

        // Draw Edges
        for (const node in this.graph) {
            for (const neighbor of this.graph[node]) {
                if (node < neighbor) {
                    this.drawLine(
                        this.positions[node].x, this.positions[node].y,
                        this.positions[neighbor].x, this.positions[neighbor].y,
                        `edge-${node}-${neighbor}`
                    );
                }
            }
        }

        // Draw Nodes
        for (const node in this.positions) {
            this.drawNode(node, this.positions[node].x, this.positions[node].y);
        }
    }

    drawLine(x1, y1, x2, y2, id) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.id = id;
        this.svg.appendChild(line);
    }

    drawNode(id, x, y) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.id = `node-${id}`;

        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', this.nodeRadius);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 1);
        text.textContent = id;

        g.appendChild(circle);
        g.appendChild(text);
        this.svg.appendChild(g);
    }

    async highlightNode(id, type = 'active') {
        const g = document.getElementById(`node-${id}`);
        if (g) {
            g.classList.add(`node-${type}`);
            if (type === 'active') playTone(400 + (id * 50), 0.1);
            if (type === 'visited') playTone(300, 0.05, 'triangle');
            await this.sleep(500);
            if (type === 'active') g.classList.remove(`node-${type}`);
        }
    }

    async highlightEdge(u, v) {
        const id = u < v ? `edge-${u}-${v}` : `edge-${v}-${u}`;
        const line = document.getElementById(id);
        if (line) {
            line.classList.add('edge-active');
            await this.sleep(300);
            line.classList.remove('edge-active');
        }
    }

    async runDemo() {
        this.isAnimating = true;
        this.shouldStop = false;
        this.startBtn.disabled = true;

        await this.bfs(0);

        if (!this.shouldStop) {
            await this.sleep(1000);
            this.render(); // Reset for DFS
            await this.dfs(0);
        }

        if (!this.shouldStop) {
            this.setMessage('Demo completed.');
        }
        this.isAnimating = false;
        this.startBtn.disabled = false;
    }

    async bfs(start) {
        this.setMessage(`Starting BFS from node ${start}...`);

        const queue = [start];
        const visited = new Set();
        visited.add(start);

        await this.highlightNode(start, 'visited');

        while (queue.length > 0) {
            if (this.shouldStop) return;
            const node = queue.shift();
            await this.highlightNode(node, 'active');

            for (const neighbor of this.graph[node]) {
                if (this.shouldStop) return;
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    await this.highlightEdge(node, neighbor);
                    await this.highlightNode(neighbor, 'visited');
                    queue.push(neighbor);
                }
            }
        }
        this.setMessage('BFS Complete.');
    }

    async dfs(start) {
        this.setMessage(`Starting DFS from node ${start}...`);
        const visited = new Set();
        await this.dfsRecursive(start, visited);
        this.setMessage('DFS Complete.');
    }

    async dfsRecursive(node, visited) {
        if (this.shouldStop) return;
        visited.add(node);
        await this.highlightNode(node, 'visited');
        await this.highlightNode(node, 'active');

        const neighbors = this.graph[node];

        for (const neighbor of neighbors) {
            if (this.shouldStop) return;
            if (!visited.has(neighbor)) {
                await this.highlightEdge(node, neighbor);
                await this.dfsRecursive(neighbor, visited);
            }
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new GraphVisualizer();
});
