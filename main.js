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

function reloadDisqusForTheme() {
    if (!window.DISQUS || typeof window.DISQUS.reset !== 'function') {
        return;
    }
    const identifier = document.body.dataset.disqusIdentifier;
    if (!identifier) {
        return;
    }
    window.DISQUS.reset({
        reload: true,
        config: function () {
            this.page.url = window.location.href;
            this.page.identifier = identifier;
        },
    });
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
        reloadDisqusForTheme();
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

function initConsentBanner() {
    const CONSENT_KEY = 'consent';
    if (localStorage.getItem(CONSENT_KEY)) {
        return;
    }
    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', '쿠키 사용 동의');
    banner.innerHTML = ''
        + '<p>본 사이트는 광고와 분석을 위해 쿠키를 사용합니다. '
        + '자세한 내용은 <a href="privacy.html">개인정보처리방침</a>을 참고해 주세요.</p>'
        + '<div class="consent-actions">'
        + '<button type="button" data-consent="decline">거부</button>'
        + '<button type="button" data-consent="accept" class="primary">동의</button>'
        + '</div>';
    document.body.appendChild(banner);
    banner.addEventListener('click', (event) => {
        const choice = event.target.dataset && event.target.dataset.consent;
        if (choice === 'accept' || choice === 'decline') {
            localStorage.setItem(CONSENT_KEY, choice);
            banner.remove();
        }
    });
}

initTheme();
initContactForm();
initDisqus();
initConsentBanner();
