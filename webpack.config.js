var path = require('path');

module.exports = {
  entry: './lib/server.1.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  node: {
    fs: 'empty'
  }
};
