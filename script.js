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
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Simple sticky header background change on scroll
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 10, 24, 0.9)';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'var(--glass-bg)';
            header.style.boxShadow = 'none';
        }
    });

    // Sleep Quiz Logic
    const quizData = [
        {
            question: "Combien d'heures dormez-vous par nuit en moyenne ?",
            options: [
                { text: "Moins de 5h", score: 5 },
                { text: "5h - 7h", score: 12 },
                { text: "7h - 9h", score: 20 },
                { text: "Plus de 9h", score: 16 }
            ]
        },
        {
            question: "Combien de fois vous réveillez-vous la nuit ?",
            options: [
                { text: "Jamais", score: 20 },
                { text: "1 à 2 fois", score: 14 },
                { text: "3 fois ou plus", score: 6 },
                { text: "Je ne dors presque pas", score: 0 }
            ]
        },
        {
            question: "Combien de temps mettez-vous à vous endormir ?",
            options: [
                { text: "Moins de 15 min", score: 20 },
                { text: "15 à 30 min", score: 15 },
                { text: "30 à 60 min", score: 8 },
                { text: "Plus d'une heure", score: 2 }
            ]
        },
        {
            question: "Comment vous sentez-vous au réveil ?",
            options: [
                { text: "En pleine forme", score: 20 },
                { text: "Un peu fatigué(e)", score: 13 },
                { text: "Épuisé(e)", score: 4 },
                { text: "J'ai mal au crâne", score: 8 }
            ]
        },
        {
            question: "Ressentez-vous de la somnolence pendant la journée ?",
            options: [
                { text: "Jamais", score: 20 },
                { text: "Parfois après le déjeuner", score: 16 },
                { text: "Souvent", score: 7 },
                { text: "Tout le temps", score: 2 }
            ]
        }
    ];

    let currentQuestion = 0;
    let totalScore = 0;
    const quizContent = document.getElementById('quiz-content');

    function renderQuestion() {
        if (!quizContent) return;

        if (currentQuestion >= quizData.length) {
            showResult();
            return;
        }

        const data = quizData[currentQuestion];
        quizContent.innerHTML = `
            <div class="quiz-question">
                <h3>Question ${currentQuestion + 1}/${quizData.length}</h3>
                <p style="margin-bottom: 2rem; font-size: 1.3rem; color: #e2e8f0;">${data.question}</p>
                <div class="options-grid">
                    ${data.options.map((opt) => `
                        <button class="option-btn" onclick="handleAnswer(${opt.score})">
                            ${opt.text}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Expose to window for inline onclick
    window.handleAnswer = (score) => {
        totalScore += score;
        const questionEl = document.querySelector('.quiz-question');
        if (questionEl) {
            questionEl.style.opacity = '0';
            questionEl.style.transform = 'translateY(-20px)';
        }

        setTimeout(() => {
            currentQuestion++;
            renderQuestion();
        }, 300);
    };

    function showResult() {
        let message = "";

        if (totalScore >= 80) {
            message = "Excellent sommeil ! Continuez comme ça.";
        } else if (totalScore >= 50) {
            message = "Sommeil moyen. Quelques ajustements pourraient vous aider.";
        } else {
            message = "Votre sommeil a besoin d'attention. Sleepy peut vous aider.";
        }

        // Note: initialized with 0% to allow animation
        quizContent.innerHTML = `
            <div class="quiz-result">
                <h3>Votre Score de Sommeil</h3>
                <div class="score-circle" id="score-circle" style="--score-percent: 0%;">
                    <div class="score-number" id="score-display">0</div>
                </div>
                <p style="font-size: 1.2rem; margin-bottom: 2rem;">${message}</p>
                <a href="#download" class="btn-primary">Améliorer mon sommeil avec Sleepy</a>
                <button class="btn-secondary" onclick="restartQuiz()" style="margin-top: 1rem;">Recommencer</button>
            </div>
        `;

        // Animate Score and Circle
        animateScore("score-display", "score-circle", 0, totalScore, 1500);
    }

    function animateScore(textId, circleId, start, end, duration) {
        if (start === end) return;
        const range = end - start;
        let current = start;
        let increment = end > start ? 1 : -1;
        const stepTime = Math.abs(Math.floor(duration / range));

        const textObj = document.getElementById(textId);
        const circleObj = document.getElementById(circleId);

        const timer = setInterval(function () {
            current += increment;

            // Update Number
            if (textObj) textObj.innerHTML = current;

            // Update Circle
            if (circleObj) circleObj.style.setProperty('--score-percent', current + '%');

            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    window.restartQuiz = () => {
        currentQuestion = 0;
        totalScore = 0;
        renderQuestion();
    };

    // Initialize Quiz
    if (quizContent) {
        renderQuestion();
    }

});
