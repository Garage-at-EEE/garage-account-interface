const Path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const portFinderSync = require('portfinder-sync')

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-eval-source-map',
  devServer: {
    host: 'local-ip',
    port: portFinderSync.getPort(6969),
    open: true,
    https: false,
    allowedHosts: 'all',
    hot: false,
    watchFiles: ['src/**', 'static/**'],
    static:
    {
      watch: true,
      directory: Path.join(__dirname, '../static')
    },
    client:
    {
      logging: 'none',
      overlay: true,
      progress: false
    },
    setupMiddlewares: function (middlewares, devServer) {
      console.log('------------------------------------------------------------')
      console.log(devServer.options.host)
      const port = devServer.options.port
      const https = devServer.options.https ? 's' : ''
      const domain1 = `http${https}://${devServer.options.host}:${port}`
      const domain2 = `http${https}://localhost:${port}`

      console.log(`Project running at:\n  - ${infoColor(domain1)}\n  - ${infoColor(domain2)}`)

      return middlewares
    }
  },
  plugins: [
    new Webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: Path.resolve(__dirname, '../src/index.html'),
      inject: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, '../src'),
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
        },
      },
      {
        test: /\.js$/,
        include: Path.resolve(__dirname, '../src'),
        loader: 'babel-loader',
      },
    ],
  },
});
