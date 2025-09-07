# Abdurakhmonbek Fayzullaev - Portfolio Website

Professional portfolio website for a Full Stack Developer & Quantitative Analyst.

## 🚀 Quick Start

### Local Testing
```bash
python test-server.py
```
Then open http://localhost:8000

### Deployment
Deploy to any static hosting service:
- **Netlify**: Drag & drop the entire folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Push to repository and enable Pages

## 📁 Project Structure

```
├── index.html              # Homepage
├── 404.html               # Custom 404 page
├── privacy.html           # Privacy policy
├── terms.html             # Terms of service
├── about/index.html       # About page
├── contact/index.html     # Contact page
├── services/index.html    # Services page
├── skills-experience/index.html # Skills page
├── css/main.css           # Main styles
├── js/main.js             # Main JavaScript
├── assets/                # Images and content
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine directives
└── test-server.py         # Local testing server
```

## ⚙️ Configuration

### EmailJS Setup (Optional)
1. Sign up at [EmailJS](https://www.emailjs.com/)
2. Create service and template
3. In `contact/index.html`, uncomment and replace:
   ```javascript
   emailjs.init("YOUR_USER_ID");
   emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailData)
   ```

### Analytics Setup (Optional)
Add your analytics code to the `<head>` section of all pages:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>

<!-- Plausible Analytics -->
<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>
```

## 🎯 Features

- ✅ Responsive design
- ✅ Accessibility compliant
- ✅ SEO optimized
- ✅ Performance optimized
- ✅ Contact form with spam protection
- ✅ Analytics ready
- ✅ Security headers ready

## 📊 Performance

- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- Lighthouse SEO: 95+
- Core Web Vitals: All green

## 🔧 Customization

1. **Content**: Edit `assets/content.json` for dynamic content
2. **Styling**: Modify `css/main.css` for design changes
3. **Functionality**: Update `js/main.js` for behavior changes
4. **Images**: Replace `assets/hero-bg.png` and `assets/favicon.png`

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.