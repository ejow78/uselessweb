const canvas = document.getElementById('oscilloscope');
const canvasCtx = canvas.getContext('2d');
const toggleBtn = document.getElementById('toggle-btn');
const freqSlider = document.getElementById('frequency');
const freqVal = document.getElementById('freq-val');
const volSlider = document.getElementById('volume');
const volVal = document.getElementById('vol-val');
const typeSelect = document.getElementById('type');

let audioCtx;
let oscillator;
let gainNode;
let analyser;
let isPlaying = false;
let animationId;

// Resize canvas to match display size
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function startTone() {
    initAudio();

    oscillator = audioCtx.createOscillator();
    gainNode = audioCtx.createGain();
    analyser = audioCtx.createAnalyser();

    oscillator.type = typeSelect.value;
    oscillator.frequency.value = freqSlider.value;

    const volume = volSlider.value / 100;
    gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

    // Connect: Oscillator -> Gain -> Analyser -> Destination
    oscillator.connect(gainNode);
    gainNode.connect(analyser);
    analyser.connect(audioCtx.destination);

    analyser.fftSize = 2048;

    oscillator.start();
    isPlaying = true;
    toggleBtn.textContent = 'Stop Tone';
    toggleBtn.classList.add('active');

    draw();
}

function stopTone() {
    if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
    }
    isPlaying = false;
    toggleBtn.textContent = 'Play Tone';
    toggleBtn.classList.remove('active');
    cancelAnimationFrame(animationId);

    // Clear canvas
    canvasCtx.fillStyle = '#18181b';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    animationId = requestAnimationFrame(draw);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = '#18181b';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = '#3b82f6';
    canvasCtx.beginPath();

    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;

        if (i === 0) {
            canvasCtx.moveTo(x, y);
        } else {
            canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
}

toggleBtn.addEventListener('click', () => {
    if (isPlaying) {
        stopTone();
    } else {
        startTone();
    }
});

freqSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    freqVal.textContent = val;
    if (oscillator) {
        oscillator.frequency.value = val;
    }
});

volSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    volVal.textContent = val;
    if (gainNode) {
        gainNode.gain.setValueAtTime(val / 100, audioCtx.currentTime);
    }
});

typeSelect.addEventListener('change', (e) => {
    if (oscillator) {
        oscillator.type = e.target.value;
    }
});
