const canvas = document.getElementById('fourier-canvas');
const ctx = canvas.getContext('2d');
const slider = document.getElementById('harmonics');
const sliderVal = document.getElementById('harmonics-val');
const soundBtn = document.getElementById('toggle-sound');

let time = 0;
let wave = [];
let nHarmonics = 1;
let audioCtx;
let oscillators = [];
let gainNode;
let isSoundEnabled = false;

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 0.1;
        gainNode.connect(audioCtx.destination);
    }
}

function updateOscillators() {
    if (!isSoundEnabled || !audioCtx) return;

    // Stop old oscillators
    oscillators.forEach(osc => osc.stop());
    oscillators = [];

    const baseFreq = 200;

    for (let i = 0; i < nHarmonics; i++) {
        let n = i * 2 + 1; // 1, 3, 5, 7...
        let osc = audioCtx.createOscillator();
        osc.frequency.value = baseFreq * n;

        let oscGain = audioCtx.createGain();
        oscGain.gain.value = 1 / (n * Math.PI / 4); // Amplitude decreases

        osc.connect(oscGain);
        oscGain.connect(gainNode);
        osc.start();
        oscillators.push(osc);
    }
}

slider.addEventListener('input', (e) => {
    nHarmonics = parseInt(e.target.value);
    sliderVal.textContent = nHarmonics;
    if (isSoundEnabled) {
        updateOscillators();
    }
});

soundBtn.addEventListener('click', () => {
    initAudio();
    isSoundEnabled = !isSoundEnabled;

    if (isSoundEnabled) {
        soundBtn.textContent = "Disable Sound";
        soundBtn.classList.add('active');
        if (audioCtx.state === 'suspended') audioCtx.resume();
        updateOscillators();
    } else {
        soundBtn.textContent = "Enable Sound";
        soundBtn.classList.remove('active');
        oscillators.forEach(osc => osc.stop());
        oscillators = [];
    }
});

function draw() {
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dynamic positioning
    let startX = canvas.width * 0.25; // Circles center at 25% width
    let startY = canvas.height / 2;
    let waveStart = canvas.width * 0.6; // Wave starts at 60% width

    let x = startX;
    let y = startY;

    for (let i = 0; i < nHarmonics; i++) {
        let prevX = x;
        let prevY = y;

        let n = i * 2 + 1; // Odd harmonics for square wave: 1, 3, 5...

        // Scale radius based on canvas size to fit
        let baseRadius = Math.min(canvas.width, canvas.height) * 0.15;
        let radius = baseRadius * (4 / (n * Math.PI)); // Amplitude

        x += radius * Math.cos(n * time);
        y += radius * Math.sin(n * time);

        // Draw Circle
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.arc(prevX, prevY, radius, 0, Math.PI * 2);
        ctx.stroke();

        // Draw Line
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    // Connect last circle to wave
    wave.unshift(y);

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.moveTo(x, y);
    ctx.lineTo(waveStart, wave[0]);
    ctx.stroke();

    // Draw Wave
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.moveTo(waveStart, wave[0]);

    for (let i = 1; i < wave.length; i++) {
        ctx.lineTo(waveStart + i, wave[i]);
    }
    ctx.stroke();

    if (wave.length > canvas.width - waveStart) {
        wave.pop();
    }

    time += 0.05;
    requestAnimationFrame(draw);
}

draw();
