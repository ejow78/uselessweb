import init2021Season from './modules/2021-season.js';
import initColapinto from './modules/colapinto.js';

document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navItems = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.style.display = 'none');

            // Add active class
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.style.display = 'block';
                // Trigger animation reset
                targetSection.style.animation = 'none';
                targetSection.offsetHeight; /* trigger reflow */
                targetSection.style.animation = 'fadeIn 0.3s ease-out';

                // Initialize Module if needed
                if (targetId === 'colapinto') {
                    initColapinto();
                }
            }
        });
    });

    // Initialize Default Module (2021)
    init2021Season();
});
