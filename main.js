
document.addEventListener('DOMContentLoaded', () => {

    /* ================= 1. Loading Screen ================= */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
        }, 500); // Small delay for smooth effect
    });

    /* ================= 2. Theme Switcher ================= */
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggle.querySelector('i');

    // Check LocalStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }

    /* ================= 3. Navigation Logic ================= */
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const restoreNavBtn = document.getElementById('restore-nav-btn');

    // Hamburger Toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinksContainer.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        }
    });

    // Double-click to hide Nav
    navbar.addEventListener('dblclick', () => {
        navbar.classList.add('nav-hidden');
        restoreNavBtn.classList.add('visible');
    });

    // Restore Nav Button
    restoreNavBtn.addEventListener('click', () => {
        navbar.classList.remove('nav-hidden');
        restoreNavBtn.classList.remove('visible');
    });

    /* ================= 4. Scroll Features ================= */
    const scrollBar = document.getElementById('scroll-bar');
    const backToTopBtn = document.getElementById('back-to-top');
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        // Sticky Nav styling
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        scrollBar.style.width = scrollPercentage + '%';

        // Back to top button visibility
        if (scrollTop > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active Nav Link Highlighting (Scroll Spy)
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Back to top click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* ================= 5. Typing Animation ================= */
    const typedTextSpan = document.querySelector('.typed-text');
    const textArray = ["Full Stack Developer", "Tech Enthusiast", "Problem Solver", "Grade 12 Student"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }
    
    if(textArray.length) setTimeout(type, newTextDelay + 250);


    /* ================= 6. Scroll Reveal Animation ================= */
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
            
            // Trigger counters if it's the about section
            if(entry.target.classList.contains('about-text')){
                runCounters();
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => revealObserver.observe(reveal));



    let countersRun = false;
    function runCounters() {
        if(countersRun) return;
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // ms
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + (target > 5 ? '+' : '');
                }
            };
            updateCounter();
        });
        countersRun = true;
    }


    /* ================= 8. Mouse Effects (Glow & Tilt & Parallax) ================= */
    const mouseGlow = document.querySelector('.mouse-glow');
    const tiltCards = document.querySelectorAll('.tilt-card');
    const heroImage = document.querySelector('.hero-image');

    document.addEventListener('mousemove', (e) => {
        // Global mouse glow
        mouseGlow.style.left = e.clientX + 'px';
        mouseGlow.style.top = e.clientY + 'px';

        // Simple Hero Parallax
        if(heroImage) {
            const x = (window.innerWidth - e.pageX * 2) / 90;
            const y = (window.innerHeight - e.pageY * 2) / 90;
            heroImage.style.transform = `translateX(${x}px) translateY(${y}px)`;
        }
    });

    // Vanilla JS Tilt Effect for cards/images
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });


    /* ================= 9. Ripple Button Effect ================= */
    const buttons = document.querySelectorAll('.ripple');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            let ripples = document.createElement('span');
            ripples.style.left = x + 'px';
            ripples.style.top = y + 'px';
            ripples.classList.add('ripple-span');
            this.appendChild(ripples);

            setTimeout(() => {
                ripples.remove();
            }, 600);
        });
    });


    /* ================= 10. Floating Particles Background ================= */
    const particlesContainer = document.getElementById('particles-container');
    const particleCount = window.innerWidth > 768 ? 30 : 15;

    for (let i = 0; i < particleCount; i++) {
        let particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 5 + 2 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'var(--primary-color)';
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Random positioning
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.top = Math.random() * 100 + 'vh';
        
        // Random float animation
        const duration = Math.random() * 10 + 10; // 10s to 20s
        const direction = Math.random() > 0.5 ? 1 : -1;
        
        particle.style.transition = `transform ${duration}s linear`;
        particlesContainer.appendChild(particle);

        // trigger movement
        setTimeout(() => {
            particle.style.transform = `translate(${Math.random() * 200 * direction}px, ${Math.random() * 200 * direction}px)`;
        }, 100);

        // Keep them moving endlessly
        setInterval(() => {
             const newDirX = Math.random() > 0.5 ? 1 : -1;
             const newDirY = Math.random() > 0.5 ? 1 : -1;
             particle.style.transform = `translate(${Math.random() * 200 * newDirX}px, ${Math.random() * 200 * newDirY}px)`;
        }, duration * 1000);
    }


    /* ================= 11. Current Year & Image Fallbacks ================= */
    document.getElementById('year').textContent = new Date().getFullYear();

    // Fallback for missing images
    const images = document.querySelectorAll('.fallback-img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Replace with a solid color placeholder generated via data URI (SVG)
            this.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%233b82f6" opacity="0.2"><rect width="100%25" height="100%25"/><text x="50%25" y="50%25" font-size="20" text-anchor="middle" alignment-baseline="middle" fill="%23ffffff" font-family="sans-serif">Image not found</text></svg>`;
        });
    });

});
