export class HttpError extends Error {
  constructor(message = 'something broken', public statusCode = 500) {
    super(message)
    Object.setPrototypeOf(this, HttpError.prototype)
    Error.captureStackTrace(this)
  }
}
