const svg = document.getElementById('graph-svg');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const messageBox = document.getElementById('message-box');
const maxFlowDisplay = document.getElementById('max-flow-display');

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

// Graph Data
const nodes = [
    { id: 0, label: 'S', x: 100, y: 200, type: 'source' },
    { id: 1, label: 'A', x: 300, y: 100 },
    { id: 2, label: 'B', x: 300, y: 300 },
    { id: 3, label: 'C', x: 500, y: 100 },
    { id: 4, label: 'D', x: 500, y: 300 },
    { id: 5, label: 'T', x: 700, y: 200, type: 'sink' }
];

// Adjacency Matrix for Capacity
// 0:S, 1:A, 2:B, 3:C, 4:D, 5:T
const capacity = [
    [0, 10, 10, 0, 0, 0], // S -> A, B
    [0, 0, 2, 4, 8, 0],   // A -> B, C, D
    [0, 0, 0, 0, 9, 0],   // B -> D
    [0, 0, 0, 0, 0, 10],  // C -> T
    [0, 0, 0, 6, 0, 10],  // D -> C, T
    [0, 0, 0, 0, 0, 0]    // T
];

// Current Flow
let flow = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
];

const edges = [];
// Generate edges list for rendering
for (let u = 0; u < 6; u++) {
    for (let v = 0; v < 6; v++) {
        if (capacity[u][v] > 0) {
            edges.push({ u, v, cap: capacity[u][v] });
        }
    }
}

function renderGraph() {
    svg.innerHTML = '';

    // Define arrow marker
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
        refX="28" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#52525b" />
        </marker>
    `;
    svg.appendChild(defs);

    // Draw Edges
    edges.forEach(edge => {
        const u = nodes[edge.u];
        const v = nodes[edge.v];
        const currentFlow = flow[edge.u][edge.v];

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", u.x);
        line.setAttribute("y1", u.y);
        line.setAttribute("x2", v.x);
        line.setAttribute("y2", v.y);
        line.setAttribute("id", `edge-${edge.u}-${edge.v}`);
        line.setAttribute("marker-end", "url(#arrowhead)");

        if (currentFlow === edge.cap) {
            line.classList.add('full');
        }

        svg.appendChild(line);

        // Label Background
        const midX = (u.x + v.x) / 2;
        const midY = (u.y + v.y) / 2;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", midX - 15);
        rect.setAttribute("y", midY - 10);
        rect.setAttribute("width", 30);
        rect.setAttribute("height", 20);
        rect.setAttribute("class", "edge-label-bg");
        rect.setAttribute("rx", 4);
        svg.appendChild(rect);

        // Label Text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", midX);
        text.setAttribute("y", midY);
        text.setAttribute("class", "edge-label");
        text.setAttribute("id", `label-${edge.u}-${edge.v}`);
        text.textContent = `${currentFlow}/${edge.cap}`;
        svg.appendChild(text);
    });

    // Draw Nodes
    nodes.forEach(node => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", 20);
        circle.setAttribute("id", `node-${node.id}`);
        if (node.type) circle.classList.add(node.type);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y);
        text.textContent = node.label;

        svg.appendChild(circle);
        svg.appendChild(text);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function highlightPath(path, color = 'var(--node-highlight)') {
    for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i + 1];
        const line = document.getElementById(`edge-${u}-${v}`);
        if (line) {
            line.style.stroke = color;
            line.style.strokeWidth = '4';
        }
        const node = document.getElementById(`node-${u}`);
        if (node) node.style.stroke = color;
        await sleep(200);
    }
    const lastNode = document.getElementById(`node-${path[path.length - 1]}`);
    if (lastNode) lastNode.style.stroke = color;
}

async function resetHighlights() {
    const lines = document.querySelectorAll('line');
    lines.forEach(line => {
        line.style.stroke = '';
        line.style.strokeWidth = '';
    });
    const circles = document.querySelectorAll('circle');
    circles.forEach(circle => {
        circle.style.stroke = '';
    });
    // Restore source/sink colors
    document.getElementById('node-0').classList.add('source');
    document.getElementById('node-5').classList.add('sink');
}

async function findMaxFlow() {
    startBtn.disabled = true;
    resetBtn.disabled = true;

    let maxFlow = 0;
    const s = 0;
    const t = 5;
    const V = 6;

    // Residual Graph initially equals Capacity
    let rGraph = capacity.map(row => [...row]);
    let parent = new Array(V);

    while (true) {
        // BFS to find augmenting path
        let visited = new Array(V).fill(false);
        let queue = [];
        queue.push(s);
        visited[s] = true;
        parent[s] = -1;

        messageBox.textContent = "Searching for augmenting path...";
        await sleep(500);

        let pathFound = false;
        while (queue.length > 0) {
            let u = queue.shift();

            // Highlight current node search
            document.getElementById(`node-${u}`).style.fill = '#3f3f46';
            await sleep(100);
            document.getElementById(`node-${u}`).style.fill = '';

            for (let v = 0; v < V; v++) {
                if (!visited[v] && rGraph[u][v] > 0) {
                    if (v === t) {
                        parent[v] = u;
                        pathFound = true;
                        break;
                    }
                    queue.push(v);
                    parent[v] = u;
                    visited[v] = true;
                }
            }
            if (pathFound) break;
        }

        if (!pathFound) {
            messageBox.textContent = "No more augmenting paths found.";
            break;
        }

        // Reconstruct path
        let path = [];
        let curr = t;
        let pathFlow = Number.MAX_VALUE;

        while (curr !== s) {
            path.unshift(curr);
            let prev = parent[curr];
            pathFlow = Math.min(pathFlow, rGraph[prev][curr]);
            curr = prev;
        }
        path.unshift(s);

        messageBox.textContent = `Path found: ${path.map(n => nodes[n].label).join('->')} | Flow: ${pathFlow}`;
        playTone(400, 0.2);
        await highlightPath(path);
        await sleep(1000);

        // Update residual capacities and flow
        for (let v = t; v !== s; v = parent[v]) {
            let u = parent[v];
            rGraph[u][v] -= pathFlow;
            rGraph[v][u] += pathFlow;

            // Update visual flow
            if (capacity[u][v] > 0) {
                flow[u][v] += pathFlow;
            } else {
                flow[v][u] -= pathFlow;
            }
        }

        maxFlow += pathFlow;
        maxFlowDisplay.textContent = maxFlow;
        renderGraph(); // Re-render to update labels and full edges
        await resetHighlights();
        playTone(600, 0.3, 'triangle');
        await sleep(500);
    }

    messageBox.textContent = `Max Flow calculated: ${maxFlow}`;
    playTone(800, 0.5, 'square');
    startBtn.disabled = false;
    resetBtn.disabled = false;
}

function reset() {
    flow = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0]
    ];
    maxFlowDisplay.textContent = '0';
    messageBox.textContent = 'Ready to start...';
    renderGraph();
}

startBtn.addEventListener('click', findMaxFlow);
resetBtn.addEventListener('click', reset);

// Initial Render
renderGraph();
