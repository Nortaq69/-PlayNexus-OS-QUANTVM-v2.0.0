// ===== PLAYNEXUS // OS:QUANTVM - MAIN SCRIPT =====

class PlayNexus {
  constructor() {
    this.quantvm = null;
    this.currentTheme = 'synthwave';
    this.currentMode = 'hacker-lair';
    this.systemState = {};
    this.isInitialized = false;
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initialize());
    } else {
      this.initialize();
    }
  }

  async initialize() {
    console.log('🧠 Initializing PlayNexus // OS:QUANTVM...');
    
    // Show loading overlay
    this.showLoadingOverlay();
    
    try {
      // Initialize UI components
      await this.initializeUI();
      
      // Initialize QUANTVM communication
      await this.initializeQuantVM();
      
      // Load initial system state
      await this.loadSystemState();
      
      // Initialize event listeners
      this.initializeEventListeners();
      
      // Initialize animations
      this.initializeAnimations();
      
      // Hide loading overlay
      this.hideLoadingOverlay();
      
      this.isInitialized = true;
      console.log('⚡ PlayNexus // OS:QUANTVM Initialized Successfully');
      
      // Show welcome notification
      this.showNotification('Welcome to the future, Captain Bladebyte!', 'success');
      
    } catch (error) {
      console.error('Error initializing PlayNexus:', error);
      this.showNotification('Initialization failed: ' + error.message, 'error');
    }
  }

  async initializeUI() {
    // Initialize particle system
    this.initializeParticleSystem();
    
    // Initialize ripple effects
    this.initializeRippleEffects();
    
    // Set up theme and mode selectors
    this.setupThemeSelectors();
    
    // Note: Navigation is handled by ui.js
  }

  async initializeQuantVM() {
    // Test QUANTVM communication
    try {
      const response = await window.quantvmAPI.processCommand('status');
      console.log('🧠 QUANTVM Response:', response);
      
      if (response.success) {
        this.updateQuantVMStatus(response.data);
      }
    } catch (error) {
      console.error('Error communicating with QUANTVM:', error);
    }
  }

  async loadSystemState() {
    try {
      this.systemState = await window.quantvmAPI.getSystemState();
      this.updateDashboard();
    } catch (error) {
      console.error('Error loading system state:', error);
    }
  }

  initializeEventListeners() {
    // QUANTVM command input
    const quantvmInput = document.getElementById('quantvm-input');
    const sendCommand = document.getElementById('send-command');
    
    if (quantvmInput && sendCommand) {
      sendCommand.addEventListener('click', () => this.sendQuantVMCommand());
      quantvmInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendQuantVMCommand();
        }
      });
    }

    // Quick action buttons
    const quickScanBtn = document.getElementById('quick-scan');
    const autoOrganizeBtn = document.getElementById('auto-organize');
    const securityCheckBtn = document.getElementById('security-check');
    
    if (quickScanBtn) {
      quickScanBtn.addEventListener('click', () => this.quickScan());
    }
    
    if (autoOrganizeBtn) {
      autoOrganizeBtn.addEventListener('click', () => this.autoOrganize());
    }
    
    if (securityCheckBtn) {
      securityCheckBtn.addEventListener('click', () => this.securityCheck());
    }

    // Dashboard refresh
    const refreshDashboardBtn = document.getElementById('refresh-dashboard');
    if (refreshDashboardBtn) {
      refreshDashboardBtn.addEventListener('click', () => this.refreshDashboard());
    }

    // Theme and mode changes
    const themeSelect = document.getElementById('theme-select');
    const modeSelect = document.getElementById('mode-select');
    
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
    }
    
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => this.changeMode(e.target.value));
    }

    // Listen for system events
    if (window.quantvmAPI) {
      window.quantvmAPI.onQuickScan(() => this.quickScan());
      window.quantvmAPI.onSecurityCheck(() => this.securityCheck());
    }
  }

  initializeAnimations() {
    // Initialize GSAP animations
    if (window.gsap) {
      this.initializeGSAPAnimations();
    }
    
    // Initialize particle animations
    this.initializeParticleAnimations();
  }

  initializeParticleSystem() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 0, 255, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  initializeRippleEffects() {
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
      background: radial-gradient(circle, rgba(255, 0, 255, 0.3) 0%, transparent 70%);
      pointer-events: none;
      transform: scale(0);
      opacity: 1;
      transition: transform 1.5s ease-out, opacity 1.5s ease-out;
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

  setupThemeSelectors() {
    const themeSelect = document.getElementById('theme-select');
    const modeSelect = document.getElementById('mode-select');
    
    if (themeSelect) {
      themeSelect.value = this.currentTheme;
    }
    
    if (modeSelect) {
      modeSelect.value = this.currentMode;
    }
  }

  // Note: Navigation is handled by ui.js - removed duplicate navigation logic

  async sendQuantVMCommand() {
    const input = document.getElementById('quantvm-input');
    const command = input.value.trim();
    
    if (!command) return;
    
    try {
      // Show typing indicator
      this.showTypingIndicator();
      
      const response = await window.quantvmAPI.processCommand(command);
      
      if (response.success) {
        this.showNotification(response.data.message, 'success');
        this.updateQuantVMStatus(response.data);
        
        // Add to activity list
        this.addActivityItem(`QUANTVM: ${command}`);
      } else {
        this.showNotification(response.error, 'error');
      }
      
    } catch (error) {
      console.error('Error sending command to QUANTVM:', error);
      this.showNotification('Communication error with QUANTVM', 'error');
    } finally {
      this.hideTypingIndicator();
      input.value = '';
    }
  }

  async quickScan() {
    try {
      this.showNotification('Initiating quick scan...', 'info');
      
      const result = await window.quantvmAPI.scanDirectory(
        window.nodeAPI.path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop')
      );
      
      if (result.success) {
        this.showNotification(`Quick scan complete: ${result.data.filesScanned} files found`, 'success');
        this.updateDashboard();
      } else {
        this.showNotification('Quick scan failed: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error during quick scan:', error);
      this.showNotification('Quick scan failed', 'error');
    }
  }

  async autoOrganize() {
    try {
      this.showNotification('Initiating auto organization...', 'info');
      
      const result = await window.quantvmAPI.organizeFiles({
        targetDirectory: window.nodeAPI.path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop'),
        strategy: 'type',
        createBackup: true
      });
      
      if (result.success) {
        this.showNotification(`Auto organization complete: ${result.organized} files organized`, 'success');
        this.updateDashboard();
      } else {
        this.showNotification('Auto organization failed: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error during auto organization:', error);
      this.showNotification('Auto organization failed', 'error');
    }
  }

  async securityCheck() {
    try {
      this.showNotification('Initiating security check...', 'info');
      
      const result = await window.quantvmAPI.securityScan();
      
      if (result.success) {
        this.showNotification('Security check complete', 'success');
        this.updateSecurityMetrics(result.data);
      } else {
        this.showNotification('Security check failed: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error during security check:', error);
      this.showNotification('Security check failed', 'error');
    }
  }

  async changeTheme(themeName) {
    try {
      const result = await window.quantvmAPI.changeTheme(themeName);
      
      if (result.success) {
        this.currentTheme = themeName;
        this.showNotification(`Theme changed to ${themeName}`, 'success');
      } else {
        this.showNotification('Theme change failed: ' + result.error, 'error');
      }
    } catch (error) {
      console.error('Error changing theme:', error);
      this.showNotification('Theme change failed', 'error');
    }
  }

  async changeMode(modeName) {
    try {
      this.currentMode = modeName;
      this.showNotification(`Mode changed to ${modeName}`, 'success');
      
      // Apply mode-specific effects
      this.applyModeEffects(modeName);
    } catch (error) {
      console.error('Error changing mode:', error);
      this.showNotification('Mode change failed', 'error');
    }
  }

  applyModeEffects(modeName) {
    const body = document.body;
    
    // Remove existing mode classes
    body.classList.remove('hacker-lair', 'ghost-temple', 'singularity-core', 'neon-jungle');
    
    // Add new mode class
    body.classList.add(modeName);
  }

  updateDashboard() {
    this.updateHealthMetrics();
    this.updateEntropyMetrics();
    this.updateQuantVMStatus();
    this.updateActivityList();
  }

  updateHealthMetrics(data = null) {
    const healthFill = document.getElementById('health-fill');
    const healthValue = document.getElementById('health-value');
    const totalFiles = document.getElementById('total-files');
    const totalSize = document.getElementById('total-size');
    
    if (data) {
      const health = data.healthScore || 100;
      const files = data.totalFiles || 0;
      const size = data.totalSize || 0;
      
      if (healthFill) {
        healthFill.style.width = `${health}%`;
      }
      
      if (healthValue) {
        healthValue.textContent = `${Math.round(health)}%`;
      }
      
      if (totalFiles) {
        totalFiles.textContent = files.toLocaleString();
      }
      
      if (totalSize) {
        const sizeMB = (size / (1024 * 1024)).toFixed(1);
        totalSize.textContent = `${sizeMB} MB`;
      }
    }
  }

  updateEntropyMetrics(data = null) {
    const entropyFill = document.getElementById('entropy-fill');
    const entropyValue = document.getElementById('entropy-value');
    const entropyStatus = document.getElementById('entropy-status');
    
    if (data) {
      const entropy = data.entropyLevel || 0;
      
      if (entropyFill) {
        const circumference = 2 * Math.PI * 40; // r=40
        const offset = circumference - (entropy / 100) * circumference;
        entropyFill.style.strokeDashoffset = offset;
      }
      
      if (entropyValue) {
        entropyValue.textContent = `${Math.round(entropy)}%`;
      }
      
      if (entropyStatus) {
        if (entropy > 70) {
          entropyStatus.textContent = 'Critical Entropy';
          entropyStatus.style.color = 'var(--color-error)';
        } else if (entropy > 50) {
          entropyStatus.textContent = 'High Entropy';
          entropyStatus.style.color = 'var(--color-warning)';
        } else {
          entropyStatus.textContent = 'System Optimal';
          entropyStatus.style.color = 'var(--color-success)';
        }
      }
    }
  }

  updateQuantVMStatus(data = null) {
    const memory = document.getElementById('quantvm-memory');
    const learning = document.getElementById('quantvm-learning');
    const confidence = document.getElementById('quantvm-confidence');
    
    if (data) {
      if (memory) {
        memory.textContent = data.memory ? 'Loaded' : 'Loading';
      }
      
      if (learning) {
        learning.textContent = data.learning ? 'Active' : 'Inactive';
      }
      
      if (confidence) {
        confidence.textContent = `${data.confidence || 85}%`;
      }
    }
  }

  updateActivityList() {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    // Add current timestamp
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
      <span class="activity-time">${timeString}</span>
      <span class="activity-text">Dashboard updated</span>
    `;
    
    activityList.appendChild(activityItem);
    
    // Keep only last 10 items
    const items = activityList.querySelectorAll('.activity-item');
    if (items.length > 10) {
      items[0].remove();
    }
  }

  addActivityItem(text) {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
      <span class="activity-time">${timeString}</span>
      <span class="activity-text">${text}</span>
    `;
    
    activityList.appendChild(activityItem);
    
    // Keep only last 10 items
    const items = activityList.querySelectorAll('.activity-item');
    if (items.length > 10) {
      items[0].remove();
    }
  }

  showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.add('slide-out');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, 5000);
  }

  showLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.remove('hidden');
    }
  }

  hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.classList.add('hidden');
    }
  }

  showTypingIndicator() {
    const sendBtn = document.getElementById('send-command');
    if (sendBtn) {
      sendBtn.innerHTML = '<span class="btn-icon animate-spin">⚡</span>';
      sendBtn.disabled = true;
    }
  }

  hideTypingIndicator() {
    const sendBtn = document.getElementById('send-command');
    if (sendBtn) {
      sendBtn.innerHTML = '<span class="btn-icon">⚡</span>';
      sendBtn.disabled = false;
    }
  }

  initializeGSAPAnimations() {
    // Initialize GSAP animations for smooth transitions
    gsap.set('.quantum-card', { opacity: 0, y: 20 });
    gsap.to('.quantum-card', { 
      opacity: 1, 
      y: 0, 
      duration: 0.6, 
      stagger: 0.1,
      ease: 'power2.out'
    });
  }

  initializeParticleAnimations() {
    // Add floating animation to particles
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      particle.classList.add('animate-float');
    });
  }

  initializeOrganizerInterface() {
    // Initialize file organizer interface
    const directoryPath = document.getElementById('directory-path');
    const browseBtn = document.getElementById('browse-directory');
    const organizeBtn = document.getElementById('organize-files');
    
    if (browseBtn) {
      browseBtn.addEventListener('click', () => {
        // In a real implementation, this would open a file dialog
        const defaultPath = window.nodeAPI.path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop');
        if (directoryPath) {
          directoryPath.value = defaultPath;
        }
      });
    }
    
    if (organizeBtn) {
      organizeBtn.addEventListener('click', () => this.autoOrganize());
    }
  }

  updateSecurityMetrics(data) {
    const securityFill = document.getElementById('security-fill');
    const securityValue = document.getElementById('security-value');
    const cloakedFiles = document.getElementById('cloaked-files');
    const alertsCount = document.getElementById('alerts-count');
    const backupsCount = document.getElementById('backups-count');
    
    if (data) {
      const health = data.systemHealth?.score || 100;
      
      if (securityFill) {
        const circumference = 2 * Math.PI * 40;
        const offset = circumference - (health / 100) * circumference;
        securityFill.style.strokeDashoffset = offset;
      }
      
      if (securityValue) {
        securityValue.textContent = `${Math.round(health)}%`;
      }
      
      if (cloakedFiles) {
        cloakedFiles.textContent = data.cloakedFiles || 0;
      }
      
      if (alertsCount) {
        alertsCount.textContent = data.intrusionAlerts || 0;
      }
      
      if (backupsCount) {
        backupsCount.textContent = data.backupsCount || 0;
      }
    }
  }
}

// Initialize the application
const playNexus = new PlayNexus();

// Export for global access
window.PlayNexus = playNexus; 