const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Add TypeScript extensions
    sourceExts: ['js', 'json', 'ts', 'tsx', 'jsx'],
    // Handle various asset types
    assetExts: [
      'png',
      'jpg',
      'jpeg',
      'gif',
      'svg',
      'ttf',
      'mp4',
      'wav',
      'mp3',
      'aac',
      'caff',
      'flac',
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
