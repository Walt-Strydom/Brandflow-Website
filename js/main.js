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

if (heroRotatingTitle) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rotatingPhrases = [
        'Make your <span class="hero__keyword">brand</span> easy to <span class="hero__keyword">trust</span> online',
        'Go from <span class="hero__keyword">idea</span> to <span class="hero__keyword">live website</span>, fast',
        '<span class="hero__keyword">Enterprise-grade</span> website for <span class="hero__keyword">SMEs</span>',
        'Turn <span class="hero__keyword">clicks</span> into <span class="hero__keyword">clients</span>'
    ];

    let phraseIndex = 0;
    const transitionDuration = 600;
    const rotationDelay = 3200;

    const showPhrase = (index) => {
        heroRotatingTitle.innerHTML = rotatingPhrases[index];
        if (prefersReducedMotion) {
            heroRotatingTitle.classList.add('is-in');
            heroRotatingTitle.classList.remove('is-out');
            return;
        }
        requestAnimationFrame(() => {
            heroRotatingTitle.classList.add('is-in');
            heroRotatingTitle.classList.remove('is-out');
        });
    };

    showPhrase(phraseIndex);

    setInterval(() => {
        if (prefersReducedMotion) {
            phraseIndex = (phraseIndex + 1) % rotatingPhrases.length;
            showPhrase(phraseIndex);
            return;
        }

        heroRotatingTitle.classList.remove('is-in');
        heroRotatingTitle.classList.add('is-out');

        setTimeout(() => {
            phraseIndex = (phraseIndex + 1) % rotatingPhrases.length;
            heroRotatingTitle.classList.remove('is-out');
            heroRotatingTitle.innerHTML = rotatingPhrases[phraseIndex];
            void heroRotatingTitle.offsetWidth;
            heroRotatingTitle.classList.add('is-in');
        }, transitionDuration);
    }, rotationDelay);
}

// ============================================
// MOBILE NAVIGATION TOGGLE
// ============================================
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        navToggle.classList.toggle('active');
    });
}

// Close mobile menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
        navToggle.classList.remove('active');
    });
});

// ============================================
// MOBILE DROPDOWN NAVIGATION
// ============================================
const dropdownItems = document.querySelectorAll('.nav__item--dropdown');

dropdownItems.forEach(item => {
    const dropdownLink = item.querySelector('.nav__link--dropdown');

    if (dropdownLink && window.innerWidth <= 768) {
        dropdownLink.addEventListener('click', (e) => {
            e.preventDefault();
            item.classList.toggle('active');
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

// Track if GA has been loaded to prevent duplicate loading
let gaLoaded = false;

// Load Google Analytics only when consent is given
function loadGoogleAnalytics() {
    if (gaLoaded || !window.GA_MEASUREMENT_ID) return;

    gaLoaded = true;

    // Create and append the gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + window.GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    // Initialize GA after script loads
    script.onload = function() {
        gtag('js', new Date());
        gtag('config', window.GA_MEASUREMENT_ID);
    };
}

function showCookieBanner() {
    const consent = localStorage.getItem('cookieConsent');

    // If already accepted, load GA immediately
    if (consent === 'accepted') {
        loadGoogleAnalytics();
        return;
    }

    // If already declined, don't show banner or load GA
    if (consent === 'declined') {
        return;
    }

    // Show banner for new visitors
    if (cookieBanner) {
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1500);
    }
}

function hideCookieBanner() {
    if (cookieBanner) {
        cookieBanner.classList.remove('show');
    }
}

if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        hideCookieBanner();
        loadGoogleAnalytics();
    });
}

if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'declined');
        hideCookieBanner();
        // GA will not be loaded
    });
}

