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

class StackVisualizer {
    constructor() {
        this.container = document.getElementById('stack-container');
        this.messageBox = document.getElementById('message-box');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.stack = [];
        this.maxSize = 6;
        this.isAnimating = false;
        this.shouldStop = false;

        this.reset();
        this.setupEventListeners();
    }

    reset() {
        this.stack = [];
        this.container.innerHTML = '';
        this.push(10, false);
        this.push(20, false);
        this.push(30, false);
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            if (this.isAnimating) return;
            this.runDemo();
        });

        this.resetBtn.addEventListener('click', () => {
            this.shouldStop = true;
            this.reset();
            this.setMessage('Stack reset.');
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
            { type: 'push', value: 40 },
            { type: 'push', value: 50 },
            { type: 'peek' },
            { type: 'pop' },
            { type: 'pop' }
        ];

        for (const op of operations) {
            if (this.shouldStop) break;

            switch (op.type) {
                case 'push':
                    await this.push(op.value);
                    break;
                case 'pop':
                    await this.pop();
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

    async push(value, animate = true) {
        if (animate) this.setMessage(`Pushing ${value}...`);

        this.stack.push(value);

        const el = document.createElement('div');
        el.className = 'stack-element';
        el.textContent = value;
        el.id = `stack-el-${this.stack.length - 1}`;

        if (animate) el.classList.add('push-animation');

        this.container.appendChild(el);

        if (animate) {
            playTone(400 + (this.stack.length * 50), 0.2, 'triangle');
            await this.sleep(500);
            el.classList.remove('push-animation');
            this.setMessage(`Pushed ${value}.`);
        }
    }

    async pop() {
        if (this.stack.length === 0) return;

        this.setMessage('Popping...');

        const el = this.container.lastElementChild;
        const value = this.stack.pop();

        el.classList.add('pop-animation');
        playTone(300, 0.2, 'sawtooth');
        await this.sleep(500);

        el.remove();
        this.setMessage(`Popped ${value}.`);
    }

    async peek() {
        if (this.stack.length === 0) return;

        this.setMessage('Peeking...');

        const el = this.container.lastElementChild;
        const value = this.stack[this.stack.length - 1];

        el.classList.add('peek-animation');
        playTone(600, 0.3, 'sine');
        await this.sleep(800);
        el.classList.remove('peek-animation');

        this.setMessage(`Top element is ${value}.`);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new StackVisualizer();
});
