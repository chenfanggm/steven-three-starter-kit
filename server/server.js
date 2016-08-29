import _debug from 'debug'
import Koa from 'koa'
import serve from 'koa-static'
import Router from 'koa-router'

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

app.use(serve('client'))
export default app
