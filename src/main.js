const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const { getPinggy } = require('./getPinggy');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  registerIpcHandlers();

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function registerIpcHandlers() {
  let activeTunnelId = null;
  ipcMain.handle("startTunnel", async (event, args) => {
    console.log("IPC Main: startTunnel called with args:", args);
    const pinggyContext = await getPinggy();
    const { tunnelOps } = pinggyContext;
    const tunnelSpec = {
      configname: 'Django Tunnel',
      configid: '56f60101-e086-4701-85ed-472af73ee353',
      type: 'http',
      localport: 8000,
      token: '',
      autoreconnect: true,
      force: true,
      ipwhitelist: null,
      forwardedhost: 'localhost',
      regioncode: '',
      serveraddress: 'a.pinggy.io',
      lastEdited: '2025-12-03T09:42:56.972Z',
      allowPreflight: false,
      serve: '',
      additionalForwarding: [],
      webdebuggerport: 0,
      basicauth: null,
      bearerauth: null,
      headermodification: [],
      httpsOnly: false,
      locaservertls: false,
      locaservertlssni: 'localhost',
      xff: '',
      fullRequestUrl: false,
      noReverseProxy: false
    }

    const startResponse = await tunnelOps.handleStart(tunnelSpec);
    activeTunnelId = startResponse.tunnelid;

    // Implement tunnel starting logic here
    console.log("Starting tunnel with args:", startResponse);
    return { status: "tunnel started", data: startResponse };
  });

  ipcMain.handle("stopTunnel", async (event, args) => {
    const pinggyContext = await getPinggy();
    const { tunnelOps } = pinggyContext;
    let stopResponse = null;
    if (activeTunnelId) {
      stopResponse = await tunnelOps.handleStop(activeTunnelId);
      activeTunnelId = null;
    }
    // Implement tunnel stopping logic here
    console.log("Stopping tunnel with args:", stopResponse);
    return { status: "tunnel stopped", data: stopResponse };
  });

  ipcMain.handle("tunnelList", async (event, args) => {

    const { tunnelOps } = await getPinggy();
    return await tunnelOps.handleList();
  })


}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
