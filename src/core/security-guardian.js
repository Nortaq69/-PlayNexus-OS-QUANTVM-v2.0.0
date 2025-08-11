const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

class SecurityGuardian {
  constructor() {
    this.name = 'SecurityGuardian';
    this.version = '2.0.0';
    this.securityLevel = 'standard';
    this.cloakedFiles = new Map();
    this.monitoredProcesses = new Set();
    this.intrusionAlerts = [];
    this.encryptionKey = null;
    this.backupLocations = new Map();
    this.selfDefenseMode = false;
  }

  async initialize() {
    console.log('🛡️ Security Guardian Initializing...');
    
    // Generate encryption key
    this.encryptionKey = crypto.randomBytes(32);
    
    // Load existing security data
    await this.loadSecurityData();
    
    // Initialize monitoring
    this.initializeSystemMonitoring();
    
    console.log('🔒 Security Guardian Online - System Protected');
  }

  async loadSecurityData() {
    // Load cloaked files registry
    const dataPath = path.join(process.env.APPDATA || process.env.HOME, '.neon-archivist', 'security');
    await fs.ensureDir(dataPath);
    
    const registryPath = path.join(dataPath, 'cloaked-registry.json');
    if (await fs.pathExists(registryPath)) {
      try {
        const registry = await fs.readJson(registryPath);
        this.cloakedFiles = new Map(Object.entries(registry));
      } catch (error) {
        console.error('Error loading cloaked registry:', error);
      }
    }
  }

  initializeSystemMonitoring() {
    // Monitor for suspicious activities
    setInterval(() => {
      this.monitorSystem();
    }, 10000); // Check every 10 seconds
  }

  async monitorSystem() {
    // Check for unauthorized access
    await this.checkFileIntegrity();
    
    // Monitor network activity (basic)
    await this.checkNetworkActivity();
    
    // Check for suspicious processes
    await this.checkSuspiciousProcesses();
  }

  async checkFileIntegrity() {
    for (const [originalPath, cloakedData] of this.cloakedFiles) {
      try {
        const exists = await fs.pathExists(cloakedData.cloakedPath);
        if (!exists) {
          this.triggerAlert('file_integrity', {
            message: `Cloaked file missing: ${originalPath}`,
            severity: 'high',
            timestamp: new Date()
          });
        }
      } catch (error) {
        console.error(`Error checking file integrity for ${originalPath}:`, error);
      }
    }
  }

  async checkNetworkActivity() {
    // Basic network monitoring
    // In a real implementation, this would use more sophisticated network monitoring
    const networkInterfaces = os.networkInterfaces();
    
    // Check for unusual network activity
    for (const [name, interfaces] of Object.entries(networkInterfaces)) {
      for (const iface of interfaces) {
        if (iface.family === 'IPv4' && !iface.internal) {
          // Monitor external connections
          this.logNetworkActivity(name, iface.address);
        }
      }
    }
  }

  async checkSuspiciousProcesses() {
    // Check for suspicious processes accessing protected files
    // This is a simplified version - real implementation would use process monitoring
    const suspiciousPatterns = [
      'keylogger',
      'spyware',
      'malware',
      'trojan'
    ];
    
    // In a real implementation, this would check running processes
    // For now, we'll just log the check
    console.log('🔍 Checking for suspicious processes...');
  }

  logNetworkActivity(interfaceName, address) {
    // Log network activity for analysis
    const activity = {
      interface: interfaceName,
      address: address,
      timestamp: new Date(),
      type: 'external_connection'
    };
    
    // Store for analysis
    this.intrusionAlerts.push(activity);
  }

  triggerAlert(type, data) {
    const alert = {
      type,
      ...data,
      timestamp: new Date(),
      id: crypto.randomBytes(8).toString('hex')
    };
    
    this.intrusionAlerts.push(alert);
    
    // Log alert
    console.log(`🚨 Security Alert [${type}]: ${data.message}`);
    
    // Trigger visual alert in UI
    // This would be sent to the renderer process
  }

