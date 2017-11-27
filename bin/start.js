'use strict'

const config = require('../config')
const server = require('../server/server')
const debug = require('debug')('app:bin:start')

const port = config.serverPort
const host = config.serverHost

server.listen(port, (error) => {
  if (error) {
    debug (`[Error] @server start :: ${ error }`)
  } else {
    debug(`Server is now running at http://${host}:${port}.`)
  }
})
