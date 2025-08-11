const fs = require('fs-extra');
const path = require('path');
const chokidar = require('chokidar');
const crypto = require('crypto');

class FileBiome {
  constructor() {
    this.name = 'FileBiome';
    this.version = '2.0.0';
    this.watchers = new Map();
    this.fileNodes = new Map();
    this.entropyZones = new Map();
    this.usagePatterns = new Map();
    this.biomeData = {
      totalFiles: 0,
      totalSize: 0,
      entropyLevel: 0,
      healthScore: 100,
      lastScan: null,
      zones: []
    };
  }

  async initialize() {
    console.log('🧬 FileBiome Initializing...');
    
    // Load existing biome data first
    await this.loadBiomeData();
    
    // Initialize file monitoring in background
    this.initializeFileWatchers().then(() => {
      console.log('🌿 FileBiome Online - Living File System Active');
    }).catch(err => {
      console.error('FileBiome watcher error:', err);
    });
    
    console.log('🌿 FileBiome Core Online - Background scanning active');
  }

  async initializeFileWatchers() {
    // Monitor common directories (start with smaller ones first)
    const directories = [
      path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop'),
      path.join(process.env.USERPROFILE || process.env.HOME, 'Documents'),
      path.join(process.env.USERPROFILE || process.env.HOME, 'Pictures')
    ];

    // Add Downloads later to avoid blocking UI
    const downloadsDir = path.join(process.env.USERPROFILE || process.env.HOME, 'Downloads');
    
    for (const dir of directories) {
      if (await fs.pathExists(dir)) {
        await this.watchDirectory(dir);
      }
    }
    
    // Add Downloads directory after a delay to prevent UI blocking
    setTimeout(async () => {
      if (await fs.pathExists(downloadsDir)) {
        console.log('📁 Adding Downloads directory to monitoring...');
        await this.watchDirectory(downloadsDir);
      }
    }, 5000); // 5 second delay
  }

  async watchDirectory(directoryPath) {
    const watcher = chokidar.watch(directoryPath, {
      persistent: true,
      ignoreInitial: true, // Don't scan everything on startup
      depth: 2, // Only watch 2 levels deep initially
      ignored: [
        /(^|[\/\\])\../, // Ignore hidden files
        /node_modules/,
        /\.git/,
        /\.vscode/,
        /\.cache/,
        /temp/,
        /tmp/,
        /build/,
        /dist/,
        /bin/,
        /obj/
      ]
    });

    watcher
      .on('add', (filePath) => this.onFileAdded(filePath))
      .on('change', (filePath) => this.onFileChanged(filePath))
      .on('unlink', (filePath) => this.onFileRemoved(filePath))
      .on('addDir', (dirPath) => this.onDirectoryAdded(dirPath))
      .on('unlinkDir', (dirPath) => this.onDirectoryRemoved(dirPath));

    this.watchers.set(directoryPath, watcher);
  }

  async onFileAdded(filePath) {
    const fileNode = await this.createFileNode(filePath);
    this.fileNodes.set(filePath, fileNode);
    this.updateBiomeData();
  }

  async onFileChanged(filePath) {
    const fileNode = this.fileNodes.get(filePath);
    if (fileNode) {
      fileNode.lastAccessed = new Date();
      fileNode.accessCount++;
      this.updateUsagePattern(filePath);
    }
  }

  async onFileRemoved(filePath) {
    this.fileNodes.delete(filePath);
    this.updateBiomeData();
  }

  async onDirectoryAdded(dirPath) {
    // Scan new directory
    await this.scanDirectory(dirPath);
  }

  async onDirectoryRemoved(dirPath) {
    // Remove all files from this directory
    for (const [filePath, fileNode] of this.fileNodes) {
      if (filePath.startsWith(dirPath)) {
        this.fileNodes.delete(filePath);
      }
    }
    this.updateBiomeData();
  }

  async createFileNode(filePath) {
    try {
      const stats = await fs.stat(filePath);
      const ext = path.extname(filePath).toLowerCase();
      
      const fileNode = {
        path: filePath,
        name: path.basename(filePath),
        size: stats.size,
        type: this.categorizeFileType(ext),
        created: stats.birthtime,
        modified: stats.mtime,
        lastAccessed: new Date(),
        accessCount: 0,
        health: this.calculateFileHealth(stats),
        entropy: this.calculateFileEntropy(filePath, stats),
        category: this.categorizeFile(filePath, ext),
        tags: this.generateTags(filePath, ext),
        nodeId: crypto.randomBytes(8).toString('hex')
      };

      return fileNode;
    } catch (error) {
      console.error(`Error creating file node for ${filePath}:`, error);
      return null;
    }
  }

