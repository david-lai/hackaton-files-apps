/* eslint-disable no-console */
//
// Copyright (c) 2018 Nutanix Inc. All rights reserved.
//
// The standalone app webpack configuration (development)
//
const path = require('path');
const chalk = require('chalk');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Constant with our paths
const paths = {
  public: path.resolve(__dirname, 'public'),
  dist: path.resolve(__dirname, 'dist'),
  src: path.resolve(__dirname, 'src')
};

let proxy = {};
let https = false;

const userName = process.env.USERNAME || 'admin';
const pwd =  process.env.PASSWORD || 'Nutanix.123';
const proxyServer = process.env.PROXY || 'http://localhost:5000';

// Proxy Configuration for override of the default
if( !process.env.PROXY ) {
  console.log('Usage: USERNAME=admin PASSWORD=\'Nutanix.123\' PROXY=\'https://10.2.3.4:9440\' npm run dev');
}

const pConfig = {
  auth: `${userName}:${pwd}`,
  target: proxyServer,
  secure: false,
  changeOrigin : true,
  ws : true,
  xfwd : true
};

// List of end points to proxy
proxy = {
  '/api/nutanix/v3' : pConfig
};
https = (proxyServer.indexOf('https') === 0);

console.log('Starting Server -- Proxying to:',
  chalk.yellow(JSON.stringify(proxyServer)));


// Webpack configuration
//----------------------
module.exports = {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    https,
    proxy,
    port: 3000
    // , hot: false
  },
  entry: path.join(paths.src, 'index_dev.js'),
  output: {
    path: paths.dist,
    filename: 'app.bundle.js'
  },
  // Tell webpack to use html plugin
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(paths.public, 'index.html')
    }),
    new ExtractTextPlugin('style.bundle.css')
  ],
  // Loaders configuration
  // We are telling webpack to use "babel-loader" for .js and .jsx files
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      // CSS loader for CSS files
      // Files will get handled by css loader and then passed to the extract text plugin
      // which will write it to the file we defined above
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          use: 'css-loader'
        })
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader'
        ]
      },
      // File loader for image assets -> ADDED IN THIS STEP
      // We'll add only image extensions, but you can add things like svgs, fonts and videos
      {
        test: /\.(woff|woff2|eot|eot\?iefix|ttf|svg|gif|png|jpg)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  // Enable importing JS files without specifying their's extension
  resolve: {
    alias: {
      // 'universal-qdc' : path.resolve('node_modules/universal-qdc/dist/index-debug.js')
    },
    extensions: ['.js', '.jsx']
  }
};