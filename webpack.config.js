module.exports = {
  entry: ['babel-polyfill', './client/main.js'],
  output: {
    path: './client',
    filename: 'bundle.js'
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
};