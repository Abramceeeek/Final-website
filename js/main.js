// Global variables
let matrixRain;
let isMatrixPage = false;
let currentPage = '';

document.addEventListener('DOMContentLoaded', function() {
  try {
    initializePage();
    setupGlobalEventListeners();
    setupScrollAnimations();
    setupHamburgerMenu();
    
    if (document.getElementById('name-display')) {
      loadHomepageContent();
    }
    
    // Initialize floating elements after other critical features
    setTimeout(initFloatingElements, 100);
  } catch (error) {
    console.error('Error during page initialization:', error);
  }
});

function initializePage() {
  isMatrixPage = document.getElementById('name-display') !== null;
  
  if (isMatrixPage) {
    setTimeout(() => {
      hideLoadingScreen();
    }, 2000);
  } else {
    initializeInnerPage();
  }
}

function initializeInnerPage() {
  setActiveNavigation();
  animatePageElements();
  
  if (window.location.pathname.includes('contact')) {
    initializeContactForm();
    initializeFAQAccordions();
  }
  
  if (window.location.pathname.includes('skills-experience')) {
    initializeSkillBars();
  }
}

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

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }
}

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

  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
  animatedElements.forEach(element => {
    observer.observe(element);
  });
}

function initializeContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', handleFormSubmit);
  
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  if (!validateForm(data)) {
    return;
  }
  const submitBtn = e.target.querySelector('.btn-submit');
  const originalText = submitBtn.querySelector('.btn-text');
  const loadingText = submitBtn.querySelector('.btn-loading');
  
  submitBtn.disabled = true;
  originalText.style.display = 'none';
  loadingText.style.display = 'inline-flex';
  
  setTimeout(() => {
    showSuccessModal();
    e.target.reset();
    submitBtn.disabled = false;
    originalText.style.display = 'inline';
    loadingText.style.display = 'none';
  }, 2000);
}

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

function clearFieldError(field) {
  const errorEl = field.parentNode.querySelector('.field-error');
  if (errorEl) {
    errorEl.style.display = 'none';
  }
  field.style.borderColor = '';
}

function showFieldError(field, message) {
  field.style.borderColor = 'var(--error-color)';
  
  const errorEl = field.parentNode.querySelector('.field-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

function validateForm(data) {
  let isValid = true;
  const form = document.getElementById('contact-form');
  
  form.querySelectorAll('.field-error').forEach(error => {
    error.style.display = 'none';
  });
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    if (!validateField({ target: field })) {
      isValid = false;
    }
  });
  
  return isValid;
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function initializeSkillBars() {
  const skillBars = document.querySelectorAll('.progress-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const percentage = progressBar.dataset.percentage || progressBar.getAttribute('data-percentage') || '0';
        
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

function initializeFAQAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    if (question && answer) {
      answer.style.display = 'none';
      
      question.addEventListener('click', () => {
        const isOpen = answer.style.display === 'block';
        
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            const otherAnswer = otherItem.querySelector('.faq-answer');
            if (otherAnswer) {
              otherAnswer.style.display = 'none';
            }
          }
        });
        
        answer.style.display = isOpen ? 'none' : 'block';
        
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

function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.style.display = 'flex';
    setTimeout(() => {
      modal.style.opacity = '1';
    }, 10);
  }
}

function closeModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 300);
  }
}

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
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
  notification.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  });
}

function setupGlobalEventListeners() {
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
  
  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 'm') {
      const mainContent = document.querySelector('main, .page-content');
      if (mainContent) {
        mainContent.focus();
      }
    }
    
    if (e.altKey && e.key === 's') {
      document.body.classList.add('no-animations');
    }
    
    if (e.key === 'Escape') {
      closeModal();
    }
  });
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

function setupHamburgerMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (!navToggle || !navMenu) {
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
  
  navMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      closeMenu();
    }
  });
  
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });
  
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

function loadHomepageContent() {
  // Hero content is already embedded in HTML, no need to fetch
  // This function is kept for compatibility but does nothing
  console.log('Homepage content loaded from HTML');
}

const utils = {
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
  
  isInViewport: function(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  },
  
  scrollToElement: function(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

window.portfolioUtils = utils;

window.addEventListener('beforeunload', () => {
  if (matrixRain) {
    matrixRain.destroy();
  }
});

function initFloatingElements() {
  const floatingElements = document.querySelectorAll('.floating-element');
  
  // Check if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  floatingElements.forEach(element => {
    const speed = parseFloat(element.dataset.speed) || 1;
    let position = Math.random() * 100;
    let animationId;
    
    function animate() {
      position += speed * 0.05; // Reduced speed for better performance
      if (position > 100) position = 0;
      
      element.style.transform = `translateY(${Math.sin(position * 0.1) * 15}px) rotate(${position * 0.3}deg)`;
      animationId = requestAnimationFrame(animate);
    }
    
    // Only animate if element is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate();
        } else {
          cancelAnimationFrame(animationId);
        }
      });
    });
    
    observer.observe(element);
  });
}

// Remove duplicate floating element initialization