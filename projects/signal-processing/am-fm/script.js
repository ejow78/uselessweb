const canvas = document.getElementById('modulation-canvas');
const ctx = canvas.getContext('2d');
const carrierSlider = document.getElementById('carrierFreq');
const modSlider = document.getElementById('modFreq');
const fcVal = document.getElementById('fc-val');
const fmVal = document.getElementById('fm-val');
const radioButtons = document.getElementsByName('modType');

let time = 0;
let fc = 10; // Carrier Frequency
let fm = 1;  // Modulating Frequency
let modType = 'AM';

function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

carrierSlider.addEventListener('input', (e) => {
    fc = parseFloat(e.target.value);
    fcVal.textContent = fc;
});

modSlider.addEventListener('input', (e) => {
    fm = parseFloat(e.target.value);
    fmVal.textContent = fm;
});

radioButtons.forEach(radio => {
    radio.addEventListener('change', (e) => {
        modType = e.target.value;
    });
});

function draw() {
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const amplitude = 50;

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';

    for (let x = 0; x < canvas.width; x++) {
        let t = (x + time) * 0.05;
        let y = 0;

        // Modulating Signal (Information)
        let signal = Math.sin(fm * t * 0.1);

        if (modType === 'AM') {
            // Amplitude Modulation: (1 + m*sin(fmt)) * sin(fct)
            // We use m=1 for 100% modulation
            y = (1 + signal) * Math.sin(fc * t * 0.1) * amplitude;
        } else {
            // Frequency Modulation: sin(fct + I*sin(fmt))
            // I is modulation index
            y = Math.sin(fc * t * 0.1 + 5 * signal) * amplitude;
        }

        if (x === 0) {
            ctx.moveTo(x, centerY + y);
        } else {
            ctx.lineTo(x, centerY + y);
        }
    }
    ctx.stroke();

    // Draw Modulating Signal (Ghost) for reference
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x++) {
        let t = (x + time) * 0.05;
        let signal = Math.sin(fm * t * 0.1);
        let y = signal * amplitude;

        if (modType === 'AM') {
            // Envelope
            y = (1 + signal) * amplitude;
            if (x === 0) ctx.moveTo(x, centerY - y);
            else ctx.lineTo(x, centerY - y);
        } else {
            // Just the signal
            if (x === 0) ctx.moveTo(x, centerY + y);
            else ctx.lineTo(x, centerY + y);
        }
    }
    ctx.stroke();

    if (modType === 'AM') {
        // Draw bottom envelope for AM
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x++) {
            let t = (x + time) * 0.05;
            let signal = Math.sin(fm * t * 0.1);
            let y = -(1 + signal) * amplitude;
            if (x === 0) ctx.moveTo(x, centerY - y);
            else ctx.lineTo(x, centerY - y);
        }
        ctx.stroke();
    }

    time += 2;
    requestAnimationFrame(draw);
}

draw();
