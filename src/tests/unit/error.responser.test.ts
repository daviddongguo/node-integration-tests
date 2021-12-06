import { errorResponser } from './../../routes/errorResponser'
import { Request, Response } from 'express'
import httpMocks, { MockResponse } from 'node-mocks-http'
import faker from 'faker'
import { HttpError } from '../../routes/http.error'
describe('Error Responser', () => {
  const message = faker.random.words(10)
  const req = httpMocks.createRequest() as Request
  let res: MockResponse<Response>
  const next = jest.fn()
  beforeEach(() => {
    res = httpMocks.createResponse()
  })
  it('return 500', () => {
    const err = new Error(message)
    errorResponser(err, req, res, next)
    expect(res.statusCode).toBe(500)
    expect(res._getJSONData()).toStrictEqual({ message })
    expect(next).not.toBeCalled()
  })
  it('return 400', () => {
    const statusCode = 400
    const err = new HttpError(message, statusCode)
    errorResponser(err, req, res, next)
    expect(res.statusCode).toBe(statusCode)
    expect(res._getJSONData()).toStrictEqual({ message })
    expect(next).not.toBeCalled()
  })
})
