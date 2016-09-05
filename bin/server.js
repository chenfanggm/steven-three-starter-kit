import _debug from 'debug'
import server from '../server/server'
import config from '../config'
const debug = _debug('app:server')


server.listen(config.port, () => {
  debug(`Server is listening on ${config.port}`)
})