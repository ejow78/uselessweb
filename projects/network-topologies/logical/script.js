const svg = document.getElementById('network-svg');
const btns = document.querySelectorAll('.topo-btn');
const actionBtn = document.getElementById('action-btn');
const title = document.getElementById('topo-title');
const desc = document.getElementById('topo-desc');

let currentType = 'token';
let isRunning = false;
let animationId;

const nodes = [
    { id: 0, label: 'A', x: 400, y: 50 },
    { id: 1, label: 'B', x: 650, y: 200 },
    { id: 2, label: 'C', x: 400, y: 350 },
    { id: 3, label: 'D', x: 150, y: 200 }
];

// Logical Ring Edges (for Token)
const ringEdges = [
    { u: 0, v: 1 }, { u: 1, v: 2 }, { u: 2, v: 3 }, { u: 3, v: 0 }
];

// Logical Bus/Star Edges (for Broadcast) - Represented as Star physically
const starEdges = [
    { u: 'hub', v: 0 }, { u: 'hub', v: 1 }, { u: 'hub', v: 2 }, { u: 'hub', v: 3 }
];
const hub = { id: 'hub', label: 'Switch', x: 400, y: 200 };

function renderBase() {
    svg.innerHTML = '';

    if (currentType === 'token') {
        // Draw Ring connections
        ringEdges.forEach(edge => {
            const u = nodes[edge.u];
            const v = nodes[edge.v];
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", u.x);
            line.setAttribute("y1", u.y);
            line.setAttribute("x2", v.x);
            line.setAttribute("y2", v.y);
            svg.appendChild(line);
        });
    } else {
        // Draw Star connections (Physical Star, Logical Bus)
        // Draw Hub
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", hub.x);
        circle.setAttribute("cy", hub.y);
        circle.setAttribute("r", 30);
        circle.setAttribute("fill", "#27272a");
        circle.setAttribute("stroke", "#3b82f6");
        svg.appendChild(circle);

        starEdges.forEach(edge => {
            const v = nodes[edge.v];
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", hub.x);
            line.setAttribute("y1", hub.y);
            line.setAttribute("x2", v.x);
            line.setAttribute("y2", v.y);
            svg.appendChild(line);
        });
    }

    // Draw Nodes
    nodes.forEach(node => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", 20);

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

async function runTokenRing() {
    if (isRunning) return;
    isRunning = true;
    actionBtn.disabled = true;

    // Create Token
    const token = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    token.setAttribute("r", 8);
    token.setAttribute("class", "token");
    svg.appendChild(token);

    let currentNode = 0;

    // Simulate 2 loops
    for (let i = 0; i < 8; i++) {
        const u = nodes[currentNode];
        const nextNode = (currentNode + 1) % 4;
        const v = nodes[nextNode];

        // Move token to node
        token.setAttribute("cx", u.x);
        token.setAttribute("cy", u.y);

        // Wait at node (processing)
        await sleep(500);

        // Animate to next node
        const steps = 20;
        const dx = (v.x - u.x) / steps;
        const dy = (v.y - u.y) / steps;

        for (let s = 1; s <= steps; s++) {
            token.setAttribute("cx", u.x + dx * s);
            token.setAttribute("cy", u.y + dy * s);
            await sleep(20);
        }

        currentNode = nextNode;
    }

    token.remove();
    isRunning = false;
    actionBtn.disabled = false;
}

async function runBroadcast() {
    if (isRunning) return;
    isRunning = true;
    actionBtn.disabled = true;

    // Source Node (A)
    const src = nodes[0];

    // Create Packet at Source
    const packet = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    packet.setAttribute("r", 8);
    packet.setAttribute("class", "packet");
    packet.setAttribute("cx", src.x);
    packet.setAttribute("cy", src.y);
    svg.appendChild(packet);

    await sleep(500);

    // Move to Hub
    const steps = 20;
    let dx = (hub.x - src.x) / steps;
    let dy = (hub.y - src.y) / steps;

    for (let s = 1; s <= steps; s++) {
        packet.setAttribute("cx", src.x + dx * s);
        packet.setAttribute("cy", src.y + dy * s);
        await sleep(20);
    }

    packet.remove();

    // Broadcast to others (B, C, D)
    const targets = [1, 2, 3];
    const packets = [];

    targets.forEach(t => {
        const p = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        p.setAttribute("r", 8);
        p.setAttribute("class", "packet");
        p.setAttribute("cx", hub.x);
        p.setAttribute("cy", hub.y);
        svg.appendChild(p);
        packets.push({ el: p, target: nodes[t] });
    });

    for (let s = 1; s <= steps; s++) {
        packets.forEach(p => {
            let pdx = (p.target.x - hub.x) / steps;
            let pdy = (p.target.y - hub.y) / steps;
            let currentX = parseFloat(p.el.getAttribute("cx"));
            let currentY = parseFloat(p.el.getAttribute("cy"));
            p.el.setAttribute("cx", currentX + pdx);
            p.el.setAttribute("cy", currentY + pdy);
        });
        await sleep(20);
    }

    await sleep(500);
    packets.forEach(p => p.el.remove());

    isRunning = false;
    actionBtn.disabled = false;
}

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isRunning) return;
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentType = btn.dataset.type;

        if (currentType === 'token') {
            title.textContent = "Token Ring Logic";
            desc.textContent = "A 'token' frame travels around the network. Only the node with the token can transmit data. This prevents collisions.";
            actionBtn.textContent = "Start Token";
        } else {
            title.textContent = "Broadcast (Ethernet) Logic";
            desc.textContent = "Data is sent to a central point (Switch/Hub) and then broadcasted to all other nodes (or specific ones). In a Hub, everyone receives it.";
            actionBtn.textContent = "Send Broadcast";
        }
        renderBase();
    });
});

actionBtn.addEventListener('click', () => {
    if (currentType === 'token') {
        runTokenRing();
    } else {
        runBroadcast();
    }
});

renderBase();