// Check consent and show banner or load GA on page load
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
        console.log('downloadModal element:', downloadModal);
        if (!window.currentAssessmentData) {
            alert('Assessment data not available. Please try running a new assessment.');
            return;
        }
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

    // Helper to extract text from items
    function getText(item) {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object') {
            const props = ['description', 'text', 'value', 'title', 'content', 'name', 'summary'];
            for (const p of props) {
                if (item[p] && typeof item[p] === 'string') return item[p];
            }
            for (const key in item) {
                if (typeof item[key] === 'string' && item[key].length > 0) return item[key];
            }
        }
        return String(item || '');
    }

    function buildList(items) {
        if (!items || !items.length) return '';
        return '<ul>' + items.map(item => '<li>' + getText(item) + '</li>').join('') + '</ul>';
    }

    let sectionsHtml = '';

    // Section 1: Current Process
    sectionsHtml += `
        <div class="section">
            <div class="section-header"><span class="section-number">1</span><h2 class="section-title">Current Process Overview</h2></div>
            <div class="section-content"><p>${data.currentProcess || 'Your process involves manual handling of routine business operations.'}</p></div>
        </div>`;

    // Section 2: Inefficiencies
    sectionsHtml += `
        <div class="section">
            <div class="section-header"><span class="section-number">2</span><h2 class="section-title">Identified Inefficiencies</h2></div>
            <div class="section-content">${buildList(data.inefficiencies || ['Repetitive manual handling', 'Delays caused by human dependency', 'Risk of overlooked steps'])}</div>
        </div>`;

    // Section 3: Improvements
    sectionsHtml += `
        <div class="section">
            <div class="section-header"><span class="section-number">3</span><h2 class="section-title">How the BrandFlow Automation Engine Would Improve This</h2></div>
            <div class="section-content">${buildList(data.improvements || ['Information moves automatically', 'Actions triggered immediately', 'Updates sent automatically'])}</div>
        </div>`;

    // Section 4: Business Impact
    sectionsHtml += `
        <div class="section">
            <div class="section-header"><span class="section-number">4</span><h2 class="section-title">Business Impact</h2></div>
            <div class="section-content">${buildList(data.businessImpact || ['Reduced time on routine tasks', 'Faster turnaround', 'Lower risk of human error', 'Greater consistency'])}</div>
        </div>`;

    // Section 5: Technical Workflow (if available)
    let sectionNum = 5;
    if (data.technicalWorkflow) {
        const tw = data.technicalWorkflow;
        let workflowContent = '';
        if (tw.trigger) {
            workflowContent += `<p><strong>Trigger:</strong> ${tw.trigger}</p>`;
        }
        if (tw.steps && tw.steps.length > 0) {
            workflowContent += '<div style="margin-top: 12px;">';
            tw.steps.forEach(step => {
                workflowContent += `<div style="margin-bottom: 10px; padding: 10px; background: #fff; border-radius: 6px;">
                    <strong>Step ${step.step}: ${step.name}</strong> <span style="color: #64748b; font-size: 12px;">(${step.duration})</span>
                    <p style="margin: 4px 0 0; font-size: 14px;">${step.description}</p>
                </div>`;
            });
            workflowContent += '</div>';
        }
        if (tw.totalProcessingTime) {
            workflowContent += `<p style="margin-top: 10px;"><strong>Total Processing Time:</strong> ${tw.totalProcessingTime}</p>`;
        }
        sectionsHtml += `
            <div class="section">
                <div class="section-header"><span class="section-number">${sectionNum}</span><h2 class="section-title">Technical Workflow Architecture</h2></div>
                <div class="section-content">${workflowContent}</div>
            </div>`;
        sectionNum++;
    }

    // Process Upgrade Level
    sectionsHtml += `
        <div class="section">
            <div class="section-header"><span class="section-number">${sectionNum}</span><h2 class="section-title">Process Upgrade Level</h2></div>
            <div class="section-content"><div class="upgrade-level">${data.upgradeLevel || 'Multi-step process enhancement'}</div></div>
        </div>`;
    sectionNum++;

    // Implementation (if available)
    if (data.implementation) {
        const impl = data.implementation;
        let implContent = '<div style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 12px;">';
        if (impl.timeline) implContent += `<div style="flex: 1; min-width: 120px; padding: 10px; background: #fff; border-radius: 6px;"><strong>Timeline</strong><p>${impl.timeline}</p></div>`;
        if (impl.complexity) implContent += `<div style="flex: 1; min-width: 120px; padding: 10px; background: #fff; border-radius: 6px;"><strong>Complexity</strong><p>${impl.complexity}</p></div>`;
        if (impl.estimatedCost) implContent += `<div style="flex: 1; min-width: 120px; padding: 10px; background: #fff; border-radius: 6px; border: 2px solid #f97316;"><strong>Investment</strong><p style="font-size: 18px; font-weight: 700; color: #1e3a5f;">${impl.estimatedCost}</p></div>`;
        implContent += '</div>';
        if (impl.prerequisites && impl.prerequisites.length > 0) {
            implContent += '<p><strong>Prerequisites:</strong></p>' + buildList(impl.prerequisites);
        }
        sectionsHtml += `
            <div class="section">
                <div class="section-header"><span class="section-number">${sectionNum}</span><h2 class="section-title">Implementation Overview</h2></div>
                <div class="section-content">${implContent}</div>
            </div>`;
        sectionNum++;
    }

    // Recommended Next Step
    sectionsHtml += `
        <div class="section">
            <div class="section-header"><span class="section-number">${sectionNum}</span><h2 class="section-title">Recommended Next Step</h2></div>
            <div class="section-content"><div class="next-step"><p>${data.nextStep || 'Schedule a consultation to convert this assessment into a live automation solution.'}</p></div></div>
        </div>`;

    return `
    <div id="pdf-content" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #334155; padding: 10px; max-width: 800px; margin: 0 auto;">
        <div style="text-align: center; padding-bottom: 24px; border-bottom: 3px solid #f97316; margin-bottom: 24px;">
            <div style="font-size: 28px; font-weight: 700; color: #1e3a5f; margin-bottom: 8px;">Brand<span style="color: #f97316;">Flow</span></div>
            <div style="display: inline-block; background: linear-gradient(135deg, #f97316, #fb923c); color: white; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">AI-Powered Assessment</div>
            <h1 style="font-size: 22px; color: #1e3a5f; margin: 0 0 16px;">Your Automation Assessment</h1>
            <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap; font-size: 13px; color: #64748b;">
                <span><strong style="color: #1e3a5f;">Reference:</strong> ${assessmentId}</span>
                <span><strong style="color: #1e3a5f;">Prepared for:</strong> ${userName}</span>
                <span><strong style="color: #1e3a5f;">Company:</strong> ${userCompany}</span>
                <span><strong style="color: #1e3a5f;">Date:</strong> ${date}</span>
            </div>
        </div>

        <style>
            .section { background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 16px; border-left: 4px solid #f97316; }
            .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
            .section-number { width: 28px; height: 28px; background: linear-gradient(135deg, #f97316, #fb923c); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; flex-shrink: 0; }
            .section-title { font-size: 16px; font-weight: 600; color: #1e3a5f; margin: 0; }
            .section-content { padding-left: 38px; }
            .section-content p { margin: 0 0 8px; font-size: 14px; }
            .section-content ul { list-style: disc; padding-left: 20px; margin: 0; }
            .section-content li { margin-bottom: 6px; font-size: 14px; }
            .upgrade-level { display: inline-block; background: linear-gradient(135deg, #1e3a5f, #2d4a6f); color: white; padding: 8px 18px; border-radius: 8px; font-weight: 600; font-size: 14px; }
            .next-step { background: #ffffff; padding: 14px; border-radius: 8px; border: 2px solid #f97316; }
            .next-step p { margin: 0; font-size: 14px; }
        </style>

        ${sectionsHtml}

        <div style="margin-top: 32px; padding-top: 24px; border-top: 2px solid #e2e8f0; text-align: center;">
            <div style="background: linear-gradient(135deg, #f97316, #fb923c); color: white; padding: 16px; border-radius: 12px; margin-bottom: 16px;">
                <h3 style="font-size: 16px; margin: 0 0 8px;">Ready to implement this automation solution?</h3>
                <p style="font-size: 13px; margin: 0; opacity: 0.9;">Schedule a consultation with our team to convert this assessment into a live automation solution.</p>
            </div>
            <div style="font-size: 13px; color: #64748b;">
                <p style="margin: 0;"><strong>BrandFlow</strong></p>
                <p style="margin: 4px 0;">Email: hello@brandflow.co.za | Phone: +27 82 785 3646</p>
                <p style="margin: 4px 0;">Website: brandflow.co.za</p>
            </div>
            <p style="margin-top: 16px; font-size: 11px; color: #94a3b8;">
                This assessment was generated by the BrandFlow Automation Engine.
                The recommendations provided are based on the process description submitted and are subject to detailed analysis during consultation.
            </p>
        </div>
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

        if (!window.currentAssessmentData) {
            alert('Assessment data not available. Please try running a new assessment.');
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        submitBtn.disabled = true;

        try {
            // Save user info to database (non-blocking)
            if (window.currentAssessmentId) {
                fetch(`${ASSESSMENT_API_URL}?action=download`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        assessment_id: window.currentAssessmentId,
                        name: userName,
                        email: userEmail,
                        company: userCompany,
                        phone: userPhone
                    })
                }).catch(err => console.error('Failed to save download info:', err));
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
        const target = parseInt(el.dataset.target, 10);
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
// BEFORE vs AFTER TOGGLE
// ============================================
const btnBefore = document.getElementById('ba-btn-before');
const btnAfter = document.getElementById('ba-btn-after');
const panelBefore = document.getElementById('ba-panel-before');
const panelAfter = document.getElementById('ba-panel-after');

if (btnBefore && btnAfter) {
    btnBefore.addEventListener('click', () => {
        btnBefore.classList.add('ba-toggle-btn--active');
        btnAfter.classList.remove('ba-toggle-btn--active');
        panelBefore.classList.remove('ba-panel--hidden');
        panelAfter.classList.add('ba-panel--hidden');
    });

    btnAfter.addEventListener('click', () => {
        btnAfter.classList.add('ba-toggle-btn--active');
        btnBefore.classList.remove('ba-toggle-btn--active');
        panelAfter.classList.remove('ba-panel--hidden');
        panelBefore.classList.add('ba-panel--hidden');
    });
}

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
            desc = 'Your current processes are relatively lean, but there may still be opportunities to gain efficiency. Our AI Advisor can help identify where automation would add the most value in your specific business context.';
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
// INSIGHTS LOADER (n8n-updatable JSON)
// ============================================
(function loadInsights() {
    const grid = document.getElementById('insights-grid');
    const loading = document.getElementById('insights-loading');
    const footer = document.getElementById('insights-footer');
    if (!grid) return;

    fetch('/data/insights.json')
        .then(r => r.json())
        .then(data => {
            const articles = (data.articles || []).slice(0, 4);
            if (!articles.length) {
                if (loading) loading.innerHTML = '<p>No articles available yet. Check back soon.</p>';
                return;
            }

            if (loading) loading.remove();

            articles.forEach((article, idx) => {
                const isFeatured = article.featured && idx === 0;
                const card = document.createElement('a');
                card.className = 'insight-card reveal-on-scroll' + (isFeatured ? ' insight-card--featured' : '');
                card.href = article.slug ? '/insights/' + article.slug : '#';

                const date = new Date(article.publishedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });

                card.innerHTML = `
                    <div class="insight-card__image">
                        <iconify-icon icon="ph:article" width="64" height="64" class="insight-card__image-icon"></iconify-icon>
                        <span class="insight-card__image-cat">${article.category || 'Automation'}</span>
                    </div>
                    <div class="insight-card__body">
                        <div class="insight-card__meta">
                            <span>${date}</span>
                            <span class="insight-card__meta-dot"></span>
                            <span>${article.readTime || '5 min read'}</span>
                        </div>
                        <h3 class="insight-card__title">${article.title}</h3>
                        <p class="insight-card__excerpt">${article.excerpt}</p>
                        <span class="insight-card__read-more">
                            Read article
                            <iconify-icon icon="ph:arrow-right" width="14" height="14"></iconify-icon>
                        </span>
                    </div>
                `;
                grid.appendChild(card);
            });

            if (footer && data.articles && data.articles.length > 4) {
                footer.style.display = 'block';
            }
        })
        .catch(() => {
            // Fallback: show static placeholder cards if JSON not available
            if (loading) {
                loading.innerHTML = `
                    <div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--color-text-light)">
                        <iconify-icon icon="ph:article" width="48" height="48" style="opacity:0.3;margin-bottom:1rem;display:block;margin-left:auto;margin-right:auto"></iconify-icon>
                        <p>Articles are being prepared. Check back soon for automation insights and SA SME guides.</p>
                    </div>`;
            }
        });
})();

// ============================================
// WHATSAPP QUICK-REPLY PANEL
// ============================================
(function initWAPanel() {
    const widget = document.getElementById('wa-widget');
    const trigger = document.getElementById('wa-trigger');
    const panel = document.getElementById('wa-panel');
    const closeBtn = document.getElementById('wa-close');
    const badge = document.getElementById('wa-badge');

    if (!trigger || !panel) return;

    let isOpen = false;
    const openIcon = trigger.querySelector('.wa-trigger__icon--open');
    const closeIcon = trigger.querySelector('.wa-trigger__icon--close');

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
        if (isOpen) closePanel(); else openPanel();
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closePanel);
    }

    // Auto-open panel after 8 seconds if user hasn't interacted
    setTimeout(() => {
        if (!isOpen) openPanel();
    }, 8000);
})();
