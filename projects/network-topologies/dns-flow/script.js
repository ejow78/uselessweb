const nodes = {
    client: document.getElementById('node-client'),
    resolver: document.getElementById('node-resolver'),
    root: document.getElementById('node-root'),
    tld: document.getElementById('node-tld'),
    auth: document.getElementById('node-auth')
};
const queryBtn = document.getElementById('query-btn');
const statusMsg = document.getElementById('status-msg');
const svg = document.getElementById('connection-layer');
const wrapper = document.querySelector('.dns-wrapper');

let isRunning = false;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getCenter(element) {
    const rect = element.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2 - wrapperRect.left,
        y: rect.top + rect.height / 2 - wrapperRect.top
    };
}

function drawLine(from, to, dashed = false) {
    const start = getCenter(nodes[from]);
    const end = getCenter(nodes[to]);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);
    line.setAttribute("stroke", "#3f3f46");
    line.setAttribute("stroke-width", "2");
    if (dashed) line.setAttribute("stroke-dasharray", "5,5");

    svg.appendChild(line);
}

function initLines() {
    svg.innerHTML = '';
    drawLine('client', 'resolver');
    drawLine('resolver', 'root');
    drawLine('resolver', 'tld');
    drawLine('resolver', 'auth');
}

// Re-draw lines on resize
window.addEventListener('resize', initLines);
// Initial draw
setTimeout(initLines, 100);

async function animatePacket(from, to, color = '#ffff00') {
    const start = getCenter(nodes[from]);
    const end = getCenter(nodes[to]);

    const packet = document.createElement('div');
    packet.classList.add('packet');
    packet.style.left = `${start.x}px`;
    packet.style.top = `${start.y}px`;
    packet.style.backgroundColor = color;
    packet.style.boxShadow = `0 0 10px ${color}`;

    wrapper.appendChild(packet);

    // Animation
    const steps = 50;
    const dx = (end.x - start.x) / steps;
    const dy = (end.y - start.y) / steps;

    for (let i = 1; i <= steps; i++) {
        packet.style.left = `${start.x + dx * i}px`;
        packet.style.top = `${start.y + dy * i}px`;
        await sleep(10);
    }

    packet.remove();
}

async function runDNSQuery() {
    if (isRunning) return;
    isRunning = true;
    queryBtn.disabled = true;
    statusMsg.textContent = "Step 1: Client asks Recursive Resolver...";

    // Highlight Client
    nodes.client.classList.add('active');
    await animatePacket('client', 'resolver');
    nodes.client.classList.remove('active');

    // Highlight Resolver
    nodes.resolver.classList.add('active');
    statusMsg.textContent = "Step 2: Resolver asks Root Server (.) ...";
    await sleep(500);
    await animatePacket('resolver', 'root');
    nodes.resolver.classList.remove('active');

    // Root
    nodes.root.classList.add('active');
    statusMsg.textContent = "Step 3: Root replies with TLD (.com) address.";
    await sleep(500);
    await animatePacket('root', 'resolver', '#22c55e'); // Green reply
    nodes.root.classList.remove('active');

    // Resolver
    nodes.resolver.classList.add('active');
    statusMsg.textContent = "Step 4: Resolver asks TLD Server (.com)...";
    await sleep(500);
    await animatePacket('resolver', 'tld');
    nodes.resolver.classList.remove('active');

    // TLD
    nodes.tld.classList.add('active');
    statusMsg.textContent = "Step 5: TLD replies with Auth Server address.";
    await sleep(500);
    await animatePacket('tld', 'resolver', '#22c55e');
    nodes.tld.classList.remove('active');

    // Resolver
    nodes.resolver.classList.add('active');
    statusMsg.textContent = "Step 6: Resolver asks Authoritative Server...";
    await sleep(500);
    await animatePacket('resolver', 'auth');
    nodes.resolver.classList.remove('active');

    // Auth
    nodes.auth.classList.add('active');
    statusMsg.textContent = "Step 7: Authoritative Server returns IP!";
    await sleep(500);
    await animatePacket('auth', 'resolver', '#22c55e');
    nodes.auth.classList.remove('active');

    // Resolver
    nodes.resolver.classList.add('active');
    statusMsg.textContent = "Step 8: Resolver returns IP to Client.";
    await sleep(500);
    await animatePacket('resolver', 'client', '#22c55e');
    nodes.resolver.classList.remove('active');

    nodes.client.classList.add('active');
    statusMsg.textContent = "Done! Client connects to 93.184.216.34";
    await sleep(1000);
    nodes.client.classList.remove('active');

    isRunning = false;
    queryBtn.disabled = false;
}

queryBtn.addEventListener('click', runDNSQuery);
