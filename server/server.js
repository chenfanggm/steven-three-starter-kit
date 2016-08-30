import _debug from 'debug'
import webpack from 'webpack'
import webpackDevMiddleware from './middleware/webpack-dev'
import webpackHMRMiddleware from './middleware/webpack-hmr'
import webpackConfig from '../build/webpack.config.js'
import Koa from 'koa'
import serve from 'koa-static'
import Router from 'koa-router'
import config from '../config'


const debug = _debug('app:server')
const app = new Koa()
const router = new Router()
/**
 * Middleware
 */
/*router.get('/', (ctx, next) => {
  ctx.body = require('../client/index.html')
})
app.use(router.routes())*/

if (config.env === 'production') {
  app.use(serve(webpackConfig.output.path))
} else {
  var compiler = webpack(webpackConfig)

  app.use(webpackDevMiddleware(compiler, webpackConfig.output.publicPath))
  app.use(webpackHMRMiddleware(compiler))
}

export default app
