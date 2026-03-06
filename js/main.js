/* ============================================
   BRANDFLOW WEBSITE - JAVASCRIPT
   All interactive functionality
   ============================================ */

// ============================================
// GLOBAL VARIABLES
// ============================================
const header = document.getElementById('header');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav__link');
const scrollTopBtn = document.getElementById('scroll-top');
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');
const hasAnchorNavLinks = document.querySelector('.nav__link[href^="#"]');

// Global top scroll progress indicator
const scrollProgressBar = document.getElementById('scroll-progress-bar') || (() => {
    const el = document.createElement('div');
    el.id = 'scroll-progress-bar';
    el.className = 'scroll-progress-bar';
    document.body.appendChild(el);
    return el;
})();

function trackEvent(eventName, params = {}) {
    if (typeof gtag !== 'function') return;
    gtag('event', eventName, params);
}

// ============================================
// SCROLL PERFORMANCE OPTIMIZATION
// ============================================
// Detect mobile devices
const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

// Single scroll handler with RAF throttling for all scroll-based effects
let scrollTicking = false;
let lastKnownScrollY = 0;

function handleAllScrollEffects() {
    const scrollY = lastKnownScrollY;

    // 1. Header scroll effect
    if (header) {
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // 2. Parallax effect (desktop only)
    if (!isMobileDevice && heroSection && parallaxLayers.length > 0) {
        const heroHeight = heroSection.offsetHeight;
        if (scrollY < heroHeight) {
            parallaxLayers.forEach((layer, index) => {
                const speed = (index + 1) * 0.3;
                const yPos = -(scrollY * speed);
                layer.style.transform = `translateY(${yPos}px)`;
            });
        }
    }

    // 3. Scroll to top button visibility
    if (scrollTopBtn) {
        if (scrollY > 300) {
            scrollTopBtn.classList.add('show');

            // Check if over footer
            const footer = document.querySelector('.footer');
            if (footer) {
                const footerRect = footer.getBoundingClientRect();
                const buttonRect = scrollTopBtn.getBoundingClientRect();

                if (buttonRect.bottom > footerRect.top) {
                    scrollTopBtn.classList.add('over-footer');
                } else {
                    scrollTopBtn.classList.remove('over-footer');
                }
            }
        } else {
            scrollTopBtn.classList.remove('show');
            scrollTopBtn.classList.remove('over-footer');
        }
    }

    // 4. Active anchor link tracking (if present)
    if (hasAnchorNavLinks) {
        updateActiveNavLinkOnScroll(scrollY);
    }

    // 5. Top scroll progress indicator
    if (scrollProgressBar) {
        const doc = document.documentElement;
        const scrollable = doc.scrollHeight - doc.clientHeight;
        const progress = scrollable > 0 ? Math.min((scrollY / scrollable) * 100, 100) : 0;
        scrollProgressBar.style.width = progress + '%';
    }

    scrollTicking = false;
}

function onScroll() {
    lastKnownScrollY = window.scrollY;

    if (!scrollTicking) {
        window.requestAnimationFrame(handleAllScrollEffects);
        scrollTicking = true;
    }
}

// Single passive scroll listener for all effects
window.addEventListener('scroll', onScroll, { passive: true });

// ============================================
// PARALLAX SETUP
// ============================================
const parallaxLayers = document.querySelectorAll('.parallax-layer');
const heroSection = document.querySelector('.hero');

// Initialize parallax on load (desktop only)
if (!isMobileDevice && heroSection) {
    window.addEventListener('load', () => {
        lastKnownScrollY = window.scrollY;
        handleAllScrollEffects();
    });
} else {
    // Disable parallax transforms on mobile
    parallaxLayers.forEach(layer => {
        layer.style.transform = 'none';
    });
}

// ============================================
// HERO ROTATING TITLE
// ============================================
const heroRotatingTitle = document.querySelector('.hero__title-rotating');
const heroTitleRotator = document.querySelector('.hero__title-rotator');

if (heroRotatingTitle && heroTitleRotator) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rotatingPhrases = [
        'Build systems that <span class="hero__keyword">work while you sleep</span>',
        '<span class="hero__keyword">AI engineering</span> for businesses that mean business',
        'From <span class="hero__keyword">concept</span> to <span class="hero__keyword">production</span> \u2014 end to end',
        '<span class="hero__keyword">Automate</span> the repetitive. <span class="hero__keyword">Amplify</span> the exceptional'
    ];

    let phraseIndex = 0;
    const transitionDuration = 600;
    const rotationDelay = 3200;

    const setRotatorHeight = (height) => {
        heroTitleRotator.style.height = `${height}px`;
    };

    const showPhrase = (index) => {
        heroRotatingTitle.innerHTML = rotatingPhrases[index];
        heroRotatingTitle.classList.remove('is-out');

        if (prefersReducedMotion) {
            heroRotatingTitle.classList.add('is-in');
            heroTitleRotator.style.height = 'auto';
            return;
        }

        requestAnimationFrame(() => {
            setRotatorHeight(heroRotatingTitle.scrollHeight);
            heroRotatingTitle.classList.add('is-in');
            setTimeout(() => {
                heroTitleRotator.style.height = 'auto';
            }, transitionDuration);
        });
    };

    showPhrase(phraseIndex);

    setInterval(() => {
        if (prefersReducedMotion) {
            phraseIndex = (phraseIndex + 1) % rotatingPhrases.length;
            showPhrase(phraseIndex);
            return;
        }

        setRotatorHeight(heroTitleRotator.offsetHeight);
        heroRotatingTitle.classList.remove('is-in');
        heroRotatingTitle.classList.add('is-out');

        setTimeout(() => {
            phraseIndex = (phraseIndex + 1) % rotatingPhrases.length;
            heroRotatingTitle.innerHTML = rotatingPhrases[phraseIndex];
            heroRotatingTitle.classList.remove('is-out');

            requestAnimationFrame(() => {
                setRotatorHeight(heroRotatingTitle.scrollHeight);
                heroRotatingTitle.classList.add('is-in');
            });

            setTimeout(() => {
                heroTitleRotator.style.height = 'auto';
            }, transitionDuration);
        }, transitionDuration);
    }, rotationDelay);
}

// ============================================
// MOBILE NAVIGATION TOGGLE + ACCESSIBILITY
// ============================================
const dropdownItems = document.querySelectorAll('.nav__item--dropdown');

function closeMobileMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('show');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
}

if (navToggle && navMenu) {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'nav-menu');

    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('show');
        navToggle.classList.toggle('active', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
}

// Close mobile menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Don't close menu when tapping a dropdown toggle on mobile
        if (link.classList.contains('nav__link--dropdown') && window.innerWidth <= 768) return;
        closeMobileMenu();
    });
});

// ============================================
// MOBILE DROPDOWN NAVIGATION
// ============================================
dropdownItems.forEach((item, index) => {
    const dropdownLink = item.querySelector('.nav__link--dropdown');
    const dropdownPanel = item.querySelector('.nav__dropdown');

    if (!dropdownLink || !dropdownPanel) return;

    const dropdownId = dropdownPanel.id || `nav-dropdown-${index + 1}`;
    dropdownPanel.id = dropdownId;

    dropdownLink.setAttribute('role', 'button');
    dropdownLink.setAttribute('aria-expanded', 'false');
    dropdownLink.setAttribute('aria-controls', dropdownId);

    const toggleDropdown = (shouldOpen) => {
        item.classList.toggle('active', shouldOpen);
        dropdownLink.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    };

    dropdownLink.addEventListener('click', (e) => {
        const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
        if (!isTouchDevice && window.innerWidth > 768) return;
        e.preventDefault();
        // Close any other open dropdowns first
        dropdownItems.forEach(other => {
            if (other !== item && other.classList.contains('active')) {
                other.classList.remove('active');
                const otherLink = other.querySelector('.nav__link--dropdown');
                if (otherLink) otherLink.setAttribute('aria-expanded', 'false');
            }
        });
        toggleDropdown(!item.classList.contains('active'));
    });

    dropdownLink.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDropdown(!item.classList.contains('active'));
        }
        if (e.key === 'Escape') {
            toggleDropdown(false);
            dropdownLink.focus();
        }
    });
});

