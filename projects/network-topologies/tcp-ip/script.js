const encapBtn = document.getElementById('encap-btn');
const decapBtn = document.getElementById('decap-btn');
const layers = document.querySelectorAll('.layer');
const pdus = {
    app: document.querySelector('.app-data'),
    trans: document.querySelector('.transport-segment'),
    net: document.querySelector('.internet-packet'),
    link: document.querySelector('.link-frame')
};
const processTitle = document.getElementById('process-title');
const processDesc = document.getElementById('process-desc');
const stepDetails = document.getElementById('step-details');

let currentStep = 0;
let mode = 'encap'; // or 'decap'
let isAnimating = false;

const encapSteps = [
    {
        layer: 4,
        title: "Layer 4: Application",
        desc: "The application generates data (e.g., an HTTP request).",
        detail: "User Data is ready to be sent."
    },
    {
        layer: 3,
        title: "Layer 3: Transport",
        desc: "The data is segmented. A TCP Header is added for reliability.",
        detail: "TCP Header + Data = <strong>Segment</strong>"
    },
    {
        layer: 2,
        title: "Layer 2: Internet",
        desc: "The segment is packetized. An IP Header is added with logical addresses.",
        detail: "IP Header + Segment = <strong>Packet</strong>"
    },
    {
        layer: 1,
        title: "Layer 1: Network Access",
        desc: "The packet is framed. A Frame Header (MAC) and Trailer (FCS) are added.",
        detail: "Frame Header + Packet + FCS = <strong>Frame</strong>"
    }
];

const decapSteps = [
    {
        layer: 1,
        title: "Layer 1: Network Access",
        desc: "The frame is received. The Header and Trailer are stripped to reveal the Packet.",
        detail: "Frame -> <strong>Packet</strong>"
    },
    {
        layer: 2,
        title: "Layer 2: Internet",
        desc: "The IP Header is read (routing check) and stripped to reveal the Segment.",
        detail: "Packet -> <strong>Segment</strong>"
    },
    {
        layer: 3,
        title: "Layer 3: Transport",
        desc: "The TCP Header is processed (sequencing) and stripped to reveal Data.",
        detail: "Segment -> <strong>Data</strong>"
    },
    {
        layer: 4,
        title: "Layer 4: Application",
        desc: "The raw data is passed to the application (e.g., Web Browser).",
        detail: "Data Received!"
    }
];

function resetView() {
    layers.forEach(l => l.classList.remove('active-process'));
    stepDetails.innerHTML = '';
}

function updateStep(stepIndex) {
    if (stepIndex >= 4) return;

    // Determine data based on mode
    const data = mode === 'encap' ? encapSteps[stepIndex] : decapSteps[stepIndex];

    // Highlight Layer
    resetView();
    const layerEl = document.querySelector(`.layer[data-layer="${data.layer}"]`);
    layerEl.classList.add('active-process');

    // Update Info
    processTitle.textContent = data.title;
    processDesc.textContent = data.desc;
    stepDetails.innerHTML = `<div class="step-info"><span class="concept">${data.detail}</span></div>`;

    // Visual Animation Logic
    if (mode === 'encap') {
        if (data.layer === 4) {
            pdus.app.classList.remove('hidden');
            pdus.trans.classList.add('hidden');
            pdus.net.classList.add('hidden');
            pdus.link.classList.add('hidden');
        } else if (data.layer === 3) {
            pdus.trans.classList.remove('hidden');
        } else if (data.layer === 2) {
            pdus.net.classList.remove('hidden');
        } else if (data.layer === 1) {
            pdus.link.classList.remove('hidden');
        }
    } else {
        // Decap Logic
        if (data.layer === 1) {
            pdus.link.classList.remove('hidden');
            pdus.net.classList.add('hidden'); // Hide inner initially to show "strip" effect logic? 
            // Actually for decap visuals, we start full and remove.
            // Simplified: Just show the current layer's PDU "revealing" the next up
            pdus.link.classList.remove('hidden');
            pdus.net.classList.remove('hidden');
            pdus.trans.classList.remove('hidden');
            pdus.app.classList.remove('hidden');
        } else if (data.layer === 2) {
            pdus.link.classList.add('hidden');
        } else if (data.layer === 3) {
            pdus.net.classList.add('hidden');
        } else if (data.layer === 4) {
            pdus.trans.classList.add('hidden');
        }
    }
}

async function runAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    currentStep = 0;

    // Reset visual state based on mode start
    if (mode === 'encap') {
        pdus.app.classList.add('hidden');
        pdus.trans.classList.add('hidden');
        pdus.net.classList.add('hidden');
        pdus.link.classList.add('hidden');
    } else {
        // Start full
        pdus.app.classList.remove('hidden');
        pdus.trans.classList.remove('hidden');
        pdus.net.classList.remove('hidden');
        pdus.link.classList.remove('hidden');
    }

    for (let i = 0; i < 4; i++) {
        updateStep(i);
        await new Promise(r => setTimeout(r, 2000));
        currentStep++;
    }

    isAnimating = false;
}

encapBtn.addEventListener('click', () => {
    if (isAnimating) return;
    mode = 'encap';
    encapBtn.classList.add('active');
    decapBtn.classList.remove('active');
    runAnimation();
});

decapBtn.addEventListener('click', () => {
    if (isAnimating) return;
    mode = 'decap';
    decapBtn.classList.add('active');
    encapBtn.classList.remove('active');
    runAnimation();
});

// Init
mode = 'encap';
runAnimation();
