const httpStatus = require('http-status')

const ExtendableError = function (message, status, isPublic) {
  Error.call(this, message)
  this.name = this.constructor.name
  this.message = message
  this.status = status
  this.isPublic = isPublic
  this.isOperational = true
  Error.captureStackTrace(this, this.constructor.name)
}

const APIError = function (message, status, isPublic) {
  if (status === undefined) status = httpStatus.INTERNAL_SERVER_ERROR
  if (isPublic === undefined) isPublic = false
  ExtendableError.call(this, message, status, isPublic)
}

module.exports = APIError
