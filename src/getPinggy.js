const { app } = require("electron");

let pinggyModulePromise = null;
let pinggyContext = null;

function getPinggy() {
  if (!pinggyModulePromise) {
    pinggyModulePromise = import("pinggy")
      .then((mod) => {
       
          mod.enablePackageLogging({
            level: "debug",
            filePath: "log.txt",
            stdout: true,
            source: true,
            silent: false,
            enableSdkLog: true,
          });
        

        const tunnelOps = new mod.TunnelOperations();
        pinggyContext = {
          module: mod,
          tunnelOps
        };
        console.log("Pinggy SDK loaded successfully.",tunnelOps );
        return pinggyContext;
      })
      .catch((err) => {
        console.error("Failed to load Pinggy SDK:", err);
        throw err;
      });
  }

  return pinggyModulePromise;
}
app.whenReady().then(getPinggy);

module.exports = {
  getPinggy,
};
