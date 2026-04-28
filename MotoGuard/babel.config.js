module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Path aliases — devono corrispondere a tsconfig.json
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './src/components',
            '@screens':    './src/screens',
            '@hooks':      './src/hooks',
            '@services':   './src/services',
            '@utils':      './src/utils',
            '@theme':      './src/theme',
            '@store':      './src/store',
            '@types':      './src/types',
          },
        },
      ],
      // Reanimated deve essere sempre l'ultimo plugin
      'react-native-reanimated/plugin',
    ],
  };
};
