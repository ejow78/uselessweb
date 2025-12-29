const svg = document.getElementById('network-svg');
const btns = document.querySelectorAll('.topo-btn');
const title = document.getElementById('topo-title');
const desc = document.getElementById('topo-desc');
const prosCons = document.getElementById('topo-pros-cons');

const data = {
    bus: {
        title: "Bus Topology",
        desc: "All devices are connected to a single central cable, called the bus or backbone. Terminators are required at both ends.",
        pros: "Easy to install, less cable required, cost-effective for small networks.",
        cons: "If the main cable fails, the whole network fails. Performance decreases with more nodes.",
        nodes: [
            { id: 0, label: 'PC1', x: 150, y: 150 },
            { id: 1, label: 'PC2', x: 300, y: 250 },
            { id: 2, label: 'PC3', x: 450, y: 150 },
            { id: 3, label: 'PC4', x: 600, y: 250 }
        ],
        edges: [
            { type: 'backbone', x1: 50, y1: 200, x2: 750, y2: 200 },
            { u: 0, x: 150, y: 200 }, // Drop line
            { u: 1, x: 300, y: 200 },
            { u: 2, x: 450, y: 200 },
            { u: 3, x: 600, y: 200 }
        ]
    },
    star: {
        title: "Star Topology",
        desc: "All devices are connected to a central device (Hub or Switch). This is the most common topology today.",
        pros: "Easy to troubleshoot, one node failure doesn't affect others, easy to add nodes.",
        cons: "If the central device fails, the whole network fails. Requires more cable than Bus.",
        nodes: [
            { id: 'hub', label: 'Switch', x: 400, y: 200, type: 'hub' },
            { id: 0, label: 'PC1', x: 400, y: 50 },
            { id: 1, label: 'PC2', x: 650, y: 200 },
            { id: 2, label: 'PC3', x: 400, y: 350 },
            { id: 3, label: 'PC4', x: 150, y: 200 }
        ],
        edges: [
            { u: 'hub', v: 0 },
            { u: 'hub', v: 1 },
            { u: 'hub', v: 2 },
            { u: 'hub', v: 3 }
        ]
    },
    ring: {
        title: "Ring Topology",
        desc: "Each device is connected to two other devices, forming a ring. Data travels in one direction.",
        pros: "Data flows in one direction reducing collisions. No central server needed.",
        cons: "One broken cable or node breaks the entire loop. Difficult to troubleshoot.",
        nodes: [
            { id: 0, label: 'PC1', x: 400, y: 50 },
            { id: 1, label: 'PC2', x: 600, y: 200 },
            { id: 2, label: 'PC3', x: 400, y: 350 },
            { id: 3, label: 'PC4', x: 200, y: 200 }
        ],
        edges: [
            { u: 0, v: 1 },
            { u: 1, v: 2 },
            { u: 2, v: 3 },
            { u: 3, v: 0 }
        ]
    },
    mesh: {
        title: "Mesh Topology",
        desc: "Every device is connected to every other device (Full Mesh). Provides high redundancy.",
        pros: "No single point of failure, high privacy and security, simultaneous data transmission.",
        cons: "Expensive due to cabling, complex installation and maintenance.",
        nodes: [
            { id: 0, label: 'PC1', x: 200, y: 100 },
            { id: 1, label: 'PC2', x: 600, y: 100 },
            { id: 2, label: 'PC3', x: 600, y: 300 },
            { id: 3, label: 'PC4', x: 200, y: 300 }
        ],
        edges: [
            { u: 0, v: 1 }, { u: 0, v: 2 }, { u: 0, v: 3 },
            { u: 1, v: 2 }, { u: 1, v: 3 },
            { u: 2, v: 3 }
        ]
    }
};

function render(type) {
    const config = data[type];
    svg.innerHTML = '';

    // Update Info
    title.textContent = config.title;
    desc.textContent = config.desc;
    prosCons.innerHTML = `
        <li><strong>Pros:</strong> ${config.pros}</li>
        <li><strong>Cons:</strong> ${config.cons}</li>
    `;

    // Draw Edges
    config.edges.forEach(edge => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

        if (type === 'bus') {
            if (edge.type === 'backbone') {
                line.setAttribute("x1", edge.x1);
                line.setAttribute("y1", edge.y1);
                line.setAttribute("x2", edge.x2);
                line.setAttribute("y2", edge.y2);
                line.classList.add('backbone');
            } else {
                // Drop lines
                const node = config.nodes.find(n => n.id === edge.u);
                line.setAttribute("x1", node.x);
                line.setAttribute("y1", node.y);
                line.setAttribute("x2", edge.x);
                line.setAttribute("y2", edge.y);
            }
        } else {
            // Standard node-to-node
            const u = config.nodes.find(n => n.id === edge.u);
            const v = config.nodes.find(n => n.id === edge.v);
            line.setAttribute("x1", u.x);
            line.setAttribute("y1", u.y);
            line.setAttribute("x2", v.x);
            line.setAttribute("y2", v.y);
        }
        svg.appendChild(line);
    });

    // Draw Nodes
    config.nodes.forEach(node => {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", node.x);
        circle.setAttribute("cy", node.y);
        circle.setAttribute("r", node.type === 'hub' ? 30 : 20);
        if (node.type) circle.classList.add(node.type);

        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", node.x);
        text.setAttribute("y", node.y);
        text.textContent = node.label;

        svg.appendChild(circle);
        svg.appendChild(text);
    });
}

btns.forEach(btn => {
    btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        render(btn.dataset.type);
    });
});

// Initial Render
render('bus');
