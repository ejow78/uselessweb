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

async function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    // Create temp arrays
    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) {
        L[i] = { value: arr[left + i].value };
        arr[left + i].element.style.backgroundColor = 'var(--bar-aux)';
    }
    for (let j = 0; j < n2; j++) {
        R[j] = { value: arr[mid + 1 + j].value };
        arr[mid + 1 + j].element.style.backgroundColor = 'var(--bar-aux)';
    }

    await sleep(delay);

    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
        arr[k].element.style.backgroundColor = 'var(--bar-comparing)';
        playNote(200 + arr[k].value * 5);
        await sleep(delay);

        if (L[i].value <= R[j].value) {
            arr[k].value = L[i].value;
            arr[k].element.style.height = `${arr[k].value}%`;
            i++;
        } else {
            arr[k].value = R[j].value;
            arr[k].element.style.height = `${arr[k].value}%`;
            j++;
        }

        // Visual feedback for placed element
        arr[k].element.style.backgroundColor = 'var(--bar-active)';
        playNote(600);
        await sleep(delay);

        // Reset color if not fully sorted yet (though merge sort builds sorted subarrays)
        // We'll leave it as 'active' to show it's part of the merged segment
        k++;
    }

    while (i < n1) {
        arr[k].element.style.backgroundColor = 'var(--bar-comparing)';
        await sleep(delay);

        arr[k].value = L[i].value;
        arr[k].element.style.height = `${arr[k].value}%`;
        arr[k].element.style.backgroundColor = 'var(--bar-active)';
        playNote(600);
        i++;
        k++;
    }

    while (j < n2) {
        arr[k].element.style.backgroundColor = 'var(--bar-comparing)';
        await sleep(delay);

        arr[k].value = R[j].value;
        arr[k].element.style.height = `${arr[k].value}%`;
        arr[k].element.style.backgroundColor = 'var(--bar-active)';
        playNote(600);
        j++;
        k++;
    }

    // Reset colors for this segment after merge
    for (let x = left; x <= right; x++) {
        arr[x].element.style.backgroundColor = 'var(--bar-color)';
    }
}

async function mergeSort(arr, left, right) {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    await mergeSort(arr, left, mid);
    await mergeSort(arr, mid + 1, right);
    await merge(arr, left, mid, right);
}

async function runMergeSort() {
    initAudio();
    startBtn.disabled = true;
    resetBtn.disabled = true;

    await mergeSort(bars, 0, bars.length - 1);

    // Success run
    for (let i = 0; i < bars.length; i++) {
        bars[i].element.style.backgroundColor = 'var(--bar-sorted)';
        playNote(800 + i * 20);
        await sleep(20);
    }

    startBtn.disabled = false;
    resetBtn.disabled = false;
}

startBtn.addEventListener('click', runMergeSort);
resetBtn.addEventListener('click', generateBars);

// Initial generation
generateBars();
