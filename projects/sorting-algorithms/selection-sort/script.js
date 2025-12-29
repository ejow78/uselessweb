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

async function selectionSort() {
    const n = bars.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        bars[i].element.style.backgroundColor = 'var(--bar-active)'; // Current position

        for (let j = i + 1; j < n; j++) {
            bars[j].element.style.backgroundColor = 'var(--bar-comparing)';
            playNote(200 + bars[j].value * 5);
            await sleep(delay / 2);

            if (bars[j].value < bars[minIdx].value) {
                if (minIdx !== i) {
                    bars[minIdx].element.style.backgroundColor = 'var(--bar-color)'; // Reset previous min
                }
                minIdx = j;
                bars[minIdx].element.style.backgroundColor = 'var(--bar-min)'; // New min found
                playNote(600);
            } else {
                bars[j].element.style.backgroundColor = 'var(--bar-color)';
            }
        }

        if (minIdx !== i) {
            // Swap
            let tempVal = bars[i].value;
            bars[i].value = bars[minIdx].value;
            bars[minIdx].value = tempVal;

            bars[i].element.style.height = `${bars[i].value}%`;
            bars[minIdx].element.style.height = `${bars[minIdx].value}%`;

            bars[minIdx].element.style.backgroundColor = 'var(--bar-color)';
            playNote(400);
        }

        bars[i].element.style.backgroundColor = 'var(--bar-sorted)';
        await sleep(delay);
    }
    bars[n - 1].element.style.backgroundColor = 'var(--bar-sorted)';
}

async function runSelectionSort() {
    initAudio();
    startBtn.disabled = true;
    resetBtn.disabled = true;

    await selectionSort();

    // Success run
    for (let i = 0; i < bars.length; i++) {
        playNote(800 + i * 20);
        await sleep(20);
    }

    startBtn.disabled = false;
    resetBtn.disabled = false;
}

startBtn.addEventListener('click', runSelectionSort);
resetBtn.addEventListener('click', generateBars);

// Initial generation
generateBars();
