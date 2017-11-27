// 1) Object.assign
Object.assign = require('object-assign')

// 2) Promise
// ------------------------------------
if (typeof Promise === 'undefined') {
  window.Promise = require('bluebird')
}

// 3) Fetch
// ------------------------------------
if (typeof window.fetch === 'undefined') {
  require('whatwg-fetch')
}
