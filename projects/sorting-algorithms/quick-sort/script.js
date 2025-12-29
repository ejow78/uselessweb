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

async function partition(arr, low, high) {
    let pivot = arr[high].value;
    // Highlight pivot
    arr[high].element.style.backgroundColor = 'var(--bar-pivot)';

    let i = low - 1;

    for (let j = low; j < high; j++) {
        // Highlight comparison
        arr[j].element.style.backgroundColor = 'var(--bar-comparing)';
        playNote(200 + arr[j].value * 5);
        await sleep(delay);

        if (arr[j].value < pivot) {
            i++;
            // Swap values
            let tempVal = arr[i].value;
            arr[i].value = arr[j].value;
            arr[j].value = tempVal;

            // Swap visual heights
            arr[i].element.style.height = `${arr[i].value}%`;
            arr[j].element.style.height = `${arr[j].value}%`;

            playNote(600); // Swap sound
        }

        // Reset color (unless it's the pivot)
        if (j !== high) {
            arr[j].element.style.backgroundColor = 'var(--bar-color)';
        }
    }

    // Swap pivot to correct position
    let tempVal = arr[i + 1].value;
    arr[i + 1].value = arr[high].value;
    arr[high].value = tempVal;

    arr[i + 1].element.style.height = `${arr[i + 1].value}%`;
    arr[high].element.style.height = `${arr[high].value}%`;

    playNote(600);

    // Reset pivot color
    arr[high].element.style.backgroundColor = 'var(--bar-color)';

    return i + 1;
}

async function quickSort(arr, low, high) {
    if (low < high) {
        let pi = await partition(arr, low, high);

        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
}

async function runQuickSort() {
    initAudio();
    startBtn.disabled = true;
    resetBtn.disabled = true;

    await quickSort(bars, 0, bars.length - 1);

    // Success run
    for (let i = 0; i < bars.length; i++) {
        bars[i].element.style.backgroundColor = 'var(--bar-sorted)';
        playNote(800 + i * 20);
        await sleep(20);
    }

    startBtn.disabled = false;
    resetBtn.disabled = false;
}

startBtn.addEventListener('click', runQuickSort);
resetBtn.addEventListener('click', generateBars);

// Initial generation
generateBars();
