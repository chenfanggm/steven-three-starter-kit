const fs = require('fs-extra')
const webpack = require('webpack')
const webpackConfig = require('../../steven-three-starter-kit/build/webpack.config')
const debug = require('debug')('app:bin:compile')
const config = require('../config')

const paths = config.pathUtil

// Wrapper around webpack to promisify its compiler and supply friendly logging
const webpackCompiler = (webpackConfig) => {
  return new Promise((resolve, reject) => {
    const compiler = webpack(webpackConfig)
    compiler.run((err, stats) => {
      if (err) {
        debug('[Error] Webpack compiler encountered a fatal error.', err)
        return reject(err)
      }

      const jsonStats = stats.toJson()
      if (jsonStats.errors.length > 0) {
        debug('Webpack compiler encountered errors.')
        debug(jsonStats.errors.join('\n'))
        return reject(new Error('Webpack compiler encountered errors'))
      } else if (jsonStats.warnings.length > 0) {
        debug('Webpack compiler encountered warnings.')
        debug(jsonStats.warnings.join('\n'))
        if (config.compilerFailOnWarning) {
          throw new Error('Config set to fail on warning, exiting with compile warning.')
        }
      }

      resolve(jsonStats)
    })
  })
}


const compile = () => {
  debug('Starting compiler...')
  debug('Target application environment: ' + config.env)
  return Promise.resolve()
    .then(() => webpackCompiler(webpackConfig))
    .then(stats => {
      debug('Copying static assets from ./client/statics to dist folder.')
      fs.copySync(paths.client('statics'), paths.dist())
      return stats
    })
    .then((stats) => {
      debug(stats.toString({
        chunks : false,
        colors : true
      }))
      debug('Webpack compile completed successfully.')
    })
    .catch((err) => {
      debug('[Error] Compiler encountered an error.', err)
      process.exit(1)
    })
}

compile()

