// Main JavaScript functionality for the portfolio website

// Global variables
let matrixRain;
let isMatrixPage = false;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  initializePage();
  setupGlobalEventListeners();
  addAnimationDelays();
  // Load homepage content if on the main page
  if (document.getElementById('main-canvas')) {
    loadHomepageContent();
  }
  setupHamburgerMenu();
});

// Page initialization
function initializePage() {
  // Check if we're on the matrix home page
  isMatrixPage = document.getElementById('main-canvas') !== null;
  
  if (isMatrixPage) {
    // Initialize Matrix rain effect
    window.addEventListener('load', () => {
      matrixRain = new MatrixRain();
    });
    
    // Visibility API for performance
    document.addEventListener('visibilitychange', () => {
      if (matrixRain) {
        if (document.hidden) {
          matrixRain.pause();
        } else {
          matrixRain.resume();
        }
      }
    });
  } else {
    // Initialize other pages
    initializeInnerPage();
  }
}

// Initialize inner pages (non-matrix pages)
function initializeInnerPage() {
  // Add active class to current navigation item
  setActiveNavigation();
  
  // Initialize page-specific animations
  animatePageElements();
  
  // Initialize form handling if contact page
  if (window.location.pathname.includes('contact')) {
    initializeContactForm();
  }
  
  // Initialize skill bars if skills page
  if (window.location.pathname.includes('skills')) {
    initializeSkillBars();
  }
  
  // Initialize project filters if projects page
  if (window.location.pathname.includes('projects')) {
    //initializeProjectFilters();
  }
}

// Set active navigation item
function setActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .nav-menu a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}


// Animate page elements on load
function animatePageElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all content sections
  const sections = document.querySelectorAll('.content-section, .card');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}

// Add staggered animation delays
function addAnimationDelays() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
}

