const container = document.getElementById('bars-container');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

let bars = [];
const numBars = 20;
const delay = 200; // ms
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playNote(freq) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.1);
    osc.stop(audioCtx.currentTime + 0.1);
}

function generateBars() {
    container.innerHTML = '';
    bars = [];
    for (let i = 0; i < numBars; i++) {
        const height = Math.floor(Math.random() * 80) + 10; // 10% to 90%
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${height}%`;
        container.appendChild(bar);
        bars.push({ element: bar, value: height });
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function insertionSort() {
    initAudio();
    startBtn.disabled = true;
    resetBtn.disabled = true;

    const n = bars.length;

    for (let i = 1; i < n; i++) {
        let currentVal = bars[i].value;
        let currentEl = bars[i].element;

        // Highlight current element being inserted
        currentEl.style.backgroundColor = 'var(--bar-active)';
        playNote(200 + currentVal * 5); // Base 200Hz + value mapping
        await sleep(delay);

        let j = i - 1;

        while (j >= 0 && bars[j].value > currentVal) {
            // Highlight comparison
            bars[j].element.style.backgroundColor = 'var(--bar-comparing)';
            playNote(200 + bars[j].value * 5);
            await sleep(delay);

            // Swap visual heights
            bars[j + 1].value = bars[j].value;
            bars[j + 1].element.style.height = `${bars[j].value}%`;

            // Reset color
            bars[j].element.style.backgroundColor = 'var(--bar-color)';

            j--;
        }

        // Place current element
        bars[j + 1].value = currentVal;
        bars[j + 1].element.style.height = `${currentVal}%`;
        playNote(600); // Placement sound

        // Mark as sorted (visually just reset to normal or a specific sorted color if desired)
        currentEl.style.backgroundColor = 'var(--bar-color)';
    }

    // Finish animation
    for (let i = 0; i < n; i++) {
        bars[i].element.style.backgroundColor = 'var(--bar-sorted)';
        playNote(800 + i * 20); // Success run
        await sleep(20);
    }

    startBtn.disabled = false;
    resetBtn.disabled = false;
}

startBtn.addEventListener('click', insertionSort);
resetBtn.addEventListener('click', generateBars);

// Initial generation
generateBars();
