/* ============================================
   BRANDFLOW WEBSITE - GSAP ANIMATIONS
   Immersive scroll-driven animation layer
   Requires: GSAP 3 + ScrollTrigger plugin
   ============================================ */

(function () {
    'use strict';

    // Guard: GSAP must be available
    if (typeof gsap === 'undefined') return;

    // Guard: ScrollTrigger must be available
    if (typeof ScrollTrigger === 'undefined') {
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }

    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // ============================================
    // ACCESSIBILITY: Respect prefers-reduced-motion
    // ============================================
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        // Ensure all reveal-on-scroll elements are visible
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }

    // ============================================
    // GSAP DEFAULTS
    // ============================================
    gsap.defaults({
        ease: 'power3.out',
        duration: 0.7
    });

    // ============================================
    // UTILITY: Safe query (returns null if not found)
    // ============================================
    const q = (selector) => document.querySelector(selector);
    const qa = (selector) => gsap.utils.toArray(selector);

    // ============================================
    // 1. HEADER ENTRANCE
    // ============================================
    const header = q('.header');
    if (header) {
        gsap.from(header, {
            y: -60,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.1
        });
    }

    // ============================================
    // 2. HERO ENTRANCE TIMELINE (homepage only)
    // ============================================
    const heroSection = q('.hero');
    if (heroSection) {
        const heroTl = gsap.timeline({ delay: 0.25 });

        // Left panel content — staggered entrance
        if (q('.hero__eyebrow')) {
            heroTl.from('.hero__eyebrow', {
                y: 24,
                opacity: 0,
                duration: 0.6,
                ease: 'power3.out'
            });
        }

        if (q('.hero__title-rotator')) {
            heroTl.from('.hero__title-rotator', {
                y: 32,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out'
            }, '-=0.35');
        }

        if (q('.hero__description')) {
            heroTl.from('.hero__description', {
                y: 20,
                opacity: 0,
                duration: 0.6
            }, '-=0.35');
        }

        const heroButtons = qa('.hero__buttons .btn');
        if (heroButtons.length) {
            heroTl.from(heroButtons, {
                y: 20,
                opacity: 0,
                stagger: 0.12,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.25');
        }

        // Right panel — slide in from right
        const heroRight = q('.hero__split-right');
        if (heroRight) {
            heroTl.from(heroRight, {
                x: 60,
                opacity: 0,
                duration: 1.0,
                ease: 'power2.out'
            }, '-=0.65');
        }

        // SVG nodes — pop in with back.out after panel appears
        const svgGroups = heroSection.querySelectorAll('.hero__svg g[filter]');
        if (svgGroups.length) {
            heroTl.from(svgGroups, {
                scale: 0.6,
                opacity: 0,
                stagger: 0.15,
                duration: 0.55,
                ease: 'back.out(1.6)',
                transformOrigin: 'center center'
            }, '-=0.5');
        }

        // SVG flow paths — draw in
        const flowPaths = heroSection.querySelectorAll('.hero__svg path[id^="flowPath"]');
        if (flowPaths.length) {
            flowPaths.forEach((path) => {
                const length = path.getTotalLength ? path.getTotalLength() : 100;
                gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
                heroTl.to(path, {
                    strokeDashoffset: 0,
                    duration: 0.6,
                    ease: 'power2.inOut'
                }, '-=0.4');
            });
        }

        // SVG floating badges — fade up after nodes
        const svgBadges = heroSection.querySelectorAll('.hero__svg g:not([filter])');
        if (svgBadges.length) {
            heroTl.from(svgBadges, {
                y: -12,
                opacity: 0,
                stagger: 0.18,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.3');
        }
    }

    // ============================================
    // 3. HERO SVG PARALLAX (scroll scrub)
    // ============================================
    if (heroSection) {
        // Badges float in opposite directions on scroll
        const heroBadges = heroSection.querySelectorAll('.hero__svg g:not([filter])');
        if (heroBadges.length >= 2) {
            // Top-left badge (savings) — moves up slowly
            gsap.to(heroBadges[0], {
                y: -30,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1.5
                }
            });
            // Bottom-right badge (uptime) — moves down slightly
            gsap.to(heroBadges[1], {
                y: 20,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 2
                }
            });
        }

        // SVG container subtle depth scroll
        const svgContainer = q('.hero__svg-container');
        if (svgContainer) {
            gsap.to(svgContainer, {
                y: 40,
                ease: 'none',
                scrollTrigger: {
                    trigger: heroSection,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });
        }
    }

    // ============================================
    // 4. SECTION HEADERS — Staggered reveal
    // ============================================
    qa('.section__header').forEach(header => {
        const tag = header.querySelector('.section__tag');
        const title = header.querySelector('.section__title');
        const subtitle = header.querySelector('.section__subtitle');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: header,
                start: 'top 88%',
                once: true
            }
        });

        if (tag) tl.from(tag, { y: 16, opacity: 0, duration: 0.5 });
        if (title) tl.from(title, { y: 24, opacity: 0, duration: 0.6 }, '-=0.25');
        if (subtitle) tl.from(subtitle, { y: 16, opacity: 0, duration: 0.5 }, '-=0.25');
    });

    // ============================================
    // 5. STATS COUNTERS — ScrollTrigger triggered
    // ============================================
    const statsSection = q('.stats-strip');
    if (statsSection) {
        // Stagger the stat items in
        const statItems = qa('.stats-item');
        if (statItems.length) {
            gsap.fromTo(statItems,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.12,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: statsSection,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        }

        // Animate the number counters
        document.querySelectorAll('.stats-item__count').forEach(el => {
            const target = parseInt(el.dataset.target, 10);
            if (isNaN(target)) return;

            const obj = { val: 0 };
            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: 'power1.inOut',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    once: true
                },
                onUpdate: () => {
                    el.textContent = Math.round(obj.val);
                }
            });
        });
    }

    // ============================================
    // 6. TRUST BAR — Stagger sectors in
    // ============================================
    const trustBar = q('.trust-bar');
    if (trustBar) {
        const sectors = qa('.trust-bar__sector');
        if (sectors.length) {
            gsap.from(sectors, {
                y: 12,
                opacity: 0,
                stagger: 0.08,
                duration: 0.45,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: trustBar,
                    start: 'top 90%',
                    once: true
                }
            });
        }
    }

    // ============================================
    // 7. PREVIEW CARDS — Staggered grid reveal
    // ============================================
    const previewSection = q('.preview-cards');
    if (previewSection) {
        // Large featured card — from left
        const largeCard = q('.preview-card--large');
        if (largeCard) {
            gsap.fromTo(largeCard,
                { x: -40, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.75,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: largeCard,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        }

        // Right grid cards — stagger up
        const rightCards = qa('.preview-cards__right-grid .preview-card');
        if (rightCards.length) {
            gsap.fromTo(rightCards,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.preview-cards__right-grid',
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        }

        // Advisor CTA strip
        const advisorCta = q('.preview-card--advisor-cta');
        if (advisorCta) {
            gsap.fromTo(advisorCta,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: advisorCta,
                        start: 'top 88%',
                        once: true
                    }
                }
            );
        }
    }

    // ============================================
    // 8. PROOF CARDS — Stagger reveal
    // ============================================
    const proofCards = qa('.proof-card');
    if (proofCards.length) {
        gsap.fromTo(proofCards,
            { y: 48, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.proof-strip',
                    start: 'top 82%',
                    once: true
                }
            }
        );
    }

    // ============================================
    // 9. TESTIMONIAL CARDS — Stagger reveal
    // ============================================
    const testimonialCards = qa('.testimonial-card');
    if (testimonialCards.length) {
        gsap.fromTo(testimonialCards,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.7,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.testimonials',
                    start: 'top 82%',
                    once: true
                }
            }
        );
    }

    // ============================================
    // 10. DISCOVERY CTA — Split entrance
    // ============================================
    const discoveryCta = q('.discovery-cta__inner');
    if (discoveryCta) {
        const content = q('.discovery-cta__content');
        const visual = q('.discovery-cta__visual');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: discoveryCta,
                start: 'top 82%',
                once: true
            }
        });

        if (content) tl.from(content, { x: -45, opacity: 0, duration: 0.75, ease: 'power2.out' });
        if (visual) tl.from(visual, { x: 45, opacity: 0, duration: 0.75, ease: 'power2.out' }, '-=0.5');

        // List items stagger
        const listItems = qa('.discovery-cta__list li');
        if (listItems.length) {
            tl.from(listItems, {
                x: -20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.4,
                ease: 'power2.out'
            }, '-=0.4');
        }

        // Agenda items stagger
        const agendaItems = qa('.discovery-cta__agenda-item');
        if (agendaItems.length) {
            tl.from(agendaItems, {
                y: 16,
                opacity: 0,
                stagger: 0.1,
                duration: 0.4,
                ease: 'power2.out'
            }, '-=0.3');
        }
    }

    // ============================================
    // 11. GENERIC SCROLL REVEALS (.reveal-on-scroll)
    //     Handles any remaining elements not covered
    //     by specific animations above
    // ============================================
    // We mark specifically animated elements to avoid double-animating
    const specificSelectors = [
        '.preview-card--large',
        '.preview-cards__right-grid .preview-card',
        '.preview-card--advisor-cta',
        '.proof-card',
        '.testimonial-card',
        '.stats-item',
        '.discovery-cta__content',
        '.discovery-cta__visual'
    ];

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        // Skip elements already handled by specific animations above
        const isHandled = specificSelectors.some(sel => el.matches(sel));
        if (isHandled) {
            el.classList.add('revealed'); // Prevent CSS showing invisible
            return;
        }

        gsap.fromTo(el,
            { y: 36, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.65,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    once: true,
                    onEnter: () => el.classList.add('revealed')
                }
            }
        );
    });

    // ============================================
    // 12. PAGE SVG ANIMATIONS (service pages)
    //     Enhances existing CSS animations with
    //     a clean entrance on scroll
    // ============================================
    const pageSvg = q('.page-svg');
    if (pageSvg) {
        const pageSvgTl = gsap.timeline({
            scrollTrigger: {
                trigger: pageSvg,
                start: 'top 82%',
                once: true
            }
        });

        pageSvgTl.from(pageSvg, {
            scale: 0.88,
            opacity: 0,
            duration: 0.8,
            ease: 'back.out(1.4)'
        });

        // Float elements within page SVG
        const floatEls = pageSvg.querySelectorAll('[class*="float"], [class*="pulse"]');
        if (floatEls.length) {
            pageSvgTl.from(floatEls, {
                y: 20,
                opacity: 0,
                stagger: 0.12,
                duration: 0.5,
                ease: 'power2.out'
            }, '-=0.4');
        }
    }

    // ============================================
    // 13. SERVICE CARDS (services.html, why-us.html, etc.)
    // ============================================
    const serviceCards = qa('.service-card');
    if (serviceCards.length) {
        gsap.from(serviceCards, {
            y: 40,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: serviceCards[0].closest('section') || serviceCards[0],
                start: 'top 82%',
                once: true
            }
        });
    }

    // ============================================
    // 14. PRICING CARDS (pricing pages)
    // ============================================
    const pricingCards = qa('.pricing-card');
    if (pricingCards.length) {
        gsap.from(pricingCards, {
            y: 50,
            opacity: 0,
            stagger: 0.15,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: pricingCards[0].closest('section') || pricingCards[0],
                start: 'top 82%',
                once: true
            }
        });
    }

    // ============================================
    // 15. INDUSTRY CARDS (industries.html)
    // ============================================
    const industryCards = qa('.industry-card');
    if (industryCards.length) {
        gsap.from(industryCards, {
            y: 36,
            opacity: 0,
            stagger: 0.09,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: industryCards[0].closest('section') || industryCards[0],
                start: 'top 82%',
                once: true
            }
        });
    }

    // ============================================
    // 16. FAQ / ACCORDION ITEMS
    // ============================================
    const faqItems = qa('.faq-compact');
    if (faqItems.length) {
        gsap.from(faqItems, {
            y: 24,
            opacity: 0,
            stagger: 0.08,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: faqItems[0].closest('section') || faqItems[0],
                start: 'top 85%',
                once: true
            }
        });
    }

    // ============================================
    // 17. CONTACT FORM
    // ============================================
    const contactFormContainer = q('.contact__form-container');
    if (contactFormContainer) {
        gsap.from(contactFormContainer, {
            y: 40,
            opacity: 0,
            duration: 0.75,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: contactFormContainer,
                start: 'top 85%',
                once: true
            }
        });
    }

    // ============================================
    // 18. FOOTER ENTRANCE
    // ============================================
    const footer = q('.footer');
    if (footer) {
        gsap.from(footer, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: footer,
                start: 'top 95%',
                once: true
            }
        });
    }

    // ============================================
    // 19. HOVER MICRO-ANIMATIONS (preview cards)
    //     Subtle lift on hover using GSAP for
    //     smoother easing than CSS alone
    // ============================================
    if (window.innerWidth > 768) {
        qa('.preview-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -6, duration: 0.3, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.inOut' });
            });
        });

        qa('.proof-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -4, duration: 0.3, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.inOut' });
            });
        });

        qa('.testimonial-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -4, duration: 0.3, ease: 'power2.out' });
            });
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.inOut' });
            });
        });
    }

    // ============================================
    // FAILSAFE: Reveal any elements still hidden
    //           after 3 seconds (handles edge cases
    //           where ScrollTrigger never fires)
    // ============================================
    setTimeout(() => {
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            if (parseFloat(window.getComputedStyle(el).opacity) < 0.1) {
                el.style.opacity = '1';
                el.style.transform = 'none';
                el.classList.add('revealed');
            }
        });
    }, 3000);

})();
