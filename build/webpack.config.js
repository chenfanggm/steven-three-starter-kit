import path from 'path'
import webpack from 'webpack'
import cssnano from 'cssnano'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import config from '../config'


const __DEV__ = (config.env === 'development')

const webpackConfig = {
  devtool: 'source-map',
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
      },
      {
        test: /\.scss$/,
        loaders: [
          'style',
          'css?sourceMap&-minimize',
          'postcss',
          'sass?sourceMap'
        ]
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css?sourceMap&-minimize',
          'postcss'
        ]
      }
    ]
  }
}

const entryPath = ['babel-polyfill', './client/main.js']
webpackConfig.entry = {
  app: __DEV__ ? [
    'webpack-hot-middleware/client?path=/__webpack_hmr'
  ].concat(entryPath) : entryPath
}

webpackConfig.output = {
  filename: `[name].[hash].js`,
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
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

webpackConfig.sassLoader = {
  includePaths: '../client/styles'
}

webpackConfig.postcss = [
  cssnano({
    autoprefixer: {
      add: true,
      remove: true,
      browsers: ['last 2 versions']
    },
    discardComments: {
      removeAll: true
    },
    discardUnused: false,
    mergeIdents: false,
    reduceIdents: false,
    safe: true,
    sourcemap: true
  })
]

if (config.env === 'development') {
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
} else {
  webpackConfig.module.loaders.filter((loader) =>
    loader.loaders && loader.loaders.find((name) => /css/.test(name.split('?')[0]))
  ).forEach((loader) => {
      const [first, ...rest] = loader.loaders
      loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
      Reflect.deleteProperty(loader, 'loaders')
    })

  webpackConfig.plugins.push(
    new ExtractTextPlugin('[name].[contenthash].css', {
      allChunks: true
    })
  )
}


export default webpackConfig