const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const fs = require("fs");
const packageJSON = require("./package.json");
const path = require("path");
const cp = require("child_process");
const util = require("util");
const exec = util.promisify(cp.exec);

module.exports = {
  packagerConfig: {
    asar: {
      unpack: ["**/node_modules/@pinggy/**", "**/node_modules/pinggy/**", "**/node_modules/winston/**"]
    },
  },
  rebuildConfig: {
    onlyModules: ["@pinggy/pinggy"]
  },
  hooks:{
    packageAfterCopy: async (forgeConfig, buildPath, electronVersion, platform, arch) => {
      console.log("Running packageAfterCopy: Installing production dependencies...");

      const srcPackageJson = path.resolve(__dirname, "package.json");
      const destPackageJson = path.join(buildPath, "package.json");

      // 1. Copy package.json to the build folder
      fs.copyFileSync(srcPackageJson, destPackageJson);

      // 2. Run npm install inside the build folder
      console.log(`Installing production dependencies in ${buildPath} for ${platform} ${arch}...`);
      try {
        await exec(`npm install --omit=dev --no-bin-links --arch=${arch} --platform=${platform}`, {
          cwd: buildPath
        });
        console.log("Production dependencies installed successfully.");
      } catch (err) {
        console.error("Failed to install dependencies:", err);
        throw err;
      }
    }

  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        setupIcon: "./src/icons/banner_icon.ico",
        loadingGif: "./public/loading2.gif",
        iconUrl:
          "https://s3.us-east-2.amazonaws.com/pinggy.web.debugger/icon.ico",
        author: "pinggy",
        description: "Create tunnels to localhost",
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
       config: {
        options: {
          icon: "./src/icons/icon.png",
          bin: "my-app",
          homepage: "https://pinggy.io",
          productName: "my-app",
        },
      },
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
              preload: {
                js: './src/preload.js',
              },
            },
          ],
        },
      },
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};
