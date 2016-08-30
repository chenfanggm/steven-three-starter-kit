import _debug from 'debug'
import fs from 'fs-extra'
import path from 'path'
import webpackCompiler from '../build/webpack-compiler'
import webpackConfig from '../build/webpack.config.js'


const debug = _debug('app:bin:compile')

;(async function () {
  try {
    debug('Run compiler')
    const stats = await webpackCompiler(webpackConfig)
    console.log('stats', stats)
    debug('Copy static assets to dist folder.')
    fs.copySync(path.resolve(__dirname, '../client/static'), path.resolve(__dirname, '../dist'))
  } catch (e) {
    debug('Compiler encountered an error.', e)
    process.exit(1)
  }
})()

