const { app, BrowserWindow, ipcMain, dialog, shell, Menu, Tray, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const crypto = require('crypto');

// Quantum System Core
const QuantVM = require('./core/quantvm');
const FileBiome = require('./core/file-biome');
const SecurityGuardian = require('./core/security-guardian');
const ThemeEngine = require('./core/theme-engine');

let mainWindow;
let quantvm;
let fileBiome;
let securityGuardian;
let themeEngine;
let tray;

// Quantum System State
let systemState = {
  mode: 'hacker-lair',
  theme: 'synthwave',
  aiEnabled: true,
  securityLevel: 'standard',
  fileEntropy: 0,
  lastActivity: Date.now()
};

// Initialize Quantum Core
async function initializeQuantumCore() {
  console.log('🧠 Initializing QUANTVM Core...');
  
  quantvm = new QuantVM();
  fileBiome = new FileBiome();
  securityGuardian = new SecurityGuardian();
  themeEngine = new ThemeEngine();
  
  await quantvm.initialize();
  await fileBiome.initialize();
  await securityGuardian.initialize();
  await themeEngine.initialize();
  
  console.log('⚡ QUANTVM Core Online - System Ready');
}

// Create Living Cyberpunk Window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false
    },
    icon: path.join(__dirname, '../assets/icons/icon.png'),
    titleBarStyle: 'hidden',
    frame: false,
    transparent: true,
    show: false,
    backgroundColor: '#000000'
  });

  // Load the quantum interface
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  // Quantum window events
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    quantvm.speak('PlayNexus // OS:QUANTVM initialized. Welcome to the future.');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Security: Prevent new window creation
  mainWindow.webContents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
}

// System Tray Integration
function createTray() {
  const iconPath = path.join(__dirname, '../assets/icons/tray-icon.png');
  const icon = nativeImage.createFromPath(iconPath);
  
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🧠 QUANTVM Status',
      enabled: false
    },
    { type: 'separator' },
    {
      label: '🔍 Quick Scan',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('quick-scan');
        }
      }
    },
    {
      label: '🛡️ Security Check',
      click: () => {
        if (mainWindow) {
          mainWindow.webContents.send('security-check');
        }
      }
    },
    { type: 'separator' },
    {
      label: '⚡ Show/Hide',
      click: () => {
        if (mainWindow.isVisible()) {
          mainWindow.hide();
        } else {
          mainWindow.show();
        }
      }
    },
    {
      label: '🚪 Exit',
      click: () => {
        app.quit();
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
      tray.setToolTip('PlayNexus // OS:QUANTVM');
  
  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

// IPC Handlers for Quantum Communication
ipcMain.handle('quantvm-command', async (event, command) => {
  try {
    const result = await quantvm.processCommand(command);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-system-state', () => {
  return systemState;
});

ipcMain.handle('update-system-state', (event, newState) => {
  systemState = { ...systemState, ...newState };
  return systemState;
});

ipcMain.handle('scan-directory', async (event, directoryPath) => {
  try {
    const scanResult = await fileBiome.scanDirectory(directoryPath);
    return { success: true, data: scanResult };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('organize-files', async (event, options) => {
  try {
    const result = await fileBiome.organizeFiles(options);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('security-scan', async (event) => {
  try {
    const scanResult = await securityGuardian.fullScan();
    return { success: true, data: scanResult };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('cloak-file', async (event, filePath) => {
  try {
    const result = await securityGuardian.cloakFile(filePath);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('change-theme', async (event, themeName) => {
  try {
    const theme = await themeEngine.loadTheme(themeName);
    systemState.theme = themeName;
    return { success: true, data: theme };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-file-biome', async (event) => {
  try {
    const biomeData = await fileBiome.getBiomeData();
    return { success: true, data: biomeData };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// App Lifecycle
app.whenReady().then(async () => {
  await initializeQuantumCore();
  createWindow();
  createTray();
  
  // Periodic system maintenance
  setInterval(() => {
    fileBiome.updateEntropyLevel();
    securityGuardian.monitorSystem();
  }, 30000); // Every 30 seconds
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', async () => {
  if (quantvm) {
    await quantvm.shutdown();
  }
  if (fileBiome) {
    await fileBiome.shutdown();
  }
  if (securityGuardian) {
    await securityGuardian.shutdown();
  }
});

// Security: Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
} 