  categorizeFileType(extension) {
    const typeMap = {
      // Documents
      '.pdf': 'document',
      '.doc': 'document',
      '.docx': 'document',
      '.txt': 'document',
      '.rtf': 'document',
      
      // Images
      '.jpg': 'image',
      '.jpeg': 'image',
      '.png': 'image',
      '.gif': 'image',
      '.bmp': 'image',
      '.svg': 'image',
      
      // Videos
      '.mp4': 'video',
      '.avi': 'video',
      '.mov': 'video',
      '.wmv': 'video',
      '.mkv': 'video',
      
      // Audio
      '.mp3': 'audio',
      '.wav': 'audio',
      '.flac': 'audio',
      '.aac': 'audio',
      
      // Archives
      '.zip': 'archive',
      '.rar': 'archive',
      '.7z': 'archive',
      '.tar': 'archive',
      
      // Code
      '.js': 'code',
      '.py': 'code',
      '.java': 'code',
      '.cpp': 'code',
      '.html': 'code',
      '.css': 'code',
      
      // Data
      '.json': 'data',
      '.xml': 'data',
      '.csv': 'data',
      '.xlsx': 'data',
      '.db': 'data'
    };

    return typeMap[extension] || 'unknown';
  }

  categorizeFile(filePath, extension) {
    const fileName = path.basename(filePath).toLowerCase();
    
    // Project files
    if (fileName.includes('project') || fileName.includes('final') || fileName.includes('draft')) {
      return 'project';
    }
    
    // Work files
    if (fileName.includes('work') || fileName.includes('business') || fileName.includes('report')) {
      return 'work';
    }
    
    // Personal files
    if (fileName.includes('personal') || fileName.includes('family') || fileName.includes('vacation')) {
      return 'personal';
    }
    
    // Temporary files
    if (fileName.includes('temp') || fileName.includes('tmp') || fileName.includes('cache')) {
      return 'temporary';
    }
    
    // Screenshots
    if (fileName.includes('screenshot') || fileName.includes('screen')) {
      return 'screenshot';
    }
    
    return 'general';
  }

  generateTags(filePath, extension) {
    const tags = [];
    const fileName = path.basename(filePath).toLowerCase();
    
    // Add type-based tags
    tags.push(this.categorizeFileType(extension));
    tags.push(this.categorizeFile(filePath, extension));
    
    // Add content-based tags
    if (fileName.includes('invoice') || fileName.includes('receipt')) {
      tags.push('financial');
    }
    
    if (fileName.includes('photo') || fileName.includes('image')) {
      tags.push('media');
    }
    
    if (fileName.includes('backup') || fileName.includes('copy')) {
      tags.push('backup');
    }
    
    return tags;
  }

  calculateFileHealth(stats) {
    const now = new Date();
    const ageInDays = (now - stats.mtime) / (1000 * 60 * 60 * 24);
    const sizeInMB = stats.size / (1024 * 1024);
    
    let health = 100;
    
    // Penalize very old files
    if (ageInDays > 365) {
      health -= 20;
    }
    
    // Penalize very large files
    if (sizeInMB > 100) {
      health -= 15;
    }
    
    // Bonus for recently modified files
    if (ageInDays < 7) {
      health += 10;
    }
    
    return Math.max(0, Math.min(100, health));
  }

  calculateFileEntropy(filePath, stats) {
    // Calculate entropy based on file characteristics
    let entropy = 0;
    
    // Size entropy
    const sizeInMB = stats.size / (1024 * 1024);
    if (sizeInMB > 50) entropy += 30;
    else if (sizeInMB > 10) entropy += 20;
    else if (sizeInMB > 1) entropy += 10;
    
    // Age entropy
    const ageInDays = (new Date() - stats.mtime) / (1000 * 60 * 60 * 24);
    if (ageInDays > 180) entropy += 40;
    else if (ageInDays > 90) entropy += 30;
    else if (ageInDays > 30) entropy += 20;
    
    // Location entropy (files in root directories are more chaotic)
    const depth = filePath.split(path.sep).length;
    if (depth <= 3) entropy += 20;
    
    return Math.min(100, entropy);
  }