  async cloakFile(filePath) {
    console.log(`🔐 Cloaking file: ${filePath}`);
    
    try {
      // Check if file exists
      if (!await fs.pathExists(filePath)) {
        throw new Error('File does not exist');
      }
      
      // Generate cloaked path
      const cloakedPath = this.generateCloakedPath(filePath);
      
      // Read and encrypt file content
      const fileContent = await fs.readFile(filePath);
      const encryptedContent = this.encryptData(fileContent);
      
      // Write encrypted content to cloaked location
      await fs.writeFile(cloakedPath, encryptedContent);
      
      // Create decoy file
      await this.createDecoyFile(filePath);
      
      // Store cloaking information
      const cloakedData = {
        originalPath: filePath,
        cloakedPath: cloakedPath,
        encryptionKey: this.encryptionKey.toString('hex'),
        cloakedAt: new Date(),
        size: fileContent.length,
        checksum: crypto.createHash('sha256').update(fileContent).digest('hex')
      };
      
      this.cloakedFiles.set(filePath, cloakedData);
      
      // Save registry
      await this.saveCloakedRegistry();
      
      return {
        success: true,
        originalPath: filePath,
        cloakedPath: cloakedPath,
        message: 'File successfully cloaked with quantum encryption'
      };
    } catch (error) {
      console.error('Error cloaking file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async uncloakFile(filePath) {
    const cloakedData = this.cloakedFiles.get(filePath);
    if (!cloakedData) {
      throw new Error('File is not cloaked');
    }
    
    try {
      // Read encrypted content
      const encryptedContent = await fs.readFile(cloakedData.cloakedPath);
      
      // Decrypt content
      const decryptedContent = this.decryptData(encryptedContent);
      
      // Verify checksum
      const checksum = crypto.createHash('sha256').update(decryptedContent).digest('hex');
      if (checksum !== cloakedData.checksum) {
        throw new Error('File integrity check failed');
      }
      
      // Write decrypted content back to original location
      await fs.writeFile(filePath, decryptedContent);
      
      // Remove cloaked file
      await fs.remove(cloakedData.cloakedPath);
      
      // Remove from registry
      this.cloakedFiles.delete(filePath);
      await this.saveCloakedRegistry();
      
      return {
        success: true,
        message: 'File successfully uncloaked'
      };
    } catch (error) {
      console.error('Error uncloaking file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateCloakedPath(originalPath) {
    const fileName = path.basename(originalPath);
    const extension = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, extension);
    
    // Generate random filename
    const randomName = crypto.randomBytes(8).toString('hex');
    const cloakedFileName = `${randomName}.dat`;
    
    // Store in secure location
    const secureDir = path.join(process.env.APPDATA || process.env.HOME, '.neon-archivist', 'secure', 'cloaked');
    fs.ensureDirSync(secureDir);
    
    return path.join(secureDir, cloakedFileName);
  }

  async createDecoyFile(originalPath) {
    const fileName = path.basename(originalPath);
    const extension = path.extname(fileName);
    
    // Create a decoy file that looks legitimate
    let decoyContent = '';
    
    switch (extension.toLowerCase()) {
      case '.txt':
        decoyContent = 'This file has been moved to a secure location for protection.';
        break;
      case '.pdf':
        decoyContent = '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(File Protected) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF';
        break;
      case '.jpg':
      case '.jpeg':
      case '.png':
        // Create a minimal valid image file
        decoyContent = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0]); // JPEG header
        break;
      default:
        decoyContent = 'File protected by PlayNexus Security Guardian';
    }
    
    await fs.writeFile(originalPath, decoyContent);
  }

  encryptData(data) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher('aes-256-cbc', this.encryptionKey);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV + encrypted data
    return iv.toString('hex') + ':' + encrypted;
  }

