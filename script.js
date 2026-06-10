document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. APPLE-STYLE SCROLL REVEAL (FADE SCALE)
       ========================================================================== */
    const revealOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        root: null,
        threshold: 0.05, // Trigger when 5% of the element is visible
        rootMargin: "0px 0px -40px 0px"
    });

    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
        
        // Initial viewport check
        const rect = reveal.getBoundingClientRect();
        if (rect.top < window.innerHeight - 40) {
            reveal.classList.add('active');
        }
    });

    /* ==========================================================================
       2. SCROLL EVENTS: NAVBAR SCROLL & ACTIVE STATE
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section[id], header[id]');
    const navItems = document.querySelectorAll('.nav-link-item');

    window.addEventListener('scroll', () => {
        // Toggle navbar scrolled class
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Section tracking on scroll
        let currentSection = "";
        const scrollPosition = window.scrollY + 100; // Nav height offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        if (window.scrollY < 80) {
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
        document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : 'auto';
    }

    hamburgerBtn.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
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
});
