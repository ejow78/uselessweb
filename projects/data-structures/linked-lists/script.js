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

class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
        this.id = Math.random().toString(36).substr(2, 9);
    }
}

class LinkedListVisualizer {
    constructor() {
        this.container = document.getElementById('list-container');
        this.messageBox = document.getElementById('message-box');
        this.startBtn = document.getElementById('start-btn');
        this.resetBtn = document.getElementById('reset-btn');

        this.head = null;
        this.tail = null;
        this.size = 0;
        this.isAnimating = false;
        this.shouldStop = false;

        // Initial setup
        this.reset();
        this.setupEventListeners();
    }

    reset() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.append(10, false);
        this.append(20, false);
        this.append(30, false);
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
            this.setMessage('Reset list.');
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
        let current = this.head;

        while (current) {
            const nodeWrapper = document.createElement('div');
            nodeWrapper.className = 'node-wrapper';
            nodeWrapper.id = `node-${current.id}`;

            nodeWrapper.innerHTML = `
                <div class="node">
                    <div class="node-content">
                        <div class="node-data">${current.value}</div>
                        <div class="node-next"></div>
                    </div>
                </div>
                ${current.next ? '<div class="arrow"></div>' : '<div class="arrow"></div><div class="null-node">NULL</div>'}
            `;

            this.container.appendChild(nodeWrapper);
            current = current.next;
        }

        if (!this.head) {
            this.container.innerHTML = '<div class="null-node">HEAD -> NULL</div>';
        }
    }

    async highlightNode(nodeId, type = 'highlight') {
        const el = document.getElementById(`node-${nodeId}`);
        if (el) {
            const content = el.querySelector('.node');
            content.classList.add(type);
            if (type === 'highlight') playTone(300, 0.1);
            if (type === 'found') playTone(600, 0.3, 'square');
            await this.sleep(500);
            if (type !== 'deleting') content.classList.remove(type);
        }
    }

    async runDemo() {
        this.isAnimating = true;
        this.shouldStop = false;
        this.startBtn.disabled = true;

        const operations = [
            { type: 'append', value: 40 },
            { type: 'prepend', value: 5 },
            { type: 'search', value: 20 },
            { type: 'delete', value: 20 }
        ];

        for (const op of operations) {
            if (this.shouldStop) break;

            switch (op.type) {
                case 'append':
                    await this.append(op.value);
                    break;
                case 'prepend':
                    await this.prepend(op.value);
                    break;
                case 'search':
                    await this.search(op.value);
                    break;
                case 'delete':
                    await this.deleteValue(op.value);
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

    async prepend(value) {
        this.setMessage(`Prepending ${value}...`);

        const newNode = new Node(value);
        newNode.next = this.head;
        this.head = newNode;
        if (!this.tail) {
            this.tail = newNode;
        }
        this.size++;

        this.render();
        const el = document.getElementById(`node-${newNode.id}`);
        if (el) el.classList.add('new-node');
        playTone(500, 0.2, 'triangle');
        await this.sleep(500);
        if (el) el.classList.remove('new-node');

        this.setMessage(`Prepended ${value}.`);
    }

    async append(value, animate = true) {
        if (animate) this.setMessage(`Appending ${value}...`);

        const newNode = new Node(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            // O(1) append using tail
            if (animate && !this.shouldStop) await this.highlightNode(this.tail.id);
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.size++;

        this.render();
        if (animate) {
            const el = document.getElementById(`node-${newNode.id}`);
            if (el) el.classList.add('new-node');
            playTone(500, 0.2, 'triangle');
            await this.sleep(500);
            if (el) el.classList.remove('new-node');
            this.setMessage(`Appended ${value}.`);
        }
    }

    async deleteValue(value) {
        this.setMessage(`Deleting value ${value}...`);

        if (!this.head) return;

        if (this.head.value === value) {
            await this.highlightNode(this.head.id, 'deleting');
            this.head = this.head.next;
            if (!this.head) {
                this.tail = null;
            }
            this.size--;
            this.render();
            this.setMessage(`Deleted ${value}.`);
            return;
        }

        let current = this.head;
        let prev = null;
        let found = false;

        while (current) {
            if (this.shouldStop) return;
            await this.highlightNode(current.id);
            if (current.value === value) {
                found = true;
                break;
            }
            prev = current;
            current = current.next;
        }

        if (found) {
            await this.highlightNode(current.id, 'deleting');
            prev.next = current.next;
            if (current === this.tail) {
                this.tail = prev;
            }
            this.size--;
            this.render();
            this.setMessage(`Deleted ${value}.`);
        } else {
            this.setMessage(`Value ${value} not found.`);
        }
    }

    async search(value) {
        this.setMessage(`Searching for ${value}...`);

        let current = this.head;
        let index = 0;
        let found = false;

        while (current) {
            if (this.shouldStop) return;
            await this.highlightNode(current.id);
            if (current.value === value) {
                await this.highlightNode(current.id, 'found');
                this.setMessage(`Found ${value} at index ${index}.`);
                found = true;
                break;
            }
            current = current.next;
            index++;
        }

        if (!found) {
            this.setMessage(`Value ${value} not found.`);
            playTone(150, 0.3, 'sawtooth');
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new LinkedListVisualizer();
});
