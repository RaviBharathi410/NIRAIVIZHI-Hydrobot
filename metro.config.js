const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const {
    resolver: { sourceExts, assetExts },
} = config;

config.resolver.sourceExts = [...sourceExts, 'mjs', 'cjs'];
config.resolver.assetExts = [...assetExts, 'wasm'];
config.resolver.resolverMainFields = ['sbmodern', 'browser', 'module', 'main'];

// Explicit fix for Three.js and Fiber resolution
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    'three': path.resolve(__dirname, 'node_modules/three'),
    '@react-three/fiber': path.resolve(__dirname, 'node_modules/@react-three/fiber'),
    '@react-three/drei': path.resolve(__dirname, 'node_modules/@react-three/drei'),
};

module.exports = config;
