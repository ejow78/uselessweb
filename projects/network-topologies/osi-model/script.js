const layers = document.querySelectorAll('.layer');
const title = document.getElementById('layer-title');
const desc = document.getElementById('layer-desc');
const details = document.getElementById('layer-details');
const pduVal = document.getElementById('pdu-val');
const protoVal = document.getElementById('proto-val');
const funcVal = document.getElementById('func-val');

const layersData = {
    7: {
        name: "Application Layer",
        desc: "The layer that the user interacts with directly. It provides network services to user applications.",
        pdu: "Data",
        protocols: "HTTP, HTTPS, FTP, SMTP, DNS, SSH",
        func: "Resource sharing, remote file access, directory services."
    },
    6: {
        name: "Presentation Layer",
        desc: "Responsible for translating data into a format that the application layer can understand. Handles encryption and compression.",
        pdu: "Data",
        protocols: "SSL/TLS, JPEG, MPEG, GIF, ASCII",
        func: "Data encryption, compression, and translation/formatting."
    },
    5: {
        name: "Session Layer",
        desc: "Manages sessions (connections) between applications. It sets up, coordinates, and terminates conversations.",
        pdu: "Data",
        protocols: "NetBIOS, RPC, SQL, NFS",
        func: "Session management (setup, maintenance, teardown)."
    },
    4: {
        name: "Transport Layer",
        desc: "Responsible for end-to-end communication and error recovery. Segmentation and reassembly happen here.",
        pdu: "Segment (TCP) / Datagram (UDP)",
        protocols: "TCP, UDP, SCTP",
        func: "End-to-end connection reliability, flow control, sequencing."
    },
    3: {
        name: "Network Layer",
        desc: "Responsible for routing packets across networks to the destination address. Logical addressing (IP) occurs here.",
        pdu: "Packet",
        protocols: "IP (IPv4, IPv6), ICMP, IPsec, IGMP",
        func: "Routing, logical addressing, path determination."
    },
    2: {
        name: "Data Link Layer",
        desc: "Responsible for node-to-node delivery within the same network. Physical addressing (MAC) occurs here.",
        pdu: "Frame",
        protocols: "Ethernet, Wi-Fi (802.11), PPP, Switch protocols",
        func: "Physical addressing (MAC), error detection, flow control."
    },
    1: {
        name: "Physical Layer",
        desc: "The physical medium through which data is transmitted as bits (electrical, optical, or radio signals).",
        pdu: "Bit",
        protocols: "Ethernet cables (CAT6), Fiber optics, Bluetooth, DSL",
        func: "Transmission of raw bitstream over physical medium."
    }
};

function updateInfo(layerId) {
    const data = layersData[layerId];
    title.textContent = data.name;
    title.style.color = `var(--layer-${layerId})`;
    desc.textContent = data.desc;

    pduVal.textContent = data.pdu;
    protoVal.textContent = data.protocols;
    funcVal.textContent = data.func;

    details.classList.remove('hidden');

    // Highlight
    layers.forEach(l => l.classList.remove('active'));
    document.querySelector(`.layer[data-layer="${layerId}"]`).classList.add('active');
}

layers.forEach(layer => {
    layer.addEventListener('mouseover', () => {
        updateInfo(layer.dataset.layer);
    });

    layer.addEventListener('click', () => {
        updateInfo(layer.dataset.layer);
    });
});

// Select Application layer by default
updateInfo(7);
