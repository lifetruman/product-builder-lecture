const THEME_STORAGE_KEY = 'theme';

function getInitialTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme, toggleBtn) {
    document.documentElement.setAttribute('data-theme', theme);
    if (toggleBtn) {
        toggleBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    }
}

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    applyTheme(getInitialTheme(), themeToggleBtn);
    if (!themeToggleBtn) {
        return;
    }
    themeToggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, next);
        applyTheme(next, themeToggleBtn);
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-status');
    if (!contactForm || !contactStatus) {
        return;
    }
    contactForm.addEventListener('submit', async (event) => {
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
    });
}

function initDisqus() {
    const thread = document.getElementById('disqus_thread');
    const identifier = document.body.dataset.disqusIdentifier;
    if (!thread || !identifier) {
        return;
    }
    window.disqus_config = function () {
        this.page.url = window.location.href;
        this.page.identifier = identifier;
    };
    const s = document.createElement('script');
    s.src = 'https://productbilder-2.disqus.com/embed.js';
    s.setAttribute('data-timestamp', String(Date.now()));
    document.head.appendChild(s);
}

initTheme();
initContactForm();
initDisqus();
