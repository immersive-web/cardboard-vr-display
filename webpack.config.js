const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

const licensePath = path.join(__dirname, 'build', 'license.js');
const license = fs.readFileSync(licensePath, 'utf8');

module.exports = {
  entry: {
    'cardboard-vr-display': './src/cardboard-vr-display.js',
  },
  output: {
    library: 'CardboardVRDisplay',
    libraryTarget: 'var',
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  devtool: 'source-map',
  devServer: {
    publicPath: '/dist',
    contentBase: [
      path.resolve(__dirname, 'dist'),
      path.resolve(__dirname, 'examples'),
    ],
    host: '0.0.0.0',
    disableHostCheck: true
  },
  plugins: [
    new webpack.BannerPlugin({ banner: license, raw: true }),
  ],
};