// Close dropdowns when tapping/clicking outside (supports tablet touch)
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav__item--dropdown')) {
        dropdownItems.forEach(item => {
            if (item.classList.contains('active')) {
                item.classList.remove('active');
                const link = item.querySelector('.nav__link--dropdown');
                if (link) link.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

// ============================================
// ACTIVE NAVIGATION LINK BASED ON CURRENT PAGE
// ============================================
function normalizeSlugFromPath(pathname) {
    if (!pathname || pathname === '/') {
        return 'index';
    }

    let cleanPath = pathname.split('?')[0].split('#')[0];
    if (cleanPath.endsWith('/') && cleanPath.length > 1) {
        cleanPath = cleanPath.slice(0, -1);
    }

    let slug = cleanPath.split('/').pop() || 'index';

    if (slug === 'index.html') {
        return 'index';
    }

    if (slug.endsWith('.html')) {
        slug = slug.slice(0, -5);
    }

    return slug || 'index';
}

function normalizeSlugFromHref(href) {
    if (!href || href.startsWith('#')) {
        return '';
    }

    const cleanHref = href.split('?')[0].split('#')[0];

    if (cleanHref.startsWith('http')) {
        try {
            return normalizeSlugFromPath(new URL(cleanHref).pathname);
        } catch (error) {
            return '';
        }
    }

    if (cleanHref.startsWith('/')) {
        return normalizeSlugFromPath(cleanHref);
    }

    return normalizeSlugFromPath(`/${cleanHref}`);
}

function setActiveNavLink() {
    const currentSlug = normalizeSlugFromPath(window.location.pathname);

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        const linkSlug = normalizeSlugFromHref(linkHref);
        // Remove any existing active class first
        link.classList.remove('active');

        // Check if this link matches the current page
        if (linkSlug && linkSlug === currentSlug) {
            link.classList.add('active');
        }
    });
}

// Set active link on page load
document.addEventListener('DOMContentLoaded', setActiveNavLink);

function scrollToSectionFromQuery() {
    const params = new URLSearchParams(window.location.search);
    let sectionId = params.get('section');

    if (!sectionId && window.location.hash) {
        const hashId = window.location.hash.replace('#', '');
        if (hashId) {
            sectionId = hashId;
            const newUrl = `${window.location.pathname}?section=${encodeURIComponent(hashId)}`;
            window.history.replaceState({}, '', newUrl);
        }
    }

    if (!sectionId) {
        return;
    }

    const target = document.getElementById(sectionId);
    if (!target) {
        return;
    }

    const headerHeight = header ? header.offsetHeight : 0;
    const targetPosition = target.offsetTop - headerHeight;

    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(scrollToSectionFromQuery, 150);
});

// Legacy scroll-based active link for same-page anchor navigation
function updateActiveNavLinkOnScroll(scrollY) {
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink.classList.add('active');
        } else if (navLink) {
            navLink.classList.remove('active');
        }
    });
}

// ============================================
// SMOOTH SCROLL FOR SAME-PAGE ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only handle pure anchor links (not empty # links)
        if (href && href.length > 1) {
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
let isScrolling = false;
let scrollCheckInterval = null;

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function(e) {
        e.preventDefault();

        // Add loading animation
        scrollTopBtn.classList.add('scrolling');
        isScrolling = true;

        // Scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Clear any existing interval
        if (scrollCheckInterval) {
            clearInterval(scrollCheckInterval);
        }

        // Check if scrolling has completed by monitoring scroll position
        let lastScrollY = window.scrollY;
        let samePositionCount = 0;

        scrollCheckInterval = setInterval(function() {
            const currentScrollY = window.scrollY;

            // Check if we've reached the top
            if (currentScrollY === 0) {
                if (scrollTopBtn) {
                    scrollTopBtn.classList.remove('scrolling');
                }
                isScrolling = false;
                clearInterval(scrollCheckInterval);
                scrollCheckInterval = null;
            }
            // Check if scroll position hasn't changed (scrolling stopped)
            else if (currentScrollY === lastScrollY) {
                samePositionCount++;
                // If position hasn't changed for 3 checks (300ms), consider it done
                if (samePositionCount >= 3) {
                    if (scrollTopBtn) {
                        scrollTopBtn.classList.remove('scrolling');
                    }
                    isScrolling = false;
                    clearInterval(scrollCheckInterval);
                    scrollCheckInterval = null;
                }
            } else {
                samePositionCount = 0;
                lastScrollY = currentScrollY;
            }
        }, 100); // Check every 100ms

        // Fallback timeout in case something goes wrong
        setTimeout(function() {
            if (isScrolling) {
                if (scrollTopBtn) {
                    scrollTopBtn.classList.remove('scrolling');
                }
                isScrolling = false;
                if (scrollCheckInterval) {
                    clearInterval(scrollCheckInterval);
                    scrollCheckInterval = null;
                }
            }
        }, 3000); // Max 3 seconds
    });
}

// ============================================
// COMPACT FAQ ACCORDION (Contact Section)
// ============================================
const faqItemsCompact = document.querySelectorAll('.faq-item-compact');

faqItemsCompact.forEach(item => {
    const question = item.querySelector('.faq-item-compact__question');

    question.addEventListener('click', () => {
        // Close other open items
        faqItemsCompact.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// ============================================
// REVEAL ON SCROLL ANIMATION
// ============================================
const revealElements = document.querySelectorAll('.reveal-on-scroll');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// Hero title blur-in animation removed per request

// ============================================
// HERO STATS COUNTER ANIMATION
// ============================================
function animateCounter(element, target, duration, suffix = '') {
    let current = 0;
    const increment = target / (duration / 16); // 60fps
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Trigger counter animation on page load
window.addEventListener('load', () => {
    const projectsCounter = document.querySelector('.hero__stat:nth-child(1) .hero__stat-number');

    if (projectsCounter) {
        // Start from 0 and animate to 50
        projectsCounter.textContent = '0+';

        // Wait a brief moment then start animation
        setTimeout(() => {
            animateCounter(projectsCounter, 50, 2000, '+');
        }, 500);
    }
});

// ============================================
// CONTACT FORM HANDLING
// ============================================
if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', async (e) => {
        // Note: FormSubmit will handle the actual submission
        // This is just for showing the success message
        
        // Uncomment below to prevent default and show success message
        // without actual form submission (for testing)
        
        /*
        e.preventDefault();
        
        // Show success message
        formSuccess.classList.add('show');
        
        // Hide form fields
        const formGroups = contactForm.querySelectorAll('.form__group');
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        
        formGroups.forEach(group => {
            group.style.display = 'none';
        });
        submitBtn.style.display = 'none';
        
        // Reset form after 5 seconds
        setTimeout(() => {
            contactForm.reset();
            formSuccess.classList.remove('show');
            formGroups.forEach(group => {
                group.style.display = 'flex';
            });
            submitBtn.style.display = 'inline-flex';
        }, 5000);
        */
    });
}

// ============================================
// FLIP ANIMATION FOR SUBMIT BUTTON
// ============================================
const submitButton = document.querySelector('.form__submit');

if (submitButton) {
    submitButton.addEventListener('click', (e) => {
        // Add flip class to trigger animation
        submitButton.classList.add('flip');

        // Remove the class after animation completes to allow it to be triggered again
        setTimeout(() => {
            submitButton.classList.remove('flip');
        }, 600); // Match the animation duration
    });
}

// ============================================
// FORM VALIDATION ENHANCEMENT
// ============================================
const formInputs = document.querySelectorAll('.form__input, .form__select, .form__textarea');

formInputs.forEach(input => {
    // Add floating label effect
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
    
    // Real-time validation feedback
    input.addEventListener('input', () => {
        if (input.validity.valid) {
            input.style.borderColor = 'var(--color-green)';
        } else {
            input.style.borderColor = 'var(--color-border)';
        }
    });
});

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================
const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// ============================================
// PERFORMANCE: LAZY LOAD IMAGES
// ============================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ============================================
// BROWSER MOCKUP INTERACTIONS
// ============================================
const projectCards = document.querySelectorAll('.project-card');
const mockupContents = document.querySelectorAll('.browser-mockup__content');

const updateMockupScales = () => {
    mockupContents.forEach(content => {
        const styles = getComputedStyle(content);
        const mockupWidth = parseFloat(styles.getPropertyValue('--mockup-width')) || 1440;
        const containerWidth = content.clientWidth || mockupWidth;
        const scale = containerWidth / mockupWidth;
        content.style.setProperty('--mockup-scale', scale.toFixed(4));
    });
};

updateMockupScales();
window.addEventListener('resize', () => {
    window.requestAnimationFrame(updateMockupScales);
});

projectCards.forEach(card => {
    const iframe = card.querySelector('iframe');
    const overlay = card.querySelector('.browser-mockup__overlay');
    
    // Prevent iframe interaction when not hovering
    if (iframe && overlay) {
        overlay.addEventListener('click', (e) => {
            // Allow link to work
            const link = overlay.querySelector('.btn');
            if (link && e.target === link) {
                return;
            }
            // Prevent other clicks
            e.preventDefault();
        });
    }
});

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Escape key closes mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('show')) {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
    }
});

