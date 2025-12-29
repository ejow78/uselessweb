const container = document.getElementById('bars-container');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');

let bars = [];
const numBars = 20;
const delay = 100; // ms
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

async function shakerSort() {
    let swapped = true;
    let start = 0;
    let end = bars.length;

    while (swapped) {
        swapped = false;

        // Forward pass
        for (let i = start; i < end - 1; ++i) {
            bars[i].element.style.backgroundColor = 'var(--bar-comparing)';
            bars[i + 1].element.style.backgroundColor = 'var(--bar-comparing)';
            playNote(200 + bars[i].value * 5);
            await sleep(delay);

            if (bars[i].value > bars[i + 1].value) {
                // Swap
                let tempVal = bars[i].value;
                bars[i].value = bars[i + 1].value;
                bars[i + 1].value = tempVal;

                bars[i].element.style.height = `${bars[i].value}%`;
                bars[i + 1].element.style.height = `${bars[i + 1].value}%`;

                playNote(600);
                swapped = true;
            }

            bars[i].element.style.backgroundColor = 'var(--bar-color)';
            bars[i + 1].element.style.backgroundColor = 'var(--bar-color)';
        }

        if (!swapped) break;
        swapped = false;

        // Mark end as sorted
        bars[end - 1].element.style.backgroundColor = 'var(--bar-sorted)';
        end--;

        // Backward pass
        for (let i = end - 1; i >= start; i--) {
            bars[i].element.style.backgroundColor = 'var(--bar-comparing)';
            bars[i + 1].element.style.backgroundColor = 'var(--bar-comparing)';
            playNote(200 + bars[i].value * 5);
            await sleep(delay);

            if (bars[i].value > bars[i + 1].value) {
                // Swap
                let tempVal = bars[i].value;
                bars[i].value = bars[i + 1].value;
                bars[i + 1].value = tempVal;

                bars[i].element.style.height = `${bars[i].value}%`;
                bars[i + 1].element.style.height = `${bars[i + 1].value}%`;

                playNote(600);
                swapped = true;
            }

            bars[i].element.style.backgroundColor = 'var(--bar-color)';
            bars[i + 1].element.style.backgroundColor = 'var(--bar-color)';
        }

        // Mark start as sorted
        bars[start].element.style.backgroundColor = 'var(--bar-sorted)';
        start++;
    }

    // Mark remaining middle as sorted
    for (let i = start; i < end; i++) {
        bars[i].element.style.backgroundColor = 'var(--bar-sorted)';
    }
}

async function runShakerSort() {
    initAudio();
    startBtn.disabled = true;
    resetBtn.disabled = true;

    await shakerSort();

    // Success run
    for (let i = 0; i < bars.length; i++) {
        bars[i].element.style.backgroundColor = 'var(--bar-sorted)';
        playNote(800 + i * 20);
        await sleep(20);
    }

    startBtn.disabled = false;
    resetBtn.disabled = false;
}

startBtn.addEventListener('click', runShakerSort);
resetBtn.addEventListener('click', generateBars);

// Initial generation
generateBars();