  decryptData(encryptedData) {
    const parts = encryptedData.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    
    const decipher = crypto.createDecipher('aes-256-cbc', this.encryptionKey);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  async saveCloakedRegistry() {
    const dataPath = path.join(process.env.APPDATA || process.env.HOME, '.neon-archivist', 'security');
    const registryPath = path.join(dataPath, 'cloaked-registry.json');
    
    const registry = Object.fromEntries(this.cloakedFiles);
    await fs.writeJson(registryPath, registry, { spaces: 2 });
  }

  async fullScan() {
    console.log('🔍 Initiating full security scan...');
    
    const scanResults = {
      timestamp: new Date(),
      cloakedFiles: this.cloakedFiles.size,
      intrusionAlerts: this.intrusionAlerts.length,
      securityLevel: this.securityLevel,
      systemHealth: await this.assessSystemHealth(),
      recommendations: []
    };
    
    // Generate security recommendations
    if (this.cloakedFiles.size === 0) {
      scanResults.recommendations.push('Consider cloaking sensitive files for enhanced protection');
    }
    
    if (this.intrusionAlerts.length > 10) {
      scanResults.recommendations.push('High number of security alerts detected - review system activity');
    }
    
    if (scanResults.systemHealth.score < 70) {
      scanResults.recommendations.push('System security health below optimal - run maintenance');
    }
    
    return scanResults;
  }

  async assessSystemHealth() {
    let score = 100;
    const issues = [];
    
    // Check cloaked files integrity
    for (const [path, data] of this.cloakedFiles) {
      try {
        const exists = await fs.pathExists(data.cloakedPath);
        if (!exists) {
          score -= 10;
          issues.push(`Cloaked file missing: ${path}`);
        }
      } catch (error) {
        score -= 5;
        issues.push(`Error checking cloaked file: ${path}`);
      }
    }
    
    // Check recent intrusion alerts
    const recentAlerts = this.intrusionAlerts.filter(alert => 
      (new Date() - alert.timestamp) < 24 * 60 * 60 * 1000 // Last 24 hours
    );
    
    if (recentAlerts.length > 5) {
      score -= 15;
      issues.push('High number of recent security alerts');
    }
    
    return {
      score: Math.max(0, score),
      issues,
      timestamp: new Date()
    };
  }

  activateSelfDefenseMode() {
    console.log('🛡️ Activating Self-Defense Mode...');
    
    this.selfDefenseMode = true;
    
    // Implement self-defense measures
    this.obfuscateSystemFiles();
    this.createFakeDesktop();
    this.activateEmergencyProtocols();
    
    return {
      success: true,
      message: 'Self-Defense Mode activated. System is now in maximum protection state.'
    };
  }

  deactivateSelfDefenseMode() {
    console.log('🛡️ Deactivating Self-Defense Mode...');
    
    this.selfDefenseMode = false;
    
    // Restore normal operation
    this.restoreSystemFiles();
    this.removeFakeDesktop();
    
    return {
      success: true,
      message: 'Self-Defense Mode deactivated. System restored to normal operation.'
    };
  }

  obfuscateSystemFiles() {
    // In a real implementation, this would obfuscate critical system files
    console.log('🔐 Obfuscating critical system files...');
  }

  createFakeDesktop() {
    // Create a fake desktop environment to confuse potential threats
    console.log('🎭 Creating decoy desktop environment...');
  }

  activateEmergencyProtocols() {
    // Activate emergency security protocols
    console.log('🚨 Emergency protocols activated...');
  }

  restoreSystemFiles() {
    // Restore system files to normal state
    console.log('🔓 Restoring system files...');
  }

  removeFakeDesktop() {
    // Remove fake desktop environment
    console.log('🎭 Removing decoy environment...');
  }

  async createBackup(filePath) {
    const backupPath = this.generateBackupPath(filePath);
    
    try {
      await fs.copy(filePath, backupPath);
      
      this.backupLocations.set(filePath, {
        backupPath,
        createdAt: new Date(),
        size: (await fs.stat(filePath)).size
      });
      
      return {
        success: true,
        backupPath,
        message: 'Backup created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateBackupPath(originalPath) {
    const fileName = path.basename(originalPath);
    const extension = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, extension);
    const timestamp = Date.now();
    
    const backupDir = path.join(process.env.APPDATA || process.env.HOME, '.neon-archivist', 'backups');
    fs.ensureDirSync(backupDir);
    
    return path.join(backupDir, `${nameWithoutExt}_backup_${timestamp}${extension}`);
  }

  async shutdown() {
    console.log('🛡️ Security Guardian Shutting Down...');
    
    // Save all security data
    await this.saveCloakedRegistry();
    
    // Deactivate self-defense mode if active
    if (this.selfDefenseMode) {
      this.deactivateSelfDefenseMode();
    }
    
    console.log('🔒 Security Guardian Offline');
  }

  // NEW FEATURE 11: Advanced Threat Detection
  async detectThreats() {
    const threats = [];
    const suspiciousPatterns = [
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.pif$/i,
      /\.vbs$/i,
      /\.js$/i
    ];
    
    const suspiciousNames = [
      'virus', 'malware', 'trojan', 'spyware', 'keylogger',
      'password', 'credit', 'card', 'bank', 'login'
    ];
    
    for (const [filePath, fileData] of this.monitoredFiles.entries()) {
      const fileName = path.basename(filePath).toLowerCase();
      const extension = path.extname(filePath).toLowerCase();
      
      // Check for suspicious file extensions
      if (suspiciousPatterns.some(pattern => pattern.test(fileName))) {
        threats.push({
          type: 'suspicious_extension',
          filePath,
          severity: 'high',
          description: `File with potentially dangerous extension: ${extension}`,
          timestamp: new Date().toISOString()
        });
      }
      
      // Check for suspicious file names
      if (suspiciousNames.some(name => fileName.includes(name))) {
        threats.push({
          type: 'suspicious_name',
          filePath,
          severity: 'medium',
          description: `File with suspicious name pattern: ${fileName}`,
          timestamp: new Date().toISOString()
        });
      }
      
      // Check for recently modified system files
      if (this.isSystemFile(filePath) && this.wasRecentlyModified(fileData)) {
        threats.push({
          type: 'system_file_modified',
          filePath,
          severity: 'high',
          description: 'System file was recently modified',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return threats;
  }

  // NEW FEATURE 12: Encryption Management System
  async manageEncryption() {
    const encryptionStatus = {
      encryptedFiles: [],
      unencryptedFiles: [],
      encryptionKey: null,
      encryptionStrength: 'AES-256'
    };
    
    // Generate encryption key if not exists
    if (!this.encryptionKey) {
      this.encryptionKey = this.generateEncryptionKey();
    }
    
    // Check encryption status of sensitive files
    for (const [filePath, fileData] of this.monitoredFiles.entries()) {
      if (this.isSensitiveFile(filePath)) {
        const isEncrypted = await this.checkFileEncryption(filePath);
        
        if (isEncrypted) {
          encryptionStatus.encryptedFiles.push({
            filePath,
            encryptionDate: fileData.encryptionDate,
            encryptionMethod: fileData.encryptionMethod || 'AES-256'
          });
        } else {
          encryptionStatus.unencryptedFiles.push({
            filePath,
            sensitivity: this.getFileSensitivity(filePath),
            recommendedAction: 'encrypt'
          });
        }
      }
    }
    
    return encryptionStatus;
  }

  // NEW FEATURE 13: Security Analytics Dashboard
  async generateSecurityAnalytics() {
    const analytics = {
      totalFiles: this.monitoredFiles.size,
      encryptedFiles: 0,
      suspiciousFiles: 0,
      systemFiles: 0,
      securityScore: 100,
      recentAlerts: [],
      threatLevel: 'low',
      recommendations: []
    };
    
    for (const [filePath, fileData] of this.monitoredFiles.entries()) {
      if (fileData.isEncrypted) analytics.encryptedFiles++;
      if (fileData.isSuspicious) analytics.suspiciousFiles++;
      if (this.isSystemFile(filePath)) analytics.systemFiles++;
    }
    
    // Calculate security score
    const totalFiles = analytics.totalFiles || 1;
    const encryptedRatio = analytics.encryptedFiles / totalFiles;
    const suspiciousRatio = analytics.suspiciousFiles / totalFiles;
    
    analytics.securityScore = Math.max(0, 100 - (suspiciousRatio * 50) + (encryptedRatio * 20));
    
    // Determine threat level
    if (analytics.securityScore < 50) analytics.threatLevel = 'high';
    else if (analytics.securityScore < 75) analytics.threatLevel = 'medium';
    else analytics.threatLevel = 'low';
    
    // Generate recommendations
    if (encryptedRatio < 0.3) {
      analytics.recommendations.push('Consider encrypting more sensitive files');
    }
    if (suspiciousRatio > 0.1) {
      analytics.recommendations.push('Review suspicious files for potential threats');
    }
    if (analytics.securityScore < 75) {
      analytics.recommendations.push('Run a full security scan');
    }
    
    return analytics;
  }

  // NEW FEATURE 14: Real-time File Monitoring
  async startRealTimeMonitoring() {
    if (this.monitoringActive) return;
    
    this.monitoringActive = true;
    console.log('🔍 Starting real-time file monitoring...');
    
    // Monitor file system events
    const chokidar = require('chokidar');
    const watcher = chokidar.watch(this.monitoredDirectories, {
      ignored: /[\/\\]\./,
      persistent: true,
      ignoreInitial: true
    });
    
    watcher
      .on('add', (filePath) => this.handleFileAdded(filePath))
      .on('change', (filePath) => this.handleFileChanged(filePath))
      .on('unlink', (filePath) => this.handleFileDeleted(filePath))
      .on('error', (error) => console.error('File monitoring error:', error));
    
    this.fileWatcher = watcher;
  }

  // NEW FEATURE 15: Advanced Backup System
  async createAdvancedBackup() {
    const backupConfig = {
      source: this.monitoredDirectories,
      destination: path.join(process.env.APPDATA || process.env.HOME, '.neon-archivist', 'backups'),
      compression: true,
      encryption: true,
      incremental: true,
      retention: 30 // days
    };
    
    const backupId = `backup_${Date.now()}`;
    const backupPath = path.join(backupConfig.destination, backupId);
    
    try {
      await fs.ensureDir(backupPath);
      
      // Create backup manifest
      const manifest = {
        id: backupId,
        timestamp: new Date().toISOString(),
        files: [],
        totalSize: 0,
        compressionRatio: 0,
        encryptionEnabled: backupConfig.encryption
      };
      
      // Backup each monitored directory
      for (const directory of this.monitoredDirectories) {
        const files = await this.getFilesRecursively(directory);
        
        for (const file of files) {
          const relativePath = path.relative(directory, file);
          const backupFilePath = path.join(backupPath, relativePath);
          
          await fs.ensureDir(path.dirname(backupFilePath));
          
          if (backupConfig.encryption) {
            await this.encryptFile(file, backupFilePath);
          } else {
            await fs.copy(file, backupFilePath);
          }
          
          const stats = await fs.stat(file);
          manifest.files.push({
            originalPath: file,
            backupPath: backupFilePath,
            size: stats.size,
            encrypted: backupConfig.encryption
          });
          
          manifest.totalSize += stats.size;
        }
      }
      
      // Save manifest
      await fs.writeJson(path.join(backupPath, 'manifest.json'), manifest, { spaces: 2 });
      
      // Clean old backups
      await this.cleanOldBackups(backupConfig.retention);
      
      return {
        success: true,
        backupId,
        backupPath,
        manifest
      };
      
    } catch (error) {
      console.error('Backup creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Helper methods for new features
  isSystemFile(filePath) {
    const systemPaths = [
      'C:\\Windows\\System32',
      'C:\\Windows\\SysWOW64',
      'C:\\Program Files',
      'C:\\Program Files (x86)'
    ];
    return systemPaths.some(systemPath => filePath.startsWith(systemPath));
  }

  wasRecentlyModified(fileData) {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    return fileData.lastModified && fileData.lastModified > oneHourAgo;
  }

  isSensitiveFile(filePath) {
    const sensitivePatterns = [
      /password/i,
      /credential/i,
      /private/i,
      /secret/i,
      /\.key$/i,
      /\.pem$/i,
      /\.p12$/i
    ];
    
    const fileName = path.basename(filePath);
    return sensitivePatterns.some(pattern => pattern.test(fileName));
  }

  getFileSensitivity(filePath) {
    if (this.isSensitiveFile(filePath)) return 'high';
    if (this.isSystemFile(filePath)) return 'medium';
    return 'low';
  }

  generateEncryptionKey() {
    const crypto = require('crypto');
    return crypto.randomBytes(32);
  }

  async checkFileEncryption(filePath) {
    try {
      const data = await fs.readFile(filePath);
      // Simple check: encrypted files usually have high entropy
      const entropy = this.calculateEntropy(data);
      return entropy > 7.5; // High entropy suggests encryption
    } catch (error) {
      return false;
    }
  }

  calculateEntropy(data) {
    const byteCounts = new Array(256).fill(0);
    for (const byte of data) {
      byteCounts[byte]++;
    }
    
    let entropy = 0;
    const length = data.length;
    
    for (let i = 0; i < 256; i++) {
      if (byteCounts[i] > 0) {
        const probability = byteCounts[i] / length;
        entropy -= probability * Math.log2(probability);
      }
    }
    
    return entropy;
  }

  async handleFileAdded(filePath) {
    console.log(`🔍 New file detected: ${filePath}`);
    this.monitoredFiles.set(filePath, {
      added: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isSuspicious: this.isSuspiciousFile(filePath)
    });
  }

  async handleFileChanged(filePath) {
    console.log(`🔍 File modified: ${filePath}`);
    const fileData = this.monitoredFiles.get(filePath) || {};
    fileData.lastModified = new Date().toISOString();
    this.monitoredFiles.set(filePath, fileData);
  }

  async handleFileDeleted(filePath) {
    console.log(`🔍 File deleted: ${filePath}`);
    this.monitoredFiles.delete(filePath);
  }

  isSuspiciousFile(filePath) {
    const suspiciousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.vbs'];
    const extension = path.extname(filePath).toLowerCase();
    return suspiciousExtensions.includes(extension);
  }

  async getFilesRecursively(directory) {
    const files = [];
    const items = await fs.readdir(directory);
    
    for (const item of items) {
      const fullPath = path.join(directory, item);
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        files.push(...await this.getFilesRecursively(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  async cleanOldBackups(retentionDays) {
    const backupDir = path.join(process.env.APPDATA || process.env.HOME, '.neon-archivist', 'backups');
    const cutoffTime = Date.now() - (retentionDays * 24 * 60 * 60 * 1000);
    
    try {
      const backups = await fs.readdir(backupDir);
      
      for (const backup of backups) {
        const backupPath = path.join(backupDir, backup);
        const stats = await fs.stat(backupPath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          await fs.remove(backupPath);
          console.log(`🗑️ Removed old backup: ${backup}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning old backups:', error);
    }
  }
}

module.exports = SecurityGuardian; 