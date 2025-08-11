const { contextBridge, ipcRenderer } = require('electron');

// Secure API bridge for quantum communication
contextBridge.exposeInMainWorld('quantvmAPI', {
  // QUANTVM AI Core
  processCommand: (command) => ipcRenderer.invoke('quantvm-command', command),
  
  // System State Management
  getSystemState: () => ipcRenderer.invoke('get-system-state'),
  updateSystemState: (newState) => ipcRenderer.invoke('update-system-state', newState),
  
  // File Biome Operations
  scanDirectory: (path) => ipcRenderer.invoke('scan-directory', path),
  organizeFiles: (options) => ipcRenderer.invoke('organize-files', options),
  getFileBiome: () => ipcRenderer.invoke('get-file-biome'),
  
  // Security Guardian
  securityScan: () => ipcRenderer.invoke('security-scan'),
  cloakFile: (filePath) => ipcRenderer.invoke('cloak-file', filePath),
  
  // Theme Engine
  changeTheme: (themeName) => ipcRenderer.invoke('change-theme', themeName),
  
  // Event Listeners
  onQuickScan: (callback) => ipcRenderer.on('quick-scan', callback),
  onSecurityCheck: (callback) => ipcRenderer.on('security-check', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Expose system information
contextBridge.exposeInMainWorld('systemInfo', {
  platform: process.platform,
  arch: process.arch,
  version: process.version,
  userAgent: navigator.userAgent
});

// Security: Prevent access to Node.js APIs
contextBridge.exposeInMainWorld('nodeAPI', {
  // Only expose what's absolutely necessary
  path: {
    join: (...args) => require('path').join(...args),
    basename: (path) => require('path').basename(path),
    extname: (path) => require('path').extname(path)
  }
}); 