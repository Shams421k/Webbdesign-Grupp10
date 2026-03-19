document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        // Öppnar/stänger mobilmenyn
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

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

