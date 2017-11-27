const argv = require('yargs').argv
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const debug = require('debug')('app:config:webpack')
const config = require('../config')

const paths = config.pathUtil
const __DEV__ = config.compilerGlobals.__DEV__
const __PROD__ = config.compilerGlobals.__PROD__
const __TEST__ = config.compilerGlobals.__TEST__

debug('Init webpack config.')
const mainEntry = [paths.client('main')]
if (__DEV__) {
  mainEntry.push(`webpack-hot-middleware/client.js?path=${config.compilerPublicPath}__webpack_hmr&reload=true`)
}
const webpackConfig = {
  entry: {
    main: mainEntry,
    vendor: config.compilerVendors,
    normalize: [paths.client('normalize')]
  },
  output: {
    path: paths.dist(),
    filename: __DEV__ ? `[name].bundle.js` : `[name].[${config.compilerHashType}].bundle.js`,
    publicPath: config.compilerPublicPath
  },
  resolve: {
    modules: [
      paths.client(),
      'node_modules'
    ],
    extensions: ['*', '.js', '.jsx', '.json']
    // alias: {}
  },
  devtool: config.compilerSourceMap,
  externals: {},
  module: {
    // noParse: /jquery/,
    rules: []
  },
  plugins: [
    new webpack.DefinePlugin(config.compilerGlobals),
    // new webpack.ProvidePlugin({})
  ]
}

// ------------------------------------
// Module Rules
// ------------------------------------
// JavaScript
webpackConfig.module.rules.push({
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        ['babel-preset-env', {
          modules: false,
          targets: {
            browsers: 'last 2 versions',
            uglify: true
          }
        }]
      ],
      plugins: [
        ['lodash', { 'id': ['lodash', 'semantic-ui-react'] }],
        //'babel-plugin-syntax-dynamic-import',
        'babel-plugin-transform-class-properties',
        ['babel-plugin-transform-runtime', {
          polyfill: false // only polyfill needed features in client/normalize.js
        }],
        ['babel-plugin-transform-object-rest-spread', {
          useBuiltIns: true // polyfill Object.assign in client/normalize.js
        }]
      ]
    }
  }]
})

// Images
webpackConfig.module.rules.push({
  test: /\.(jpe?g|png|gif)$/i,
  loader: 'url-loader',
  options: { limit: 8192 }
})

// Fonts
;[
  ['woff', 'application/font-woff'],
  ['woff2', 'application/font-woff2'],
  ['otf', 'font/opentype'],
  ['ttf', 'application/octet-stream'],
  ['eot', 'application/vnd.ms-fontobject'],
  ['svg', 'image/svg+xml'],
].forEach((font) => {
  const extension = font[0]
  const mimetype = font[1]

  webpackConfig.module.rules.push({
    test    : new RegExp(`\\.${extension}$`),
    loader  : 'url-loader',
    options : {
      name  : 'fonts/[name].[ext]',
      limit : 10000,
      mimetype,
    },
  })
})

// Styles
const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: config.compilerCssModules,
    importLoaders: 1,
    localIdentName: '[name]__[local]--[hash:base64:5]',
    sourceMap: !!config.compilerSourceMap,
    minimize: {
      preset: ['default', {
        autoprefixer: { browsers: ['last 2 versions'] },
        discardComments: { removeAll : true },
        discardUnused: false,
        mergeIdents: false,
        reduceIdents: false,
        safe: true,
        sourcemap: !!config.compilerSourceMap
      }]
    }
  }
}

const sassLoader = {
  loader: 'sass-loader',
  options: {
    sourceMap: !!config.compilerSourceMap,
    includePaths: [
      paths.client('styles'),
    ]
  }
}

const extractStyles = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  allChunks: true,
  disable: __DEV__
})

webpackConfig.module.rules.push({
  test: /\.(sass|scss)$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [
      cssLoader,
      sassLoader
    ]
  })
})

webpackConfig.module.rules.push({
  test: /\.css$/,
  loader: extractStyles.extract({
    fallback: 'style-loader',
    use: [cssLoader]
  })
})

webpackConfig.plugins.push(extractStyles)

// HTML Template
webpackConfig.plugins.push(new HtmlWebpackPlugin({
  template: paths.client('index.html'),
  favicon: paths.client('statics/favicon.ico'),
  hash: false,
  inject: 'body',
  minify: {
    collapseWhitespace: true
  }
}))

// Development Tools
if (__DEV__) {
  debug('Enable plugins for live development (HMR, NamedModulesPlugin).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  )
}

// Production Optimizations
if (__PROD__) {
  debug('Enable plugins for production optimization.')
  webpackConfig.plugins.push(
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: !!config.devtool,
      comments: false,
      compress: {
        warnings: false,
        screw_ie8: true,
        conditionals: true,
        unused: true,
        comparisons: true,
        sequences: true,
        dead_code: true,
        evaluate: true,
        if_return: true,
        join_vars: true,
      }
    })
  )
}

// Bundle Splitting
if (!__TEST__) {
  debug('Enable plugins for bundle split.')
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'normalize']
    })
  )
}

/* Ensure that the compiler exits on errors during testing so that
they do not get skipped and misreported.*/
if (__TEST__ && !argv.watch) {
  webpackConfig.plugins.push(function () {
    this.plugin('done', function (stats) {
      if (stats.compilation.errors.length) {
        throw new Error(
          stats.compilation.errors.map(err => err.message || err)
        )
      }
    })
  })
}

module.exports = webpackConfig
