const svg = document.getElementById('graph-svg');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const statusDisplay = document.getElementById('status-display');
const weightDisplay = document.getElementById('weight-display');

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playNote(freq) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = freq;
    osc.type = 'triangle';
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// Graph Data
const nodes = [
    { id: 0, label: 'A', x: 200, y: 100 },
    { id: 1, label: 'B', x: 400, y: 50 },
    { id: 2, label: 'C', x: 600, y: 100 },
    { id: 3, label: 'D', x: 200, y: 300 },
    { id: 4, label: 'E', x: 400, y: 350 },
    { id: 5, label: 'F', x: 600, y: 300 }
];

// Weighted Adjacency Matrix
const INF = Infinity;
const graph = [
    [0, 4, 4, 6, 6, INF],
    [4, 0, 2, INF, INF, INF],
    [4, 2, 0, 8, INF, INF],
    [6, INF, 8, 0, 9, INF],
    [6, INF, INF, 9, 0, 10],
    [INF, INF, INF, INF, 10, 0]
];

// Add some more connections for interest
graph[1][4] = 12; graph[4][1] = 12;
graph[2][5] = 15; graph[5][2] = 15;

const edges = [];
for (let u = 0; u < 6; u++) {
    for (let v = u + 1; v < 6; v++) {
        if (graph[u][v] !== INF) {
            edges.push({ u, v, weight: graph[u][v] });
        }
    }
}

function renderGraph() {
    svg.innerHTML = '';

    // Draw Edges
    edges.forEach(edge => {
        const u = nodes[edge.u];
        const v = nodes[edge.v];

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", u.x);
        line.setAttribute("y1", u.y);
        line.setAttribute("x2", v.x);
        line.setAttribute("y2", v.y);
        line.setAttribute("id", `edge-${edge.u}-${edge.v}`);
        svg.appendChild(line);

        // Weight Label
        const midX = (u.x + v.x) / 2;
        const midY = (u.y + v.y) / 2;

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", midX - 10);
        rect.setAttribute("y", midY - 10);
        rect.setAttribute("width", 20);
        rect.setAttribute("height", 20);
        rect.setAttribute("class", "edge-label-bg");
        rect.setAttribute("rx", 4);
        svg.appendChild(rect);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", midX);
        text.setAttribute("y", midY);
        text.setAttribute("class", "edge-label");
        text.textContent = edge.weight;
        svg.appendChild(text);
    });

    // Draw Nodes
    nodes.forEach(node => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", 25);
        circle.setAttribute("id", `node-${node.id}`);

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

async function runPrim() {
    startBtn.disabled = true;
    resetBtn.disabled = true;
    statusDisplay.textContent = "Running...";

    const V = 6;
    let parent = new Array(V).fill(-1);
    let key = new Array(V).fill(Infinity);
    let mstSet = new Array(V).fill(false);
    let totalWeight = 0;

    key[0] = 0;
    parent[0] = -1;

    for (let count = 0; count < V; count++) {
        // Pick min key vertex
        let u = -1;
        let min = Infinity;

        for (let v = 0; v < V; v++) {
            if (!mstSet[v] && key[v] < min) {
                min = key[v];
                u = v;
            }
        }

        if (u === -1) break;

        mstSet[u] = true;

        // Visual: Add node to MST
        const nodeU = document.getElementById(`node-${u}`);
        nodeU.classList.add('mst');
        playNote(300 + u * 50);

        // Visual: Highlight edge connecting to parent
        if (parent[u] !== -1) {
            let v = parent[u];
            let edgeId = u < v ? `edge-${u}-${v}` : `edge-${v}-${u}`;
            document.getElementById(edgeId).classList.add('mst');
            totalWeight += graph[u][v];
            weightDisplay.textContent = totalWeight;
            playNote(500 + u * 30);
        }

        await sleep(600);

        // Update neighbors
        for (let v = 0; v < V; v++) {
            if (graph[u][v] !== INF && !mstSet[v] && graph[u][v] < key[v]) {
                parent[v] = u;
                key[v] = graph[u][v];
            }
        }
    }

    statusDisplay.textContent = "MST Complete";
    startBtn.disabled = false;
    resetBtn.disabled = false;
}

function reset() {
    renderGraph();
    statusDisplay.textContent = "Ready";
    weightDisplay.textContent = "0";
}

startBtn.addEventListener('click', runPrim);
resetBtn.addEventListener('click', reset);

renderGraph();
