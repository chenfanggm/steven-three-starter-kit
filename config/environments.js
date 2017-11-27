module.exports = {
  // --------------------------------------
  // Overrides when NODE_ENV === 'development'
  // --------------------------------------
  development: (config) => ({
    compilerPublicPath: `http://${config.serverHost}:${config.serverPort}/`,
    proxy: {
      enabled: false,
      options: {
        host: 'http://localhost:8080',
        match: /^\/api\/.*/
      }
    },
    compilerGlobals: {
      ...config.compilerGlobals,
      __API_URL__: `http://${config.serverHost}:${config.serverPort}/api/v1`,
    }
  }),

  // --------------------------------------
  // Overrides when NODE_ENV === 'production'
  // --------------------------------------
  production: (config) => ({
    serverHost : 'your_host_domain.com',
    compilerPublicPath: '/',
    compilerFailOnWarning: false,
    compilerHashType: 'chunkhash',
    compilerSourceMap: 'source-map',
    compiler_stats: {
      chunks: true,
      chunkModules: true,
      colors: true
    },
    proxy: {
      enabled: false,
      options: {
        host: 'http://your_host_domain.com:3000',
        match: /^\/api\/.*/
      }
    },
    cache_control: { max_age: 2 * 60 * 60 * 1000 }, // 2 hours
    compilerGlobals: {
      ...config.compilerGlobals,
      __API_URL__: 'http://your_host_domian.com/api/v1'
    }
  })
}

