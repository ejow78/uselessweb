const svg = document.getElementById('network-svg');
const btns = document.querySelectorAll('.topo-btn');
const title = document.getElementById('topo-title');
const desc = document.getElementById('topo-desc');
const prosCons = document.getElementById('topo-pros-cons');
const theoryContainer = document.getElementById('topo-theory');

const data = {
    bus: {
        title: "Bus Topology",
        desc: "All devices are connected to a single central cable, called the bus or backbone. Terminators are required at both ends to prevent signal reflection.",
        pros: "Easy to install and extend, requires less cable than other topologies, cost-effective for small networks.",
        cons: "If the main cable (backbone) fails, the entire network goes down. Performance degrades with heavy traffic. Difficult to troubleshoot individual device faults.",
        theory: `
            <h2>Understanding Bus Topology</h2>
            <p>In a <strong>Bus Topology</strong>, every computer and network device is connected to a single cable. This central cable is the backbone of the network. Data is transmitted in one direction from one end of the cable to the other.</p>
            
            <h3>How it Works</h3>
            <p>When a device transmits data, the signal travels along the backbone in both directions. All devices receive the signal, but only the device with the matching destination MAC address accepts it. To prevent signals from bouncing back and causing interference (signal reflection), <strong>terminators</strong> are placed at both ends of the backbone.</p>

            <h3>Carrier Sense Multiple Access (CSMA/CD)</h3>
            <p>Bus networks typically use <strong>CSMA/CD</strong> (Collision Detection) to manage data transmission. Devices listen to the bus before transmitting to avoid data collisions. If two devices transmit simultaneously, a collision occurs, and both must wait a random amount of time before retrying.</p>

            <h3>Key Characteristics</h3>
            <ul>
                <li><strong>Single Backbone:</strong> One main cable handles all traffic.</li>
                <li><strong>Terminators:</strong> Essential to absorb signals at cable ends.</li>
                <li><strong>Half-Duplex:</strong> Data can flow in both directions, but not simultaneously.</li>
            </ul>
        `,
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
        desc: "All devices are connected to a central device (Hub, Switch, or Router). This is the most common topology in modern LANs.",
        pros: "Easy to install and manage. Failure of one node doesn't affect the rest. Easy to troubleshoot.",
        cons: "If the central device fails, the whole network goes down. Requires more cable than Bus topology. Performance depends on the central device's capacity.",
        theory: `
            <h2>Understanding Star Topology</h2>
            <p>In a <strong>Star Topology</strong>, every node connects to a central network device, typically a <strong>Switch</strong> or a <strong>Hub</strong>. The central device acts as a conduit to transmit messages.</p>
            
            <h3>Hub vs. Switch</h3>
            <p>If a <strong>Hub</strong> is used, it broadcasts incoming data to all ports (inefficient). If a <strong>Switch</strong> is used, it reads the destination MAC address and sends data only to the intended recipient (efficient and secure).</p>

            <h3>Why it's Popular</h3>
            <p>Star topology is the industry standard for Ethernet LANs (Local Area Networks) due to its reliability. Adding or removing devices is seamless and doesn't disrupt the network.</p>

            <h3>Key Characteristics</h3>
            <ul>
                <li><strong>Centralized Management:</strong> The switch controls the flow of data.</li>
                <li><strong>Isolation:</strong> A cable break only affects one device.</li>
                <li><strong>Scalability:</strong> Easy to expand by connecting more devices to the switch (or daisy-chaining switches).</li>
            </ul>
        `,
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
        desc: "Each device is connected to exactly two other devices, forming a closed loop. Data travels in one direction (unidirectional).",
        pros: "Data flows in one direction, reducing collisions. No need for a central server. Equal access for all devices.",
        cons: "One broken cable or failed node breaks the entire loop. Adding/removing nodes disrupts the network. Slower than Star due to token passing.",
        theory: `
            <h2>Understanding Ring Topology</h2>
            <p>In a <strong>Ring Topology</strong>, data travels from node to node, with each node handling every packet. Typically, a <strong>Token Passing</strong> protocol is used.</p>
            
            <h3>Token Passing</h3>
            <p>A "token" (a small data packet) circulates around the ring. Only the device holding the token can transmit data. This prevents collisions entirely, making performace deterministic even under heavy load.</p>

            <h3>Dual Ring (FDDI)</h3>
            <p>To address the single point of failure (cable break), protocols like <strong>FDDI</strong> (Fiber Distributed Data Interface) use a second, counter-rotating ring for redundancy. If the main ring breaks, the data wraps around onto the secondary ring.</p>

            <h3>Key Characteristics</h3>
            <ul>
                <li><strong>Peer-to-Peer:</strong> All nodes have equal status.</li>
                <li><strong>Deterministic:</strong> Predictable access time (good for industrial control).</li>
                <li><strong>Vulnerability:</strong> A single break splits the ring.</li>
            </ul>
        `,
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
        desc: "Every device is connected to every other device (Full Mesh). Provides the highest level of redundancy and reliability.",
        pros: "No single point of failure. High privacy/security (dedicated links). Simultaneous data transmission.",
        cons: "Extremely expensive due to cabling costs. Complex installation and maintenance. High power consumption for ports.",
        theory: `
            <h2>Understanding Mesh Topology</h2>
            <p><strong>Mesh Topology</strong> is designed for maximum reliability. In a <strong>Full Mesh</strong>, every node connects directly to every other node. In a <strong>Partial Mesh</strong>, only critical nodes are fully interconnected.</p>
            
            <h3>The Mathematics of Mesh</h3>
            <p>The number of cables required for a full mesh is calculated as <code>N(N-1)/2</code>, where N is the number of nodes. For 10 computers, you need 45 cables! This makes full mesh impractical for LANs but essential for critical backbones and WANs (like the Internet itself).</p>

            <h3>Key Characteristics</h3>
            <ul>
                <li><strong>Redundancy:</strong> Multiple paths for data travel. If one link fails, another takes over.</li>
                <li><strong>Dedicated Bandwidth:</strong> Links are not shared, guaranteeing throughput.</li>
                <li><strong>Use Case:</strong> Military networks, Internet backbone, IoT networks (Zigbee).</li>
            </ul>
        `,
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
    },
    tree: {
        title: "Tree Topology",
        desc: "A hierarchical structure where a root node connects to other nodes, which in turn connect to more nodes. Often called a 'Star of Stars'.",
        pros: "Scalable and hierarchical. Fault isolation (a child node failure doesn't affect the root). Easy to manage large networks.",
        cons: "Dependent on the root node (if root fails, subtrees become isolated). Complex configuration. Cabling heavy.",
        theory: `
            <h2>Understanding Tree Topology</h2>
            <p><strong>Tree Topology</strong> combines elements of Star and Bus topologies. It consists of groups of star-configured workstations connected to a linear bus backbone or a root switch.</p>
            
            <h3>Hierarchy</h3>
            <p>It mimics a family tree. The device at the top is the <strong>Root</strong>. Devices connected to it are <strong>Parent</strong> nodes, which connect to <strong>Child</strong> nodes. This structure is ideal for organizing networks by department (e.g., HQ -> HR -> Payroll).</p>

            <h3>Use Cases</h3>
            <p>Tree topology is widely used in <strong>WANs</strong> (Wide Area Networks) and large corporate networks where distinct branches need to be managed separately but linked centrally.</p>

            <h3>Key Characteristics</h3>
            <ul>
                <li><strong>Point-to-Point:</strong> Segments are connected point-to-point.</li>
                <li><strong>Scalability:</strong> Easily expandable (add a new branch).</li>
                <li><strong>Root Dependency:</strong> The health of the root node is critical.</li>
            </ul>
        `,
        nodes: [
            { id: 'root', label: 'Root', x: 400, y: 50, type: 'hub' },
            { id: 'sub1', label: 'Switch A', x: 200, y: 150, type: 'hub' },
            { id: 'sub2', label: 'Switch B', x: 600, y: 150, type: 'hub' },
            { id: 0, label: 'PC1', x: 100, y: 300 },
            { id: 1, label: 'PC2', x: 300, y: 300 },
            { id: 2, label: 'PC3', x: 500, y: 300 },
            { id: 3, label: 'PC4', x: 700, y: 300 }
        ],
        edges: [
            { u: 'root', v: 'sub1' },
            { u: 'root', v: 'sub2' },
            { u: 'sub1', v: 0 },
            { u: 'sub1', v: 1 },
            { u: 'sub2', v: 2 },
            { u: 'sub2', v: 3 }
        ]
    },
    hybrid: {
        title: "Hybrid Topology",
        desc: "A combination of two or more different topologies (e.g., Star + Ring, Star + Bus). Inherits merits and demerits of the combined topologies.",
        pros: "Extremely flexible and scalable. Can be optimized for specific needs (e.g., speed in one part, redundancy in another).",
        cons: "Most complex design and implementation. Expensive. Requires intelligent concentrators (Routers/Switches).",
        theory: `
            <h2>Understanding Hybrid Topology</h2>
            <p>A <strong>Hybrid Topology</strong> integrates multiple standard topologies. For example, a university might use a Star topology for classrooms (easy management), a Ring topology for the admin building (security), and connect them via a Bus backbone.</p>
            
            <h3>Real-World Example</h3>
            <p> The Internet is the ultimate hybrid topology, combining mesh (backbone), star (ISPs to homes), and bus (older local loops) architectures.</p>

            <h3>Key Characteristics</h3>
            <ul>
                <li><strong>Flexibility:</strong> No need to stick to one rule.</li>
                <li><strong>Reliability:</strong> Fault detection and isolation is easier in the specific sub-networks.</li>
                <li><strong>Cost:</strong> Often higher due to diverse hardware requirements.</li>
            </ul>
        `,
        nodes: [
            { id: 'hub_star', label: 'Switch', x: 200, y: 200, type: 'hub' },
            { id: 0, label: 'PC1', x: 100, y: 100 },
            { id: 1, label: 'PC2', x: 300, y: 100 },
            { id: 2, label: 'PC3', x: 200, y: 300 },

            // Connected to a Ring structure
            { id: 'ring1', label: 'Node A', x: 500, y: 150 },
            { id: 'ring2', label: 'Node B', x: 650, y: 150 },
            { id: 'ring3', label: 'Node C', x: 650, y: 300 },
            { id: 'ring4', label: 'Node D', x: 500, y: 300 }
        ],
        edges: [
            // Star Part
            { u: 'hub_star', v: 0 },
            { u: 'hub_star', v: 1 },
            { u: 'hub_star', v: 2 },

            // Bridge
            { u: 'hub_star', v: 'ring1', style: 'dashed' },

            // Ring Part
            { u: 'ring1', v: 'ring2' },
            { u: 'ring2', v: 'ring3' },
            { u: 'ring3', v: 'ring4' },
            { u: 'ring4', v: 'ring1' }
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

    // Inject Theory Content
    if (theoryContainer && config.theory) {
        theoryContainer.innerHTML = config.theory;
    }

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

            if (edge.style === 'dashed') {
                line.setAttribute("stroke-dasharray", "5,5");
            }
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
