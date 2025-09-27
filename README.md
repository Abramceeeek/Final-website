# Abdurakhmonbek Fayzullaev - Professional Portfolio Website

A modern, professional portfolio website showcasing expertise in actuarial science and quantitative finance. Built with clean URLs, smooth animations, and responsive design.

## 🌟 Features

- **Clean URL Structure**: Modern routing without .html extensions
- **Responsive Design**: Mobile-first approach with professional aesthetics
- **Smooth Animations**: CSS animations and JavaScript interactions
- **SEO Optimized**: Meta tags, structured data, and sitemap
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Contact Form**: Working contact form with EmailJS integration
- **Performance**: Optimized loading and Core Web Vitals
- **CV Aligned**: All content matches your LaTeX CV exactly
- **Current Experience**: Updated with Apple Inc. Specialist role
- **Comprehensive Skills**: Full range of actuarial, financial, and quantitative skills

## 🚀 Live Demo

Visit: [https://abdurakhmonbek.com](https://abdurakhmonbek.com)

## 📁 Project Structure

```
/
├── index.html                 # Homepage
├── about/                     # About page
│   └── index.html
├── skills-experience/         # Skills & Experience page
│   └── index.html
├── services/                  # Services page
│   └── index.html
├── contact/                   # Contact page
│   └── index.html
├── assets/                    # Static assets
│   ├── content.json          # Dynamic content
│   ├── favicon.png           # Site favicon
│   └── Curriculum vitae.pdf  # Resume
├── css/                       # Stylesheets
│   ├── main.css              # Main styles
│   └── matrix.css            # Matrix background
├── js/                        # JavaScript
│   ├── main.js               # Main functionality
│   └── matrix.js             # Matrix rain effect
├── robots.txt                 # Search engine directives
├── sitemap.xml               # XML sitemap
└── README.md                 # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern CSS with custom properties and animations
- **JavaScript (ES6+)**: Vanilla JS with modern features
- **EmailJS**: Contact form functionality
- **Responsive Design**: Mobile-first approach
- **Performance**: Optimized assets and loading

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🚀 Getting Started

### Prerequisites

- Modern web browser
- Local web server (for development)
- EmailJS account (for contact form)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abdurakhmonbek/portfolio-website.git
   cd portfolio-website
   ```

2. **Set up EmailJS** (for contact form)
   - Sign up at [EmailJS](https://www.emailjs.com/)
   - Get your User ID, Service ID, and Template ID
   - Update the contact form in `contact/index.html`

3. **Start local server**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

4. **Open in browser**
   Navigate to `http://localhost:8000`

## ⚙️ Configuration

### Contact Form Setup

1. **EmailJS Configuration**
   ```javascript
   // In contact/index.html, update these values:
   emailjs.init("YOUR_USER_ID");
   emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailData);
   ```

2. **Custom Email Template**
   Create an email template in EmailJS with variables:
   - `{{name}}` - Sender's name
   - `{{email}}` - Sender's email
   - `{{subject}}` - Message subject
   - `{{message}}` - Message content
   - `{{service}}` - Service type
   - `{{budget}}` - Budget range

### Content Updates

1. **Homepage Content**: Edit `assets/content.json`
2. **Page Content**: Edit individual HTML files
3. **Styling**: Modify `css/main.css`
4. **Functionality**: Update `js/main.js`

## 🎨 Customization

### Colors
Update CSS custom properties in `css/main.css`:
```css
:root {
  --primary-color: #00ff88;
  --secondary-color: #6366f1;
  --accent-color: #f59e0b;
  /* ... more colors */
}
```

### Fonts
The website uses Inter and Poppins fonts. To change:
1. Update font imports in CSS
2. Modify `--font-primary` and `--font-display` variables

### Animations
Customize animations in `css/main.css`:
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## 📊 Performance Optimization

- **Image Optimization**: Use WebP format with fallbacks
- **CSS Minification**: Minify CSS for production
- **JavaScript Bundling**: Consider bundling for production
- **Caching**: Implement proper cache headers
- **CDN**: Use CDN for static assets

## 🔍 SEO Features

- **Meta Tags**: Comprehensive meta information
- **Structured Data**: JSON-LD schema markup
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Search engine directives
- **Semantic HTML**: Proper heading hierarchy
- **Alt Text**: Image descriptions for accessibility

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and semantic markup
- **Color Contrast**: WCAG AA compliant colors
- **Skip Links**: Navigation shortcuts
- **Focus Indicators**: Clear focus states

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

- **Website**: [https://abdurakhmonbek.com](https://abdurakhmonbek.com)
- **Email**: contact@abdurakhmonbek.com
- **LinkedIn**: [Abdurakhmonbek Fayzullaev](https://linkedin.com/in/abdurakhmonbek)
- **GitHub**: [@abdurakhmonbek](https://github.com/abdurakhmonbek)

## 🙏 Acknowledgments

- Matrix rain effect inspiration
- Modern CSS techniques and best practices
- Accessibility guidelines and standards
- Performance optimization strategies

---

**Built with ❤️ by Abdurakhmonbek Fayzullaev**
