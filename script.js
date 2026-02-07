document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for Fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up');
    animatedElements.forEach(el => observer.observe(el));

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            if (navLinks.style.display === 'flex') {
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = '#020617';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
            }
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;

            // Toggle active class on question for chevron rotation
            question.classList.toggle('active');

            // Toggle open class on answer for max-height animation
            answer.classList.toggle('open');

            // Optional: Close other FAQs when one opens (Accordion style)
            // faqQuestions.forEach(q => {
            //     if (q !== question) {
            //         q.classList.remove('active');
            //         q.nextElementSibling.classList.remove('open');
            //     }
            // });
        });
    });

    // Expert Audio Player (Visual Mockup Logic)
    const playBtn = document.querySelector('.play-btn-large');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            // Visual toggle only
            const icon = playBtn.querySelector('svg');
            if (playBtn.classList.contains('playing')) {
                playBtn.classList.remove('playing');
                // Play icon
                icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
            } else {
                playBtn.classList.add('playing');
                // Pause icon
                icon.innerHTML = '<path d="M6 4h4v16H6zm8 0h4v16h-4z"/>';
            }
        });
    }
});
