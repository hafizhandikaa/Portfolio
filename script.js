document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. SCROLL REVEAL ANIMATIONS
       ========================================================================== */
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -40px 0px"
    });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
        
        // Initial check for elements already in viewport
        const rect = reveal.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40) {
            reveal.classList.add('active');
        }
    });

    /* ==========================================================================
       2. SCROLL ACTION: NAVBAR & ACTIVE NAV LINKS
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id], header[id]');
    const navItems = document.querySelectorAll('.nav-link-item');

    window.addEventListener('scroll', () => {
        // Toggle navbar background
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link tracking
        let currentSection = "";
        const scrollPosition = window.scrollY + 120; // Offset for nav height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        // Fallback for top of page
        if (window.scrollY < 100) {
            currentSection = "home";
        }

        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === `#${currentSection}` || (currentSection === "home" && href === "#home")) {
                item.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       3. MOBILE HAMBURGER MENU DRAWER
       ========================================================================== */
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        hamburgerBtn.classList.toggle('open');
        mobileOverlay.classList.toggle('open');
        // Prevent body scrolling when menu is open
        document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : 'auto';
    }

    hamburgerBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close menu when a link is clicked
            hamburgerBtn.classList.remove('open');
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = 'auto';
        });
    });

    /* ==========================================================================
       4. DYNAMIC COPYRIGHT YEAR
       ========================================================================== */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       5. PREMIUM HOVER CARD TILT & GLOW MICRO-INTERACTIONS
       ========================================================================== */
    const interactiveCards = document.querySelectorAll('.glass-card, .btn-resume, .btn-contact-cta');

    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position inside element
            const y = e.clientY - rect.top;  // y position inside element
            
            // Calculate tilt angle based on cursor position (max 4deg tilt)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - y) / centerY) * 4;
            const rotateY = ((x - centerX) / centerX) * 4;

            // Apply subtle tilt transform
            if (!card.classList.contains('btn-resume') && !card.classList.contains('btn-contact-cta')) {
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
            }

            // Create a dynamic glow spotlight effect on cards
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            // Reset transforms on mouse leave
            card.style.transform = '';
            card.style.setProperty('--mouse-x', `-999px`);
            card.style.setProperty('--mouse-y', `-999px`);
        });
    });
});
