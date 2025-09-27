// Enhanced Matrix Rain with performance optimizations
class MatrixRain {
    constructor() {
      this.canvas = document.getElementById('matrix-canvas');
      if (!this.canvas) return; // Exit if canvas not found (for other pages)
      
      this.ctx = this.canvas.getContext('2d');
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
      this.fontSize = Math.max(16, Math.min(24, window.innerWidth / 80));
      this.columns = Math.floor(this.width / this.fontSize);
      this.drops = Array(this.columns).fill(1);
      this.characters = 'アカサタナハマヤラワガザダバパイキシチニヒミリウクスツヌフムユルエケセテネヘメレオコソトノホモヨロヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      this.frame = 0;
      this.phase = 'loading';
      this.nameStart = false;
      this.paused = false;
      
      // Performance optimization
      this.lastTime = 0;
      this.fps = 60;
      this.interval = 1000 / this.fps;
      
      this.init();
    }
  
    init() {
      this.animate();
      this.startPhases();
      this.setupEventListeners();
    }
  
    drawMatrixRain(speed = 1, intensity = 0.06) {
      if (this.paused) return;
      
      // Performance: Use requestAnimationFrame throttling
      const now = Date.now();
      if (now - this.lastTime < this.interval) return;
      this.lastTime = now;
  
      this.ctx.fillStyle = `rgba(0, 0, 0, ${intensity})`;
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      this.ctx.fillStyle = '#0F0';
      this.ctx.font = this.fontSize + "px Courier New";
      
      for (let i = 0; i < this.drops.length; i++) {
        const text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        const x = i * this.fontSize;
        const y = this.drops[i] * this.fontSize;
        
        // Add glow effect occasionally
        if (Math.random() > 0.95) {
          this.ctx.fillStyle = '#fff';
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = '#00ff00';
        } else {
          this.ctx.fillStyle = '#0F0';
          this.ctx.shadowBlur = 0;
        }
        
        this.ctx.fillText(text, x, y);
        
        if (this.drops[i] * this.fontSize > this.height && Math.random() > 0.975) {
          this.drops[i] = 0;
        }
        this.drops[i] += speed;
      }
    }
  
    animate() {
      if (!this.canvas) return; // Safety check
      
      this.frame++;
      
      switch (this.phase) {
        case 'rain':
          this.drawMatrixRain();
          break;
        case 'name':
          this.drawMatrixRain(0.5, 0.04);
          if (!this.nameStart) {
            const nameDisplay = document.getElementById('name-display');
            if (nameDisplay) {
              nameDisplay.classList.add('visible');
              this.nameStart = true;
            }
          }
          break;
        case 'nav':
          this.drawMatrixRain(0.3, 0.03);
          break;
      }
      
      requestAnimationFrame(() => this.animate());
    }
  
    startPhases() {
      // Loading phase
      setTimeout(() => {
        const loading = document.getElementById('loading-screen');
        if (loading) {
          loading.style.display = 'none';
        }
        this.phase = 'rain';
      }, 2000);
      
      // Name reveal phase
      setTimeout(() => {
        this.phase = 'name';
      }, 5000);
      
      // Glitch effect on name
      setTimeout(() => {
        const nameDisplay = document.getElementById('name-display');
        if (nameDisplay) {
          nameDisplay.classList.add('glitch');
          setTimeout(() => {
            nameDisplay.classList.remove('glitch');
          }, 500);
        }
      }, 8000);
      
      // Navigation phase
      setTimeout(() => {
        const nameDisplay = document.getElementById('name-display');
        if (nameDisplay) {
          nameDisplay.classList.remove('visible');
        }
        this.phase = 'nav';
      }, 15000);
      
      setTimeout(() => {
        const navigation = document.getElementById('main-navigation');
        if (navigation) {
          navigation.classList.add('visible');
        }
      }, 17000);
    }
  
    setupEventListeners() {
      // Resize handler with debouncing
      let resizeTimeout;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (!this.canvas) return;
          this.width = this.canvas.width = window.innerWidth;
          this.height = this.canvas.height = window.innerHeight;
          this.fontSize = Math.max(16, Math.min(24, window.innerWidth / 80));
          this.columns = Math.floor(this.width / this.fontSize);
          this.drops = Array(this.columns).fill(1);
        }, 250);
      });
  
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          // Quick access to skip animations
          if (this.phase === 'loading') {
            const loading = document.getElementById('loading-screen');
            const navigation = document.getElementById('main-navigation');
            if (loading) loading.style.display = 'none';
            this.phase = 'nav';
            if (navigation) navigation.classList.add('visible');
          }
        }
      });
    }
  
    // Method to pause/resume animation for performance
    pause() {
      this.paused = true;
    }
  
    resume() {
      this.paused = false;
    }
  
    // Clean up method
    destroy() {
      this.paused = true;
      if (this.canvas) {
        this.ctx.clearRect(0, 0, this.width, this.height);
      }
    }
  }
  
  // Export for use in other files
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MatrixRain;
  } else {
    window.MatrixRain = MatrixRain;
  }