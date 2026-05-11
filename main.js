const lottoNumbersDiv = document.getElementById('lotto-numbers');
const generateBtn = document.getElementById('generate-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

const THEME_STORAGE_KEY = 'theme';

function getInitialTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggleBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
}

applyTheme(getInitialTheme());
themeToggleBtn.addEventListener('click', toggleTheme);

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers(numbers) {
    lottoNumbersDiv.innerHTML = '';
    for (const number of numbers) {
        const ball = document.createElement('div');
        ball.classList.add('lotto-ball');
        ball.textContent = number;
        ball.style.backgroundColor = getBallColor(number);
        lottoNumbersDiv.appendChild(ball);
    }
}

function getBallColor(number) {
    if (number <= 10) {
        return '#fbc400'; // Yellow
    } else if (number <= 20) {
        return '#69c8f2'; // Blue
    } else if (number <= 30) {
        return '#ff7272'; // Red
    } else if (number <= 40) {
        return '#aaa'; // Gray
    } else {
        return '#b0d840'; // Green
    }
}

generateBtn.addEventListener('click', () => {
    const numbers = generateLottoNumbers();
    displayNumbers(numbers);
});

const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-status');

async function handleContactSubmit(event) {
    event.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    contactStatus.className = '';
    contactStatus.textContent = '전송 중...';

    try {
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' },
        });
        if (response.ok) {
            contactForm.reset();
            contactStatus.className = 'success';
            contactStatus.textContent = '문의가 전송되었습니다. 감사합니다!';
        } else {
            const data = await response.json().catch(() => ({}));
            const message = Array.isArray(data.errors)
                ? data.errors.map((e) => e.message).join(', ')
                : '전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
            contactStatus.className = 'error';
            contactStatus.textContent = message;
        }
    } catch {
        contactStatus.className = 'error';
        contactStatus.textContent = '네트워크 오류가 발생했습니다. 다시 시도해주세요.';
    } finally {
        submitBtn.disabled = false;
    }
}

contactForm.addEventListener('submit', handleContactSubmit);

(function loadDisqus() {
    const d = document;
    const s = d.createElement('script');
    s.src = 'https://productbilder-2.disqus.com/embed.js';
    s.setAttribute('data-timestamp', String(Date.now()));
    (d.head || d.body).appendChild(s);
})();
