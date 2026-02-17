const svg = document.getElementById('network-svg');
const btns = document.querySelectorAll('.topo-btn');
const actionBtn = document.getElementById('action-btn');
const title = document.getElementById('topo-title');
const desc = document.getElementById('topo-desc');
const theoryContainer = document.getElementById('topo-theory');

let currentType = 'token';
let isRunning = false;
let animationId;

// Centralized Data & Theory
const content = {
    token: {
        title: "Token Passing Logic (Ring)",
        desc: "A special 'token' frame travels around the network. Only the node holding the token is allowed to transmit data. This mechanism prevents data collisions entirely.",
        btnText: "Start Token Simulation",
        theory: `
            <h2>Understanding Token Passing</h2>
            <p><strong>Token Ring</strong> (standardized as IEEE 802.5) uses a deterministic access method. Unlike Ethernet, where devices compete for the medium, Token Ring is polite and orderly.</p>
            
            <h3>How it Works</h3>
            <p>A 3-byte frame called a <strong>Token</strong> circles the network logically. 
            <br>1. If a node wants to send data, it waits for the token.
            <br>2. It seizes the token, flips a bit to make it a "Start of Frame" sequence, and appends its data.
            <br>3. The data travels around the ring. Each node checks if the data is for them.
            <br>4. The destination node copies the data and marks the frame as "received".
            <br>5. When the frame returns to the sender, the sender verifies reception and releases a new free token.</p>

            <h3>Pros & Cons</h3>
            <ul>
                <li><strong>Pro:</strong> No collisions, predictable performance under heavy load.</li>
                <li><strong>Con:</strong> If a node fails or the cable breaks, the token stops (unless a dual ring is used). Slower max throughput compared to modern switched Ethernet.</li>
            </ul>
        `
    },
    broadcast: {
        title: "Broadcast / CSMA/CD Logic",
        desc: "In shared media (like Hubs or Bus), data is 'broadcast' to everyone. Nodes must listen before talking (Carrier Sense) and detect if they interrupted someone (Collision Detection).",
        btnText: "Send Broadcast Packet",
        theory: `
            <h2>Understanding Broadcast Logic (Ethernet)</h2>
            <p><strong>Ethernet</strong> (IEEE 802.3) originally used a shared medium (coaxial cable or hub). This logic is known as <strong>CSMA/CD</strong> (Carrier Sense Multiple Access with Collision Detection).</p>
            
            <h3>The Cocktail Party Analogy</h3>
            <p>Imagine a cocktail party where everyone shares the air.
            <br><strong>Carrier Sense (CS):</strong> You listen before you speak to make sure no one else is talking.
            <br><strong>Multiple Access (MA):</strong> Everyone has equal potential to speak.
            <br><strong>Collision Detection (CD):</strong> If two people start talking at the exact same time, they both stop, wait a random amount of time, and try again.</p>

            <h3>Broadcast Domains</h3>
            <p>A <strong>Broadcast Domain</strong> is a logical division of a network where all nodes can reach each other by broadcast. Hubs and Switches extend broadcast domains, while <strong>Routers</strong> break them.</p>

            <h3>Modern Switched Ethernet</h3>
            <p>Today, we use Switches instead of Hubs. Switches create a separate "collision domain" for each port, effectively eliminating collisions, but Broadcast packets (like ARP requests) are still sent to everyone.</p>
        `
    }
};

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

    // Update Text Content
    const data = content[currentType];
    title.textContent = data.title;
    desc.textContent = data.desc;
    actionBtn.textContent = data.btnText;
    if (theoryContainer) theoryContainer.innerHTML = data.theory;

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