// Focus trap in mobile menu
if (navMenu) {
    const focusableElements = navMenu.querySelectorAll(
        'a[href], button:not([disabled])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    navMenu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && navMenu.classList.contains('show')) {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}

// ============================================
// PRICING CARD HOVER EFFECTS (DESKTOP ONLY)
// ============================================
if (window.innerWidth > 768) {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            pricingCards.forEach(otherCard => {
                if (otherCard !== card && !otherCard.classList.contains('pricing-card--featured')) {
                    otherCard.style.opacity = '0.7';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            pricingCards.forEach(otherCard => {
                otherCard.style.opacity = '1';
            });
        });
    });
}

// ============================================
// TILT.JS - 3D CARD EFFECTS (DESKTOP ONLY)
// ============================================
if (typeof VanillaTilt !== 'undefined' && window.innerWidth > 768) {
    // Feature cards - subtle tilt
    // Pricing cards - dynamic tilt (kept for pricing section)
    const pricingCardsTilt = document.querySelectorAll('.pricing-card');
    VanillaTilt.init(pricingCardsTilt, {
        max: 6,
        speed: 300,
        glare: true,
        "max-glare": 0.25,
        scale: 1.02,
        perspective: 1000
    });

    // Feature cards, service cards, and industry cards - Tilt removed
}

// ============================================
// COOKIE CONSENT BANNER & ANALYTICS
// ============================================
const cookieBanner = document.getElementById('cookie-banner');
const cookieAccept = document.getElementById('cookie-accept');
const cookieDecline = document.getElementById('cookie-decline');
const cookieManage = document.getElementById('cookie-manage');
const COOKIE_NAME = 'brandflow_cookie_consent';
const COOKIE_DAYS = 180;

// Track if GA has been loaded to prevent duplicate loading
let gaLoaded = false;

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((acc, cookie) => {
        const [key, ...vals] = cookie.split('=');
        return key === name ? decodeURIComponent(vals.join('=')) : acc;
    }, null);
}

function setConsent(consentValue) {
    localStorage.setItem('cookieConsent', consentValue);
    setCookie(COOKIE_NAME, consentValue, COOKIE_DAYS);
}

function getConsent() {
    return localStorage.getItem('cookieConsent') || getCookie(COOKIE_NAME);
}

// Load Google Analytics only when consent is given
function loadGoogleAnalytics() {
    if (gaLoaded || !window.GA_MEASUREMENT_ID) return;

    gaLoaded = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    script.onload = function() {
        gtag('js', new Date());
        gtag('config', window.GA_MEASUREMENT_ID, { anonymize_ip: true });
        trackEvent('consent_analytics_enabled', { source: 'cookie_banner' });
    };
}

function showCookieBanner() {
    const consent = getConsent();

    if (consent === 'accepted') {
        loadGoogleAnalytics();
        return;
    }

    if (cookieBanner) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 800);
    }
}

function hideCookieBanner() {
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
}

if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
        setConsent('accepted');
        hideCookieBanner();
        loadGoogleAnalytics();
    });
}

if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
        setConsent('declined');
        hideCookieBanner();
    });
}

if (cookieManage) {
    cookieManage.addEventListener('click', () => {
        if (cookieBanner) {
            cookieBanner.classList.add('show');
        }
    });
}

showCookieBanner();

// ============================================
// SCROLL REVEAL ANIMATION - Slide from Left
// ============================================
function initScrollReveal() {
    // Add reveal-on-scroll class to cards
    const cardsToReveal = document.querySelectorAll(
        '.feature-card, .service-card, .pricing-card, .industry-card, .project-card, .services__standard, .contact__form-container, .faq-compact'
    );

    cardsToReveal.forEach(card => {
        card.classList.add('reveal-on-scroll');
    });

    // Intersection Observer for reveal animation
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all reveal elements
    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });
}

// Initialize scroll reveal
initScrollReveal();

// ============================================
// AUTOMATION ADVISOR - n8n Integration
// ============================================
const advisorForm = document.getElementById('advisor-form');
const advisorFormContainer = document.getElementById('advisor-form-container');
const advisorResults = document.getElementById('advisor-results');
const advisorResultsContent = document.getElementById('advisor-results-content');
const newAssessmentBtn = document.getElementById('new-assessment');
const advisorLoadingOverlay = document.getElementById('advisor-loading-overlay');

// Helper functions to show/hide loading overlay with proper mobile scroll handling
let scrollPosition = 0;

function showAdvisorLoading() {
    if (advisorLoadingOverlay) {
        // Store current scroll position for iOS fix
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

        // Set CSS variable for scroll position
        document.documentElement.style.setProperty('--scroll-position', `-${scrollPosition}px`);

        // Add body class to prevent scrolling (works better on mobile than overflow:hidden)
        document.body.classList.add('advisor-loading-active');

        // Show the overlay
        advisorLoadingOverlay.style.display = 'flex';
        // Trigger reflow to enable transition
        advisorLoadingOverlay.offsetHeight;
        advisorLoadingOverlay.classList.add('active');

        // Prevent touchmove on the overlay for iOS
        advisorLoadingOverlay.addEventListener('touchmove', preventScroll, { passive: false });
    }
}

function hideAdvisorLoading() {
    if (advisorLoadingOverlay) {
        advisorLoadingOverlay.classList.remove('active');

        // Remove touchmove listener
        advisorLoadingOverlay.removeEventListener('touchmove', preventScroll);

        // Wait for fade out transition
        setTimeout(() => {
            advisorLoadingOverlay.style.display = 'none';

            // Remove body class and restore scroll position
            document.body.classList.remove('advisor-loading-active');
            document.documentElement.style.removeProperty('--scroll-position');

            // Restore scroll position on iOS
            window.scrollTo(0, scrollPosition);
        }, 300);
    }
}

// Prevent scroll on touch devices
function preventScroll(e) {
    e.preventDefault();
}

// n8n Webhook URL - Replace with your actual webhook URL
const N8N_WEBHOOK_URL = 'https://n8n.brandflow.co.za/webhook/e83c19d9-3544-4ba7-9da6-16577be45389';

