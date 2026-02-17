import { posts } from './posts-data.js';

const grid = document.getElementById('posts-grid');
const modal = document.getElementById('post-modal');
const closeModal = document.getElementById('close-modal');
const modalTitle = document.getElementById('modal-title');
const modalDate = document.getElementById('modal-date');
const modalAuthors = document.getElementById('modal-authors');
const modalType = document.getElementById('modal-type');
const modalBody = document.getElementById('modal-body');
const modalFooter = document.getElementById('modal-footer');

// Render Cards
function renderEntries() {
    grid.innerHTML = '';

    // Sort by date desc (newest first)
    const sortedEntries = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedEntries.forEach(entry => {
        const card = document.createElement('article');
        card.className = 'post-card';
        card.dataset.id = entry.id;

        // Validation for type
        const type = entry.type || 'post';

        // Format date
        const dateObj = new Date(entry.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // Generate Tags HTML
        const tagsHtml = entry.tags ?
            `<div class="post-tags">
                ${entry.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
             </div>` : '';

        // Generate Read Time
        const readTime = entry.readTime ? `<span class="meta-separator">•</span> <span>${entry.readTime}</span>` : '';

        card.innerHTML = `
            <div class="post-header">
                <h3>${entry.title}</h3>
            </div>
            <div class="post-meta">
                <span>${dateStr}</span>
                ${readTime}
            </div>
            <p class="post-preview">${entry.preview}</p>
            <div class="post-footer">
                ${tagsHtml}
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

    // Type info
    const type = entry.type || 'post';

    // Populate Modal
    modalTitle.textContent = entry.title;
    modalDate.textContent = dateStr;
    modalAuthors.textContent = entry.authors ? `Author(s): ${entry.authors.join(', ')}` : '';

    // modalType is hidden in CSS, but we keep logic just in case
    // modalType.textContent = ...

    modalBody.innerHTML = entry.content;

    // Footer Actions
    modalFooter.innerHTML = '';

    // Export PDF Button
    const exportBtn = document.createElement('button');
    exportBtn.className = 'btn-primary';
    exportBtn.textContent = 'Export to PDF';
    exportBtn.onclick = () => exportToPDF(entry);
    modalFooter.appendChild(exportBtn);

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Export to PDF Logic
async function exportToPDF(entry) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const margin = 20;
    let y = 20;

    // Title
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    // Split title if too long
    const titleLines = doc.splitTextToSize(entry.title, 170);
    doc.text(titleLines, margin, y);
    y += (titleLines.length * 10) + 10;

    // Metadata
    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.text(entry.date, margin, y);
    y += 6;
    if (entry.authors) {
        doc.text(`By ${entry.authors.join(', ')}`, margin, y);
        y += 10;
    } else {
        y += 4;
    }

    // Line separator
    doc.setLineWidth(0.5);
    doc.line(margin, y, 190, y);
    y += 10;

    // Content
    // Note: This is a basic HTML text implementation. 
    // For rich HTML rendering, simpler is to strip tags or use a html2canvas approach, 
    // but stripping tags is safer for basic text export without 3rd party bloat.
    // For this implementation, we will try to preserve paragraphs.

    doc.setFont("times", "normal");
    doc.setFontSize(12);

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = entry.content;
    const text = tempDiv.innerText || tempDiv.textContent; // Get plain text

    const contentLines = doc.splitTextToSize(text, 170);

    // Simple pagination handling
    const pageHeight = doc.internal.pageSize.height;

    contentLines.forEach(line => {
        if (y > pageHeight - 20) {
            doc.addPage();
            y = 20;
        }
        doc.text(line, margin, y);
        y += 7;
    });

    doc.save(`${entry.title.replace(/\s+/g, '_')}.pdf`);
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
