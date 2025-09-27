// ===== MODERN PORTFOLIO WEBSITE JAVASCRIPT =====

// Global variables
let currentPage = '';

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  try {
    console.log('Initializing page...');
    initializePage();
    setupGlobalEventListeners();
    setupScrollAnimations();
    setupHamburgerMenu();
    
    // Load homepage content if on the main page
    if (window.location.pathname === '/' || window.location.pathname.endsWith('/index.html')) {
      console.log('Loading homepage content...');
      loadHomepageContent();
    } else {
      console.log('This is an inner page');
    }
  } catch (error) {
    console.error('Error during page initialization:', error);
  }
});

// Ensure loading screen hides on window load
window.addEventListener('load', () => {
  setTimeout(hideLoadingScreen, 1000);
});

// Page initialization
function initializePage() {
  const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
  
  if (isHomePage) {
    console.log('Initializing home page...');
    // Show navigation immediately for non-Matrix version
    setTimeout(() => {
      const navigation = document.querySelector('.main-navigation');
      if (navigation) {
        navigation.classList.add('visible');
      }
    }, 500);
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
  if (window.location.pathname.includes('skills-experience')) {
    initializeSkillBars();
  }
  
  // Initialize FAQ accordions if contact page
  if (window.location.pathname.includes('contact')) {
    initializeFAQAccordions();
  }
}

// Set active navigation item
function setActiveNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-links a, .nav-menu a');
  
  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath || 
        (currentPath === '/' && linkPath === '/') ||
        (currentPath !== '/' && linkPath !== '/' && currentPath.includes(linkPath.replace('/', '')))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Hide loading screen
function hideLoadingScreen() {
  console.log('Hiding loading screen...');
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
      console.log('Loading screen hidden');
    }, 500);
  } else {
    console.log('Loading screen element not found');
  }
}

// Animate page elements on load
function animatePageElements() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  // Observe all content sections
  const sections = document.querySelectorAll('.content-section, .card, .service-card, .pricing-card');
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    
    setTimeout(() => {
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });
}

// Setup scroll animations
function setupScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  });

  // Observe elements with animation classes
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

// Initialize contact form
function initializeContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', handleFormSubmit);
  
  // Add real-time validation
  const inputs = form.querySelectorAll('input, textarea, select');
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
  const originalText = submitBtn.querySelector('.btn-text');
  const loadingText = submitBtn.querySelector('.btn-loading');
  
  submitBtn.disabled = true;
  originalText.style.display = 'none';
  loadingText.style.display = 'inline-flex';
  
  // Simulate form submission (replace with actual implementation)
  setTimeout(() => {
    showSuccessModal();
    e.target.reset();
    submitBtn.disabled = false;
    originalText.style.display = 'inline';
    loadingText.style.display = 'none';
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
    errorEl.style.display = 'none';
  }
  field.style.borderColor = '';
}

// Show field error
function showFieldError(field, message) {
  field.style.borderColor = 'var(--error-color)';
  
  const errorEl = field.parentNode.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

// Validate entire form
function validateForm(data) {
  let isValid = true;
  const form = document.getElementById('contact-form');
  
  // Clear previous errors
  form.querySelectorAll('.field-error').forEach(error => {
    error.style.display = 'none';
  });
  
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

// Initialize FAQ accordions
function initializeFAQAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      // Initially hide answers
      answer.style.display = 'none';
      
      question.addEventListener('click', () => {
        const isOpen = answer.style.display === 'block';
        
        // Close all other answers
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) {
              otherAnswer.style.display = 'none';
            }
          }
        });
        
        // Toggle current answer
        answer.style.display = isOpen ? 'none' : 'block';
        
        // Add smooth animation
        if (!isOpen) {
          answer.style.opacity = '0';
          answer.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            answer.style.transition = 'all 0.3s ease';
            answer.style.opacity = '1';
            answer.style.transform = 'translateY(0)';
          }, 10);
        }
      });
    }
  });
}

// Show success modal
function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }
}

// Close modal
function closeModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

