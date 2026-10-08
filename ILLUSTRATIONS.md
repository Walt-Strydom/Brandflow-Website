# BrandFlow illustrations

The illustrations preserve BrandFlow's existing navy, orange and white palette and original logo assets. They are SVG scenes with dimensional geometry, shaded faces and CSS motion, not WebGL models. No new runtime dependencies are required.

- `scripts/build-illustrations.cjs` generates the 14 inline page-hero scenes. Run it from any directory with Node. Edit scene geometry and page mappings here, then rebuild.
- `index.html` contains the interactive homepage illustration; `automation-advisor.html` also contains the loading indicator.
- `css/illustrations.css` controls float, signal and depth effects, responsive layout and reduced-motion styling.
- `js/illustrations.js` manages play/pause, the locally saved preference, subtle pointer tilt, and offscreen/background suspension. When the operating system requests reduced motion, it disables animation and displays a Reduced motion indicator. SVGs remain visible without JavaScript.

Run `node scripts/test-illustration-motion.cjs` to check the motion-control lifecycle. Also review the pages visually at desktop/mobile widths after geometry changes. SVG title/description IDs must remain unique within each document.
