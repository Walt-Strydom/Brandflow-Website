// BrandFlow SVG Animations — Powered by Snap.svg 0.5.1
// Generates and animates all hero SVG illustrations programmatically.
(function () {
    'use strict';
    if (typeof Snap === 'undefined') return;

    /* ── Palette ─────────────────────────────────────────────────────────── */
    var C = {
        navy:        '#1e3a5f',
        navyDark:    '#0f2744',
        orange:      '#f97316',
        orangeLight: '#fb923c',
        white:       '#ffffff',
        border:      '#e2e8f0'
    };

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── Animation helpers ───────────────────────────────────────────────── */

    // Vertical float loop: el floats to (tx, ty) then back, repeating forever
    function floatLoop(el, tx, ty, dur, delay) {
        if (reduced) return;
        setTimeout(function () {
            (function run() {
                el.animate({ transform: 't' + tx + ',' + ty }, dur, mina.easeinout, function () {
                    el.animate({ transform: 't0,0' }, dur, mina.easeinout, run);
                });
            }());
        }, delay || 0);
    }

    // Scale pulse loop around a centre point
    function pulseLoop(el, cx, cy, scale, dur, delay) {
        if (reduced) return;
        setTimeout(function () {
            (function run() {
                el.animate({ transform: 's' + scale + ',' + scale + ',' + cx + ',' + cy }, dur, mina.easeinout, function () {
                    el.animate({ transform: 's1,1,' + cx + ',' + cy }, dur, mina.easeinout, run);
                });
            }());
        }, delay || 0);
    }

    // Marching-ants dash animation on a single path element
    function dashLoop(el, dur) {
        if (reduced) return;
        el.attr({ 'stroke-dashoffset': 0 });
        (function run() {
            el.animate({ 'stroke-dashoffset': -20 }, dur, mina.linear, function () {
                el.attr({ 'stroke-dashoffset': 0 });
                run();
            });
        }());
    }

    // Small vertical bob for accent dots/stars
    function dotFloat(el, ty, dur, delay) {
        if (reduced) return;
        setTimeout(function () {
            (function run() {
                el.animate({ transform: 't0,' + ty }, dur, mina.easeinout, function () {
                    el.animate({ transform: 't0,0' }, dur, mina.easeinout, run);
                });
            }());
        }, delay || 0);
    }

    // Continuous rotation around a point
    function rotateLoop(el, cx, cy, dur) {
        if (reduced) return;
        (function run() {
            el.animate({ transform: 'r360,' + cx + ',' + cy }, dur, mina.linear, function () {
                el.attr({ transform: 'r0,' + cx + ',' + cy });
                run();
            });
        }());
    }

    // Inject raw SVG string into <defs>
    function defs(s, html) {
        s.defs.node.innerHTML = html;
    }

    // Shorthand: create polygon via element API (safe across Snap versions)
    function poly(s, pts) {
        return s.el('polygon').attr({ points: pts });
    }
    function pline(s, pts) {
        return s.el('polyline').attr({ points: pts });
    }

    /* ── Page routing ────────────────────────────────────────────────────── */
    function init() {
        // index.html uses a different container class
        var indexSvg = document.querySelector('.hero__svg-container .hero__svg');
        if (indexSvg) {
            indexSvg.id = 'snap-idx';
            initIndex(Snap('#snap-idx'));
            return;
        }

        var pageSvg = document.querySelector('.page-hero__svg-container .page-hero__svg');
        if (!pageSvg) return;
        pageSvg.id = 'snap-pg';
        var hero = document.querySelector('.page-hero');
        if (!hero) return;
        var cl = hero.classList;
        var s  = Snap('#snap-pg');

        if      (cl.contains('page-hero--ai'))          initAiMl(s);
        else if (cl.contains('page-hero--api'))         initApi(s);
        else if (cl.contains('page-hero--web'))         initWebDev(s);
        else if (cl.contains('page-hero--development')) initFullStack(s);
        else if (cl.contains('page-hero--automation'))  initAutomation(s);
        else if (cl.contains('page-hero--advisor'))     initAdvisor(s);
        else if (cl.contains('page-hero--services'))    initServices(s);
        else if (cl.contains('page-hero--why'))         initWhyUs(s);
    }

    /* ════════════════════════════════════════════════════════════════════════
       INDEX HERO  500 × 400
    ════════════════════════════════════════════════════════════════════════ */
    function initIndex(s) {
        s.clear();
        defs(s, [
            '<linearGradient id="i-bg" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.navy + '" stop-opacity="0.1"/>',
            '<stop offset="100%" stop-color="' + C.orange + '" stop-opacity="0.1"/></linearGradient>',
            '<linearGradient id="i-navy" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.navy + '"/>',
            '<stop offset="100%" stop-color="#2d4a6f"/></linearGradient>',
            '<linearGradient id="i-orange" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.orange + '"/>',
            '<stop offset="100%" stop-color="' + C.orangeLight + '"/></linearGradient>',
            '<filter id="i-shd"><feDropShadow dx="0" dy="4" stdDeviation="8"',
            'flood-color="' + C.navy + '" flood-opacity="0.15"/></filter>'
        ].join(''));

        // ── Background circles
        var bg = s.g(
            s.circle(400, 80, 60).attr({ fill: 'url(#i-bg)' }),
            s.circle(80, 320, 45).attr({ fill: 'url(#i-bg)' }),
            s.circle(450, 350, 30).attr({ fill: 'rgba(249,115,22,0.08)' })
        );
        pulseLoop(bg, 400, 80, 1.06, 4000, 0);

        // ── Browser window
        var browser = s.g(
            s.rect(60, 60, 320, 220, 12).attr({ fill: C.white, stroke: C.border, 'stroke-width': 2 }),
            s.rect(60, 60, 320, 36, 12).attr({ fill: '#f8fafc' }),
            s.rect(60, 84, 320, 12).attr({ fill: '#f8fafc' }),
            s.circle(82, 78, 6).attr({ fill: '#ff5f57' }),
            s.circle(102, 78, 6).attr({ fill: '#ffbd2e' }),
            s.circle(122, 78, 6).attr({ fill: '#28ca42' }),
            s.rect(145, 68, 180, 20, 4).attr({ fill: C.white, stroke: C.border, 'stroke-width': 1 }),
            s.rect(80, 115, 120, 12, 2).attr({ fill: C.navy }),
            s.rect(80, 140, 280, 8, 2).attr({ fill: C.border }),
            s.rect(80, 158, 260, 8, 2).attr({ fill: C.border }),
            s.rect(80, 176, 200, 8, 2).attr({ fill: C.border }),
            s.rect(80, 205, 100, 32, 4).attr({ fill: 'url(#i-navy)' }),
            s.rect(195, 205, 80, 32, 4).attr({ fill: 'none', stroke: C.navy, 'stroke-width': 2 }),
            s.rect(80, 250, 280, 15, 2).attr({ fill: '#f1f5f9' })
        ).attr({ filter: 'url(#i-shd)' });
        floatLoop(browser, 0, -8, 4000, 0);

        // ── Floating code card
        var code = s.g(
            s.rect(300, 140, 160, 120, 10).attr({ fill: C.navyDark }),
            s.rect(320, 160, 60, 6, 2).attr({ fill: C.orange }),
            s.rect(390, 160, 50, 6, 2).attr({ fill: '#64748b' }),
            s.rect(320, 176, 40, 6, 2).attr({ fill: '#64748b' }),
            s.rect(370, 176, 70, 6, 2).attr({ fill: '#94a3b8' }),
            s.rect(330, 192, 80, 6, 2).attr({ fill: C.orangeLight }),
            s.rect(420, 192, 20, 6, 2).attr({ fill: '#64748b' }),
            s.rect(330, 208, 50, 6, 2).attr({ fill: '#94a3b8' }),
            s.rect(320, 224, 30, 6, 2).attr({ fill: '#64748b' }),
            s.rect(360, 224, 60, 6, 2).attr({ fill: C.orange })
        ).attr({ filter: 'url(#i-shd)' });
        floatLoop(code, -5, -8, 3500, 500);

        // ── Design elements card
        var design = s.g(
            s.rect(30, 200, 130, 100, 10).attr({ fill: C.white, stroke: C.border, 'stroke-width': 2 }),
            s.circle(60, 235, 15).attr({ fill: C.navy }),
            s.circle(100, 235, 15).attr({ fill: C.orange }),
            s.circle(140, 235, 15).attr({ fill: '#64748b' }),
            s.rect(50, 265, 90, 8, 2).attr({ fill: C.navy }),
            s.rect(50, 280, 60, 6, 2).attr({ fill: C.border })
        ).attr({ filter: 'url(#i-shd)' });
        floatLoop(design, 5, -8, 3500, 300);

        // ── Floating icons
        var iconR = s.g(
            s.circle(420, 180, 28).attr({ fill: 'url(#i-orange)', filter: 'url(#i-shd)' }),
            s.rect(408, 168, 24, 16, 2).attr({ fill: C.white }),
            s.rect(415, 186, 10, 14, 1).attr({ fill: C.white })
        );
        var iconC = s.g(
            s.circle(180, 320, 24).attr({ fill: 'url(#i-navy)', filter: 'url(#i-shd)' }),
            s.rect(166, 320, 6, 14, 1).attr({ fill: C.white }),
            s.rect(177, 312, 6, 22, 1).attr({ fill: C.white }),
            s.rect(188, 316, 6, 18, 1).attr({ fill: C.white })
        );
        var iconK = s.g(
            s.circle(350, 40, 22).attr({ fill: C.white, stroke: C.orange, 'stroke-width': 3, filter: 'url(#i-shd)' }),
            s.path('M350 30 L356 45 L350 42 L344 45 Z').attr({ fill: C.orange }),
            s.circle(346, 48, 3).attr({ fill: C.navy }),
            s.circle(354, 48, 3).attr({ fill: C.navy })
        );
        floatLoop(iconR, 5, -8, 3500, 200);
        floatLoop(iconC, -5, -8, 3800, 0);
        floatLoop(iconK, 0, -6, 3000, 100);

        // ── Connection lines
        var l1 = s.path('M380 180 Q400 140 420 180').attr({ stroke: C.orange, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '5,5', opacity: 0.5 });
        var l2 = s.path('M160 280 Q120 300 180 320').attr({ stroke: C.navy, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '5,5', opacity: 0.5 });
        dashLoop(l1, 2000);
        dashLoop(l2, 2500);

        // ── Accent dots
        [[250,30,4,C.orange,1],[270,40,3,C.navy,1],[480,250,5,C.orange,0.6],[20,150,4,C.navy,0.4],[490,120,3,C.orange,0.5]].forEach(function (d, i) {
            dotFloat(s.circle(d[0], d[1], d[2]).attr({ fill: d[3], opacity: d[4] }), -4, 3000, i * 400);
        });
    }

    /* ════════════════════════════════════════════════════════════════════════
       AI & ML HERO  400 × 320
    ════════════════════════════════════════════════════════════════════════ */
    function initAiMl(s) {
        s.clear();
        defs(s, [
            '<linearGradient id="ai-g1" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.orange + '"/>',
            '<stop offset="100%" stop-color="' + C.orangeLight + '"/></linearGradient>',
            '<linearGradient id="ai-g2" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="#fff" stop-opacity="0.12"/>',
            '<stop offset="100%" stop-color="#fff" stop-opacity="0.04"/></linearGradient>',
            '<filter id="ai-sh"><feDropShadow dx="0" dy="4" stdDeviation="8"',
            'flood-color="#000" flood-opacity="0.2"/></filter>'
        ].join(''));

        // Background
        var bg = s.g(
            s.circle(200, 155, 110).attr({ fill: 'none', stroke: 'url(#ai-g1)', 'stroke-width': 1, 'stroke-dasharray': '6 4', opacity: 0.3 }),
            s.circle(200, 155, 75).attr({ fill: 'url(#ai-g2)' }),
            s.circle(340, 55, 28).attr({ fill: 'url(#ai-g2)' })
        );
        pulseLoop(bg, 200, 155, 1.06, 4000, 0);

        // Spoke lines
        ['M200 155 L95 78','M200 155 L310 73','M200 155 L84 232','M200 155 L316 237','M200 155 L200 42'].forEach(function (d) {
            dashLoop(s.path(d).attr({ stroke: C.orange, 'stroke-width': 1.5, fill: 'none', 'stroke-dasharray': '5,5', opacity: 0.5 }), 2000);
        });

        // Central hub
        var hub = s.g(
            s.circle(200, 155, 48).attr({ fill: C.navyDark }),
            s.circle(200, 155, 38).attr({ fill: 'url(#ai-g1)' }),
            s.circle(191, 147, 5).attr({ fill: C.white, opacity: 0.9 }),
            s.circle(209, 147, 5).attr({ fill: C.white, opacity: 0.9 }),
            s.circle(191, 163, 5).attr({ fill: C.white, opacity: 0.9 }),
            s.circle(209, 163, 5).attr({ fill: C.white, opacity: 0.9 }),
            s.circle(200, 155, 4).attr({ fill: C.white }),
            s.line(191, 147, 200, 155).attr({ stroke: C.white, 'stroke-width': 1.5, opacity: 0.7 }),
            s.line(209, 147, 200, 155).attr({ stroke: C.white, 'stroke-width': 1.5, opacity: 0.7 }),
            s.line(191, 163, 200, 155).attr({ stroke: C.white, 'stroke-width': 1.5, opacity: 0.7 }),
            s.line(209, 163, 200, 155).attr({ stroke: C.white, 'stroke-width': 1.5, opacity: 0.7 })
        ).attr({ filter: 'url(#ai-sh)' });
        floatLoop(hub, 0, -8, 4000, 0);

        // Outer nodes
        function mkNode(cx, cy, r1, r2, r3) {
            return s.g(
                s.circle(cx, cy, r1).attr({ fill: C.navy }),
                s.circle(cx, cy, r2).attr({ fill: 'rgba(249,115,22,0.2)' }),
                s.circle(cx, cy, r3).attr({ fill: 'url(#ai-g1)' })
            ).attr({ filter: 'url(#ai-sh)' });
        }
        var n1 = mkNode(95, 78, 26, 18, 8);
        var n2 = mkNode(310, 73, 26, 18, 8);
        var n3 = mkNode(84, 232, 22, 14, 6);
        var n4 = mkNode(316, 237, 22, 14, 6);
        var topNode = s.g(s.circle(200, 42, 20).attr({ fill: C.navy }), s.circle(200, 42, 13).attr({ fill: 'url(#ai-g1)' }), s.circle(200, 42, 5).attr({ fill: C.white })).attr({ filter: 'url(#ai-sh)' });

        floatLoop(n1, -5, -8, 3500, 0);
        floatLoop(n2,  5, -8, 3500, 500);
        floatLoop(n3, -5, -8, 3800, 1000);
        floatLoop(n4,  5, -8, 3800, 1500);
        floatLoop(topNode, 5, -8, 3500, 200);

        // Floating model card
        var card1 = s.g(
            s.rect(28, 128, 58, 50, 10).attr({ fill: 'rgba(255,255,255,0.08)' }),
            s.rect(36, 140, 40, 6, 3).attr({ fill: 'url(#ai-g1)', opacity: 0.9 }),
            s.rect(36, 153, 30, 4, 2).attr({ fill: 'rgba(255,255,255,0.4)' }),
            s.rect(36, 163, 38, 4, 2).attr({ fill: 'rgba(255,255,255,0.35)' })
        ).attr({ filter: 'url(#ai-sh)' });
        floatLoop(card1, -5, -8, 3500, 0);

        // Accuracy badge
        var badge1 = s.g(
            s.rect(312, 158, 72, 34, 8).attr({ fill: C.navyDark }),
            s.rect(318, 165, 58, 6, 3).attr({ fill: 'url(#ai-g1)', opacity: 0.9 }),
            s.rect(318, 177, 40, 4, 2).attr({ fill: 'rgba(255,255,255,0.35)' })
        ).attr({ filter: 'url(#ai-sh)' });
        floatLoop(badge1, 5, -8, 3500, 500);

        // Dots
        [[153,108,4,C.orange,0.6],[247,103,3,C.orange,0.5],[158,202,3,C.white,0.3],[242,207,4,C.white,0.3],[362,153,5,C.orange,0.4],[38,153,4,C.orange,0.4]].forEach(function (d, i) {
            dotFloat(s.circle(d[0], d[1], d[2]).attr({ fill: d[3], opacity: d[4] }), -4, 3000, i * 400);
        });
    }

    /* ════════════════════════════════════════════════════════════════════════
       API DEVELOPMENT HERO  400 × 320
    ════════════════════════════════════════════════════════════════════════ */
    function initApi(s) {
        s.clear();
        defs(s, [
            '<linearGradient id="ap-g1" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.orange + '"/>',
            '<stop offset="100%" stop-color="' + C.orangeLight + '"/></linearGradient>',
            '<linearGradient id="ap-g2" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="#fff" stop-opacity="0.12"/>',
            '<stop offset="100%" stop-color="#fff" stop-opacity="0.04"/></linearGradient>',
            '<filter id="ap-sh"><feDropShadow dx="0" dy="4" stdDeviation="8"',
            'flood-color="#000" flood-opacity="0.2"/></filter>'
        ].join(''));

        // Background
        s.g(
            s.circle(200, 155, 115).attr({ fill: 'none', stroke: 'url(#ap-g1)', 'stroke-width': 1, 'stroke-dasharray': '8 4', opacity: 0.25 }),
            s.circle(200, 155, 70).attr({ fill: 'url(#ap-g2)' }),
            s.circle(48, 48, 30).attr({ fill: 'url(#ap-g2)' })
        );

        // Spoke lines
        ['M200 155 L88 73','M200 155 L320 68','M200 155 L342 182','M200 155 L78 242','M200 155 L200 270'].forEach(function (d) {
            dashLoop(s.path(d).attr({ stroke: C.orange, 'stroke-width': 1.5, fill: 'none', 'stroke-dasharray': '5,5', opacity: 0.5 }), 2000);
        });

        // Central hub
        var hub = s.g(
            s.circle(200, 155, 46).attr({ fill: C.navyDark }),
            s.circle(200, 155, 36).attr({ fill: 'url(#ap-g1)' }),
            s.rect(182, 148, 36, 14, 4).attr({ fill: 'rgba(255,255,255,0.15)' }),
            s.rect(186, 152, 28, 8, 2).attr({ fill: C.white, opacity: 0.92 })
        ).attr({ filter: 'url(#ap-sh)' });
        floatLoop(hub, 0, -8, 4000, 0);

        // Endpoint badges
        var ep1 = s.g(s.rect(50, 55, 64, 28, 8).attr({ fill: C.navy }), s.rect(56, 62, 30, 7, 3).attr({ fill: 'url(#ap-g1)' }), s.rect(90, 62, 18, 7, 3).attr({ fill: 'rgba(255,255,255,0.25)' })).attr({ filter: 'url(#ap-sh)' });
        var ep2 = s.g(s.rect(296, 50, 68, 28, 8).attr({ fill: C.navy }), s.rect(302, 57, 36, 7, 3).attr({ fill: 'rgba(100,220,130,0.75)' }), s.rect(342, 57, 16, 7, 3).attr({ fill: 'rgba(255,255,255,0.25)' })).attr({ filter: 'url(#ap-sh)' });
        var ep3 = s.g(s.rect(318, 165, 72, 28, 8).attr({ fill: C.navy }), s.rect(324, 172, 42, 7, 3).attr({ fill: 'rgba(249,115,22,0.85)' }), s.rect(370, 172, 14, 7, 3).attr({ fill: 'rgba(255,255,255,0.25)' })).attr({ filter: 'url(#ap-sh)' });
        var ep4 = s.g(s.rect(40, 222, 72, 28, 8).attr({ fill: C.navy }), s.rect(46, 229, 40, 7, 3).attr({ fill: 'rgba(139,92,246,0.8)' }), s.rect(90, 229, 16, 7, 3).attr({ fill: 'rgba(255,255,255,0.25)' })).attr({ filter: 'url(#ap-sh)' });
        var epBot = s.g(s.rect(160, 260, 80, 26, 8).attr({ fill: C.navyDark }), s.rect(168, 267, 62, 6, 3).attr({ fill: 'url(#ap-g1)', opacity: 0.85 })).attr({ filter: 'url(#ap-sh)' });
        var card1 = s.g(
            s.rect(28, 132, 55, 48, 8).attr({ fill: 'rgba(255,255,255,0.07)' }),
            s.rect(35, 141, 14, 5, 2).attr({ fill: C.orange, opacity: 0.85 }),
            s.rect(35, 152, 40, 4, 2).attr({ fill: 'rgba(255,255,255,0.3)' }),
            s.rect(35, 162, 32, 4, 2).attr({ fill: 'rgba(255,255,255,0.25)' }),
            s.rect(35, 172, 14, 4, 2).attr({ fill: C.orange, opacity: 0.5 })
        ).attr({ filter: 'url(#ap-sh)' });

        floatLoop(ep1, -5, -8, 3500, 0);
        floatLoop(ep2,  5, -8, 3500, 500);
        floatLoop(ep3,  5, -8, 3800, 1000);
        floatLoop(ep4, -5, -8, 3800, 1500);
        floatLoop(epBot, 0,  6, 3500, 300);
        floatLoop(card1,-5, -8, 3500, 200);

        [[148,98,4,C.orange,0.55],[253,94,3,C.orange,0.5],[268,212,4,C.white,0.3],[128,217,3,C.white,0.3],[372,128,5,C.orange,0.4]].forEach(function (d, i) {
            dotFloat(s.circle(d[0], d[1], d[2]).attr({ fill: d[3], opacity: d[4] }), -4, 3000, i * 400);
        });
    }

    /* ════════════════════════════════════════════════════════════════════════
       WEB DEVELOPMENT HERO  400 × 320
    ════════════════════════════════════════════════════════════════════════ */
    function initWebDev(s) {
        s.clear();
        defs(s, [
            '<linearGradient id="wb-g1" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.orange + '"/>',
            '<stop offset="100%" stop-color="#ea6c0a"/></linearGradient>',
            '<linearGradient id="wb-g2" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.navy + '"/>',
            '<stop offset="100%" stop-color="' + C.navyDark + '"/></linearGradient>',
            '<filter id="wb-sh"><feDropShadow dx="0" dy="4" stdDeviation="8"',
            'flood-color="rgba(15,39,68,0.25)"/></filter>'
        ].join(''));

        // Background glow
        var bgC = s.circle(200, 160, 110).attr({ fill: 'rgba(249,115,22,0.06)' });
        pulseLoop(bgC, 200, 160, 1.06, 4000, 0);

        // Browser window
        var browser = s.g(
            s.rect(70, 60, 220, 160, 10).attr({ fill: 'url(#wb-g2)' }),
            s.rect(70, 60, 220, 28, 10).attr({ fill: C.navyDark }),
            s.rect(70, 78, 220, 10).attr({ fill: C.navyDark }),
            s.circle(88, 74, 4).attr({ fill: '#ef4444' }),
            s.circle(100, 74, 4).attr({ fill: '#f59e0b' }),
            s.circle(112, 74, 4).attr({ fill: '#22c55e' }),
            s.rect(122, 68, 120, 12, 6).attr({ fill: 'rgba(255,255,255,0.12)' }),
            s.text(133, 77, 'brandflow.co.za').attr({ 'font-size': 6, fill: 'rgba(255,255,255,0.6)', 'font-family': 'monospace' }),
            s.rect(70, 88, 220, 132).attr({ fill: '#f8fafc' }),
            s.rect(70, 208, 220, 12).attr({ fill: '#f8fafc' }),
            s.rect(70, 88, 220, 18).attr({ fill: C.navy }),
            s.rect(80, 93, 30, 8, 2).attr({ fill: 'rgba(255,255,255,0.9)' }),
            s.rect(192, 95, 18, 4, 2).attr({ fill: 'rgba(255,255,255,0.5)' }),
            s.rect(216, 95, 18, 4, 2).attr({ fill: 'rgba(255,255,255,0.5)' }),
            s.rect(240, 95, 18, 4, 2).attr({ fill: 'rgba(255,255,255,0.5)' }),
            s.rect(70, 106, 220, 48).attr({ fill: 'url(#wb-g2)', opacity: 0.9 }),
            s.rect(84, 114, 80, 6, 3).attr({ fill: 'rgba(255,255,255,0.9)' }),
            s.rect(84, 124, 60, 4, 2).attr({ fill: 'rgba(255,255,255,0.6)' }),
            s.rect(84, 134, 32, 10, 5).attr({ fill: C.orange }),
            s.rect(84, 162, 60, 5, 2.5).attr({ fill: C.navy, opacity: 0.7 }),
            s.rect(84, 172, 100, 4, 2).attr({ fill: '#94a3b8' }),
            s.rect(84, 180, 80, 4, 2).attr({ fill: '#94a3b8' }),
            s.rect(84, 188, 90, 4, 2).attr({ fill: '#94a3b8' }),
            s.rect(202, 158, 70, 50, 6).attr({ fill: C.white, stroke: C.border, 'stroke-width': 1 }),
            s.rect(208, 164, 58, 20, 3).attr({ fill: '#f0f9ff' }),
            s.rect(208, 189, 40, 4, 2).attr({ fill: '#94a3b8' }),
            s.rect(208, 197, 28, 4, 2).attr({ fill: '#94a3b8' })
        ).attr({ filter: 'url(#wb-sh)' });
        floatLoop(browser, 0, -8, 4000, 0);

        // Mobile phone
        var phone = s.g(
            s.rect(36, 110, 52, 88, 8).attr({ fill: C.white, stroke: C.border, 'stroke-width': 1.5 }),
            s.rect(36, 110, 52, 16, 8).attr({ fill: C.navy }),
            s.rect(36, 118, 52, 8).attr({ fill: C.navy }),
            s.circle(62, 118, 3).attr({ fill: 'rgba(255,255,255,0.6)' }),
            s.rect(42, 132, 40, 24, 3).attr({ fill: '#f0f9ff' }),
            s.rect(42, 160, 40, 4, 2).attr({ fill: '#94a3b8' }),
            s.rect(42, 168, 28, 4, 2).attr({ fill: '#94a3b8' }),
            s.rect(42, 176, 40, 8, 4).attr({ fill: C.orange, opacity: 0.85 }),
            s.rect(30, 202, 64, 18, 6).attr({ fill: 'url(#wb-g1)' }),
            s.text(62, 214, 'Mobile-First').attr({ 'text-anchor': 'middle', 'font-size': 7, fill: C.white, 'font-weight': 600 })
        );
        floatLoop(phone, -5, -8, 3500, 0);

        // Colour palette card
        var palette = s.g(
            s.rect(308, 100, 72, 58, 8).attr({ fill: C.white, stroke: C.border, 'stroke-width': 1.5 }),
            s.text(344, 116, 'Brand Palette').attr({ 'text-anchor': 'middle', 'font-size': 7, fill: C.navy, 'font-weight': 700 }),
            s.rect(318, 122, 14, 14, 3).attr({ fill: C.orange }),
            s.rect(335, 122, 14, 14, 3).attr({ fill: C.navy }),
            s.rect(352, 122, 14, 14, 3).attr({ fill: '#22c55e' }),
            s.rect(318, 140, 14, 8, 2).attr({ fill: '#3b82f6' }),
            s.rect(335, 140, 14, 8, 2).attr({ fill: '#8b5cf6' }),
            s.rect(352, 140, 14, 8, 2).attr({ fill: '#f8fafc', stroke: C.border, 'stroke-width': 1 })
        );
        floatLoop(palette, 5, -8, 3500, 500);

        // PageSpeed badge
        var speed = s.g(
            s.rect(282, 198, 88, 34, 10).attr({ fill: 'url(#wb-g1)' }),
            s.text(326, 211, '100 PageSpeed').attr({ 'text-anchor': 'middle', 'font-size': 7, fill: C.white, 'font-weight': 700 }),
            s.circle(294, 218, 6).attr({ fill: 'rgba(255,255,255,0.2)' }),
            s.text(294, 221, '\u2713').attr({ 'text-anchor': 'middle', 'font-size': 7, fill: C.white, 'font-weight': 800 }),
            s.text(330, 224, 'SEO Optimised').attr({ 'text-anchor': 'middle', 'font-size': 6.5, fill: 'rgba(255,255,255,0.85)' })
        ).attr({ filter: 'url(#wb-sh)' });
        floatLoop(speed, 5, -6, 3500, 300);

        // Dots
        [[55,85,3,C.orange,0.5],[68,95,2,C.navy,0.5],[340,75,3,C.orange,0.5],[328,88,2,C.navy,0.5],[155,250,3,C.orange,0.5],[245,255,2.5,C.navy,0.5],[310,170,2,C.orange,0.5]].forEach(function (d, i) {
            dotFloat(s.circle(d[0], d[1], d[2]).attr({ fill: d[3], opacity: d[4] }), -4, 3000, i * 350);
        });
    }

    /* ════════════════════════════════════════════════════════════════════════
       FULL STACK HERO  400 × 320
    ════════════════════════════════════════════════════════════════════════ */
    function initFullStack(s) {
        s.clear();
        defs(s, [
            '<linearGradient id="fs-g1" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.orange + '"/>',
            '<stop offset="100%" stop-color="' + C.orangeLight + '"/></linearGradient>',
            '<linearGradient id="fs-g2" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="#fff" stop-opacity="0.12"/>',
            '<stop offset="100%" stop-color="#fff" stop-opacity="0.04"/></linearGradient>',
            '<filter id="fs-sh"><feDropShadow dx="0" dy="4" stdDeviation="8"',
            'flood-color="#000" flood-opacity="0.2"/></filter>'
        ].join(''));

        s.g(
            s.circle(375, 48, 45).attr({ fill: 'url(#fs-g2)' }),
            s.circle(38, 278, 35).attr({ fill: 'url(#fs-g2)' }),
            s.circle(348, 278, 22).attr({ fill: 'rgba(249,115,22,0.08)' })
        );

        // Stack layers
        var stack = s.g(
            s.rect(80, 58, 240, 62, 12).attr({ fill: 'rgba(255,255,255,0.07)' }),
            s.rect(80, 58, 240, 26, 12).attr({ fill: C.navyDark }),
            s.rect(80, 72, 240, 12).attr({ fill: C.navyDark }),
            s.circle(98, 71, 5).attr({ fill: '#ff5f57' }),
            s.circle(113, 71, 5).attr({ fill: '#ffbd2e' }),
            s.circle(128, 71, 5).attr({ fill: '#28ca42' }),
            s.rect(145, 64, 130, 14, 4).attr({ fill: 'rgba(255,255,255,0.08)' }),
            s.rect(90, 96, 140, 7, 3).attr({ fill: 'rgba(255,255,255,0.3)' }),
            s.rect(90, 109, 100, 7, 3).attr({ fill: 'rgba(255,255,255,0.2)' }),
            s.path('M200 122 L200 140').attr({ stroke: C.orange, 'stroke-width': 2.5, fill: 'none' }),
            poly(s, '200,145 195,135 205,135').attr({ fill: C.orange }),
            s.rect(100, 145, 200, 58, 12).attr({ fill: 'rgba(255,255,255,0.07)' }),
            s.rect(112, 158, 42, 8, 4).attr({ fill: 'url(#fs-g1)', opacity: 0.85 }),
            s.rect(164, 158, 65, 8, 4).attr({ fill: 'rgba(255,255,255,0.22)' }),
            s.rect(112, 174, 85, 6, 3).attr({ fill: 'rgba(255,255,255,0.18)' }),
            s.rect(207, 174, 65, 6, 3).attr({ fill: 'rgba(255,255,255,0.18)' }),
            s.path('M200 205 L200 223').attr({ stroke: C.orange, 'stroke-width': 2.5, fill: 'none' }),
            poly(s, '200,228 195,218 205,218').attr({ fill: C.orange }),
            s.ellipse(200, 248, 68, 16).attr({ fill: C.navy }),
            s.rect(132, 248, 136, 26).attr({ fill: C.navy }),
            s.ellipse(200, 274, 68, 16).attr({ fill: C.navy }),
            s.ellipse(200, 248, 68, 16).attr({ fill: '#2d4a6f' }),
            s.ellipse(200, 248, 50, 8).attr({ fill: 'none', stroke: 'url(#fs-g1)', 'stroke-width': 1.5, opacity: 0.6 })
        ).attr({ filter: 'url(#fs-sh)' });
        floatLoop(stack, 0, -8, 4000, 0);

        // Code card
        var card1 = s.g(
            s.rect(298, 108, 80, 78, 10).attr({ fill: C.navyDark }),
            s.rect(308, 120, 38, 5, 2).attr({ fill: C.orange }),
            s.rect(312, 132, 54, 4, 2).attr({ fill: 'rgba(255,255,255,0.28)' }),
            s.rect(312, 143, 44, 4, 2).attr({ fill: 'rgba(255,255,255,0.22)' }),
            s.rect(312, 154, 50, 4, 2).attr({ fill: C.orange, opacity: 0.5 }),
            s.rect(312, 165, 34, 4, 2).attr({ fill: 'rgba(255,255,255,0.22)' }),
            s.rect(312, 176, 45, 4, 2).attr({ fill: 'rgba(255,255,255,0.18)' })
        ).attr({ filter: 'url(#fs-sh)' });
        floatLoop(card1, 5, -8, 3500, 500);

        // Tech label card
        var badge1 = s.g(
            s.rect(18, 102, 65, 55, 10).attr({ fill: 'rgba(255,255,255,0.07)' }),
            s.rect(26, 112, 48, 7, 3).attr({ fill: 'url(#fs-g1)', opacity: 0.85 }),
            s.rect(26, 126, 36, 5, 2).attr({ fill: 'rgba(255,255,255,0.3)' }),
            s.rect(26, 137, 44, 5, 2).attr({ fill: 'rgba(255,255,255,0.25)' }),
            s.rect(26, 148, 28, 5, 2).attr({ fill: 'rgba(255,255,255,0.2)' })
        ).attr({ filter: 'url(#fs-sh)' });
        floatLoop(badge1, -5, -8, 3500, 0);

        // Deploy badge
        var deploy = s.g(
            s.rect(286, 36, 72, 28, 8).attr({ fill: 'url(#fs-g1)' }),
            s.rect(294, 43, 56, 7, 3).attr({ fill: 'rgba(255,255,255,0.9)' })
        ).attr({ filter: 'url(#fs-sh)' });
        floatLoop(deploy, 5, -8, 3500, 200);

        dashLoop(s.path('M298 90 Q285 100 298 112').attr({ stroke: C.orange, 'stroke-width': 1.5, fill: 'none', 'stroke-dasharray': '4,4', opacity: 0.4 }), 2000);

        [[58,63,4,C.orange,0.5],[352,198,5,C.orange,0.5],[200,24,4,C.orange,0.4],[48,198,3,C.white,0.3],[345,60,3,C.white,0.3]].forEach(function (d, i) {
            dotFloat(s.circle(d[0], d[1], d[2]).attr({ fill: d[3], opacity: d[4] }), -4, 3000, i * 400);
        });
    }

    /* ════════════════════════════════════════════════════════════════════════
       PROCESS AUTOMATION HERO  500 × 320
    ════════════════════════════════════════════════════════════════════════ */
    function initAutomation(s) {
        s.clear();
        defs(s, [
            '<linearGradient id="au-g1" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.orange + '"/>',
            '<stop offset="100%" stop-color="' + C.orangeLight + '"/></linearGradient>',
            '<linearGradient id="au-g2" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="#fff" stop-opacity="0.15"/>',
            '<stop offset="100%" stop-color="#fff" stop-opacity="0.05"/></linearGradient>',
            '<filter id="au-sh"><feDropShadow dx="0" dy="4" stdDeviation="6"',
            'flood-color="#000" flood-opacity="0.12"/></filter>',
            '<marker id="au-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">',
            '<polygon points="0 0, 10 3.5, 0 7" fill="' + C.orange + '"/></marker>'
        ].join(''));

        // Background
        s.g(
            s.circle(60, 60, 40).attr({ fill: 'url(#au-g2)' }),
            s.circle(450, 280, 30).attr({ fill: 'url(#au-g2)' }),
            s.circle(470, 70, 20).attr({ fill: 'rgba(249,115,22,0.1)' }),
            s.circle(30, 250, 25).attr({ fill: 'rgba(30,58,95,0.08)' })
        );

        // Left chaos card
        var chaos = s.g(
            s.rect(30, 100, 100, 120, 12).attr({ fill: C.white }),
            s.path('M45,150 Q60,120 75,155 Q90,130 105,150').attr({ fill: 'none', stroke: '#94a3b8', 'stroke-width': 2, 'stroke-linecap': 'round' }),
            s.path('M50,165 Q65,140 80,170 Q95,145 110,160').attr({ fill: 'none', stroke: '#94a3b8', 'stroke-width': 2, 'stroke-linecap': 'round' }),
            s.path('M55,180 Q70,155 85,185 Q100,160 115,175').attr({ fill: 'none', stroke: '#94a3b8', 'stroke-width': 2, 'stroke-linecap': 'round' }),
            s.rect(45, 110, 70, 6, 2).attr({ fill: C.navy })
        ).attr({ filter: 'url(#au-sh)' });
        floatLoop(chaos, 0, -6, 3500, 0);

        // Center hub
        var gearGroup = s.g(
            s.circle(250, 145, 35).attr({ fill: 'url(#au-g1)' }),
            s.circle(250, 145, 15).attr({ fill: C.white }),
            s.rect(244, 100, 12, 14, 2).attr({ fill: C.white }),
            s.rect(244, 176, 12, 14, 2).attr({ fill: C.white }),
            s.rect(205, 139, 14, 12, 2).attr({ fill: C.white }),
            s.rect(281, 139, 14, 12, 2).attr({ fill: C.white })
        );
        var hub = s.g(
            s.rect(175, 95, 150, 130, 14).attr({ fill: C.white }),
            gearGroup,
            s.text(250, 205, 'BrandFlow').attr({ 'text-anchor': 'middle', 'font-family': 'Inter, sans-serif', 'font-size': 14, fill: C.navy, 'font-weight': 700 })
        ).attr({ filter: 'url(#au-sh)' });
        rotateLoop(gearGroup, 250, 145, 6000);
        floatLoop(hub, 0, -6, 4000, 200);

        // Right output cards
        var cGrowth = s.g(
            s.rect(370, 70, 90, 55, 10).attr({ fill: C.white }),
            s.circle(395, 90, 10).attr({ fill: 'url(#au-g1)' }),
            s.rect(415, 85, 35, 5, 2).attr({ fill: C.navy }),
            s.rect(415, 95, 25, 4, 2).attr({ fill: C.border }),
            s.text(395, 115, 'Growth').attr({ 'font-family': 'Inter, sans-serif', 'font-size': 9, fill: '#64748b', 'font-weight': 500 })
        ).attr({ filter: 'url(#au-sh)' });
        var cClarity = s.g(
            s.rect(380, 135, 90, 55, 10).attr({ fill: C.white }),
            s.rect(395, 150, 30, 20, 3).attr({ fill: C.orange, opacity: 0.2 }),
            pline(s, '400,165 408,155 415,160 425,150').attr({ stroke: C.orange, 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }),
            s.text(405, 180, 'Clarity').attr({ 'font-family': 'Inter, sans-serif', 'font-size': 9, fill: '#64748b', 'font-weight': 500 })
        ).attr({ filter: 'url(#au-sh)' });
        var cTime = s.g(
            s.rect(370, 200, 90, 55, 10).attr({ fill: C.white }),
            s.rect(395, 215, 8, 22, 2).attr({ fill: C.navy }),
            s.rect(408, 222, 8, 15, 2).attr({ fill: C.orange }),
            s.rect(421, 218, 8, 19, 2).attr({ fill: C.navy }),
            s.text(395, 248, 'Time Saved').attr({ 'font-family': 'Inter, sans-serif', 'font-size': 9, fill: '#64748b', 'font-weight': 500 })
        ).attr({ filter: 'url(#au-sh)' });

        floatLoop(cGrowth,  5, -8, 3500, 0);
        floatLoop(cClarity, 5, -8, 3500, 500);
        floatLoop(cTime,    5, -8, 3500, 1000);

        // Arrows
        s.path('M130 160 Q152 160 175 160').attr({ stroke: C.orange, 'stroke-width': 2, fill: 'none', 'marker-end': 'url(#au-arrow)' });
        var d1 = s.path('M325 130 Q347 110 370 97').attr({ stroke: C.orange, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '4,4', opacity: 0.6 });
        var d2 = s.path('M325 160 Q347 160 380 162').attr({ stroke: C.orange, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '4,4', opacity: 0.6 });
        var d3 = s.path('M325 190 Q347 210 370 225').attr({ stroke: C.orange, 'stroke-width': 2, fill: 'none', 'stroke-dasharray': '4,4', opacity: 0.6 });
        dashLoop(d1, 2000);
        dashLoop(d2, 2200);
        dashLoop(d3, 1800);

        [s.circle(152,160,4), s.circle(347,112,3), s.circle(352,161,3), s.circle(347,208,3)].forEach(function (d, i) {
            d.attr({ fill: C.orange });
            dotFloat(d, -3, 2500, i * 300);
        });
    }

    /* ════════════════════════════════════════════════════════════════════════
       AI ADVISOR HERO  400 × 320
    ════════════════════════════════════════════════════════════════════════ */
    function initAdvisor(s) {
        s.clear();
        defs(s, [
            '<linearGradient id="ad-g1" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.orange + '"/>',
            '<stop offset="100%" stop-color="' + C.orangeLight + '"/></linearGradient>',
            '<linearGradient id="ad-g2" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="#fff" stop-opacity="0.12"/>',
            '<stop offset="100%" stop-color="#fff" stop-opacity="0.04"/></linearGradient>',
            '<filter id="ad-sh"><feDropShadow dx="0" dy="4" stdDeviation="8"',
            'flood-color="#000" flood-opacity="0.2"/></filter>'
        ].join(''));

        s.g(
            s.circle(200, 155, 105).attr({ fill: 'url(#ad-g2)' }),
            s.circle(58, 52, 35).attr({ fill: 'url(#ad-g2)' }),
            s.circle(352, 268, 25).attr({ fill: 'rgba(249,115,22,0.08)' })
        );

        // Robot figure
        var robot = s.g(
            s.rect(167, 92, 66, 58, 14).attr({ fill: C.navy }),
            s.circle(187, 116, 9).attr({ fill: 'url(#ad-g1)' }),
            s.circle(213, 116, 9).attr({ fill: 'url(#ad-g1)' }),
            s.circle(187, 116, 4).attr({ fill: C.white }),
            s.circle(213, 116, 4).attr({ fill: C.white }),
            s.rect(181, 132, 38, 6, 3).attr({ fill: 'rgba(255,255,255,0.2)' }),
            s.line(200, 92, 200, 72).attr({ stroke: 'url(#ad-g1)', 'stroke-width': 2.5 }),
            s.circle(200, 67, 8).attr({ fill: 'url(#ad-g1)' }),
            s.rect(162, 150, 76, 72, 14).attr({ fill: C.navyDark }),
            s.rect(162, 150, 76, 72, 14).attr({ fill: 'none', stroke: 'url(#ad-g1)', 'stroke-width': 1.5 }),
            s.rect(172, 162, 56, 8, 4).attr({ fill: 'rgba(249,115,22,0.4)' }),
            s.rect(172, 177, 27, 6, 3).attr({ fill: 'rgba(255,255,255,0.2)' }),
            s.rect(205, 177, 27, 6, 3).attr({ fill: 'rgba(255,255,255,0.2)' }),
            s.rect(172, 190, 56, 6, 3).attr({ fill: 'rgba(255,255,255,0.15)' }),
            s.rect(172, 203, 40, 6, 3).attr({ fill: 'rgba(249,115,22,0.3)' }),
            s.rect(178, 222, 18, 25, 7).attr({ fill: C.navy }),
            s.rect(204, 222, 18, 25, 7).attr({ fill: C.navy })
        ).attr({ filter: 'url(#ad-sh)' });
        floatLoop(robot, 0, -8, 4000, 0);

        // Chat bubbles
        var bub1 = s.g(
            s.rect(25, 98, 116, 52, 12).attr({ fill: 'rgba(255,255,255,0.08)' }),
            poly(s, '25,142 25,156 38,142').attr({ fill: 'rgba(255,255,255,0.08)' }),
            s.rect(35, 110, 88, 7, 3).attr({ fill: 'rgba(255,255,255,0.4)' }),
            s.rect(35, 124, 68, 7, 3).attr({ fill: 'rgba(255,255,255,0.3)' })
        ).attr({ filter: 'url(#ad-sh)' });
        floatLoop(bub1, -5, -8, 3500, 0);

        var bub2 = s.g(
            s.rect(258, 96, 122, 64, 12).attr({ fill: C.navy }),
            poly(s, '380,140 380,154 367,140').attr({ fill: C.navy }),
            s.rect(268, 108, 92, 7, 3).attr({ fill: 'url(#ad-g1)', opacity: 0.85 }),
            s.rect(268, 122, 78, 6, 3).attr({ fill: 'rgba(255,255,255,0.35)' }),
            s.rect(268, 135, 58, 6, 3).attr({ fill: 'rgba(255,255,255,0.25)' })
        ).attr({ filter: 'url(#ad-sh)' });
        floatLoop(bub2, 5, -8, 3500, 500);

        // Insight card
        var card1 = s.g(
            s.rect(278, 198, 108, 72, 12).attr({ fill: 'rgba(255,255,255,0.07)' }),
            s.rect(287, 208, 58, 7, 3).attr({ fill: 'url(#ad-g1)', opacity: 0.9 }),
            s.rect(287, 222, 88, 5, 2).attr({ fill: 'rgba(255,255,255,0.3)' }),
            s.rect(287, 233, 72, 5, 2).attr({ fill: 'rgba(255,255,255,0.25)' }),
            s.rect(287, 244, 52, 5, 2).attr({ fill: 'rgba(255,255,255,0.2)' }),
            s.rect(287, 256, 15, 8, 2).attr({ fill: 'rgba(249,115,22,0.5)' }),
            s.rect(307, 251, 15, 13, 2).attr({ fill: 'rgba(249,115,22,0.7)' }),
            s.rect(327, 247, 15, 17, 2).attr({ fill: 'url(#ad-g1)' }),
            s.rect(347, 254, 15, 10, 2).attr({ fill: 'rgba(249,115,22,0.6)' })
        ).attr({ filter: 'url(#ad-sh)' });
        floatLoop(card1, -5, -8, 3500, 0);

        [[148,62,5,C.orange,0.7],[268,72,4,C.orange,0.6],[52,185,4,C.orange,0.5],[358,152,3,C.white,0.4],
         [238,52,4,C.orange,0.5],[38,232,4,C.orange,0.4],[362,88,3,C.white,0.3],[42,148,3,C.white,0.3]].forEach(function (d, i) {
            dotFloat(s.circle(d[0], d[1], d[2]).attr({ fill: d[3], opacity: d[4] }), -4, 3000, i * 400);
        });
    }

    /* ════════════════════════════════════════════════════════════════════════
       SERVICES HERO  400 × 320
    ════════════════════════════════════════════════════════════════════════ */
    function initServices(s) {
        s.clear();
        defs(s, [
            '<linearGradient id="sv-g1" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.orange + '"/>',
            '<stop offset="100%" stop-color="' + C.orangeLight + '"/></linearGradient>',
            '<linearGradient id="sv-g2" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="#fff" stop-opacity="0.15"/>',
            '<stop offset="100%" stop-color="#fff" stop-opacity="0.05"/></linearGradient>',
            '<filter id="sv-sh"><feDropShadow dx="0" dy="4" stdDeviation="6"',
            'flood-color="#000" flood-opacity="0.12"/></filter>'
        ].join(''));

        s.g(
            s.circle(50, 50, 35).attr({ fill: 'url(#sv-g2)' }),
            s.circle(370, 280, 25).attr({ fill: 'url(#sv-g2)' }),
            s.circle(380, 80, 15).attr({ fill: 'rgba(249,115,22,0.1)' })
        );

        // Central spinning gear
        var gear = s.g(
            s.circle(200, 160, 55).attr({ fill: C.white }),
            s.circle(200, 160, 42).attr({ fill: 'url(#sv-g1)' }),
            s.circle(200, 160, 18).attr({ fill: C.white }),
            s.rect(192, 95, 16, 20, 3).attr({ fill: C.white }),
            s.rect(192, 205, 16, 20, 3).attr({ fill: C.white }),
            s.rect(135, 152, 20, 16, 3).attr({ fill: C.white }),
            s.rect(245, 152, 20, 16, 3).attr({ fill: C.white }),
            s.rect(150, 110, 16, 18, 3).attr({ fill: C.white, transform: 'rotate(-45,158,119)' }),
            s.rect(234, 110, 16, 18, 3).attr({ fill: C.white, transform: 'rotate(45,242,119)' }),
            s.rect(150, 192, 16, 18, 3).attr({ fill: C.white, transform: 'rotate(45,158,201)' }),
            s.rect(234, 192, 16, 18, 3).attr({ fill: C.white, transform: 'rotate(-45,242,201)' })
        ).attr({ filter: 'url(#sv-sh)' });
        rotateLoop(gear, 200, 160, 8000);

        // Floating service cards
        var c1 = s.g(s.rect(40,100,70,70,12).attr({fill:C.white}), s.rect(55,115,40,6,2).attr({fill:C.navy}), s.rect(55,128,30,4,2).attr({fill:C.border}), s.rect(55,138,35,4,2).attr({fill:C.border}), s.circle(75,155,8).attr({fill:'url(#sv-g1)'})).attr({filter:'url(#sv-sh)'});
        var c2 = s.g(s.rect(290,80,70,70,12).attr({fill:C.white}), s.circle(325,105,12).attr({fill:C.navy}), s.rect(305,125,40,4,2).attr({fill:C.border}), s.rect(310,135,30,4,2).attr({fill:C.border})).attr({filter:'url(#sv-sh)'});
        var c3 = s.g(s.rect(60,220,65,60,10).attr({fill:C.white}), s.rect(75,232,35,20,3).attr({fill:C.orange,opacity:0.2}), pline(s,'80,250 88,242 95,248 105,235').attr({stroke:C.orange,'stroke-width':2,fill:'none','stroke-linecap':'round'})).attr({filter:'url(#sv-sh)'});
        var c4 = s.g(s.rect(280,200,65,60,10).attr({fill:C.white}), s.rect(295,215,8,30,2).attr({fill:C.navy}), s.rect(308,225,8,20,2).attr({fill:C.orange}), s.rect(321,220,8,25,2).attr({fill:C.navy})).attr({filter:'url(#sv-sh)'});

        floatLoop(c1, -5, -8, 3500, 0);
        floatLoop(c2,  5, -8, 3500, 500);
        floatLoop(c3, -5,  8, 3800, 1000);
        floatLoop(c4,  5,  8, 3800, 1500);

        dashLoop(s.path('M110 135 Q130 150 145 145').attr({stroke:C.orange,'stroke-width':2,fill:'none','stroke-dasharray':'4,4',opacity:0.4}), 2000);
        dashLoop(s.path('M255 145 Q270 130 290 115').attr({stroke:C.orange,'stroke-width':2,fill:'none','stroke-dasharray':'4,4',opacity:0.4}), 2500);

        [[130,140,4,C.orange,0.6],[270,180,4,C.orange,0.6],[150,200,3,C.white,0.4],[250,120,3,C.white,0.4]].forEach(function(d,i){
            dotFloat(s.circle(d[0],d[1],d[2]).attr({fill:d[3],opacity:d[4]}), -4, 3000, i*400);
        });
    }

    /* ════════════════════════════════════════════════════════════════════════
       WHY US HERO  400 × 320
    ════════════════════════════════════════════════════════════════════════ */
    function initWhyUs(s) {
        s.clear();
        defs(s, [
            '<linearGradient id="wy-g1" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="' + C.orange + '"/>',
            '<stop offset="100%" stop-color="' + C.orangeLight + '"/></linearGradient>',
            '<linearGradient id="wy-g2" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" stop-color="#fff" stop-opacity="0.2"/>',
            '<stop offset="100%" stop-color="#fff" stop-opacity="0.05"/></linearGradient>',
            '<filter id="wy-sh"><feDropShadow dx="0" dy="4" stdDeviation="8"',
            'flood-color="#000" flood-opacity="0.15"/></filter>'
        ].join(''));

        s.g(
            s.circle(350, 50, 40).attr({ fill: 'url(#wy-g2)' }),
            s.circle(50, 270, 30).attr({ fill: 'url(#wy-g2)' }),
            s.circle(380, 280, 20).attr({ fill: 'rgba(249,115,22,0.15)' })
        );

        // Shield
        var shield = s.g(
            s.path('M200 40 L280 70 L280 160 C280 210 245 250 200 280 C155 250 120 210 120 160 L120 70 Z').attr({ fill: C.white }),
            s.path('M200 55 L265 80 L265 155 C265 195 238 230 200 255 C162 230 135 195 135 155 L135 80 Z').attr({ fill: 'url(#wy-g1)' }),
            s.path('M170 155 L190 175 L235 125').attr({ stroke: C.white, 'stroke-width': 8, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' })
        ).attr({ filter: 'url(#wy-sh)' });
        floatLoop(shield, 0, -8, 4000, 0);

        // Animate checkmark stroke draw
        if (!reduced) {
            var check = shield.node.querySelectorAll('path')[2];
            var checkEl = Snap(check);
            checkEl.attr({ 'stroke-dasharray': '200', 'stroke-dashoffset': '200' });
            checkEl.animate({ 'stroke-dashoffset': '0' }, 1500, mina.easeout);
        }

        // Floating stats badges
        function mkBadge(cx, cy, r, line1, size1, col1, line2, size2) {
            return s.g(
                s.circle(cx, cy, r).attr({ fill: C.white }),
                s.text(cx, cy - 5, line1).attr({ 'text-anchor': 'middle', 'font-size': size1, 'font-weight': 700, fill: col1 }),
                s.text(cx, cy + 12, line2).attr({ 'text-anchor': 'middle', 'font-size': size2, fill: '#64748b' })
            ).attr({ filter: 'url(#wy-sh)' });
        }
        var b1 = mkBadge(80, 100, 35, '100%', 14, C.navy, 'Satisfaction', 9);
        var b2 = mkBadge(320, 130, 35, '50+', 14, C.navy, 'Projects', 9);
        var b3 = mkBadge(100, 220, 30, 'Fast', 11, C.orange, 'Delivery', 8);

        floatLoop(b1, -5, -8, 3500, 0);
        floatLoop(b2,  5, -8, 3500, 500);
        floatLoop(b3, -5,  8, 3800, 1000);

        // Star
        poly(s, '320,220 324,232 337,232 327,240 330,252 320,244 310,252 313,240 303,232 316,232').attr({ fill: C.orange });

        [s.circle(340,60,3).attr({fill:C.white,opacity:0.6}), s.circle(30,140,4).attr({fill:C.orange,opacity:0.4})].forEach(function(d,i){
            dotFloat(d, -4, 3000, i * 600);
        });
    }

    /* ── Boot ────────────────────────────────────────────────────────────── */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

}());
