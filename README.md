<div align="center">

# Ho Services

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![FormSubmit](https://img.shields.io/badge/FormSubmit-Email_Integration-4CAF50)](https://formsubmit.co/)
[![Responsive](https://img.shields.io/badge/Design-Mobile--First-0ea5e9)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![SEO](https://img.shields.io/badge/SEO-Optimised-brightgreen)](https://schema.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Enquiry_Button-25D366?logo=whatsapp&logoColor=white)](https://wa.me/)
[![License](https://img.shields.io/badge/License-Proprietary-red)](#license)
[![Live Site](https://img.shields.io/badge/Live_Site-print.com.sg-e85d04)](https://print.com.sg/)

**Modern, production-ready printing store website for Ho Services — Singapore's trusted print partner for 30+ years. No frameworks, no dependencies, no build step — just clean HTML, CSS, and vanilla JavaScript.**

🌐 **Live site:** [https://print.com.sg/](https://print.com.sg/)

</div>

---

## Screenshot

> Open `index.html` directly in your browser — no server required.

---

## About

Ho Services is a Singapore-based printing store offering a comprehensive range of design, printing, photocopying, scanning, and binding services. This website is a **fully static, zero-dependency** front-end built to convert walk-in and online customers into quote requests — fast.

Every section is built for lead generation: a hero with dual CTAs, a 15-service grid, a filterable product gallery, an animated stats bar, a FAQ accordion, and a full quote enquiry form that POSTs directly to email via FormSubmit.co. A floating WhatsApp button appears on every page so customers can reach the store in one tap.

Built with **pure HTML, CSS, and vanilla JavaScript only** — no React, no Vue, no Webpack, no npm install. Drop the three files on any web host and it works.

---

## Key Features

### SEO-friendly structure
- Semantic HTML5 elements (`<section>`, `<nav>`, `<footer>`, `<article>`)
- Full `<meta>` tags — description, keywords, author, OpenGraph title/description/type
- Clean heading hierarchy (`h1` → `h2` → `h3`) on every section
- Descriptive `alt` attributes and `aria-label` on all interactive elements
- Smooth scroll behaviour and hash-based anchor navigation

### Lead generation on every section
- **Hero dual CTAs** — *Request a Quote* + *View Services* above the fold
- **Service cards** — each of the 15 services links directly to the quote form
- **Product gallery** — every product overlay includes a *Get Quote* button
- **Sticky navbar** — *Get a Quote* CTA visible at all scroll depths
- **Quote form** — nine fields including file upload, service dropdown, quantity, and preferred deadline
- **Floating WhatsApp button** — pre-filled message, one-tap enquiry, visible on all devices
- **WhatsApp in quote sidebar** — secondary contact channel alongside the form

### Quote form with FormSubmit integration
- Sends enquiries directly to `hello@print.com.sg` via [FormSubmit.co](https://formsubmit.co/) AJAX — no backend required
- `fetch()` POST with `Accept: application/json` — **no page reload**
- Loading spinner state while the request is in flight
- Inline field validation on blur — name, email, phone, service, message
- Success and error notification banners after submission
- File upload with drag-target highlight and filename confirmation

### Scroll animations and interactions
- **IntersectionObserver** reveal — elements fade and slide up as they enter the viewport
- **Animated statistics counter** — easeOut cubic animation counts up to 30+, 15+, 5 000+, 50 000+ on scroll
- **FAQ accordion** — accessible `aria-expanded` toggle, one open item at a time
- **Product filter** — four category buttons (Business Printing / Marketing Materials / Document Services / Large Format) filter the gallery without page reload
- **Sticky navbar** — transparent on hero, solid navy on scroll, with active-link highlighting per section
- **Mobile hamburger menu** — animated three-line to × transition, closes on link tap or outside click

### Design system
- **CSS custom properties** for every colour, shadow, radius, and transition — easy to re-theme in one block
- **Mobile-first responsive** — `min-width` breakpoints at 560 px, 600 px, 768 px, 900 px, 1200 px
- **Google Fonts** — Inter (body) + Poppins (headings), loaded with `preconnect` for performance
- **Colour palette** — navy `#0f1e3d`, navy-mid `#1e3a6e`, accent orange `#e85d04`, white, light grey
- **Pure SVG illustrations** — hero background, about section visual, all 15 service icons, all 9 product cards — no external image dependencies
- Hover animations on service cards (icon colour flip), product cards (overlay reveal), contact cards (translate), and all buttons

---

## Sections

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Hero** | Full-screen banner, headline, subheading, dual CTAs, live stats |
| 2 | **About** | 30-year history, brand values, visual split layout |
| 3 | **Services** | 15 service cards with SVG icons and direct quote links |
| 4 | **Products** | Filterable 9-item gallery with hover overlay and quote CTAs |
| 5 | **Why Us** | 6 benefit cards + animated statistics bar |
| 6 | **FAQ** | Accordion of 5 common customer questions |
| 7 | **Quote Form** | Full enquiry form with FormSubmit email delivery |
| 8 | **Contact** | Address, phone, email, hours, map placeholder, WhatsApp |
| 9 | **Footer** | 4-column layout, social icons, back-to-top button |

### Services included

Business Card Printing · Flyer / Brochure Printing · Sticker Printing · Letterhead Printing · Envelope Printing · Invoice Printing · ID Card Printing · Voucher Printing · Booklet Printing · Photocopying · Scanning · Binding · Artwork Design · Large Format Printing · Banner / Poster Printing

---

## Tech Stack

| Layer | Detail |
|-------|--------|
| **Markup** | HTML5 — semantic, accessible, SEO-structured |
| **Styles** | CSS3 — custom properties, flexbox, CSS Grid, `clamp()`, `aspect-ratio` |
| **Scripts** | Vanilla ES6+ JavaScript — `IntersectionObserver`, `fetch()`, `FormData`, `requestAnimationFrame` |
| **Fonts** | Google Fonts — Inter 300–800 · Poppins 600–800 |
| **Form backend** | [FormSubmit.co](https://formsubmit.co/) — zero-backend AJAX email delivery |
| **Icons / Art** | Inline SVG only — no icon font, no CDN dependency |
| **Build** | None — open `index.html` directly |
| **Deploy** | Any static host — GitHub Pages, Netlify, Cloudflare Pages, shared hosting |

---

## Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    index.html (browser)                    │
│   Navbar · Hero · About · Services · Products · Why Us     │
│   FAQ · Quote Form · Contact · Footer · WhatsApp Float     │
└──────────────┬─────────────────────┬───────────────────────┘
               │                     │
┌──────────────▼──────┐   ┌──────────▼──────────────────────┐
│     style.css       │   │          script.js              │
│  CSS custom props   │   │  Navbar scroll + active link    │
│  Mobile-first grid  │   │  Hamburger toggle               │
│  Scroll animations  │   │  IntersectionObserver reveal    │
│  Component styles   │   │  Animated stats counter         │
│  Responsive layout  │   │  FAQ accordion                  │
└─────────────────────┘   │  Product filter                 │
                          │  File upload label              │
                          │  Form validation + fetch()      │
                          │  Smooth scroll + back-to-top    │
                          └─────────────┬───────────────────┘
                                        │
                          ┌─────────────▼───────────────────┐
                          │      FormSubmit.co API          │
                          │  POST /ajax/hello@print.com.sg  │
                          │  Delivers email, no backend     │
                          └─────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- Any modern web browser (Chrome, Firefox, Safari, Edge)
- A text editor to customise content (VS Code recommended)
- A FormSubmit.co-activated email address for live form delivery

### Open locally

```bash
git clone https://github.com/hojianfeng/hoservices.git
cd hoservices

# Open directly — no npm install, no build step
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Customise

1. **Contact details** — search for placeholder values in `index.html`:
   - `+65 0000 0000` → real phone number
   - `hello@print.com.sg` → real email address
   - `123 Print Street, Singapore 000000` → real address
   - `Mon – Fri: 9:00am – 6:00pm` → actual opening hours
   - `https://wa.me/6500000000` → real WhatsApp number (appears in 3 places)

2. **Form email** — in `script.js`, update the `FORM_ENDPOINT` constant:
   ```js
   const FORM_ENDPOINT = 'https://formsubmit.co/ajax/YOUR_EMAIL_HERE';
   ```
   Then visit your email inbox and click the FormSubmit activation link on first submission.

3. **Theme colours** — all colours are CSS custom properties at the top of `style.css`:
   ```css
   :root {
     --navy:   #0f1e3d;
     --accent: #e85d04;
     /* ... */
   }
   ```

4. **Google Maps** — replace the SVG map placeholder in the Contact section with a real embed:
   ```html
   <iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>
   ```

---

## File Structure

```
hoservices/
├── index.html      Main HTML — all sections, SVG illustrations, semantic markup
├── style.css       All styles — CSS variables, mobile-first layout, animations
├── script.js       All interactivity — navbar, form, filter, counter, FAQ
└── README.md       This file
```

---

## Deployment

### GitHub Pages (free, instant)

1. Push this repo to GitHub (already done if you're reading this).
2. Go to **Settings → Pages → Source → main branch → / (root)**.
3. GitHub serves `index.html` at `https://hojianfeng.github.io/hoservices/`.

### Netlify (drag and drop)

1. Drag the project folder onto [app.netlify.com](https://app.netlify.com/).
2. Done — Netlify auto-detects the static site and assigns a URL.
3. Add a custom domain under **Site settings → Domain management**.

### Cloudflare Pages

```bash
# Connect repo in the Cloudflare Pages dashboard
# Build command: (none)
# Build output directory: /
```

### Traditional shared hosting

Upload `index.html`, `style.css`, and `script.js` to the `public_html` (or `www`) folder via FTP/SFTP.

---

## License

Proprietary / All Rights Reserved — © 2024 Ho Services.
