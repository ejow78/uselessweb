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

class ArrayVisualizer {
    constructor() {
        this.container = document.getElementById('array-container');
        this.messageBox = document.getElementById('message-box');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.initialData = [12, 45, 7, 23, 56];
        this.data = [...this.initialData];
        this.maxSize = 10;
        this.isAnimating = false;
        this.shouldStop = false;

        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            if (this.isAnimating) return;
            this.runDemo();
        });

        this.resetBtn.addEventListener('click', () => {
            this.shouldStop = true;
            this.data = [...this.initialData];
            this.render();
            this.setMessage('Reset array.');
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

    render() {
        this.container.innerHTML = '';
        this.data.forEach((value, index) => {
            const el = document.createElement('div');
            el.className = 'array-element';
            el.id = `el-${index}`;
            el.innerHTML = `
                <div class="element-box">${value}</div>
                <div class="element-index">${index}</div>
            `;
            this.container.appendChild(el);
        });
    }

    async runDemo() {
        this.isAnimating = true;
        this.shouldStop = false;
        this.startBtn.disabled = true;

        const operations = [
            { type: 'access', index: 2 },
            { type: 'search', value: 23 },
            { type: 'insert', index: 2, value: 99 },
            { type: 'delete', index: 4 }
        ];

        for (const op of operations) {
            if (this.shouldStop) break;

            switch (op.type) {
                case 'access':
                    await this.access(op.index);
                    break;
                case 'search':
                    await this.search(op.value);
                    break;
                case 'insert':
                    await this.insert(op.index, op.value);
                    break;
                case 'delete':
                    await this.delete(op.index);
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

    async insert(index, value) {
        this.setMessage(`Inserting ${value} at index ${index}...`);

        // Animate shifting
        for (let i = this.data.length - 1; i >= index; i--) {
            if (this.shouldStop) return;
            const el = document.getElementById(`el-${i}`);
            if (el) {
                el.classList.add('highlight');
                playTone(300 + i * 50, 0.1);
                await this.sleep(300);
                el.classList.remove('highlight');
            }
        }

        this.data.splice(index, 0, value);
        this.render();

        const newEl = document.getElementById(`el-${index}`);
        if (newEl) {
            newEl.classList.add('new-element');
            playTone(600, 0.3, 'square');
            await this.sleep(500);
            newEl.classList.remove('new-element');
        }

        this.setMessage(`Inserted ${value} at index ${index}.`);
    }

    async delete(index) {
        this.setMessage(`Deleting element at index ${index}...`);

        const el = document.getElementById(`el-${index}`);
        if (el) {
            el.classList.add('deleting');
            playTone(200, 0.3, 'sawtooth');
            await this.sleep(500);
        }

        this.data.splice(index, 1);
        this.render();

        this.setMessage(`Deleted element at index ${index}.`);
    }

    async access(index) {
        this.setMessage(`Accessing index ${index}...`);

        const el = document.getElementById(`el-${index}`);
        if (el) {
            el.classList.add('highlight');
            playTone(440, 0.2);
            await this.sleep(500);
            el.classList.remove('highlight');
            this.setMessage(`Value at index ${index} is ${this.data[index]}.`);
        }
    }

    async search(value) {
        this.setMessage(`Searching for ${value}...`);

        let found = false;
        for (let i = 0; i < this.data.length; i++) {
            if (this.shouldStop) return;
            const el = document.getElementById(`el-${i}`);
            el.classList.add('highlight');
            playTone(300 + i * 30, 0.1);
            await this.sleep(300);
            el.classList.remove('highlight');

            if (this.data[i] === value) {
                el.classList.add('found');
                playTone(880, 0.4, 'square');
                this.setMessage(`Found ${value} at index ${i}!`);
                found = true;
                await this.sleep(1000);
                el.classList.remove('found');
                break;
            }
        }

        if (!found) {
            this.setMessage(`${value} not found in array.`);
            playTone(150, 0.3, 'sawtooth');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new ArrayVisualizer();
});