  updateUsagePattern(filePath) {
    const now = new Date();
    const pattern = this.usagePatterns.get(filePath) || {
      accessCount: 0,
      lastAccess: null,
      accessFrequency: 0
    };
    
    pattern.accessCount++;
    pattern.lastAccess = now;
    
    // Calculate access frequency (accesses per day)
    if (pattern.lastAccess) {
      const daysSinceLastAccess = (now - pattern.lastAccess) / (1000 * 60 * 60 * 24);
      pattern.accessFrequency = 1 / Math.max(1, daysSinceLastAccess);
    }
    
    this.usagePatterns.set(filePath, pattern);
  }

  updateBiomeData() {
    let totalFiles = 0;
    let totalSize = 0;
    let totalEntropy = 0;
    let totalHealth = 0;
    
    for (const fileNode of this.fileNodes.values()) {
      totalFiles++;
      totalSize += fileNode.size;
      totalEntropy += fileNode.entropy;
      totalHealth += fileNode.health;
    }
    
    this.biomeData = {
      totalFiles,
      totalSize,
      entropyLevel: totalFiles > 0 ? totalEntropy / totalFiles : 0,
      healthScore: totalFiles > 0 ? totalHealth / totalFiles : 100,
      lastScan: new Date(),
      zones: this.calculateEntropyZones()
    };
  }

  calculateEntropyZones() {
    const zones = [];
    const directories = new Map();
    
    // Group files by directory
    for (const fileNode of this.fileNodes.values()) {
      const dir = path.dirname(fileNode.path);
      if (!directories.has(dir)) {
        directories.set(dir, []);
      }
      directories.get(dir).push(fileNode);
    }
    
    // Calculate entropy for each directory
    for (const [dir, files] of directories) {
      const avgEntropy = files.reduce((sum, file) => sum + file.entropy, 0) / files.length;
      const zone = {
        path: dir,
        name: path.basename(dir),
        entropy: avgEntropy,
        fileCount: files.length,
        health: files.reduce((sum, file) => sum + file.health, 0) / files.length,
        status: avgEntropy > 70 ? 'critical' : avgEntropy > 50 ? 'warning' : 'healthy'
      };
      
      zones.push(zone);
    }
    
    return zones.sort((a, b) => b.entropy - a.entropy);
  }

