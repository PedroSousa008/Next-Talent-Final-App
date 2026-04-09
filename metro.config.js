// @ts-check
const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Web production: Terser can mangle anonymous Expo web module classes, which breaks
// expo-modules-core registerWebModule ("Module implementation must be a class").
// See: https://github.com/expo/expo/issues/33628
config.transformer.minifierConfig = {
  ...config.transformer.minifierConfig,
  keep_classnames: true,
  keep_fnames: true,
};

module.exports = config;