if (advisorForm) {
    advisorForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('advisor-submit');
        const btnText = submitBtn.querySelector('.btn__text');
        const btnLoading = submitBtn.querySelector('.btn__loading');
        const processDescription = document.getElementById('process-description').value.trim();

        // Validate input
        if (processDescription.length < 20) {
            alert('Please provide a more detailed description of your process (at least 20 characters).');
            return;
        }

        // Show loading state on button
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;

        // Show fullscreen loading overlay
        showAdvisorLoading();

        try {
            // Send request to n8n webhook
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    process_description: processDescription,
                    timestamp: new Date().toISOString(),
                    source: 'brandflow-website'
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const rawData = await response.json();
            console.log('Raw response from n8n:', rawData);

            // Parse the output field if it exists
            let data;
            if (rawData.output) {
                // The AI response is in the 'output' field as a JSON string
                data = JSON.parse(rawData.output);
            } else {
                // Response is already in the correct format
                data = rawData;
            }

            console.log('Parsed data:', data);

            // Hide loading overlay
            hideAdvisorLoading();

            // Store current assessment data for download
            window.currentAssessmentData = data;

            // Display the results
            displayAdvisorResults(data);

            // Track the assessment in the database
            trackAssessment(processDescription, data);

            // Show results, hide form
            advisorFormContainer.style.display = 'none';
            advisorResults.style.display = 'block';

            // Scroll to results
            advisorResults.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Advisor Error:', error);

            // Hide loading overlay
            hideAdvisorLoading();

            // Show error message
            advisorResultsContent.innerHTML = `
                <div class="advisor__error">
                    <div class="advisor__error-icon">
                        <iconify-icon icon="ph:warning-circle" width="48" height="48"></iconify-icon>
                    </div>
                    <h4 class="advisor__error-title">Unable to Process Your Request</h4>
                    <p class="advisor__error-text">We encountered an issue while analyzing your process. Please try again or contact us directly for assistance.</p>
                </div>
            `;

            advisorFormContainer.style.display = 'none';
            advisorResults.style.display = 'block';

        } finally {
            // Reset button state
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// Display formatted results from n8n
function displayAdvisorResults(data) {
    // Debug: Log the actual structure of arrays
    console.log('=== DEBUG: Data Structure ===');
    console.log('improvements:', data.improvements);
    console.log('businessImpact:', data.businessImpact);
    if (data.improvements && data.improvements.length > 0) {
        console.log('First improvement item:', data.improvements[0]);
        console.log('Type of first item:', typeof data.improvements[0]);
    }

    // Build technical workflow section if available
    let technicalWorkflowHtml = '';
    if (data.technicalWorkflow) {
        const tw = data.technicalWorkflow;

        // Build workflow steps
        let stepsHtml = '';
        if (tw.steps && tw.steps.length > 0) {
            stepsHtml = tw.steps.map(step => `
                <div class="workflow-step">
                    <div class="workflow-step__header">
                        <span class="workflow-step__number">${step.step}</span>
                        <div class="workflow-step__info">
                            <h5 class="workflow-step__name">${escapeHtml(step.name)}</h5>
                            <span class="workflow-step__duration">
                                <iconify-icon icon="ph:clock" width="14" height="14"></iconify-icon>
                                ${escapeHtml(step.duration)}
                            </span>
                        </div>
                    </div>
                    <p class="workflow-step__description">${escapeHtml(step.description)}</p>
                    <div class="workflow-step__systems">
                        ${step.systems.map(sys => `<span class="workflow-step__system">${escapeHtml(sys)}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        }

        // Build integrations badges
        let integrationsHtml = '';
        if (tw.integrations && tw.integrations.length > 0) {
            integrationsHtml = `
                <div class="workflow-integrations">
                    <h5 class="workflow-integrations__title">
                        <iconify-icon icon="ph:plug" width="18" height="18"></iconify-icon>
                        Systems & Integrations
                    </h5>
                    <div class="workflow-integrations__list">
                        ${tw.integrations.map(int => `<span class="workflow-integration">${escapeHtml(int)}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        // Build conditional logic
        let conditionalHtml = '';
        if (tw.conditionalLogic && tw.conditionalLogic.length > 0) {
            conditionalHtml = `
                <div class="workflow-logic">
                    <h5 class="workflow-logic__title">
                        <iconify-icon icon="ph:git-branch" width="18" height="18"></iconify-icon>
                        Intelligent Routing Logic
                    </h5>
                    <ul class="workflow-logic__list">
                        ${tw.conditionalLogic.map(logic => `<li>${escapeHtml(logic)}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        technicalWorkflowHtml = `
        <!-- Section 5: Technical Workflow -->
        <div class="assessment-section assessment-section--workflow">
            <div class="assessment-section__header">
                <span class="assessment-section__number">5</span>
                <h4 class="assessment-section__title">Technical Workflow Architecture</h4>
            </div>
            <div class="assessment-section__content">
                <!-- Trigger -->
                <div class="workflow-trigger">
                    <div class="workflow-trigger__icon">
                        <iconify-icon icon="ph:lightning" width="24" height="24"></iconify-icon>
                    </div>
                    <div class="workflow-trigger__content">
                        <h5 class="workflow-trigger__title">Workflow Trigger</h5>
                        <p class="workflow-trigger__description">${escapeHtml(tw.trigger || 'Automated trigger based on incoming data')}</p>
                    </div>
                </div>

                <!-- Steps -->
                <div class="workflow-steps">
                    ${stepsHtml}
                </div>

                <!-- Processing Time -->
                ${tw.totalProcessingTime ? `
                <div class="workflow-time">
                    <iconify-icon icon="ph:timer" width="20" height="20"></iconify-icon>
                    <span><strong>Total Processing Time:</strong> ${escapeHtml(tw.totalProcessingTime)}</span>
                </div>
                ` : ''}

                <!-- Integrations -->
                ${integrationsHtml}

                <!-- Conditional Logic -->
                ${conditionalHtml}
            </div>
        </div>
        `;
    }

    // Build implementation section if available
    let implementationHtml = '';
    if (data.implementation) {
        const impl = data.implementation;

        let prerequisitesHtml = '';
        if (impl.prerequisites && impl.prerequisites.length > 0) {
            prerequisitesHtml = `
                <div class="implementation-item">
                    <h5 class="implementation-item__title">
                        <iconify-icon icon="ph:check-square" width="18" height="18"></iconify-icon>
                        Prerequisites
                    </h5>
                    <ul class="implementation-item__list">
                        ${impl.prerequisites.map(pre => `<li>${escapeHtml(pre)}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        implementationHtml = `
        <!-- Section: Implementation Details -->
        <div class="assessment-section">
            <div class="assessment-section__header">
                <span class="assessment-section__number">${data.technicalWorkflow ? '7' : '6'}</span>
                <h4 class="assessment-section__title">Implementation Overview</h4>
            </div>
            <div class="assessment-section__content">
                <div class="implementation-grid">
                    ${impl.timeline ? `
                    <div class="implementation-item">
                        <h5 class="implementation-item__title">
                            <iconify-icon icon="ph:calendar" width="18" height="18"></iconify-icon>
                            Timeline
                        </h5>
                        <p class="implementation-item__value">${escapeHtml(impl.timeline)}</p>
                    </div>
                    ` : ''}

                    ${impl.complexity ? `
                    <div class="implementation-item">
                        <h5 class="implementation-item__title">
                            <iconify-icon icon="ph:chart-bar" width="18" height="18"></iconify-icon>
                            Complexity
                        </h5>
                        <p class="implementation-item__value">${escapeHtml(impl.complexity)}</p>
                    </div>
                    ` : ''}

                    ${impl.estimatedCost ? `
                    <div class="implementation-item implementation-item--highlight">
                        <h5 class="implementation-item__title">
                            <iconify-icon icon="ph:currency-circle-dollar" width="18" height="18"></iconify-icon>
                            Investment
                        </h5>
                        <p class="implementation-item__value implementation-item__value--large">${escapeHtml(impl.estimatedCost)}</p>
                    </div>
                    ` : ''}
                </div>

                ${prerequisitesHtml}
            </div>
        </div>
        `;
    }

    const html = `
        <!-- Section 1: Current Process Overview -->
        <div class="assessment-section">
            <div class="assessment-section__header">
                <span class="assessment-section__number">1</span>
                <h4 class="assessment-section__title">Current Process Overview</h4>
            </div>
            <div class="assessment-section__content">
                <p>${escapeHtml(data.currentProcess || 'Your process involves manual handling of routine business operations.')}</p>
            </div>
        </div>

        <!-- Section 2: Identified Inefficiencies -->
        <div class="assessment-section">
            <div class="assessment-section__header">
                <span class="assessment-section__number">2</span>
                <h4 class="assessment-section__title">Identified Inefficiencies</h4>
            </div>
            <div class="assessment-section__content">
                <ul>
                    ${(data.inefficiencies || ['Repetitive manual handling of information', 'Delays caused by human dependency', 'Risk of overlooked steps or follow-ups']).map(item => {
                        const text = extractText(item);
                        return text ? `<li>${escapeHtml(text)}</li>` : '';
                    }).join('')}
                </ul>
            </div>
        </div>

        <!-- Section 3: Automation Improvements -->
        <div class="assessment-section">
            <div class="assessment-section__header">
                <span class="assessment-section__number">3</span>
                <h4 class="assessment-section__title">How the BrandFlow Automation Engine Would Improve This</h4>
            </div>
            <div class="assessment-section__content">
                <ul>
                    ${(data.improvements || ['Information moves automatically once received', 'Actions are triggered immediately, without waiting', 'Updates and confirmations are sent automatically']).map(item => {
                        const text = extractText(item);
                        return text ? `<li>${escapeHtml(text)}</li>` : '';
                    }).join('')}
                </ul>
            </div>
        </div>

        <!-- Section 4: Business Impact -->
        <div class="assessment-section">
            <div class="assessment-section__header">
                <span class="assessment-section__number">4</span>
                <h4 class="assessment-section__title">Business Impact</h4>
            </div>
            <div class="assessment-section__content">
                <ul class="impact-list">
                    ${(data.businessImpact || ['Reduced time spent on routine tasks', 'Faster turnaround on client or internal requests', 'Lower risk of human error', 'Greater consistency in service delivery']).map(item => {
                        const text = extractText(item);
                        return text ? `<li>${escapeHtml(text)}</li>` : '';
                    }).join('')}
                </ul>
            </div>
        </div>

        ${technicalWorkflowHtml}

        <!-- Section 6: Process Upgrade Level -->
        <div class="assessment-section">
            <div class="assessment-section__header">
                <span class="assessment-section__number">${data.technicalWorkflow ? '6' : '5'}</span>
                <h4 class="assessment-section__title">Process Upgrade Level</h4>
            </div>
            <div class="assessment-section__content">
                <div class="assessment-level">
                    <iconify-icon icon="ph:gauge" width="20" height="20"></iconify-icon>
                    ${escapeHtml(data.upgradeLevel || 'Multi-step process enhancement')}
                </div>
            </div>
        </div>

        ${implementationHtml}

        <!-- Section 8: Recommended Next Step -->
        <div class="assessment-section">
            <div class="assessment-section__header">
                <span class="assessment-section__number">${data.technicalWorkflow && data.implementation ? '8' : data.technicalWorkflow || data.implementation ? '7' : '6'}</span>
                <h4 class="assessment-section__title">Recommended Next Step</h4>
            </div>
            <div class="assessment-section__content">
                <div class="assessment-next-step">
                    <p>${escapeHtml(data.nextStep || 'Your process can be structured and deployed through the BrandFlow Automation Engine. Schedule a consultation to convert this assessment into a live automation solution.')}</p>
                </div>
            </div>
        </div>
    `;

    advisorResultsContent.innerHTML = html;

    // Populate results summary bar
    const summaryEl = document.getElementById('advisor-results-summary');
    const levelEl = document.getElementById('results-upgrade-level');
    const refEl = document.getElementById('results-reference');
    const dateEl = document.getElementById('results-date');
    if (summaryEl) {
        if (levelEl && data.upgradeLevel) levelEl.textContent = data.upgradeLevel;
        if (refEl) {
            // currentAssessmentId is set asynchronously after tracking; use fallback until available
            const refVal = window.currentAssessmentId || ('BF-' + Date.now().toString(36).toUpperCase());
            refEl.textContent = refVal;
            // Update once tracking completes (poll once after 3s)
            setTimeout(() => { if (window.currentAssessmentId && refEl) refEl.textContent = window.currentAssessmentId; }, 3000);
        }
        if (dateEl) dateEl.textContent = new Date().toLocaleDateString('en-ZA', {day: 'numeric', month: 'short', year: 'numeric'});
        summaryEl.style.display = 'flex';
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Extract text from an item (handles strings, objects, or any structure)
function extractText(item) {
    // If it's a string, return it directly
    if (typeof item === 'string') {
        return item;
    }

    // If it's null or undefined, return empty string
    if (item == null) {
        return '';
    }

    // If it's an object, try common property names
    if (typeof item === 'object') {
        // Log the object structure for debugging
        console.log('Item structure:', JSON.stringify(item, null, 2));

        // Try common property names
        const commonProps = ['description', 'text', 'value', 'title', 'content', 'message',
                            'improvement', 'impact', 'issue', 'name', 'summary', 'detail'];

        for (const prop of commonProps) {
            if (item[prop] && typeof item[prop] === 'string') {
                return item[prop];
            }
        }

        // If object has numbered keys (like "0", "1", etc.), it might be array-like
        if (item['0'] && typeof item['0'] === 'string') {
            return item['0'];
        }

        // Last resort: get the first string value found in the object
        for (const key in item) {
            if (typeof item[key] === 'string' && item[key].length > 0) {
                console.log(`Found text in property "${key}":`, item[key]);
                return item[key];
            }
        }

        // If still nothing, try to stringify
        return JSON.stringify(item);
    }

    // For other types, convert to string
    return String(item);
}

// New Assessment button handler
if (newAssessmentBtn) {
    newAssessmentBtn.addEventListener('click', function() {
        // Reset form
        advisorForm.reset();

        // Clear stored assessment data
        window.currentAssessmentId = null;
        window.currentAssessmentData = null;

        // Show form, hide results
        advisorResults.style.display = 'none';
        advisorFormContainer.style.display = 'block';

        // Scroll to form
        advisorFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// ============================================
// ASSESSMENT TRACKING & DOWNLOAD
// ============================================
// Use absolute URL to avoid path issues with clean URLs
const ASSESSMENT_API_URL = '/api/assessment.php';

// Store current assessment data globally
window.currentAssessmentId = null;
window.currentAssessmentData = null;

/**
 * Track assessment in database
 */
async function trackAssessment(processDescription, results) {
    console.log('Tracking assessment...');
    try {
        const response = await fetch(`${ASSESSMENT_API_URL}?action=track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                process_description: processDescription,
                results: results
            })
        });

        console.log('Track response status:', response.status);
        const data = await response.json();
        console.log('Track response data:', data);

        if (response.ok && data.success && data.assessment_id) {
            window.currentAssessmentId = data.assessment_id;
            console.log('Assessment tracked:', data.assessment_id);

            // Update hidden field in download form
            const assessmentIdField = document.getElementById('download-assessment-id');
            if (assessmentIdField) {
                assessmentIdField.value = data.assessment_id;
            }
        } else {
            console.error('Track API error:', data.error || 'Unknown error');
        }
    } catch (error) {
        console.error('Failed to track assessment:', error);
        // Continue anyway - tracking is not critical for user experience
    }
}

// Download Modal Elements
const downloadModal = document.getElementById('download-modal');
const downloadModalBackdrop = document.getElementById('download-modal-backdrop');
const downloadModalClose = document.getElementById('download-modal-close');
const downloadForm = document.getElementById('download-form');
const downloadBtn = document.getElementById('download-assessment-btn');

/**
 * Show download modal
 */
function showDownloadModal() {
    if (downloadModal) {
        downloadModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus first input
        setTimeout(() => {
            const firstInput = downloadModal.querySelector('input:not([type="hidden"])');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

/**
 * Hide download modal
 */
function hideDownloadModal() {
    if (downloadModal) {
        downloadModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Download button click handler
console.log('Download button element:', downloadBtn);
if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Download button clicked');
        console.log('currentAssessmentData:', window.currentAssessmentData);
        console.log('currentAssessmentId:', window.currentAssessmentId);
        console.log('downloadModal element:', downloadModal);
        showDownloadModal();
        console.log('Modal active class added:', downloadModal ? downloadModal.classList.contains('active') : 'no modal');
    });
} else {
    console.error('Download button not found in DOM!');
}

// Close modal handlers
if (downloadModalClose) {
    downloadModalClose.addEventListener('click', hideDownloadModal);
}

if (downloadModalBackdrop) {
    downloadModalBackdrop.addEventListener('click', hideDownloadModal);
}

// Close modal on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && downloadModal && downloadModal.classList.contains('active')) {
        hideDownloadModal();
    }
});

/**
 * Build PDF HTML content from assessment data
 */
function buildPdfHtml(assessmentData, userName, userCompany) {
    const data = assessmentData;
    const date = new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
    const assessmentId = window.currentAssessmentId || 'BF-' + Date.now();

    const resultsContent = document.getElementById('advisor-results-content');
    const scoreEl = document.getElementById('advisor-score-value');
    const automationLevelEl = document.getElementById('results-upgrade-level');

    const summaryMarkup = `
        <div class="pdf-summary-grid">
            <div class="pdf-summary-item">
                <span class="pdf-summary-label">Prepared for</span>
                <span class="pdf-summary-value">${escapeHtml(userName)}</span>
            </div>
            <div class="pdf-summary-item">
                <span class="pdf-summary-label">Company</span>
                <span class="pdf-summary-value">${escapeHtml(userCompany)}</span>
            </div>
            <div class="pdf-summary-item">
                <span class="pdf-summary-label">Reference</span>
                <span class="pdf-summary-value">${escapeHtml(assessmentId)}</span>
            </div>
            <div class="pdf-summary-item">
                <span class="pdf-summary-label">Generated</span>
                <span class="pdf-summary-value">${escapeHtml(date)}</span>
            </div>
            <div class="pdf-summary-item">
                <span class="pdf-summary-label">Automation Level</span>
                <span class="pdf-summary-value">${escapeHtml(automationLevelEl ? automationLevelEl.textContent.trim() : (data.upgradeLevel || '—'))}</span>
            </div>
            <div class="pdf-summary-item">
                <span class="pdf-summary-label">Assessment Score</span>
                <span class="pdf-summary-value">${escapeHtml(scoreEl ? scoreEl.textContent.trim() : '—')}</span>
            </div>
        </div>
    `;

    const reportBody = resultsContent && resultsContent.innerHTML.trim()
        ? resultsContent.innerHTML
        : '<p>Assessment results are not available. Please run a new assessment and try again.</p>';

    return `
    <div id="pdf-content" class="pdf-report">
        <style>
            .pdf-report { font-family: 'Inter', 'Segoe UI', Tahoma, sans-serif; color: #334155; max-width: 820px; margin: 0 auto; padding: 8px; }
            .pdf-header { text-align: center; border-bottom: 3px solid #f97316; padding-bottom: 20px; margin-bottom: 22px; }
            .pdf-brand { font-size: 30px; font-weight: 800; color: #1e3a5f; margin-bottom: 6px; }
            .pdf-brand span { color: #f97316; }
            .pdf-badge { display: inline-block; background: linear-gradient(135deg, #f97316, #fb923c); color: #fff; padding: 5px 14px; border-radius: 999px; font-size: 11px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; margin-bottom: 10px; }
            .pdf-title { color: #1e3a5f; font-size: 24px; margin: 0; }
            .pdf-summary-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin: 16px 0 0; }
            .pdf-summary-item { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; background: #f8fafc; text-align: left; }
            .pdf-summary-label { display: block; font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #64748b; margin-bottom: 4px; font-weight: 700; }
            .pdf-summary-value { display: block; color: #1e3a5f; font-size: 13px; font-weight: 700; line-height: 1.4; }
            .pdf-results { margin-top: 10px; }
            .pdf-results .assessment-section { background: #f8fafc; border-radius: 12px; padding: 18px; margin-bottom: 14px; border-left: 4px solid #f97316; page-break-inside: avoid; break-inside: avoid; }
            .pdf-results .assessment-section__header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
            .pdf-results .assessment-section__number { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #f97316, #fb923c); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; }
            .pdf-results .assessment-section__title { margin: 0; color: #1e3a5f; font-size: 16px; }
            .pdf-results .assessment-section__content { color: #334155; font-size: 14px; line-height: 1.6; }
            .pdf-results ul { margin: 0; padding-left: 1.25rem; }
            .pdf-results li { margin-bottom: 6px; }
            .pdf-results .implementation-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
            .pdf-results .implementation-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }
            .pdf-results .implementation-item--highlight { border: 2px solid #f97316; }
            .pdf-results .implementation-item__title { display: flex; align-items: center; gap: 6px; margin: 0 0 6px; color: #1e3a5f; font-size: 13px; }
            .pdf-results .implementation-item__value { margin: 0; font-size: 14px; }
            .pdf-results .implementation-item__value--large { font-size: 18px; font-weight: 700; color: #1e3a5f; }
            .pdf-results .assessment-upgrade { display: inline-block; background: linear-gradient(135deg, #1e3a5f, #2d4a6f); color: #fff; border-radius: 8px; padding: 8px 14px; font-weight: 700; }
            .pdf-results .assessment-next-step { background: #fff; border: 2px solid #f97316; border-radius: 8px; padding: 12px; }
            .pdf-results iconify-icon { display: none; }
            .pdf-footer { margin-top: 24px; padding-top: 16px; border-top: 2px solid #e2e8f0; text-align: center; }
            .pdf-footer .cta { background: linear-gradient(135deg, #f97316, #fb923c); color: #fff; border-radius: 12px; padding: 14px; margin-bottom: 14px; }
            .pdf-footer .cta h3 { margin: 0 0 6px; font-size: 16px; }
            .pdf-footer .cta p { margin: 0; font-size: 13px; opacity: .95; }
            .pdf-footer p { margin: 3px 0; font-size: 12px; color: #64748b; }
            .pdf-footer .disclaimer { margin-top: 12px; font-size: 10px; color: #94a3b8; }
            @media (max-width: 760px) {
                .pdf-summary-grid { grid-template-columns: 1fr 1fr; }
                .pdf-results .implementation-grid { grid-template-columns: 1fr; }
            }
        </style>

        <header class="pdf-header">
            <div class="pdf-brand">Brand<span>Flow</span></div>
            <div class="pdf-badge">AI-Powered Assessment</div>
            <h1 class="pdf-title">Your Automation Assessment</h1>
            ${summaryMarkup}
        </header>

        <section class="pdf-results">
            ${reportBody}
        </section>

        <footer class="pdf-footer">
            <div class="cta">
                <h3>Ready to implement this automation solution?</h3>
                <p>Schedule a consultation with our team to convert this assessment into a live automation solution.</p>
            </div>
            <p><strong>BrandFlow</strong></p>
            <p>Email: hello@brandflow.co.za | Phone: +27 82 785 3646</p>
            <p>Website: brandflow.co.za</p>
            <p class="disclaimer">This assessment was generated by the BrandFlow Automation Engine. Recommendations are based on the process description submitted and are confirmed during consultation.</p>
        </footer>
    </div>`;
}

// Download form submission - generates PDF client-side
if (downloadForm) {
    downloadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('download-submit');
        const btnText = submitBtn.querySelector('.btn__text');
        const btnLoading = submitBtn.querySelector('.btn__loading');

        // Get form data
        const formData = new FormData(downloadForm);
        const userName = formData.get('name').trim();
        const userEmail = formData.get('email').trim();
        const userCompany = formData.get('company').trim();
        const userPhone = formData.get('phone') ? formData.get('phone').trim() : null;

        // Validate
        if (!userName || userName.length < 2) {
            alert('Please enter your full name.');
            return;
        }

        if (!userEmail || !userEmail.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!userCompany || userCompany.length < 2) {
            alert('Please enter your company name.');
            return;
        }

        const hasClientData = !!window.currentAssessmentData;
        const hasTrackedAssessment = !!window.currentAssessmentId;

        if (!hasClientData && !hasTrackedAssessment) {
            alert('Assessment data not available yet. Please run a new assessment and try again.');
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;

        try {
            let downloadStarted = false;

            // Prefer server-generated report when we have a tracked assessment ID.
            if (window.currentAssessmentId) {
                try {
                    const response = await fetch(`${ASSESSMENT_API_URL}?action=download`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            assessment_id: window.currentAssessmentId,
                            name: userName,
                            email: userEmail,
                            company: userCompany,
                            phone: userPhone
                        })
                    });

                    const data = await response.json();
                    if (response.ok && data.success && data.download_url) {
                        downloadStarted = true;
                        window.location.href = data.download_url;
                    } else {
                        console.error('Server download API error:', data.error || 'Unknown error');
                    }
                } catch (err) {
                    console.error('Failed to request server download:', err);
                }
            }

            // Fallback to client-side PDF generation when server download isn't available.
            if (!downloadStarted && !window.currentAssessmentData) {
                alert('Unable to generate report right now. Please run a new assessment and try again.');
                return;
            }

            if (downloadStarted) {
                setTimeout(() => {
                    hideDownloadModal();
                    downloadForm.reset();
                }, 300);
                return;
            }

            // Build PDF HTML
            const pdfHtml = buildPdfHtml(window.currentAssessmentData, userName, userCompany);

            // Create a temporary container
            const container = document.createElement('div');
            container.innerHTML = pdfHtml;
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            document.body.appendChild(container);

            const assessmentId = window.currentAssessmentId || 'BF-' + Date.now();

            if (typeof html2pdf !== 'undefined') {
                // Generate PDF using html2pdf.js
                const opt = {
                    margin: [10, 10, 10, 10],
                    filename: 'BrandFlow-Assessment-' + assessmentId + '.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
                };

                await html2pdf().set(opt).from(container.firstElementChild).save();

                // Clean up
                document.body.removeChild(container);
            } else {
                // Fallback: open in new window for print-to-PDF
                document.body.removeChild(container);
                const printWindow = window.open('', '_blank');
                printWindow.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>BrandFlow Assessment - ' + assessmentId + '</title></head><body>');
                printWindow.document.write(pdfHtml);
                printWindow.document.write('<script>setTimeout(function(){ window.print(); }, 500);<\/script></body></html>');
                printWindow.document.close();
            }

            // Close modal after short delay
            setTimeout(() => {
                hideDownloadModal();
                downloadForm.reset();

                // Reset assessment ID in form
                const assessmentIdField = document.getElementById('download-assessment-id');
                if (assessmentIdField && window.currentAssessmentId) {
                    assessmentIdField.value = window.currentAssessmentId;
                }
            }, 500);
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('Failed to generate PDF: ' + error.message);
        } finally {
            // Reset button state
            btnText.style.display = 'flex';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });
}

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%cBrandFlow Website', 'font-size: 20px; font-weight: bold; color: #10b981;');
console.log('%cBuilt with ❤️ by BrandFlow', 'font-size: 12px; color: #64748b;');
console.log('%cInterested in a website? Contact us at walt@brandflow.co.za', 'font-size: 12px; color: #1e293b;');

// ============================================
// EXPORT FOR EXTERNAL USE (IF NEEDED)
// ============================================
window.BrandFlow = {
    version: '1.0.0',
    toggleMobileMenu: () => {
        navMenu.classList.toggle('show');
        navToggle.classList.toggle('active');
    },
    scrollToTop: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    scrollToSection: (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = header.offsetHeight;
            const targetPosition = section.offsetTop - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    }
};

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.stats-item__count');
    if (!counters.length) return;

    const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);

    const animateCounter = (el) => {
        const target = Number.parseInt(el.dataset.target, 10);
        if (!Number.isFinite(target)) {
            return;
        }

        const duration = 1800;
        const start = performance.now();

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            el.textContent = Math.round(eased * target).toLocaleString();
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

document.addEventListener('DOMContentLoaded', animateCounters);


// ============================================
// ROI CALCULATOR
// ============================================
(function initROICalc() {
    const processSelect = document.getElementById('roi-process');
    const hoursSlider = document.getElementById('roi-hours');
    const hoursVal = document.getElementById('roi-hours-val');
    const peopleSlider = document.getElementById('roi-people');
    const peopleVal = document.getElementById('roi-people-val');
    const rateSlider = document.getElementById('roi-rate');
    const rateVal = document.getElementById('roi-rate-val');

    const resultMonthlyCost = document.getElementById('roi-monthly-cost');
    const resultMonthlySaving = document.getElementById('roi-monthly-saving');
    const resultAnnualSaving = document.getElementById('roi-annual-saving');
    const resultHoursFreed = document.getElementById('roi-hours-freed');
    const resultPayback = document.getElementById('roi-payback-period');

    if (!processSelect || !hoursSlider) return;

    const fmt = (n) => 'R' + Math.round(n).toLocaleString('en-ZA');

    function calculate() {
        const savingPct = parseInt(processSelect.value, 10) / 100;
        const hrsPerWeek = parseInt(hoursSlider.value, 10);
        const people = parseInt(peopleSlider.value, 10);
        const rate = parseInt(rateSlider.value, 10);

        const hrsPerMonth = hrsPerWeek * 4.33 * people;
        const monthlyCost = hrsPerMonth * rate;
        const monthlySaving = monthlyCost * savingPct;
        const annualSaving = monthlySaving * 12;
        const hoursFreed = Math.round(hrsPerMonth * savingPct);

        // Estimate payback based on saving size
        let payback;
        if (annualSaving < 20000) payback = '6–9 months';
        else if (annualSaving < 60000) payback = '3–6 months';
        else payback = '1–3 months';

        resultMonthlyCost.textContent = fmt(monthlyCost);
        resultMonthlySaving.textContent = fmt(monthlySaving);
        resultAnnualSaving.textContent = fmt(annualSaving);
        resultHoursFreed.textContent = hoursFreed + ' hrs';
        resultPayback.textContent = payback;
    }

    [hoursSlider, peopleSlider, rateSlider].forEach(slider => {
        slider.addEventListener('input', () => {
            if (slider === hoursSlider) hoursVal.textContent = slider.value;
            if (slider === peopleSlider) peopleVal.textContent = slider.value;
            if (slider === rateSlider) rateVal.textContent = slider.value;
            calculate();
        });
    });

    processSelect.addEventListener('change', calculate);
    calculate();
})();

// ============================================
// AUTOMATION READINESS QUIZ
// ============================================
(function initQuiz() {
    const questions = document.querySelectorAll('.quiz-question');
    const prevBtn = document.getElementById('quiz-prev');
    const nextBtn = document.getElementById('quiz-next');
    const progressBar = document.getElementById('quiz-progress-bar');
    const qNumEl = document.getElementById('quiz-q-num');
    const quizQuestionsEl = document.getElementById('quiz-questions');
    const resultEl = document.getElementById('quiz-result');
    const navEl = document.querySelector('.quiz-nav');
    const retakeBtn = document.getElementById('quiz-retake');

    if (!questions.length || !prevBtn || !nextBtn) return;

    let current = 0;
    const total = questions.length;
    const answers = new Array(total).fill(null);

    function showQuestion(idx) {
        questions.forEach((q, i) => q.classList.toggle('active', i === idx));
        prevBtn.disabled = idx === 0;
        nextBtn.textContent = idx === total - 1 ? 'See Results' : 'Next';
        nextBtn.innerHTML = idx === total - 1
            ? 'See Results <iconify-icon icon="ph:check" width="16" height="16"></iconify-icon>'
            : 'Next <iconify-icon icon="ph:arrow-right" width="16" height="16"></iconify-icon>';
        progressBar.style.width = ((idx + 1) / total * 100) + '%';
        qNumEl.textContent = idx + 1;
    }

    prevBtn.addEventListener('click', () => {
        if (current > 0) { current--; showQuestion(current); }
    });

    nextBtn.addEventListener('click', () => {
        // Save answer
        const radios = document.querySelectorAll(`input[name="q${current}"]`);
        let selected = null;
        radios.forEach(r => { if (r.checked) selected = parseInt(r.value, 10); });
        answers[current] = selected;

        if (current < total - 1) {
            current++;
            showQuestion(current);
        } else {
            showResults();
        }
    });

    function showResults() {
        const score = answers.reduce((sum, val) => sum + (val || 0), 0);
        const maxScore = total * 2;

        quizQuestionsEl.style.display = 'none';
        navEl.style.display = 'none';
        resultEl.style.display = 'flex';

        document.getElementById('quiz-score-num').textContent = score;

        // Animate the arc
        const arc = document.getElementById('quiz-score-arc');
        if (arc) {
            const circumference = 339.3;
            const pct = score / maxScore;
            const offset = circumference - (pct * circumference);
            setTimeout(() => {
                arc.style.strokeDashoffset = offset;
                arc.style.stroke = score >= 7 ? '#f97316' : score >= 4 ? '#f59e0b' : '#10b981';
            }, 100);
        }

        let title, desc;
        if (score >= 7) {
            title = 'Prime for Automation';
            desc = 'Your business is an excellent candidate for automation. You have significant manual overhead, multiple disconnected systems, and clear processes that can be automated quickly for measurable ROI. We recommend starting immediately.';
        } else if (score >= 4) {
            title = 'Ready to Automate';
            desc = 'You have clear automation opportunities available. Several of your processes are repetitive and error-prone enough to benefit from automation. A targeted approach starting with your highest-frequency tasks will deliver strong results.';
        } else {
            title = 'Exploring Automation';
            desc = 'Your current processes are relatively lean, but there may still be opportunities to gain efficiency. Our Automation Advisor can help identify where automation would add the most value in your specific business context.';
        }

        document.getElementById('quiz-result-title').textContent = title;
        document.getElementById('quiz-result-desc').textContent = desc;
    }

    if (retakeBtn) {
        retakeBtn.addEventListener('click', () => {
            current = 0;
            answers.fill(null);
            document.querySelectorAll('.quiz-question input[type="radio"]').forEach(r => r.checked = false);
            quizQuestionsEl.style.display = 'block';
            navEl.style.display = 'flex';
            resultEl.style.display = 'none';
            progressBar.style.width = '20%';
            showQuestion(0);
        });
    }

    showQuestion(0);
})();

// ============================================
// WHATSAPP QUICK-REPLY PANEL
// ============================================
function initWAPanel() {
    const widget = document.getElementById('wa-widget');
    const trigger = document.getElementById('wa-trigger');
    const panel = document.getElementById('wa-panel');
    const closeBtn = document.getElementById('wa-close');
    const badge = document.getElementById('wa-badge');

    if (!trigger || !panel) return;

    let isOpen = false;
    let hasInteracted = false;
    const openIcon = trigger.querySelector('.wa-trigger__icon--open');
    const closeIcon = trigger.querySelector('.wa-trigger__icon--close');
    const autoOpenKey = `waAutoOpenShown:${window.location.pathname}`;

    function openPanel() {
        isOpen = true;
        panel.classList.add('wa-panel--open');
        panel.setAttribute('aria-hidden', 'false');
        if (openIcon) openIcon.style.display = 'none';
        if (closeIcon) closeIcon.style.display = '';
        if (badge) badge.style.display = 'none';
    }

    function closePanel() {
        isOpen = false;
        panel.classList.remove('wa-panel--open');
        panel.setAttribute('aria-hidden', 'true');
        if (openIcon) openIcon.style.display = '';
        if (closeIcon) closeIcon.style.display = 'none';
    }

    trigger.addEventListener('click', () => {
        hasInteracted = true;
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hasInteracted = true;
            closePanel();
        });
    }

    document.addEventListener('click', (event) => {
        if (!isOpen || !widget) return;
        if (!widget.contains(event.target)) {
            closePanel();
        }
    });

    // Auto-open only on homepage (once per browser session)
    const normalizedPath = window.location.pathname.replace(/\/+$/, '') || '/';
    const isHomepage = normalizedPath === '/' || normalizedPath === '/index.html';

    if (isHomepage && !sessionStorage.getItem(autoOpenKey)) {
        setTimeout(() => {
            if (!isOpen && !hasInteracted) {
                openPanel();
                sessionStorage.setItem(autoOpenKey, 'true');
            }
        }, 8000);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWAPanel);
} else {
    initWAPanel();
}

// ============================================
// CONVERSION TRACKING + CONTACT FUNNEL UX
// ============================================
(function initConversionEnhancements() {
    document.querySelectorAll('a[href^="https://wa.me"], a[href*="whatsapp"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('whatsapp_click', {
                location: window.location.pathname,
                cta_text: (link.textContent || '').trim().slice(0, 60)
            });
        });
    });

    document.querySelectorAll('.btn, .nav__link--btn').forEach(button => {
        button.addEventListener('click', () => {
            const label = (button.textContent || '').trim();
            if (!label) return;
            trackEvent('cta_click', {
                location: window.location.pathname,
                cta_label: label.slice(0, 80)
            });
        });
    });

    if (!contactForm || !contactForm.classList.contains('contact__form--funnel')) return;

    const stepPanels = Array.from(contactForm.querySelectorAll('.contact-funnel__step-panel'));
    const indicators = Array.from(contactForm.querySelectorAll('[data-step-indicator]'));
    const prevBtn = document.getElementById('contact-prev-step');
    const nextBtn = document.getElementById('contact-next-step');
    const submitBtn = document.getElementById('contact-submit');
    let currentStep = 1;

    function validateStep(step) {
        const panel = stepPanels.find(el => Number(el.dataset.step) === step);
        if (!panel) return true;
        const requiredInputs = panel.querySelectorAll('input[required], select[required], textarea[required]');
        return Array.from(requiredInputs).every(input => input.value.trim() !== '');
    }

    function showStep(step) {
        currentStep = step;
        stepPanels.forEach(panel => {
            const isActive = Number(panel.dataset.step) === step;
            panel.hidden = !isActive;
        });

        indicators.forEach(indicator => {
            const indicatorStep = Number(indicator.dataset.stepIndicator);
            indicator.classList.toggle('contact-funnel__step--active', indicatorStep === step);
        });

        if (prevBtn) prevBtn.hidden = step === 1;
        if (nextBtn) nextBtn.hidden = step === stepPanels.length;
        if (submitBtn) submitBtn.hidden = step !== stepPanels.length;

        trackEvent('form_step_view', {
            form_name: 'contact_funnel',
            step_number: step
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!validateStep(currentStep)) {
                trackEvent('form_step_validation_error', { form_name: 'contact_funnel', step_number: currentStep });
                return;
            }
            if (currentStep < stepPanels.length) {
                showStep(currentStep + 1);
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentStep > 1) {
                showStep(currentStep - 1);
            }
        });
    }

    contactForm.addEventListener('submit', () => {
        trackEvent('form_submit_start', {
            form_name: 'contact_funnel',
            service_need: (document.getElementById('website-need') || {}).value || 'unknown'
        });
    });

    showStep(1);
})();

(function trackAdvisorCompletion() {
    const results = document.getElementById('advisor-results');
    if (!results) return;

    let fired = false;
    const maybeTrack = () => {
        if (fired) return;
        const visible = results.style.display !== 'none' && results.style.display !== '';
        if (visible) {
            fired = true;
            trackEvent('advisor_assessment_complete', { location: window.location.pathname });
        }
    };

    const observer = new MutationObserver(maybeTrack);
    observer.observe(results, { attributes: true, attributeFilter: ['style', 'class'] });
})();
