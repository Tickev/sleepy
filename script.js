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

    // Expert Audio Player Logic
    const audio = document.getElementById('expert-audio');
    const playBtn = document.getElementById('play-pause-btn');
    const seekSlider = document.getElementById('seek-slider');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const progressFill = document.querySelector('.progress-fill');

    if (audio && playBtn) {
        // Handle Audio Errors
        audio.addEventListener('error', (e) => {
            console.error("Audio error:", e);
            alert("Impossible de lire l'audio. Vérifiez que le fichier 'audio/expert_message.mp3' existe.");
            playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'; // Error/Info icon
        });

        // Toggle Play/Pause
        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z"/></svg>'; // Pause icon
            } else {
                audio.pause();
                playBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'; // Play icon
            }
        });

        // Update Progress Bar & Time
        audio.addEventListener('timeupdate', () => {
            const current = audio.currentTime;
            const duration = audio.duration || 0;

            // Format Time
            currentTimeEl.textContent = formatTime(current);
            if (!isNaN(duration)) {
                durationEl.textContent = formatTime(duration);
            }

            // Update Seek Slider & Fill
            if (duration > 0) {
                const percent = (current / duration) * 100;
                seekSlider.value = percent;
                progressFill.style.width = `${percent}%`;
            }
        });

        // Seek functionality
        seekSlider.addEventListener('input', (e) => {
            const duration = audio.duration || 0;
            const seekTo = duration * (e.target.value / 100);
            audio.currentTime = seekTo;
            progressFill.style.width = `${e.target.value}%`;
        });

        // Helper: Format Time (MM:SS)
        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
        }
    }

    // --- Click Tracking (Google Analytics) ---

    // Function to track clicks
    function trackClick(element, type) {
        // Priority: data-name > innerText > alt > 'Inconnu'
        let identifier = element.getAttribute('data-name');
        if (!identifier) {
            identifier = element.innerText || element.alt || 'Inconnu';
        }

        let label = identifier.trim();

        // Google Analytics Event
        if (typeof gtag === 'function') {
            gtag('event', 'click', {
                'event_category': type,
                'event_label': label,
                'transport_type': 'beacon'
            });
            // console.log("GA Event Sent:", type, label); // Debug
        }
    }

    // Global Click Listener
    document.body.addEventListener('click', (event) => {
        // Check if the clicked element or its parent is a button or link
        const target = event.target.closest('button, a, .faq-question');

        if (target) {
            // Determine type
            let type = 'Unknown';
            if (target.tagName === 'BUTTON') type = 'Button';
            else if (target.tagName === 'A') type = 'Link';
            else if (target.classList.contains('faq-question')) type = 'FAQ Data';

            trackClick(target, type);
        }
    });

    // --- Email Subscription (EmailJS) ---
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const emailInput = document.getElementById('user-email');
            const userEmail = emailInput.value;
            const btn = newsletterForm.querySelector('button');
            const originalBtnText = btn.innerText;

            // Visual feedback
            btn.innerText = 'Envoi...';
            btn.disabled = true;

            // Prepare parameters for the template
            // These names (to_email) must match your EmailJS template variables
            const templateParams = {
                to_email: userEmail,
                // Add other params if your template needs them, e.g., to_name: 'Subscriber'
            };

            // Send Email
            // REPLACE 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with actual values
            emailjs.send('service_2dcz481', 'template_rz11zra', templateParams)
                .then(function () {
                    alert('Inscription réussie ! Vous allez recevoir votre test de routine par mail.');
                    emailInput.value = ''; // Clear input
                    btn.innerText = 'Envoyé !';
                    setTimeout(() => {
                        btn.innerText = originalBtnText;
                        btn.disabled = false;
                    }, 3000);

                    // Optional: Track in GA
                    if (typeof gtag === 'function') {
                        gtag('event', 'generate_lead', {
                            'event_category': 'Newsletter',
                            'event_label': 'Footer Form'
                        });
                    }
                }, function (error) {
                    console.error('FAILED...', error);
                    alert('Oups, une erreur est survenue. Vérifiez votre connexion ou réessayez plus tard.');
                    btn.innerText = originalBtnText;
                    btn.disabled = false;
                });
        });
    }
});
