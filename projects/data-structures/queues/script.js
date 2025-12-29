// Audio Context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(frequency, duration, type = 'sine') {
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}

class QueueVisualizer {
    constructor() {
        this.container = document.getElementById('queue-container');
        this.messageBox = document.getElementById('message-box');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.queue = [];
        this.maxSize = 8;
        this.isAnimating = false;
        this.shouldStop = false;

        this.reset();
        this.setupEventListeners();
    }

    reset() {
        this.queue = [];
        this.container.innerHTML = '';
        this.enqueue(10, false);
        this.enqueue(20, false);
        this.enqueue(30, false);
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            if (this.isAnimating) return;
            this.runDemo();
        });

        this.resetBtn.addEventListener('click', () => {
            this.shouldStop = true;
            this.reset();
            this.setMessage('Queue reset.');
            this.isAnimating = false;
            this.startBtn.disabled = false;
        });
    }

    setMessage(msg) {
        this.messageBox.textContent = msg;
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async runDemo() {
        this.isAnimating = true;
        this.shouldStop = false;
        this.startBtn.disabled = true;

        const operations = [
            { type: 'enqueue', value: 40 },
            { type: 'enqueue', value: 50 },
            { type: 'peek' },
            { type: 'dequeue' },
            { type: 'dequeue' }
        ];

        for (const op of operations) {
            if (this.shouldStop) break;

            switch (op.type) {
                case 'enqueue':
                    await this.enqueue(op.value);
                    break;
                case 'dequeue':
                    await this.dequeue();
                    break;
                case 'peek':
                    await this.peek();
                    break;
            }
            await this.sleep(1000);
        }

        if (!this.shouldStop) {
            this.setMessage('Demo completed.');
        }
        this.isAnimating = false;
        this.startBtn.disabled = false;
    }

    async enqueue(value, animate = true) {
        if (animate) this.setMessage(`Enqueueing ${value}...`);

        this.queue.push(value);

        const el = document.createElement('div');
        el.className = 'queue-element';
        el.textContent = value;
        el.id = `queue-el-${Date.now()}`; // Unique ID

        if (animate) el.classList.add('enqueue-animation');

        this.container.appendChild(el);

        if (animate) {
            playTone(400 + (this.queue.length * 30), 0.2, 'triangle');
            await this.sleep(500);
            el.classList.remove('enqueue-animation');
            this.setMessage(`Enqueued ${value}.`);
        }
    }

    async dequeue() {
        if (this.queue.length === 0) return;

        this.setMessage('Dequeueing...');

        const el = this.container.firstElementChild; // Front element
        const value = this.queue.shift();

        el.classList.add('dequeue-animation');
        playTone(300, 0.2, 'sawtooth');
        await this.sleep(500);

        el.remove();
        this.setMessage(`Dequeued ${value}.`);
    }

    async peek() {
        if (this.queue.length === 0) return;

        this.setMessage('Peeking...');

        const el = this.container.firstElementChild;
        const value = this.queue[0];

        el.classList.add('peek-animation');
        playTone(600, 0.3, 'sine');
        await this.sleep(800);
        el.classList.remove('peek-animation');

        this.setMessage(`Front element is ${value}.`);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new QueueVisualizer();
});
