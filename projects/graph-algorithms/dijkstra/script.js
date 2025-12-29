const svg = document.getElementById('graph-svg');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const statusDisplay = document.getElementById('status-display');
const distanceDisplay = document.getElementById('distance-display');

// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playNote(freq) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
}

// Graph Data
const nodes = [
    { id: 0, label: '0', x: 100, y: 200, type: 'source' },
    { id: 1, label: '1', x: 300, y: 100 },
    { id: 2, label: '2', x: 300, y: 300 },
    { id: 3, label: '3', x: 500, y: 100 },
    { id: 4, label: '4', x: 500, y: 300 },
    { id: 5, label: '5', x: 700, y: 200, type: 'target' }
];

// Weighted Adjacency Matrix
// Infinity means no edge
const INF = Infinity;
const graph = [
    [0, 4, 2, INF, INF, INF],
    [4, 0, 1, 5, INF, INF],
    [2, 1, 0, 8, 10, INF],
    [INF, 5, 8, 0, 2, 6],
    [INF, INF, 10, 2, 0, 3],
    [INF, INF, INF, 6, 3, 0]
];

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
        if (node.type) circle.classList.add(node.type);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y);
        text.textContent = node.label;

        // Distance Label (initially empty)
        const distText = document.createElementNS("http://www.w3.org/2000/svg", "text");
        distText.setAttribute("x", node.x);
        distText.setAttribute("y", node.y + 40);
        distText.setAttribute("class", "dist-label");
        distText.setAttribute("id", `dist-${node.id}`);
        distText.textContent = "∞";

        svg.appendChild(circle);
        svg.appendChild(text);
        svg.appendChild(distText);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDijkstra() {
    startBtn.disabled = true;
    resetBtn.disabled = true;
    statusDisplay.textContent = "Running...";

    const V = 6;
    const src = 0;
    const target = 5;

    let dist = new Array(V).fill(Infinity);
    let visited = new Array(V).fill(false);
    let parent = new Array(V).fill(-1);

    dist[src] = 0;
    document.getElementById(`dist-${src}`).textContent = "0";

    for (let count = 0; count < V; count++) {
        // Find min distance vertex
        let u = -1;
        let min = Infinity;

        for (let v = 0; v < V; v++) {
            if (!visited[v] && dist[v] <= min) {
                min = dist[v];
                u = v;
            }
        }

        if (u === -1 || dist[u] === Infinity) break;

        // Visual: Mark u as processing
        const nodeU = document.getElementById(`node-${u}`);
        nodeU.classList.add('processing');
        playNote(300 + u * 50);
        await sleep(500);

        visited[u] = true;
        nodeU.classList.remove('processing');
        nodeU.classList.add('visited');

        if (u === target) {
            statusDisplay.textContent = "Target Reached!";
            distanceDisplay.textContent = dist[u];
            break;
        }

        // Update neighbors
        for (let v = 0; v < V; v++) {
            if (!visited[v] && graph[u][v] !== INF && dist[u] !== Infinity &&
                dist[u] + graph[u][v] < dist[v]) {

                // Visual: Highlight edge being checked
                let edgeId = u < v ? `edge-${u}-${v}` : `edge-${v}-${u}`;
                let line = document.getElementById(edgeId);
                line.style.stroke = '#eab308';
                await sleep(300);

                dist[v] = dist[u] + graph[u][v];
                parent[v] = u;
                document.getElementById(`dist-${v}`).textContent = dist[v];
                playNote(600 + v * 50);

                line.style.stroke = ''; // Reset edge color
            }
        }
        await sleep(500);
    }

    // Reconstruct Path
    let curr = target;
    let path = [];
    if (dist[target] !== Infinity) {
        while (curr !== -1) {
            path.push(curr);
            curr = parent[curr];
        }
        path.reverse();

        // Highlight Path
        for (let i = 0; i < path.length - 1; i++) {
            let u = path[i];
            let v = path[i + 1];
            let edgeId = u < v ? `edge-${u}-${v}` : `edge-${v}-${u}`;
            document.getElementById(edgeId).classList.add('path');
            await sleep(200);
        }
    }

    startBtn.disabled = false;
    resetBtn.disabled = false;
}

function reset() {
    renderGraph();
    statusDisplay.textContent = "Ready";
    distanceDisplay.textContent = "Infinity";
}

startBtn.addEventListener('click', runDijkstra);
resetBtn.addEventListener('click', reset);

renderGraph();
