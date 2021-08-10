const path = require('path')

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'meristem.js',
    library: 'meristem',
    libraryTarget: 'umd',
  },
}
