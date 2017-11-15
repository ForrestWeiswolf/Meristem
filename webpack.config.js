// var webpack = require("webpack");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "dist/bundle.js"
  }//,
  // module: {
  //   loaders: [
  //     {
  //       test: /\.js$/,
  //       loader: 'babel-loader',
  //       query: {
  //         presets: ['es2015']
  //       }
  //     }
  //   ]
  // },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({ minimize: true })
  // ]
}

// var path = require('path');

// module.exports = {
//   entry: "./index.js",
//   devtool: "source-map",
//   output: {
//     path: path.resolve(__dirname, 'dist'),    
//     filename: "Meristem.min.js"
//   },
// };