// Show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--bg-secondary);
    border: 1px solid ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
    color: ${type === 'success' ? 'var(--success-color)' : 'var(--error-color)'};
    padding: var(--spacing-md) var(--spacing-lg);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    z-index: var(--z-tooltip);
    animation: slideInRight 0.3s ease;
    max-width: 300px;
    word-wrap: break-word;
    font-family: var(--font-primary);
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
  
  // Add click to dismiss
  notification.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease';
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
  
  // Navigation scroll effect
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.main-navigation');
    if (nav) {
      if (window.scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
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
    
    // Close modal with Escape
    if (e.key === 'Escape') {
      closeModal();
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
    
    @keyframes slideOutRight {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

// Setup hamburger menu
function setupHamburgerMenu() {
  console.log('Setting up hamburger menu...');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!navToggle || !navMenu) {
    console.log('Hamburger menu elements not found, skipping setup');
    return;
  }
  
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.classList.contains('open');
    
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  
  // Close menu when clicking a link
  navMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      closeMenu();
    }
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });
  
  // Close menu with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
  
  function openMenu() {
    navToggle.classList.add('open');
    navMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  
  function closeMenu() {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
}

// Load homepage content from external JSON
function loadHomepageContent() {
  console.log('Loading homepage content...');
  
  // Check if we're using file:// protocol
  if (location.protocol === 'file:') {
    console.log('File protocol detected, using fallback content');
    useFallbackContent();
    return;
  }
  
  fetch('assets/content.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Homepage content loaded:', data);
      injectContent(data);
      
      // Animate hero section after content loads
      setTimeout(() => {
        animateHeroSection();
      }, 500);
    })
    .catch(err => {
      console.error('Failed to load homepage content:', err);
      useFallbackContent();
    });
}

// Use fallback content for file:// protocol or fetch failures
function useFallbackContent() {
  const fallbackData = {
    nameDisplay: ['ABDURAKHMONBEK', 'FAYZULLAEV']
  };
  
  injectContent(fallbackData);
  
  // Animate hero section with fallback content
  setTimeout(() => {
    animateHeroSection();
  }, 500);
}

// Inject content into the page
function injectContent(data) {
  // Inject name display if it exists in hero
  const titleElement = document.querySelector('.hero-title');
  if (titleElement && Array.isArray(data.nameDisplay)) {
    titleElement.innerHTML = data.nameDisplay.map(line => 
      `<span class="title-line">${line}</span>`
    ).join('');
  }
}

// Animate hero section elements
function animateHeroSection() {
  try {
    console.log('Animating hero section...');
    
    // Animate name display
    const nameDisplay = document.querySelector('.name-display');
    if (nameDisplay) {
      nameDisplay.classList.add('visible');
    }
    
    // Animate title lines with staggered delay
    const titleLines = document.querySelectorAll('.title-line');
    titleLines.forEach((line, index) => {
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, 100 + (index * 150));
    });
    
    // Animate subtitle, description, and actions
    const subtitle = document.querySelector('.hero-subtitle');
    const description = document.querySelector('.hero-description');
    const actions = document.querySelector('.hero-actions');
    
    if (subtitle) {
      setTimeout(() => {
        subtitle.style.opacity = '1';
        subtitle.style.transform = 'translateY(0)';
      }, 400);
    }
    
    if (description) {
      setTimeout(() => {
        description.style.opacity = '1';
        description.style.transform = 'translateY(0)';
      }, 600);
    }
    
    if (actions) {
      setTimeout(() => {
        actions.style.opacity = '1';
        actions.style.transform = 'translateY(0)';
      }, 800);
    }
    
    // Mark animations as complete for performance
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      setTimeout(() => {
        heroContent.classList.add('loaded');
      }, 1200);
    }
    
    console.log('Hero section animation completed');
  } catch (error) {
    console.error('Error animating hero section:', error);
  }
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
  },
  
  // Smooth scroll to element
  scrollToElement: function(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Export utils for global use
window.portfolioUtils = utils;

// Cleanup function for page unload
window.addEventListener('beforeunload', () => {
  // Clean up any running animations
  console.log('Page unloading, cleaning up...');
});

