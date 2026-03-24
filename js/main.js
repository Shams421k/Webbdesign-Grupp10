document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = navLinks ? Array.from(navLinks.querySelectorAll('a[href]')) : [];
    const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const isMobileView = () => window.matchMedia('(max-width: 768px)').matches;

    const focusAndCenter = (element) => {
        if (!element) return;
        element.focus({ preventScroll: true });
        element.scrollIntoView({
            behavior: scrollBehavior,
            block: 'center',
            inline: 'nearest'
        });
    };

    if (menuToggle && navLinks) {
        // Gör mobilmenyn tangentbordsnavigerbar trots att elementet är en div.
        menuToggle.setAttribute('role', 'button');
        menuToggle.setAttribute('tabindex', '0');
        menuToggle.setAttribute('aria-label', 'Öppna eller stäng navigationsmenyn');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'primary-nav-links');
        navLinks.id = 'primary-nav-links';

        const toggleMenu = () => {
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        };

        // Öppnar/stänger mobilmenyn
        menuToggle.addEventListener('click', toggleMenu);
        menuToggle.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleMenu();
                return;
            }

            if (event.key === 'ArrowUp') {
                event.preventDefault();
                if (!navLinks.classList.contains('active')) {
                    toggleMenu();
                }
                const visibleNavItems = navItems.filter((item) => item.offsetParent !== null);
                if (!visibleNavItems.length) return;
                focusAndCenter(visibleNavItems[visibleNavItems.length - 1]);
            }
        });

    }

    // Globalt tangentbordsstöd för hela sajten:
    // - Piltangenter flyttar fokus mellan interaktiva element
    // - Enter aktiverar fokuserat element (som vänsterklick)
    const isTypingContext = (element) => {
        if (!element) return false;
        const tag = element.tagName;
        return (
            element.isContentEditable ||
            tag === 'INPUT' ||
            tag === 'TEXTAREA' ||
            tag === 'SELECT'
        );
    };

    const isVisible = (element) => {
        if (!element) return false;
        const styles = window.getComputedStyle(element);
        if (styles.display === 'none' || styles.visibility === 'hidden') return false;
        return element.getClientRects().length > 0;
    };

    const getInteractiveElements = () => {
        const selector = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled]):not([type="hidden"])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[role="button"]',
            '[role="link"]',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        return Array.from(document.querySelectorAll(selector)).filter(isVisible);
    };


    document.addEventListener('keydown', (event) => {
        const activeElement = document.activeElement;
        const key = event.key;

        if (isTypingContext(activeElement)) return;

        const isArrowKey = key === 'ArrowRight' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowUp';
        const isHorizontalArrow = key === 'ArrowLeft' || key === 'ArrowRight';
        const visibleNavItems = navItems.filter(isVisible);
        const isFocusOnMenuToggle = menuToggle && activeElement === menuToggle;
        const navIndex = visibleNavItems.indexOf(activeElement);
        const isFocusInVisibleNav = navIndex !== -1;
        const noMeaningfulFocus =
            activeElement === document.body || activeElement === document.documentElement;

        if (key === 'Escape' && menuToggle && navLinks && navLinks.classList.contains('active')) {
            event.preventDefault();
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            focusAndCenter(menuToggle);
            return;
        }

        if (isHorizontalArrow && visibleNavItems.length) {
            if (isFocusInVisibleNav || noMeaningfulFocus) {
                event.preventDefault();
                const currentNavIndex = navIndex === -1 ? 0 : navIndex;
                const nextNavIndex = key === 'ArrowRight'
                    ? (currentNavIndex + 1) % visibleNavItems.length
                    : (currentNavIndex - 1 + visibleNavItems.length) % visibleNavItems.length;
                focusAndCenter(visibleNavItems[nextNavIndex]);
                return;
            }
        }

        if (
            isMobileView() &&
            (key === 'ArrowDown' || key === 'ArrowUp') &&
            visibleNavItems.length &&
            (isFocusInVisibleNav || isFocusOnMenuToggle)
        ) {
            event.preventDefault();

            if (isFocusOnMenuToggle && key === 'ArrowDown') {
                focusAndCenter(visibleNavItems[0]);
                return;
            }

            if (isFocusOnMenuToggle && key === 'ArrowUp') {
                focusAndCenter(visibleNavItems[visibleNavItems.length - 1]);
                return;
            }

            if (key === 'ArrowUp' && isFocusInVisibleNav && navIndex === 0 && isVisible(menuToggle)) {
                focusAndCenter(menuToggle);
                return;
            }

            const currentNavIndex = navIndex === -1 ? 0 : navIndex;
            const nextNavIndex = key === 'ArrowDown'
                ? (currentNavIndex + 1) % visibleNavItems.length
                : (currentNavIndex - 1 + visibleNavItems.length) % visibleNavItems.length;
            focusAndCenter(visibleNavItems[nextNavIndex]);
            return;
        }

        if (key === 'ArrowDown' || key === 'ArrowUp') {
            const interactiveElements = getInteractiveElements();
            if (!interactiveElements.length) return;

            let currentIndex = interactiveElements.indexOf(activeElement);

            if (currentIndex === -1) {
                const startIndex = key === 'ArrowDown' ? 0 : interactiveElements.length - 1;
                event.preventDefault();
                focusAndCenter(interactiveElements[startIndex]);
                return;
            }

            const nextIndex = key === 'ArrowDown'
                ? (currentIndex + 1) % interactiveElements.length
                : (currentIndex - 1 + interactiveElements.length) % interactiveElements.length;
            event.preventDefault();
            focusAndCenter(interactiveElements[nextIndex]);
            return;
        }

        if (key === 'Enter' && activeElement && activeElement !== document.body) {
            const isClickable =
                activeElement.matches('a[href], button, [role="button"], [role="link"], input[type="submit"], input[type="button"]');

            if (isClickable) {
                event.preventDefault();
                activeElement.click();
            }
        }
    });

    // Registration: förvälj medlemsnivå baserat på query-parametern "?plan=..."
    const registrationForm = document.querySelector('#registration-form');
    const planSelect = document.querySelector('#plan');
    const registrationPrice = document.querySelector('#registration-price');

    if (registrationForm && planSelect) {
        // Priser per medlemsnivå
        const prices = {
            'Ungdom': 299,
            'Student': 349,
            'Senior': 379,
            'Standard': 399,
            'Premium': 529
        };

        // Uppdaterar prisrutan när användaren väljer nivå
        const setPrice = () => {
            const plan = planSelect.value;
            const price = prices[plan];

            if (registrationPrice) {
                if (price) {
                    registrationPrice.textContent = `Pris: ${price} kr/månad`;
                } else {
                    registrationPrice.textContent = '';
                }
            }
        };

        // Läs ?plan=... och förvälj automatiskt
        const params = new URLSearchParams(window.location.search);
        const plan = params.get('plan');
        if (plan) planSelect.value = plan;

        setPrice();
        planSelect.addEventListener('change', setPrice);
    }

    // Enkel klient-side validering för kontaktformuläret (progressive enhancement)
    const contactForm = document.querySelector('#contact-page form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            const nameInput = contactForm.querySelector('#name');
            const emailInput = contactForm.querySelector('#email');
            const messageInput = contactForm.querySelector('#message');

            let hasError = false;
            [nameInput, emailInput, messageInput].forEach(input => {
                if (!input) return;
                if (!input.value.trim()) {
                    // Markera fält som fel ifyllda (hjälper vid tangentbord)
                    input.setAttribute('aria-invalid', 'true');
                    hasError = true;
                } else {
                    input.removeAttribute('aria-invalid');
                }
            });

            if (hasError) {
                // Hindra skick om något fält är tomt
                event.preventDefault();
                alert('Fyll i alla fält innan du skickar formuläret.');
            }
        });
    }
});

