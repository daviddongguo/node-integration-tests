import { HttpError } from './../../routes/http.error'
import faker from 'faker'

describe('HTTP ERROR', () => {
  it('return http error instance', () => {
    const statusCode = faker.datatype.number(800)
    const message = faker.random.words(10)
    const httpError = new HttpError(message, statusCode)
    expect(httpError instanceof Error).toBe(true)
    expect(httpError instanceof HttpError).toBe(true)
    expect(httpError.statusCode).toBe(statusCode)
    expect(httpError.message).toBe(message)
  })
  it('return http error instance with default value', () => {
    const httpError = new HttpError()
    expect(httpError instanceof Error).toBe(true)
    expect(httpError instanceof HttpError).toBe(true)
    expect(httpError.statusCode).toBe(500)
    expect(httpError.message).toBe('something broken')
  })
  it('return error instance', () => {
    const message = faker.random.words(10)
    const error = new Error(message)
    expect(error instanceof Error).toBe(true)
    expect(error instanceof HttpError).toBe(false)
    expect(error.message).toBe(message)
    expect(error).not.toHaveProperty('statusCode')
  })
})
