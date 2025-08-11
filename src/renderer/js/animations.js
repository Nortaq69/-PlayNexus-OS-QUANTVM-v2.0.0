// ===== QUANTUM ANIMATIONS MANAGER =====

class QuantumAnimations {
  constructor() {
    this.particles = [];
    this.ripples = [];
    this.scanlines = [];
    this.isInitialized = false;
    
    this.initialize();
  }

  initialize() {
    console.log('✨ Initializing Quantum Animations...');
    
    this.initializeParticleSystem();
    this.initializeRippleSystem();
    this.initializeScanlineSystem();
    this.initializeMouseEffects();
    this.initializeThemeAnimations();
    
    this.isInitialized = true;
    console.log('✨ Quantum Animations Initialized');
  }

  // ===== PARTICLE SYSTEM =====
  initializeParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    this.createParticles(100);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      this.updateParticles();
      this.drawParticles(ctx);
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  createParticles(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomParticleColor(),
        life: Math.random() * 100 + 50,
        maxLife: Math.random() * 100 + 50
      });
    }
  }

  getRandomParticleColor() {
    const colors = [
      'rgba(255, 0, 255, 0.8)',   // Magenta
      'rgba(0, 255, 255, 0.8)',   // Cyan
      'rgba(255, 255, 0, 0.8)',   // Yellow
      'rgba(255, 0, 128, 0.8)',   // Pink
      'rgba(0, 255, 128, 0.8)'    // Green
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  updateParticles() {
    this.particles.forEach(particle => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Update life
      particle.life--;
      
      // Wrap around edges
      if (particle.x < 0) particle.x = window.innerWidth;
      if (particle.x > window.innerWidth) particle.x = 0;
      if (particle.y < 0) particle.y = window.innerHeight;
      if (particle.y > window.innerHeight) particle.y = 0;
      
      // Respawn if dead
      if (particle.life <= 0) {
        particle.x = Math.random() * window.innerWidth;
        particle.y = Math.random() * window.innerHeight;
        particle.life = particle.maxLife;
        particle.color = this.getRandomParticleColor();
      }
    });
  }

  drawParticles(ctx) {
    this.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      
      ctx.save();
      ctx.globalAlpha = alpha * particle.opacity;
      
      // Draw particle with glow effect
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.fill();
      
      ctx.restore();
    });
  }

  // ===== RIPPLE SYSTEM =====
  initializeRippleSystem() {
    const rippleContainer = document.getElementById('ripple-container');
    if (!rippleContainer) return;

    // Add ripple effect to clickable elements
    const clickableElements = document.querySelectorAll('.quantum-btn, .nav-item, .quantum-card');
    
    clickableElements.forEach(element => {
      element.addEventListener('click', (e) => {
        this.createRipple(e, rippleContainer);
      });
    });
  }

  createRipple(event, container) {
    const ripple = document.createElement('div');
    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 0, 255, 0.4) 0%, rgba(0, 255, 255, 0.2) 50%, transparent 70%);
      pointer-events: none;
      transform: scale(0);
      opacity: 1;
      transition: transform 1.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 1000;
    `;
    
    container.appendChild(ripple);
    
    // Trigger animation
    setTimeout(() => {
      ripple.style.transform = 'scale(4)';
      ripple.style.opacity = '0';
    }, 10);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 1500);
  }

  // ===== SCANLINE SYSTEM =====
  initializeScanlineSystem() {
    // Create scanline effect
    const scanline = document.createElement('div');
    scanline.className = 'scanline-effect';
    scanline.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
      opacity: 0.3;
      pointer-events: none;
      z-index: 999;
      animation: scan-line 8s linear infinite;
    `;
    
    document.body.appendChild(scanline);
  }

  // ===== MOUSE EFFECTS =====
  initializeMouseEffects() {
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      this.updateMouseEffects(mouseX, mouseY);
    });
    
    // Add hover effects to interactive elements
    const interactiveElements = document.querySelectorAll('.quantum-btn, .nav-item, .quantum-card');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.addHoverEffect(element);
      });
      
      element.addEventListener('mouseleave', () => {
        this.removeHoverEffect(element);
      });
    });
  }

  updateMouseEffects(x, y) {
    // Update particle attraction to mouse
    this.particles.forEach(particle => {
      const dx = x - particle.x;
      const dy = y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += dx * force * 0.001;
        particle.vy += dy * force * 0.001;
      }
    });
  }

  addHoverEffect(element) {
    element.style.transform = 'translateY(-2px) scale(1.02)';
    element.style.boxShadow = '0 8px 24px rgba(255, 0, 255, 0.3)';
    element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  }

  removeHoverEffect(element) {
    element.style.transform = 'translateY(0) scale(1)';
    element.style.boxShadow = '';
  }

  // ===== THEME ANIMATIONS =====
  initializeThemeAnimations() {
    // Theme-specific animations
    this.setupThemeTransitions();
    this.setupDynamicColors();
  }

  setupThemeTransitions() {
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.addEventListener('change', () => {
        this.triggerThemeTransition();
      });
    }
  }

  triggerThemeTransition() {
    const body = document.body;
    
    // Add transition effect
    body.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    body.style.filter = 'hue-rotate(180deg) brightness(1.2)';
    
    setTimeout(() => {
      body.style.filter = '';
    }, 500);
  }

  setupDynamicColors() {
    // Dynamic color shifting based on time
    setInterval(() => {
      this.updateDynamicColors();
    }, 5000);
  }

  updateDynamicColors() {
    const time = Date.now() * 0.001;
    const hue = (time * 10) % 360;
    
    document.documentElement.style.setProperty('--dynamic-hue', `${hue}deg`);
  }

  // ===== PANEL TRANSITIONS =====
  animatePanelTransition(panelName) {
    const targetPanel = document.getElementById(`${panelName}-panel`);
    if (!targetPanel) return;

    // Add entrance animation
    targetPanel.style.transform = 'translateX(20px) scale(0.95)';
    targetPanel.style.opacity = '0';
    
    setTimeout(() => {
      targetPanel.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      targetPanel.style.transform = 'translateX(0) scale(1)';
      targetPanel.style.opacity = '1';
    }, 50);
  }

  // ===== LOADING ANIMATIONS =====
  animateLoading(show = true) {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;

    if (show) {
      overlay.style.display = 'flex';
      overlay.style.opacity = '0';
      
      setTimeout(() => {
        overlay.style.transition = 'opacity 0.3s ease';
        overlay.style.opacity = '1';
      }, 10);
    } else {
      overlay.style.opacity = '0';
      
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 300);
    }
  }

  // ===== NOTIFICATION ANIMATIONS =====
  animateNotification(notification) {
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
      notification.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    }, 10);
  }

  // ===== BUTTON ANIMATIONS =====
  animateButtonPress(button) {
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 100);
  }

  // ===== CARD ANIMATIONS =====
  animateCardEntrance(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px) scale(0.95)';
    
    setTimeout(() => {
      card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0) scale(1)';
    }, 100);
  }

  // ===== GLITCH EFFECTS =====
  triggerGlitchEffect(element) {
    element.classList.add('animate-glitch');
    
    setTimeout(() => {
      element.classList.remove('animate-glitch');
    }, 300);
  }

  // ===== ENERGY PULSE =====
  triggerEnergyPulse(element) {
    element.classList.add('animate-energy-pulse');
    
    setTimeout(() => {
      element.classList.remove('animate-energy-pulse');
    }, 1500);
  }

  // ===== QUANTUM SHIFT =====
  triggerQuantumShift(element) {
    element.classList.add('animate-quantum-shift');
    
    setTimeout(() => {
      element.classList.remove('animate-quantum-shift');
    }, 4000);
  }

  // ===== PARTICLE BURST =====
  createParticleBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      const particle = {
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        size: Math.random() * 4 + 2,
        opacity: 1,
        color: this.getRandomParticleColor(),
        life: 100,
        maxLife: 100
      };
      
      this.particles.push(particle);
    }
  }

  // ===== DATA STREAM EFFECT =====
  createDataStream() {
    const stream = document.createElement('div');
    stream.className = 'data-stream';
    stream.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--color-secondary), transparent);
      opacity: 0.5;
      pointer-events: none;
      z-index: 998;
      animation: data-stream 3s linear infinite;
    `;
    
    document.body.appendChild(stream);
    
    setTimeout(() => {
      if (stream.parentNode) {
        stream.parentNode.removeChild(stream);
      }
    }, 3000);
  }

  // ===== MATRIX RAIN EFFECT =====
  createMatrixRain() {
    const rain = document.createElement('div');
    rain.className = 'matrix-rain';
    rain.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, transparent, var(--color-success), transparent);
      opacity: 0.1;
      pointer-events: none;
      z-index: 997;
      animation: matrix-rain 5s linear infinite;
    `;
    
    document.body.appendChild(rain);
    
    setTimeout(() => {
      if (rain.parentNode) {
        rain.parentNode.removeChild(rain);
      }
    }, 5000);
  }

  // ===== PUBLIC API =====
  getParticleCount() {
    return this.particles.length;
  }

  addParticle(x, y) {
    const particle = {
      x: x || Math.random() * window.innerWidth,
      y: y || Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      color: this.getRandomParticleColor(),
      life: Math.random() * 100 + 50,
      maxLife: Math.random() * 100 + 50
    };
    
    this.particles.push(particle);
  }

  clearParticles() {
    this.particles = [];
  }

  // ===== UTILITY METHODS =====
  getRandomColor() {
    const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0080', '#00ff80'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.quantumAnimations = new QuantumAnimations();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuantumAnimations;
} 