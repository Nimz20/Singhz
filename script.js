/**
 * Singhz Estate - Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- SET CURRENT YEAR IN FOOTER ---
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // --- NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- MOBILE MENU TOGGLE ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMenu() {
        mobileMenuBtn.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (mobileMenuOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';

            // Stagger animation for links
            mobileNavLinks.forEach((link, index) => {
                link.style.transitionDelay = `${0.2 + (index * 0.1)}s`;
            });
        } else {
            document.body.style.overflow = '';
            mobileNavLinks.forEach((link) => {
                link.style.transitionDelay = '0s';
            });
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuOverlay.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // --- GSAP ANIMATIONS ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Parallax Effect
        gsap.to('.hero-content', {
            yPercent: 30,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Background Mesh Parallax
        gsap.to('.bg-gradient-mesh', {
            y: 200,
            ease: 'none',
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1
            }
        });

        // Initialize reveal animations
        const revealElements = document.querySelectorAll('.reveal-up');

        revealElements.forEach(el => {
            // Get custom delay if explicitly set in inline style
            const styleDelay = el.style.getPropertyValue('--delay');
            const delay = styleDelay ? parseFloat(styleDelay) : 0;

            gsap.to(el, {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                delay: delay,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none' // Only play once
                }
            });
        });

    } else {
        console.warn('GSAP not loaded. Fallback styles applied.');
        // Fallback if GSAP fails to load
        document.querySelectorAll('.reveal-up').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.transition = 'opacity 1s ease, transform 1s ease';
        });
    }

    // --- FORM HANDLING ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            const originalText = btn.innerHTML;

            // Loading state
            btn.innerHTML = '<span class="btn-text">SENDING...</span>';
            btn.style.pointerEvents = 'none';
            btn.style.opacity = '0.7';

            try {
                // Submit to Formspree (or similar provider) to keep email hidden
                const response = await fetch('https://formspree.io/f/nimal@singhz.co.za', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message
                    })
                });

                if (response.ok) {
                    btn.innerHTML = '<span class="btn-text">MESSAGE SENT</span>';
                    btn.style.borderColor = 'var(--color-gold-base)';
                    contactForm.reset();
                } else {
                    btn.innerHTML = '<span class="btn-text">ERROR LOGGED</span>';
                    btn.style.borderColor = '#ff4444';
                }
            } catch (error) {
                btn.innerHTML = '<span class="btn-text">NETWORK ERROR</span>';
                btn.style.borderColor = '#ff4444';
            }

            // Reset button after 3s
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.pointerEvents = 'all';
                btn.style.opacity = '1';
                btn.style.borderColor = '';
            }, 3000);
        });
    }

});
