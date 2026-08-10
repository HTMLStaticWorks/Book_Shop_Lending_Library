/* ==========================================================================
   LeafShelf - Core Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
        });
    }

    // 2. Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Check LocalStorage for theme
    const savedTheme = localStorage.getItem('leafshelf_theme') || 'light';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        } else {
            htmlElement.removeAttribute('data-theme');
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        }
        localStorage.setItem('leafshelf_theme', theme);
    }

    // 3. RTL Toggle Logic
    const rtlToggleBtn = document.getElementById('rtl-toggle');
    
    const savedDir = localStorage.getItem('leafshelf_dir') || 'ltr';
    setDirection(savedDir);

    if (rtlToggleBtn) {
        rtlToggleBtn.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir') || 'ltr';
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            setDirection(newDir);
        });
    }

    function setDirection(dir) {
        htmlElement.setAttribute('dir', dir);
        if (dir === 'rtl') {
            // Include Bootstrap RTL if needed dynamically, though for simplicity we handle text-align via CSS
            document.body.classList.add('rtl-mode');
        } else {
            document.body.classList.remove('rtl-mode');
        }
        localStorage.setItem('leafshelf_dir', dir);
        // Trigger AOS refresh on layout change
        setTimeout(() => {
            if (typeof AOS !== 'undefined') AOS.refresh();
        }, 300);
    }

    // 4. Sticky Header
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-sm');
                navbar.style.background = 'var(--glass-bg)';
            } else {
                navbar.classList.remove('shadow-sm');
                // Keep glass effect or make transparent based on preference
            }
        });
    }

    // 5. Back to Top Button
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.style.opacity = '1';
                backToTopBtn.style.visibility = 'visible';
            } else {
                backToTopBtn.style.opacity = '0';
                backToTopBtn.style.visibility = 'hidden';
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        // Initial state
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
        backToTopBtn.style.transition = 'all 0.3s ease';
    }

    // 6. Animated Counters
    const counters = document.querySelectorAll('.counter-value');
    if (counters.length > 0) {
        const observerOptions = {
            threshold: 0.5
        };
        
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.getAttribute('data-count'));
                    const suffix = target.getAttribute('data-suffix') || '';
                    const duration = 2000;
                    const step = finalValue / (duration / 16);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += step;
                        if (current < finalValue) {
                            target.innerText = Math.ceil(current) + suffix;
                            requestAnimationFrame(updateCounter);
                        } else {
                            target.innerText = finalValue + suffix;
                        }
                    };
                    updateCounter();
                    observer.unobserve(target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
});
