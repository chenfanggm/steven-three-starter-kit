const path = require('path')
const debug = require('debug')('app:config')

debug('Init default application config.')
// --------------------------------------
// Default Configuration
// --------------------------------------
const config = {
  env: process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  baseDir: path.resolve(__dirname, '..'),
  clientDir: 'client',
  distDir: 'dist',
  staticDir: 'client/statics',
  testDir: 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  serverHost: 'localhost',
  serverPort: process.env.PORT || 3000,
  cors: {
    origin: [
      'http://your_host_domain.com'
    ],
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE']
  },
  log: {
    console: {
      level: 'debug',
      timestamp: true,
      colorize: true
    }
  },

  // ----------------------------------
  // Webpack Configuration
  // ----------------------------------
  compilerPublicPath: '/',
  compilerHashType: 'hash',
  compilerCssModules: false,
  compilerSourceMap:  'source-map',
  compilerFailOnWarning: false,
  compilerQuiet: false,
  compilerVendors: ['three'],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverageReporters: [
    { type : 'text-summary' },
    { type : 'html', dir : 'coverage' }
  ]
}

// NOTE: application global variables must also be added to .eslintrc
config.compilerGlobals = {
  'process.env': {
    NODE_ENV: JSON.stringify(config.env)
  },
  __DEV__: config.env === 'development',
  __PROD__: config.env === 'production',
  __TEST__: config.env === 'test'
}

// ------------------------------------
// Environment Overrides
// ------------------------------------
debug(`Looking up environment overrides for NODE_ENV "${config.env}".`)
const environments = require('./environments')
const overrides = environments[config.env]
if (overrides) {
  debug(`Found overrides, applying overrides for NODE_ENV ${config.env}`)
  Object.assign(config, overrides(config))
} else {
  debug('No environment overrides found, default config will be used.')
}

// ------------------------------------
// Project Path Utilities
// ------------------------------------
function base() {
  const args = [config.baseDir].concat([].slice.call(arguments))
  return path.resolve.apply(null, args)
}

config.pathUtil = {
  base: base,
  client: base.bind(null, config.clientDir),
  dist: base.bind(null, config.distDir)
}

module.exports = config
