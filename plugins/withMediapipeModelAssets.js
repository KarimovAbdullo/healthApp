/**
 * Copies MediaPipe .task models into native projects (same idea as the old posedetection Expo plugin).
 * Used with react-native-mediapipe from https://github.com/cdiddy77/react-native-mediapipe
 */
const path = require("path");
const fs = require("fs");
const {
  createRunOncePlugin,
  withDangerousMod,
  withXcodeProject,
  IOSConfig,
} = require("@expo/config-plugins");

function copyAndroidAssets(projectRoot, assetsPaths, ignoredPattern) {
  const assetsDir = path.join(
    projectRoot,
    "android",
    "app",
    "src",
    "main",
    "assets",
  );
  fs.mkdirSync(assetsDir, { recursive: true });

  for (const rel of assetsPaths) {
    const assetSourcePath = path.join(projectRoot, rel);
    let entries;
    try {
      entries = fs.readdirSync(assetSourcePath, { withFileTypes: true });
    } catch {
      console.warn(
        `⚠️ [withMediapipeModelAssets] Android: cannot read ${assetSourcePath}`,
      );
      continue;
    }
    for (const file of entries) {
      if (
        file.isFile() &&
        (!ignoredPattern || !file.name.match(new RegExp(ignoredPattern)))
      ) {
        fs.copyFileSync(
          path.join(assetSourcePath, file.name),
          path.join(assetsDir, file.name),
        );
        console.log(`✅ [withMediapipeModelAssets] Android: ${file.name}`);
      }
    }
  }
}

const withMediapipeModelAssets = (config, props = {}) => {
  const { assetsPaths = [], ignoredPattern } = props;

  config = withDangerousMod(config, [
    "android",
    async (cfg) => {
      copyAndroidAssets(
        cfg.modRequest.projectRoot,
        assetsPaths,
        ignoredPattern,
      );
      return cfg;
    },
  ]);

  config = withXcodeProject(config, async (cfg) => {
    const { projectRoot, platformProjectRoot } = cfg.modRequest;
    const project = cfg.modResults;
    const projectName = cfg.modRequest.projectName || "App";

    if (!fs.existsSync(platformProjectRoot)) {
      return cfg;
    }

    for (const rel of assetsPaths) {
      const assetSourcePath = path.join(projectRoot, rel);
      let entries;
      try {
        entries = fs.readdirSync(assetSourcePath, { withFileTypes: true });
      } catch {
        console.warn(
          `⚠️ [withMediapipeModelAssets] iOS: cannot read ${assetSourcePath}`,
        );
        continue;
      }
      for (const file of entries) {
        if (
          file.isFile() &&
          (!ignoredPattern || !file.name.match(new RegExp(ignoredPattern)))
        ) {
          const destPath = path.join(platformProjectRoot, file.name);
          fs.copyFileSync(path.join(assetSourcePath, file.name), destPath);
          console.log(`✅ [withMediapipeModelAssets] iOS: ${file.name}`);
          IOSConfig.XcodeUtils.addResourceFileToGroup({
            filepath: file.name,
            groupName: projectName,
            project,
            isBuildFile: true,
            verbose: true,
          });
        }
      }
    }
    return cfg;
  });

  return config;
};

module.exports = createRunOncePlugin(
  withMediapipeModelAssets,
  "withMediapipeModelAssets",
  "1.0.0",
);
