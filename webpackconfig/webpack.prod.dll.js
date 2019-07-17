const path = require('path');
const webpack = require('webpack');

const runtimePath = process.argv[5];

module.exports = {
  entry: {
    'commons': [`${runtimePath}src\\commons`]
  },
  output: {
    path: path.join(runtimePath, 'src', 'assets', 'dll'),
    filename: '[name].js',
    library: '[name]_[hash]'
  },
  mode: 'production',
  plugins: [
    new webpack.DllPlugin({
      path: path.join(runtimePath, 'src', 'assets', 'dll', '[name]-manifest.json'),
      name: '[name]_[hash]',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  }
};
