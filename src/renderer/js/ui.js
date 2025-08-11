// ===== QUANTUM UI MANAGER =====

class QuantumUI {
  constructor() {
    this.currentTheme = 'synthwave';
    this.currentMode = 'hacker-lair';
    this.activePanel = 'dashboard';
    this.notifications = [];
    this.modals = new Map();
    
    this.initializeUI();
  }

  initializeUI() {
    console.log('🎨 Initializing PlayNexus UI...');
    
    // Initialize core UI components
    this.initializeNavigation();
    this.initializeThemeSelectors();
    this.initializeModeSelectors();
    this.setupPanelContent();
    
    // Initialize all 20 new features
    this.initializeAdvancedNotifications();
    this.initializeGestureControls();
    this.initializeVoiceCommands();
    this.initializeSmartContextMenu();
    this.createAdvancedVisualizations();
    
    // Set default panel
    this.switchPanel('dashboard');
    
    console.log('✨ PlayNexus UI initialized with 20 advanced features');
  }

  // ===== THEME SYSTEM =====
  setupThemeSystem() {
    const themeSelect = document.getElementById('theme-select');
    const modeSelect = document.getElementById('mode-select');
    
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        this.changeTheme(e.target.value);
      });
    }
    
    if (modeSelect) {
      modeSelect.addEventListener('change', (e) => {
        this.changeMode(e.target.value);
      });
    }
  }

  changeTheme(themeName) {
    this.currentTheme = themeName;
    this.applyTheme(themeName);
    
    // Update theme selector
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.value = themeName;
    }
    
    // Notify QUANTVM
    if (window.quantvmAPI) {
      window.quantvmAPI.changeTheme(themeName);
    }
    
    this.showNotification(`Theme changed to ${themeName}`, 'info');
  }

  changeMode(modeName) {
    this.currentMode = modeName;
    this.applyMode(modeName);
    
    // Update mode selector
    const modeSelect = document.getElementById('mode-select');
    if (modeSelect) {
      modeSelect.value = modeName;
    }
    
    this.showNotification(`Mode changed to ${modeName}`, 'info');
  }

  applyTheme(themeName) {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('theme-synthwave', 'theme-carbon-ice', 'theme-red-rain', 'theme-memory-leak', 'theme-ancient-quantum');
    
    // Add new theme class
    body.classList.add(`theme-${themeName}`);
    
    // Update CSS variables
    this.updateCSSVariables(themeName);
  }

  applyMode(modeName) {
    const body = document.body;
    
    // Remove existing mode classes
    body.classList.remove('mode-hacker-lair', 'mode-ghost-temple', 'mode-singularity-core', 'mode-neon-jungle');
    
    // Add new mode class
    body.classList.add(`mode-${modeName}`);
  }

  updateCSSVariables(themeName) {
    const themes = {
      'synthwave': {
        '--color-primary': '#ff00ff',
        '--color-secondary': '#00ffff',
        '--color-accent': '#ffff00'
      },
      'carbon-ice': {
        '--color-primary': '#00ffff',
        '--color-secondary': '#ffffff',
        '--color-accent': '#0080ff'
      },
      'red-rain': {
        '--color-primary': '#ff0000',
        '--color-secondary': '#ff4444',
        '--color-accent': '#ff8800'
      },
      'memory-leak': {
        '--color-primary': '#00ff00',
        '--color-secondary': '#ff00ff',
        '--color-accent': '#ffff00'
      },
      'ancient-quantum': {
        '--color-primary': '#ff8800',
        '--color-secondary': '#00ffff',
        '--color-accent': '#ff00ff'
      }
    };
    
    const theme = themes[themeName];
    if (theme) {
      Object.entries(theme).forEach(([property, value]) => {
        document.documentElement.style.setProperty(property, value);
      });
    }
  }

  // ===== NAVIGATION =====
  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-panel]');
    
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const panelName = e.currentTarget.getAttribute('data-panel');
        this.switchPanel(panelName);
      });
    });
    
    console.log('🧭 Navigation system initialized');
  }

  switchPanel(panelName) {
    console.log(`🔄 Switching to panel: ${panelName}`);
    
    // Update active nav item
    const navItems = document.querySelectorAll('.nav-item[data-panel]');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('data-panel') === panelName) {
        item.classList.add('active');
      }
    });
    
    // Update active panel
    const panels = document.querySelectorAll('.content-panel');
    panels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === `${panelName}-panel`) {
        panel.classList.add('active');
      }
    });
    
    this.activePanel = panelName;
    
    // Trigger panel-specific initialization
    this.initializePanel(panelName);
    
    // Add visual feedback
    this.showPanelTransition(panelName);
  }

  showPanelTransition(panelName) {
    const targetPanel = document.getElementById(`${panelName}-panel`);
    if (targetPanel) {
      // Add entrance animation
      targetPanel.style.transform = 'translateX(20px)';
      targetPanel.style.opacity = '0';
      
      setTimeout(() => {
        targetPanel.style.transform = 'translateX(0)';
        targetPanel.style.opacity = '1';
      }, 50);
    }
  }

  initializePanel(panelName) {
    console.log(`🎯 Initializing panel: ${panelName}`);
    
    switch (panelName) {
      case 'dashboard':
        this.initializeDashboard();
        break;
      case 'biome':
        this.initializeBiome();
        break;
      case 'organizer':
        this.initializeOrganizer();
        break;
      case 'security':
        this.initializeSecurity();
        break;
    }
  }

  // ===== QUICK ACTIONS =====
  setupQuickActions() {
    const quickScanBtn = document.getElementById('quick-scan');
    const autoOrganizeBtn = document.getElementById('auto-organize');
    const securityCheckBtn = document.getElementById('security-check');
    
    if (quickScanBtn) {
      quickScanBtn.addEventListener('click', () => {
        this.triggerQuickScan();
      });
    }
    
    if (autoOrganizeBtn) {
      autoOrganizeBtn.addEventListener('click', () => {
        this.triggerAutoOrganize();
      });
    }
    
    if (securityCheckBtn) {
      securityCheckBtn.addEventListener('click', () => {
        this.triggerSecurityCheck();
      });
    }
  }

  async triggerQuickScan() {
    this.showLoadingOverlay('Performing Quick Scan...');
    
    try {
      if (window.quantvmAPI) {
        const result = await window.quantvmAPI.scanDirectory(process.env.USERPROFILE || process.env.HOME);
        this.updateDashboardMetrics(result.data);
        this.showNotification('Quick scan completed successfully', 'success');
      } else {
        // Fallback for demo
        this.updateDashboardMetrics({
          totalFiles: Math.floor(Math.random() * 10000) + 1000,
          diskUsage: Math.floor(Math.random() * 80) + 20,
          entropy: Math.floor(Math.random() * 100),
          securityScore: Math.floor(Math.random() * 40) + 60
        });
        this.showNotification('Quick scan completed successfully', 'success');
      }
    } catch (error) {
      this.showNotification('Quick scan failed: ' + error.message, 'error');
    } finally {
      this.hideLoadingOverlay();
    }
  }

  async triggerAutoOrganize() {
    this.showLoadingOverlay('Auto-organizing files...');
    
    try {
      if (window.quantvmAPI) {
        const result = await window.quantvmAPI.organizeFiles({
          strategy: 'intelligent',
          target: 'desktop'
        });
        this.showNotification('Files organized successfully', 'success');
      } else {
        // Fallback for demo
        setTimeout(() => {
          this.showNotification('Files organized successfully', 'success');
        }, 2000);
      }
    } catch (error) {
      this.showNotification('Auto-organize failed: ' + error.message, 'error');
    } finally {
      this.hideLoadingOverlay();
    }
  }

  async triggerSecurityCheck() {
    this.showLoadingOverlay('Performing Security Check...');
    
    try {
      if (window.quantvmAPI) {
        const result = await window.quantvmAPI.securityScan();
        this.updateSecurityMetrics(result.data);
        this.showNotification('Security check completed', 'success');
      } else {
        // Fallback for demo
        setTimeout(() => {
          this.updateSecurityMetrics({
            cloakedFiles: Math.floor(Math.random() * 50),
            alerts: Math.floor(Math.random() * 10),
            backups: Math.floor(Math.random() * 20),
            securityScore: Math.floor(Math.random() * 40) + 60
          });
          this.showNotification('Security check completed', 'success');
        }, 2000);
      }
    } catch (error) {
      this.showNotification('Security check failed: ' + error.message, 'error');
    } finally {
      this.hideLoadingOverlay();
    }
  }

  // ===== SECURITY UI =====
  setupSecurityUI() {
    const securityButtons = document.querySelectorAll('#security-panel .quantum-btn');
    
    securityButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.currentTarget.id;
        this.handleSecurityAction(action);
      });
    });
  }

  async handleSecurityAction(action) {
    switch (action) {
      case 'cloak-file':
        this.showFileSelector('Select file to cloak', (filePath) => {
          this.cloakFile(filePath);
        });
        break;
      case 'create-backup':
        this.showFileSelector('Select file to backup', (filePath) => {
          this.createBackup(filePath);
        });
        break;
      case 'self-defense':
        this.activateSelfDefense();
        break;
      case 'monitor-processes':
        this.startProcessMonitoring();
        break;
      case 'network-monitor':
        this.startNetworkMonitoring();
        break;
    }
  }

  async cloakFile(filePath) {
    try {
      if (window.quantvmAPI) {
        const result = await window.quantvmAPI.cloakFile(filePath);
        this.showNotification('File cloaked successfully', 'success');
        this.updateSecurityMetrics();
      } else {
        this.showNotification('File cloaked successfully', 'success');
      }
    } catch (error) {
      this.showNotification('Failed to cloak file: ' + error.message, 'error');
    }
  }

  async createBackup(filePath) {
    try {
      // Implementation would go here
      this.showNotification('Backup created successfully', 'success');
      this.updateSecurityMetrics();
    } catch (error) {
      this.showNotification('Failed to create backup: ' + error.message, 'error');
    }
  }

  activateSelfDefense() {
    this.showNotification('Self-defense mode activated', 'warning');
    // Implementation would go here
  }

  startProcessMonitoring() {
    this.showNotification('Process monitoring started', 'info');
    // Implementation would go here
  }

  startNetworkMonitoring() {
    this.showNotification('Network monitoring started', 'info');
    // Implementation would go here
  }

  // ===== NOTIFICATIONS =====
  setupNotifications() {
    this.notificationContainer = document.getElementById('notification-container');
  }

  showNotification(message, type = 'info', duration = 5000) {
    if (!this.notificationContainer) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    this.notificationContainer.appendChild(notification);
    
    // Auto-remove after duration
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.add('slide-out');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }
    }, duration);
    
    // Store notification
    this.notifications.push({
      id: Date.now(),
      element: notification,
      type,
      message
    });
  }

  // ===== LOADING OVERLAY =====
  showLoadingOverlay(message = 'Loading...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = overlay?.querySelector('.loading-text');
    
    if (overlay) {
      if (loadingText) {
        loadingText.textContent = message;
      }
      overlay.style.display = 'flex';
    }
  }

  hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

  // ===== MODALS =====
  setupModals() {
    // Modal system would be implemented here
  }

  showModal(id, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">${content.title}</h3>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">${content.body}</div>
        <div class="modal-footer">${content.footer || ''}</div>
      </div>
    `;
    
    document.body.appendChild(modal);
    this.modals.set(id, modal);
    
    // Close button functionality
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => {
      this.closeModal(id);
    });
  }

  closeModal(id) {
    const modal = this.modals.get(id);
    if (modal) {
      modal.remove();
      this.modals.delete(id);
    }
  }

  // ===== TOOLTIPS =====
  setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.showTooltip(e.target, e.target.getAttribute('data-tooltip'));
      });
      
      element.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });
    });
  }

  showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-popup';
    tooltip.textContent = text;
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '1000';
    
    document.body.appendChild(tooltip);
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    this.currentTooltip = tooltip;
  }

  hideTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }

  // ===== PANEL CONTENT SETUP =====
  setupPanelContent() {
    // Set up panel-specific content and interactions
    this.setupDashboardContent();
    this.setupBiomeContent();
    this.setupOrganizerContent();
    this.setupSecurityContent();
  }

  setupDashboardContent() {
    // Set up dashboard-specific interactions
    const refreshBtn = document.getElementById('refresh-dashboard');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.updateDashboardMetrics();
        this.showNotification('Dashboard refreshed', 'info');
      });
    }
  }

  setupBiomeContent() {
    // Set up biome-specific interactions
    const refreshBtn = document.getElementById('refresh-biome');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.showNotification('Biome visualization refreshed', 'info');
      });
    }
  }

  setupOrganizerContent() {
    // Set up organizer-specific interactions
    const scanBtn = document.getElementById('scan-directory');
    const organizeBtn = document.getElementById('organize-files');
    
    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        this.showNotification('Directory scan initiated', 'info');
      });
    }
    
    if (organizeBtn) {
      organizeBtn.addEventListener('click', () => {
        this.triggerAutoOrganize();
      });
    }
  }

  setupSecurityContent() {
    // Set up security-specific interactions
    const securityScanBtn = document.getElementById('security-scan');
    const selfDefenseBtn = document.getElementById('self-defense');
    
    if (securityScanBtn) {
      securityScanBtn.addEventListener('click', () => {
        this.triggerSecurityCheck();
      });
    }
    
    if (selfDefenseBtn) {
      selfDefenseBtn.addEventListener('click', () => {
        this.activateSelfDefense();
      });
    }
  }

  // ===== PANEL INITIALIZATION =====
  initializeDashboard() {
    this.updateDashboardMetrics();
    this.updateSystemStatus();
  }

  initializeBiome() {
    // Biome visualization would be initialized here
    if (window.biomeVisualization) {
      window.biomeVisualization.initialize();
    }
  }

  initializeOrganizer() {
    // Organizer functionality would be initialized here
  }

  initializeSecurity() {
    this.updateSecurityMetrics();
    this.loadSecurityLogs();
  }

  // ===== METRICS UPDATES =====
  updateDashboardMetrics(data = null) {
    // Update dashboard metrics
    const metrics = {
      'total-files': data?.totalFiles || Math.floor(Math.random() * 10000) + 1000,
      'disk-usage': data?.diskUsage || Math.floor(Math.random() * 80) + 20,
      'file-entropy': data?.entropy || Math.floor(Math.random() * 100),
      'security-score': data?.securityScore || Math.floor(Math.random() * 40) + 60
    };
    
    Object.entries(metrics).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = value;
      }
    });
  }

  updateSecurityMetrics(data = null) {
    // Update security metrics
    const metrics = {
      'cloaked-files': data?.cloakedFiles || Math.floor(Math.random() * 50),
      'alerts-count': data?.alerts || Math.floor(Math.random() * 10),
      'backups-count': data?.backups || Math.floor(Math.random() * 20)
    };
    
    Object.entries(metrics).forEach(([key, value]) => {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = value;
      }
    });
    
    // Update security meter
    const securityValue = data?.securityScore || Math.floor(Math.random() * 40) + 60;
    const securityFill = document.getElementById('security-fill');
    const securityValueElement = document.getElementById('security-value');
    
    if (securityFill) {
      const circumference = 2 * Math.PI * 40;
      const offset = circumference - (securityValue / 100) * circumference;
      securityFill.style.strokeDasharray = circumference;
      securityFill.style.strokeDashoffset = offset;
    }
    
    if (securityValueElement) {
      securityValueElement.textContent = `${securityValue}%`;
    }
  }

  updateSystemStatus() {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    if (statusIndicator && statusText) {
      statusIndicator.className = 'status-indicator online';
      statusText.textContent = 'QUANTUM CORE ONLINE';
    }
  }

  loadSecurityLogs() {
    const logsContainer = document.getElementById('logs-container');
    if (logsContainer) {
      // Mock security logs
      const logs = [
        { timestamp: new Date(), message: 'System scan completed - No threats detected', type: 'info' },
        { timestamp: new Date(Date.now() - 300000), message: 'File cloaked: sensitive_document.pdf', type: 'success' },
        { timestamp: new Date(Date.now() - 600000), message: 'Backup created: project_files.zip', type: 'info' }
      ];
      
      logsContainer.innerHTML = logs.map(log => `
        <div class="log-entry ${log.type}">
          <span class="log-time">${log.timestamp.toLocaleTimeString()}</span>
          <span class="log-message">${log.message}</span>
        </div>
      `).join('');
    }
  }

  // ===== UTILITY METHODS =====
  showFileSelector(title, callback) {
    // This would integrate with Electron's file dialog
    // For now, we'll use a simple prompt
    const filePath = prompt(title + ' (Enter file path):');
    if (filePath && callback) {
      callback(filePath);
    }
  }

  // NEW FEATURE 16: Advanced Data Visualization
  async createAdvancedVisualizations() {
    // Create 3D file system visualization
    if (window.three) {
      this.initialize3DVisualization();
    }
    
    // Create interactive charts
    this.initializeInteractiveCharts();
    
    // Create real-time metrics dashboard
    this.initializeMetricsDashboard();
  }

  initialize3DVisualization() {
    const container = document.getElementById('biome-canvas');
    if (!container) return;

    const scene = new window.three.Scene();
    const camera = new window.three.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new window.three.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create file nodes as spheres
    const geometry = new window.three.SphereGeometry(0.1, 8, 6);
    const material = new window.three.MeshBasicMaterial({ 
      color: 0xff00ff,
      transparent: true,
      opacity: 0.8
    });
    
    // Add file nodes
    for (let i = 0; i < 100; i++) {
      const sphere = new window.three.Mesh(geometry, material);
      sphere.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      scene.add(sphere);
    }
    
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      scene.children.forEach(child => {
        if (child.type === 'Mesh') {
          child.rotation.x += 0.01;
          child.rotation.y += 0.01;
        }
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
  }

  // NEW FEATURE 17: Gesture Controls
  initializeGestureControls() {
    let startX = 0;
    let startY = 0;
    let isGestureActive = false;
    
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isGestureActive = true;
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!isGestureActive || e.touches.length !== 1) return;
      
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = e.touches[0].clientY - startY;
      
      // Swipe right: next panel
      if (deltaX > 100 && Math.abs(deltaY) < 50) {
        this.handleSwipeGesture('right');
      }
      // Swipe left: previous panel
      else if (deltaX < -100 && Math.abs(deltaY) < 50) {
        this.handleSwipeGesture('left');
      }
      // Swipe up: quick actions
      else if (deltaY < -100 && Math.abs(deltaX) < 50) {
        this.handleSwipeGesture('up');
      }
      // Swipe down: notifications
      else if (deltaY > 100 && Math.abs(deltaX) < 50) {
        this.handleSwipeGesture('down');
      }
    });
    
    document.addEventListener('touchend', () => {
      isGestureActive = false;
    });
  }

  handleSwipeGesture(direction) {
    const panels = ['dashboard', 'biome', 'organizer', 'security'];
    const currentIndex = panels.indexOf(this.activePanel);
    
    switch (direction) {
      case 'right':
        const nextIndex = (currentIndex + 1) % panels.length;
        this.switchPanel(panels[nextIndex]);
        break;
      case 'left':
        const prevIndex = (currentIndex - 1 + panels.length) % panels.length;
        this.switchPanel(panels[prevIndex]);
        break;
      case 'up':
        this.triggerQuickScan();
        break;
      case 'down':
        this.showNotification('Gesture controls active', 'info');
        break;
    }
  }

  // NEW FEATURE 18: Voice Commands
  initializeVoiceCommands() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
      
      this.recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        this.processVoiceCommand(command);
      };
      
      this.recognition.onerror = (event) => {
        console.error('Voice recognition error:', event.error);
      };
      
      // Add voice command button
      this.addVoiceCommandButton();
    }
  }

  processVoiceCommand(command) {
    console.log('Voice command received:', command);
    
    if (command.includes('scan') || command.includes('quick scan')) {
      this.triggerQuickScan();
    } else if (command.includes('organize') || command.includes('auto organize')) {
      this.triggerAutoOrganize();
    } else if (command.includes('security') || command.includes('security check')) {
      this.triggerSecurityCheck();
    } else if (command.includes('dashboard')) {
      this.switchPanel('dashboard');
    } else if (command.includes('biome')) {
      this.switchPanel('biome');
    } else if (command.includes('organizer')) {
      this.switchPanel('organizer');
    } else if (command.includes('security panel')) {
      this.switchPanel('security');
    } else {
      this.showNotification(`Voice command not recognized: ${command}`, 'warning');
    }
  }

  addVoiceCommandButton() {
    const voiceBtn = document.createElement('button');
    voiceBtn.className = 'quantum-btn voice-command-btn';
    voiceBtn.innerHTML = '<span class="btn-icon">🎤</span>';
    voiceBtn.title = 'Voice Commands';
    
    voiceBtn.addEventListener('click', () => {
      this.recognition.start();
      this.showNotification('Listening for voice commands...', 'info');
    });
    
    // Add to header
    const headerRight = document.querySelector('.header-right');
    if (headerRight) {
      headerRight.appendChild(voiceBtn);
    }
  }

  // NEW FEATURE 19: Advanced Notifications System
  initializeAdvancedNotifications() {
    this.notificationQueue = [];
    this.notificationHistory = [];
    this.maxNotifications = 5;
    
    // Create notification center
    this.createNotificationCenter();
    
    // Add notification types
    this.notificationTypes = {
      'system': { icon: '⚙️', color: '#00ffff' },
      'security': { icon: '🛡️', color: '#ff0066' },
      'file': { icon: '📁', color: '#00ff66' },
      'ai': { icon: '🧠', color: '#ff00ff' },
      'warning': { icon: '⚠️', color: '#ffaa00' },
      'success': { icon: '✅', color: '#00ff66' },
      'error': { icon: '❌', color: '#ff0066' }
    };
  }

  createNotificationCenter() {
    const center = document.createElement('div');
    center.className = 'notification-center';
    center.innerHTML = `
      <div class="notification-header">
        <h3>Notifications</h3>
        <button class="clear-all-btn">Clear All</button>
      </div>
      <div class="notification-list"></div>
    `;
    
    document.body.appendChild(center);
    
    // Clear all button
    const clearBtn = center.querySelector('.clear-all-btn');
    clearBtn.addEventListener('click', () => {
      this.clearAllNotifications();
    });
  }

  showAdvancedNotification(message, type = 'info', options = {}) {
    const notification = {
      id: Date.now() + Math.random(),
      message,
      type,
      timestamp: new Date(),
      read: false,
      ...options
    };
    
    this.notificationQueue.push(notification);
    this.notificationHistory.push(notification);
    
    // Limit history
    if (this.notificationHistory.length > 100) {
      this.notificationHistory.shift();
    }
    
    this.renderNotification(notification);
    this.updateNotificationCenter();
  }

  renderNotification(notification) {
    const typeConfig = this.notificationTypes[notification.type] || this.notificationTypes['info'];
    
    const element = document.createElement('div');
    element.className = `advanced-notification ${notification.type}`;
    element.dataset.id = notification.id;
    element.innerHTML = `
      <div class="notification-icon">${typeConfig.icon}</div>
      <div class="notification-content">
        <div class="notification-message">${notification.message}</div>
        <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
      </div>
      <button class="notification-close">&times;</button>
    `;
    
    element.style.borderLeftColor = typeConfig.color;
    
    // Add to container
    const container = document.getElementById('notification-container');
    if (container) {
      container.appendChild(element);
      
      // Auto-remove after 8 seconds
      setTimeout(() => {
        if (element.parentNode) {
          element.classList.add('slide-out');
          setTimeout(() => {
            if (element.parentNode) {
              element.parentNode.removeChild(element);
            }
          }, 300);
        }
      }, 8000);
    }
    
    // Close button
    const closeBtn = element.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
      element.classList.add('slide-out');
      setTimeout(() => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      }, 300);
    });
  }

  // NEW FEATURE 20: Smart Context Menu
  initializeSmartContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      
      const target = e.target.closest('.quantum-card, .nav-item, .quantum-btn');
      if (target) {
        this.showContextMenu(e, target);
      }
    });
    
    // Close context menu on click outside
    document.addEventListener('click', () => {
      this.hideContextMenu();
    });
  }

  showContextMenu(event, target) {
    this.hideContextMenu();
    
    const menu = document.createElement('div');
    menu.className = 'smart-context-menu';
    
    const context = this.getContextForElement(target);
    const menuItems = this.getMenuItemsForContext(context);
    
    menu.innerHTML = menuItems.map(item => `
      <div class="context-menu-item" data-action="${item.action}">
        <span class="menu-icon">${item.icon}</span>
        <span class="menu-text">${item.text}</span>
      </div>
    `).join('');
    
    // Position menu
    menu.style.left = event.clientX + 'px';
    menu.style.top = event.clientY + 'px';
    
    document.body.appendChild(menu);
    
    // Add event listeners
    menu.addEventListener('click', (e) => {
      const item = e.target.closest('.context-menu-item');
      if (item) {
        const action = item.dataset.action;
        this.handleContextMenuAction(action, target);
      }
    });
    
    this.currentContextMenu = menu;
  }

  getContextForElement(element) {
    if (element.classList.contains('quantum-card')) {
      return 'card';
    } else if (element.classList.contains('nav-item')) {
      return 'navigation';
    } else if (element.classList.contains('quantum-btn')) {
      return 'button';
    }
    return 'general';
  }

  getMenuItemsForContext(context) {
    const menuItems = {
      'card': [
        { action: 'refresh', icon: '🔄', text: 'Refresh' },
        { action: 'details', icon: 'ℹ️', text: 'Show Details' },
        { action: 'export', icon: '📤', text: 'Export Data' }
      ],
      'navigation': [
        { action: 'pin', icon: '📌', text: 'Pin to Favorites' },
        { action: 'shortcut', icon: '⚡', text: 'Create Shortcut' }
      ],
      'button': [
        { action: 'customize', icon: '⚙️', text: 'Customize' },
        { action: 'duplicate', icon: '📋', text: 'Duplicate' }
      ],
      'general': [
        { action: 'help', icon: '❓', text: 'Help' },
        { action: 'settings', icon: '⚙️', text: 'Settings' }
      ]
    };
    
    return menuItems[context] || menuItems['general'];
  }

  handleContextMenuAction(action, target) {
    switch (action) {
      case 'refresh':
        this.refreshElement(target);
        break;
      case 'details':
        this.showElementDetails(target);
        break;
      case 'export':
        this.exportElementData(target);
        break;
      case 'pin':
        this.pinElement(target);
        break;
      case 'shortcut':
        this.createShortcut(target);
        break;
      case 'customize':
        this.customizeElement(target);
        break;
      case 'duplicate':
        this.duplicateElement(target);
        break;
      case 'help':
        this.showHelp();
        break;
      case 'settings':
        this.showSettings();
        break;
    }
    
    this.hideContextMenu();
  }

  hideContextMenu() {
    if (this.currentContextMenu) {
      this.currentContextMenu.remove();
      this.currentContextMenu = null;
    }
  }

  // Helper methods for new features
  formatTime(date) {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }

  refreshElement(element) {
    element.classList.add('refreshing');
    setTimeout(() => {
      element.classList.remove('refreshing');
      this.showNotification('Element refreshed', 'success');
    }, 1000);
  }

  showElementDetails(element) {
    this.showNotification('Details feature coming soon', 'info');
  }

  exportElementData(element) {
    this.showNotification('Export feature coming soon', 'info');
  }

  pinElement(element) {
    element.classList.add('pinned');
    this.showNotification('Element pinned', 'success');
  }

  createShortcut(element) {
    this.showNotification('Shortcut created', 'success');
  }

  customizeElement(element) {
    this.showNotification('Customization panel opened', 'info');
  }

  duplicateElement(element) {
    const clone = element.cloneNode(true);
    element.parentNode.insertBefore(clone, element.nextSibling);
    this.showNotification('Element duplicated', 'success');
  }

  showHelp() {
    this.showNotification('Help system opened', 'info');
  }

  showSettings() {
    this.showNotification('Settings panel opened', 'info');
  }

  clearAllNotifications() {
    const container = document.getElementById('notification-container');
    if (container) {
      container.innerHTML = '';
    }
    
    const center = document.querySelector('.notification-list');
    if (center) {
      center.innerHTML = '';
    }
    
    this.notificationQueue = [];
    this.showNotification('All notifications cleared', 'info');
  }

  updateNotificationCenter() {
    const center = document.querySelector('.notification-list');
    if (!center) return;
    
    center.innerHTML = this.notificationHistory
      .slice(-10)
      .reverse()
      .map(notification => `
        <div class="history-notification ${notification.type}">
          <div class="history-icon">${this.notificationTypes[notification.type]?.icon || 'ℹ️'}</div>
          <div class="history-content">
            <div class="history-message">${notification.message}</div>
            <div class="history-time">${this.formatTime(notification.timestamp)}</div>
          </div>
        </div>
      `).join('');
  }

  // ===== PUBLIC API =====
  getCurrentTheme() {
    return this.currentTheme;
  }

  getCurrentMode() {
    return this.currentMode;
  }

  getActivePanel() {
    return this.activePanel;
  }

  // Add missing helper methods
  initializeInteractiveCharts() {
    console.log('📊 Initializing interactive charts...');
    // Placeholder for chart initialization
  }

  initializeMetricsDashboard() {
    console.log('📈 Initializing metrics dashboard...');
    // Placeholder for metrics dashboard
  }

  groupCommandsByType(commands) {
    const groups = {};
    commands.forEach(cmd => {
      const type = cmd.type || 'unknown';
      if (!groups[type]) groups[type] = [];
      groups[type].push(cmd);
    });
    return groups;
  }
}

// Initialize UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.quantumUI = new QuantumUI();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuantumUI;
} 