// Initialize contact form
function initializeContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', handleFormSubmit);
  
  // Add real-time validation
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
  });
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  // Validate form
  if (!validateForm(data)) {
    return;
  }
  
  // Show loading state
  const submitBtn = e.target.querySelector('.btn-submit');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'SENDING...';
  submitBtn.disabled = true;
  
  // Simulate form submission (replace with actual implementation)
  setTimeout(() => {
    showNotification('Message sent successfully!', 'success');
    e.target.reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

// Validate individual field
function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  
  clearFieldError(field);
  
  if (field.hasAttribute('required') && !value) {
    showFieldError(field, 'This field is required');
    return false;
  }
  
  if (field.type === 'email' && value && !isValidEmail(value)) {
    showFieldError(field, 'Please enter a valid email address');
    return false;
  }
  
  return true;
}

// Clear field error
function clearFieldError(field) {
  const errorEl = field.parentNode.querySelector('.field-error');
  if (errorEl) {
    errorEl.remove();
  }
  field.style.borderColor = '';
}

// Show field error
function showFieldError(field, message) {
  field.style.borderColor = '#ff4444';
  
  const errorEl = document.createElement('div');
  errorEl.className = 'field-error';
  errorEl.textContent = message;
  errorEl.style.color = '#ff4444';
  errorEl.style.fontSize = '0.9rem';
  errorEl.style.marginTop = '0.25rem';
  
  field.parentNode.appendChild(errorEl);
}

// Validate entire form
function validateForm(data) {
  let isValid = true;
  const form = document.getElementById('contact-form');
  
  // Clear previous errors
  form.querySelectorAll('.field-error').forEach(error => error.remove());
  
  // Validate required fields
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!validateField({ target: field })) {
      isValid = false;
    }
  });
  
  return isValid;
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Initialize skill bars
function initializeSkillBars() {
  const skillBars = document.querySelectorAll('.progress-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const percentage = progressBar.dataset.percentage || '0';
        
        setTimeout(() => {
          progressBar.style.width = percentage + '%';
        }, 300);
        
        observer.unobserve(progressBar);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

// Initialize project filters
/*function initializeProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projects = document.querySelectorAll('.project-card');
  
  if (!filterButtons.length) return;
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      
      // Update active button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Filter projects
      projects.forEach(project => {
        const categories = project.dataset.categories?.split(',') || [];
        
        if (filter === 'all' || categories.includes(filter)) {
          project.style.display = 'block';
          project.style.opacity = '1';
          project.style.transform = 'translateY(0)';
        } else {
          project.style.opacity = '0';
          project.style.transform = 'translateY(20px)';
          setTimeout(() => {
            if (project.style.opacity === '0') {
              project.style.display = 'none';
            }
          }, 300);
        }
      });
    });
  });
}
*/

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0, 20, 0, 0.95);
    border: 1px solid ${type === 'success' ? '#00ff00' : '#ff4444'};
    color: ${type === 'success' ? '#00ff00' : '#ff4444'};
    padding: 1rem 1.5rem;
    border-radius: 5px;
    box-shadow: 0 0 20px ${type === 'success' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 68, 68, 0.3)'};
    z-index: 1000;
    animation: slideIn 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  // Add click to dismiss
  notification.addEventListener('click', () => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
}

// Global event listeners
function setupGlobalEventListeners() {
  // Smooth scrolling for anchor links
  document.addEventListener('click', (e) => {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault();
      const target = document.querySelector(e.target.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
  
  // Keyboard navigation improvements
  document.addEventListener('keydown', (e) => {
    // Skip to main content with Alt+M
    if (e.altKey && e.key === 'm') {
      const mainContent = document.querySelector('main, .page-content');
      if (mainContent) {
        mainContent.focus();
      }
    }
    
    // Skip animations with Alt+S
    if (e.altKey && e.key === 's') {
      document.body.classList.add('no-animations');
    }
  });
  
  // Add no-animations class for performance
  const style = document.createElement('style');
  style.textContent = `
    .no-animations *,
    .no-animations *::before,
    .no-animations *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Utility functions
const utils = {
  // Debounce function
  debounce: function(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  // Throttle function
  throttle: function(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Check if element is in viewport
  isInViewport: function(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};

// Export utils for global use
window.portfolioUtils = utils;

// Cleanup function for page unload
window.addEventListener('beforeunload', () => {
  if (matrixRain) {
    matrixRain.destroy();
  }
});

// Load homepage content from external JSON and inject into DOM
function loadHomepageContent() {
  fetch('assets/content.json')
    .then(response => response.json())
    .then(data => {
      // Inject loading message
      const loadingEl = document.getElementById('loading');
      if (loadingEl && data.loadingMessage) {
        loadingEl.innerHTML = data.loadingMessage;
      }
      // Inject name display
      const nameDisplayEl = document.getElementById('name-display');
      if (nameDisplayEl && Array.isArray(data.nameDisplay)) {
        nameDisplayEl.innerHTML = data.nameDisplay.map(line => `<div class="name-line">${line}</div>`).join('');
      }
    })
    .catch(err => {
      // Optionally handle error
      console.error('Failed to load homepage content:', err);
    });
}

function setupHamburgerMenu() {
  const navContainer = document.querySelector('.nav-container');
  if (!navContainer) return;
  // Create hamburger button if not present
  let hamburger = document.querySelector('.hamburger');
  if (!hamburger) {
    hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Open navigation menu');
    hamburger.setAttribute('aria-controls', 'main-nav-menu');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    navContainer.insertBefore(hamburger, navContainer.firstChild);
  }
  const navLinks = navContainer.querySelector('.nav-links');
  if (navLinks) {
    navLinks.id = 'main-nav-menu';
  }
  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  hamburger.onclick = function(e) {
    e.stopPropagation();
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  };
  // Close menu when clicking a link or outside
  navLinks.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
      closeMenu();
    }
  });
  document.addEventListener('click', function(e) {
    if (navLinks.classList.contains('open') && !navContainer.contains(e.target)) {
      closeMenu();
    }
  });
  // Keyboard accessibility
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });
}