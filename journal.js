import { journalEntries } from './journal-data.js';

const grid = document.getElementById('journal-grid');
const modal = document.getElementById('journal-modal');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalBody = document.getElementById('modal-body');

// Render Cards
function renderEntries() {
    grid.innerHTML = '';

    // Sort by date asc (oldest to newest)
    const sortedEntries = [...journalEntries].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedEntries.forEach(entry => {
        const card = document.createElement('article');
        card.className = 'journal-card';
        card.dataset.id = entry.id;

        // Format date
        const dateObj = new Date(entry.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        card.innerHTML = `
            <div class="card-content">
                <span class="card-date">${dateStr}</span>
                <h3>${entry.title}</h3>
                <p class="card-preview">${entry.preview}</p>
                <span class="read-more">Read more &rarr;</span>
            </div>
        `;

        card.addEventListener('click', () => openEntry(entry));
        grid.appendChild(card);
    });
}

// Open Modal
function openEntry(entry) {
    const dateObj = new Date(entry.date);
    const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    modalTitle.textContent = entry.title;
    modalDate.textContent = dateStr;
    modalBody.innerHTML = entry.content;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close Modal
function closeEntry() {
    modal.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scrolling
}

closeModal.addEventListener('click', closeEntry);

// Close on click outside
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeEntry();
    }
});

// Close on Escape key
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeEntry();
    }
});

// Initialize
renderEntries();