  async scanDirectory(directoryPath) {
    console.log(`🔍 Scanning directory: ${directoryPath}`);
    
    try {
      const files = await fs.readdir(directoryPath);
      
      for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.stat(filePath);
        
        if (stats.isFile()) {
          const fileNode = await this.createFileNode(filePath);
          if (fileNode) {
            this.fileNodes.set(filePath, fileNode);
          }
        } else if (stats.isDirectory()) {
          await this.scanDirectory(filePath);
        }
      }
      
      this.updateBiomeData();
      return { success: true, filesScanned: files.length };
    } catch (error) {
      console.error(`Error scanning directory ${directoryPath}:`, error);
      return { success: false, error: error.message };
    }
  }

  async organizeFiles(options = {}) {
    const {
      targetDirectory = path.join(process.env.USERPROFILE || process.env.HOME, 'Desktop'),
      strategy = 'type',
      createBackup = true
    } = options;

    console.log(`🧹 Organizing files in: ${targetDirectory}`);
    
    const results = {
      organized: 0,
      skipped: 0,
      errors: 0,
      details: []
    };

    try {
      // Get files in target directory
      const files = await fs.readdir(targetDirectory);
      
      for (const file of files) {
        const filePath = path.join(targetDirectory, file);
        const stats = await fs.stat(filePath);
        
        if (!stats.isFile()) continue;
        
        try {
          const fileNode = await this.createFileNode(filePath);
          if (!fileNode) continue;
          
          const newPath = this.determineNewPath(fileNode, strategy, targetDirectory);
          
          if (newPath !== filePath) {
            // Create backup if requested
            if (createBackup) {
              const backupPath = filePath + '.backup';
              await fs.copy(filePath, backupPath);
            }
            
            // Move file
            await fs.move(filePath, newPath);
            
            // Update file node
            fileNode.path = newPath;
            this.fileNodes.set(newPath, fileNode);
            this.fileNodes.delete(filePath);
            
            results.organized++;
            results.details.push({
              original: filePath,
              new: newPath,
              type: fileNode.type,
              category: fileNode.category
            });
          } else {
            results.skipped++;
          }
        } catch (error) {
          results.errors++;
          console.error(`Error organizing file ${file}:`, error);
        }
      }
      
      this.updateBiomeData();
      return results;
    } catch (error) {
      console.error('Error during file organization:', error);
      return { success: false, error: error.message };
    }
  }

  determineNewPath(fileNode, strategy, baseDirectory) {
    let newDirectory = baseDirectory;
    
    switch (strategy) {
      case 'type':
        newDirectory = path.join(baseDirectory, fileNode.type);
        break;
      case 'category':
        newDirectory = path.join(baseDirectory, fileNode.category);
        break;
      case 'date':
        const year = fileNode.modified.getFullYear();
        const month = String(fileNode.modified.getMonth() + 1).padStart(2, '0');
        newDirectory = path.join(baseDirectory, year.toString(), month);
        break;
      case 'size':
        const sizeInMB = fileNode.size / (1024 * 1024);
        if (sizeInMB > 100) newDirectory = path.join(baseDirectory, 'large');
        else if (sizeInMB > 10) newDirectory = path.join(baseDirectory, 'medium');
        else newDirectory = path.join(baseDirectory, 'small');
        break;
    }
    
    // Ensure directory exists
    fs.ensureDirSync(newDirectory);
    
    return path.join(newDirectory, fileNode.name);
  }

  getBiomeData() {
    return this.biomeData;
  }

  updateEntropyLevel() {
    this.updateBiomeData();
    return this.biomeData.entropyLevel;
  }

  async shutdown() {
    console.log('🌿 FileBiome Shutting Down...');
    
    // Stop all watchers
    for (const [directory, watcher] of this.watchers) {
      await watcher.close();
    }
    
    this.watchers.clear();
    console.log('🌿 FileBiome Offline');
  }

  async loadBiomeData() {
    // Load any persisted biome data
    // This would typically load from a database or file
    console.log('📊 Loading existing biome data...');
  }

  // NEW FEATURE 6: File Health Monitoring
  async monitorFileHealth() {
    const healthMetrics = {
      totalFiles: 0,
      corruptedFiles: 0,
      duplicateFiles: 0,
      oldFiles: 0,
      largeFiles: 0,
      healthScore: 100
    };

    for (const [filePath, fileData] of this.biomeData.entries()) {
      healthMetrics.totalFiles++;
      
      try {
        const stats = await fs.stat(filePath);
        const fileAge = Date.now() - stats.mtime.getTime();
        const fileSize = stats.size;
        
        // Check for old files (older than 1 year)
        if (fileAge > 365 * 24 * 60 * 60 * 1000) {
          healthMetrics.oldFiles++;
        }
        
        // Check for large files (larger than 100MB)
        if (fileSize > 100 * 1024 * 1024) {
          healthMetrics.largeFiles++;
        }
        
        // Check for potential corruption (0 byte files that shouldn't be)
        if (fileSize === 0 && !this.isExpectedEmptyFile(filePath)) {
          healthMetrics.corruptedFiles++;
        }
        
      } catch (error) {
        healthMetrics.corruptedFiles++;
      }
    }
    
    // Calculate health score
    const issues = healthMetrics.corruptedFiles + healthMetrics.duplicateFiles;
    healthMetrics.healthScore = Math.max(0, 100 - (issues / healthMetrics.totalFiles) * 100);
    
    return healthMetrics;
  }

  // NEW FEATURE 7: Intelligent Duplicate Detection
  async findDuplicateFiles() {
    const fileHashes = new Map();
    const duplicates = [];
    
    for (const [filePath, fileData] of this.biomeData.entries()) {
      try {
        const stats = await fs.stat(filePath);
        if (stats.size < 1024 * 1024) { // Only check files smaller than 1MB for performance
          const hash = await this.calculateFileHash(filePath);
          
          if (fileHashes.has(hash)) {
            duplicates.push({
              original: fileHashes.get(hash),
              duplicate: filePath,
              size: stats.size,
              hash: hash
            });
          } else {
            fileHashes.set(hash, filePath);
          }
        }
      } catch (error) {
        console.error(`Error checking file ${filePath}:`, error);
      }
    }
    
    return duplicates;
  }

  // NEW FEATURE 8: Smart Archiving System
  async suggestArchiving() {
    const archiveSuggestions = [];
    const now = Date.now();
    const oneYearAgo = now - (365 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = now - (180 * 24 * 60 * 60 * 1000);
    
    for (const [filePath, fileData] of this.biomeData.entries()) {
      try {
        const stats = await fs.stat(filePath);
        const lastAccess = Math.max(stats.atime.getTime(), stats.mtime.getTime());
        const fileAge = now - lastAccess;
        
        let archivePriority = 0;
        let reason = '';
        
        // High priority: files older than 1 year and not accessed recently
        if (fileAge > oneYearAgo && lastAccess < sixMonthsAgo) {
          archivePriority = 3;
          reason = 'Very old file with no recent access';
        }
        // Medium priority: files older than 6 months
        else if (fileAge > sixMonthsAgo) {
          archivePriority = 2;
          reason = 'Older file with limited recent activity';
        }
        // Low priority: files with low access frequency
        else if (fileData.accessCount < 3) {
          archivePriority = 1;
          reason = 'Rarely accessed file';
        }
        
        if (archivePriority > 0) {
          archiveSuggestions.push({
            filePath,
            priority: archivePriority,
            reason,
            lastAccess: new Date(lastAccess),
            accessCount: fileData.accessCount,
            size: stats.size
          });
        }
      } catch (error) {
        console.error(`Error checking file ${filePath}:`, error);
      }
    }
    
    return archiveSuggestions.sort((a, b) => b.priority - a.priority);
  }

  // NEW FEATURE 9: File Access Pattern Analysis
  async analyzeAccessPatterns() {
    const patterns = {
      mostAccessed: [],
      recentlyAccessed: [],
      neverAccessed: [],
      accessTrends: {}
    };
    
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    for (const [filePath, fileData] of this.biomeData.entries()) {
      const accessCount = fileData.accessCount || 0;
      const lastAccess = fileData.lastAccess ? new Date(fileData.lastAccess).getTime() : 0;
      
      // Most accessed files
      if (accessCount > 10) {
        patterns.mostAccessed.push({
          filePath,
          accessCount,
          lastAccess: new Date(lastAccess)
        });
      }
      
      // Recently accessed files
      if (lastAccess > oneWeekAgo) {
        patterns.recentlyAccessed.push({
          filePath,
          accessCount,
          lastAccess: new Date(lastAccess)
        });
      }
      
      // Never accessed files
      if (accessCount === 0) {
        patterns.neverAccessed.push({
          filePath,
          lastAccess: new Date(lastAccess)
        });
      }
    }
    
    // Sort by access count
    patterns.mostAccessed.sort((a, b) => b.accessCount - a.accessCount);
    patterns.recentlyAccessed.sort((a, b) => b.lastAccess - a.lastAccess);
    
    return patterns;
  }

  // NEW FEATURE 10: Intelligent File Organization
  async suggestOrganization() {
    const suggestions = [];
    const categories = {
      'work': [],
      'media': [],
      'documents': [],
      'downloads': [],
      'temp': []
    };
    
    for (const [filePath, fileData] of this.biomeData.entries()) {
      const fileName = path.basename(filePath);
      const extension = path.extname(filePath).toLowerCase();
      
      // Categorize by extension and name
      if (['.doc', '.docx', '.pdf', '.txt', '.rtf'].includes(extension)) {
        categories.documents.push({ filePath, fileName, reason: 'Document file' });
      } else if (['.jpg', '.jpeg', '.png', '.gif', '.mp4', '.avi', '.mp3'].includes(extension)) {
        categories.media.push({ filePath, fileName, reason: 'Media file' });
      } else if (fileName.toLowerCase().includes('temp') || fileName.toLowerCase().includes('cache')) {
        categories.temp.push({ filePath, fileName, reason: 'Temporary file' });
      } else if (path.dirname(filePath).toLowerCase().includes('downloads')) {
        categories.downloads.push({ filePath, fileName, reason: 'Downloaded file' });
      } else if (fileName.toLowerCase().includes('work') || fileName.toLowerCase().includes('project')) {
        categories.work.push({ filePath, fileName, reason: 'Work-related file' });
      }
    }
    
    // Generate suggestions for each category
    for (const [category, files] of Object.entries(categories)) {
      if (files.length > 5) {
        suggestions.push({
          action: 'organize',
          category,
          files: files.slice(0, 10), // Limit to first 10 files
          reason: `Found ${files.length} ${category} files that could be organized`,
          priority: files.length > 20 ? 'high' : 'medium'
        });
      }
    }
    
    return suggestions;
  }

  // Helper methods for new features
  async calculateFileHash(filePath) {
    const crypto = require('crypto');
    const hash = crypto.createHash('md5');
    const data = await fs.readFile(filePath);
    hash.update(data);
    return hash.digest('hex');
  }

  isExpectedEmptyFile(filePath) {
    const emptyFilePatterns = ['.gitkeep', '.empty', 'placeholder'];
    const fileName = path.basename(filePath);
    return emptyFilePatterns.some(pattern => fileName.includes(pattern));
  }
}

module.exports = FileBiome; 