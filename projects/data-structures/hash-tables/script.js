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

class HashTableVisualizer {
    constructor() {
        this.container = document.getElementById('hash-table-container');
        this.messageBox = document.getElementById('message-box');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.size = 7;
        this.table = [];
        this.isAnimating = false;
        this.shouldStop = false;

        this.reset();
        this.setupEventListeners();
    }

    reset() {
        this.table = new Array(this.size).fill(null).map(() => []);
        this.insert("apple", 10, false);
        this.insert("banana", 20, false);
        this.insert("cherry", 30, false);
        this.render();
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            if (this.isAnimating) return;
            this.runDemo();
        });

        this.resetBtn.addEventListener('click', () => {
            this.shouldStop = true;
            this.reset();
            this.setMessage('Hash Table reset.');
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

    hash(key) {
        let total = 0;
        for (let i = 0; i < key.length; i++) {
            total += key.charCodeAt(i);
        }
        return total % this.size;
    }

    render() {
        this.container.innerHTML = '';
        for (let i = 0; i < this.size; i++) {
            const row = document.createElement('div');
            row.className = 'bucket-row';
            row.id = `bucket-${i}`;

            const indexBox = document.createElement('div');
            indexBox.className = 'bucket-index';
            indexBox.textContent = i;
            row.appendChild(indexBox);

            const chain = document.createElement('div');
            chain.className = 'bucket-chain';
            chain.id = `chain-${i}`;

            this.table[i].forEach((item, idx) => {
                if (idx > 0) {
                    const arrow = document.createElement('span');
                    arrow.className = 'arrow';
                    arrow.innerHTML = '→';
                    chain.appendChild(arrow);
                }
                const itemBox = document.createElement('div');
                itemBox.className = 'hash-item';
                itemBox.id = `item-${i}-${item.key}`;
                itemBox.innerHTML = `<span class="hash-key">${item.key}:</span><span class="hash-value">${item.value}</span>`;
                chain.appendChild(itemBox);
            });

            row.appendChild(chain);
            this.container.appendChild(row);
        }
    }

    async highlightBucket(index) {
        const row = document.getElementById(`bucket-${index}`);
        if (row) {
            row.classList.add('highlight-bucket');
            playTone(300 + (index * 50), 0.1);
            await this.sleep(400);
            row.classList.remove('highlight-bucket');
        }
    }

    async runDemo() {
        this.isAnimating = true;
        this.shouldStop = false;
        this.startBtn.disabled = true;

        const operations = [
            { type: 'insert', key: 'grape', value: 40 },
            { type: 'insert', key: 'melon', value: 50 },
            { type: 'search', key: 'banana' },
            { type: 'delete', key: 'apple' }
        ];

        for (const op of operations) {
            if (this.shouldStop) break;

            switch (op.type) {
                case 'insert':
                    await this.insert(op.key, op.value);
                    break;
                case 'search':
                    await this.search(op.key);
                    break;
                case 'delete':
                    await this.delete(op.key);
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

    async insert(key, value, animate = true) {
        if (animate) this.setMessage(`Hashing key "${key}"...`);

        const index = this.hash(key);

        if (animate) {
            await this.highlightBucket(index);
            this.setMessage(`Index is ${index}. Inserting...`);
        }

        const bucket = this.table[index];
        const existingItem = bucket.find(item => item.key === key);

        if (existingItem) {
            existingItem.value = value;
        } else {
            bucket.push({ key, value });
        }

        this.render();

        if (animate) {
            const itemEl = document.getElementById(`item-${index}-${key}`);
            if (itemEl) {
                itemEl.classList.add('highlight-item');
                playTone(600, 0.2, 'triangle');
                await this.sleep(500);
                itemEl.classList.remove('highlight-item');
            }
            this.setMessage(`Inserted "${key}": ${value} at index ${index}.`);
        }
    }

    async search(key) {
        this.setMessage(`Hashing key "${key}"...`);

        const index = this.hash(key);
        await this.highlightBucket(index);

        const bucket = this.table[index];
        const item = bucket.find(item => item.key === key);

        if (item) {
            const itemEl = document.getElementById(`item-${index}-${key}`);
            if (itemEl) {
                itemEl.classList.add('found-item');
                playTone(800, 0.3, 'square');
                this.setMessage(`Found "${key}": ${item.value} at index ${index}.`);
                await this.sleep(1000);
                itemEl.classList.remove('found-item');
            }
        } else {
            this.setMessage(`Key "${key}" not found.`);
            playTone(200, 0.3, 'sawtooth');
        }
    }

    async delete(key) {
        this.setMessage(`Hashing key "${key}"...`);

        const index = this.hash(key);
        await this.highlightBucket(index);

        const bucket = this.table[index];
        const itemIndex = bucket.findIndex(item => item.key === key);

        if (itemIndex !== -1) {
            const itemEl = document.getElementById(`item-${index}-${key}`);
            if (itemEl) {
                itemEl.classList.add('deleting-item');
                playTone(300, 0.2, 'sawtooth');
                await this.sleep(500);
            }
            bucket.splice(itemIndex, 1);
            this.render();
            this.setMessage(`Deleted "${key}".`);
        } else {
            this.setMessage(`Key "${key}" not found.`);
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new HashTableVisualizer();
});
