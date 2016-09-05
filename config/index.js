import development from './development'
import production from './production'


let config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000
}

if (config.env === 'production') {
  config = Object.assign({}, config, production)
} else {
  config = Object.assign({}, config, development)
}

export default config
