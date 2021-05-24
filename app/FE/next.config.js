const path = require('path');

// Custom webpack configuration
module.exports = {
  webpack(config, { buildId, dev, isServer, defaultLoaders, webpack }) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    config.module.rules.push({
      test: /\.js$/,
      use: defaultLoaders.babel,
      include: [path.resolve(__dirname, 'node_modules', '@react-three', 'drei')],
    });

    return config;
  },
};
