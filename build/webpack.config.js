import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import config from '../config'


const __DEV__ = (config.env === 'development')
const entryPath = ['babel-polyfill', './client/main.js']

const webpackConfig = {
  devtool: 'source-map',
  output: {
    filename: `[name].[hash].js`,
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'stage-0'],
          plugins: ['transform-runtime']
        }
      }
    ]
  }
}

webpackConfig.entry = {
  app: __DEV__ ? [
    'webpack-hot-middleware/client?path=/__webpack_hmr'
  ].concat(entryPath) : entryPath
}

webpackConfig.plugins = [
  new HtmlWebpackPlugin({
    template: './client/index.html',
    hash: false,
    //favicon: './client/static/favicon.ico',
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: false
    }
  })
]

if (config.env === 'development') {
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}


export default webpackConfig