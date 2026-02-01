# BrandFlow Website

A modern, responsive marketing website for BrandFlow - a web design agency that builds affordable websites for small businesses.

## Features

- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Clean, modern UI with green and navy color scheme
- ✅ Smooth scroll animations
- ✅ Interactive FAQ accordion
- ✅ Contact form with validation
- ✅ Mobile hamburger navigation
- ✅ Scroll-to-top button
- ✅ Sticky header on scroll
- ✅ No frameworks - pure HTML, CSS, and JavaScript

## File Structure

```
brandflow-website/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All styling
├── js/
│   └── main.js         # All JavaScript functionality
├── img/                # Image directory (add your images here)
│   └── hero.jpg        # Hero section image (placeholder)
└── README.md           # This file
```

## Setup Instructions

### 1. Add Images

The website requires a hero image. You can:

**Option A: Use a placeholder**
- Download a free stock photo from [Unsplash](https://unsplash.com) or [Pexels](https://pexels.com)
- Search for: "laptop website mockup" or "web design workspace"
- Save it as `hero.jpg` in the `img/` folder

**Option B: Use a placeholder service**
- The site will work without images, but the hero section will have a broken image
- You can temporarily use: https://via.placeholder.com/1200x800 as the src

### 2. Open in Browser

Simply open `index.html` in your web browser:
- Double-click `index.html`, or
- Right-click → Open with → Your preferred browser

### 3. Edit Content

All content can be edited directly in `index.html`:
- Company name: Search for "BrandFlow" and replace
- Pricing: Update the pricing section
- Contact info: Update footer links
- Colors: Modify CSS variables in `css/styles.css`

## Customization

### Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
    --color-white: #ffffff;
    --color-green: #10b981;     /* Primary accent color */
    --color-navy: #1e293b;      /* Secondary accent color */
    --color-text-dark: #0f172a;
    --color-text-light: #64748b;
}
```

### Fonts

The site uses Google Fonts (Inter & Poppins). To change fonts:
1. Go to [Google Fonts](https://fonts.google.com)
2. Select your fonts
3. Replace the `<link>` tag in the `<head>` of `index.html`
4. Update font-family in `css/styles.css`

### Sections

Add or remove sections by:
1. Editing the HTML in `index.html`
2. Updating navigation links
3. Adjusting CSS if needed

## Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Pages & Sections

1. **Header** - Sticky navigation with mobile menu
2. **Hero** - Main call-to-action section
3. **Features** - Why choose BrandFlow
4. **Services** - Service offerings
5. **Pricing** - Transparent pricing packages
6. **Industries** - Industries served
7. **FAQ** - Frequently asked questions
8. **Contact** - Lead capture form
9. **Footer** - Social links and copyright

## Deploy

### Option 1: Traditional Hosting (GoDaddy, etc.)
1. Upload all files to your hosting via FTP
2. Ensure file structure is maintained
3. Point your domain to the uploaded files

### Option 2: Free Hosting (Netlify, Vercel)
1. Create account on [Netlify](https://netlify.com)
2. Drag and drop the entire folder
3. Your site will be live in seconds

### Option 3: GitHub Pages
1. Create a GitHub repository
2. Upload files
3. Enable GitHub Pages in settings
4. Site will be live at `username.github.io/repo-name`

## Support

For questions or issues:
- Check the code comments in each file
- All functions are clearly labeled and documented
- CSS is organized by sections

## License

Free to use for personal and commercial projects.

---

Built with ❤️ by BrandFlow
