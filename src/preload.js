// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");


contextBridge.exposeInMainWorld("api", {
  startTunnel: async () => {
    return await ipcRenderer.invoke("startTunnel");
  },
  stopTunnel: async () => {
    return await ipcRenderer.invoke("stopTunnel");
  },
  tunnelList: async () => {
    return await ipcRenderer.invoke("tunnelList");
  },
});
