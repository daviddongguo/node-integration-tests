import { inValidPathHandler } from './../../routes/inValidPathHandler'
import { Request } from 'express'
import httpMocks from 'node-mocks-http'
import faker from 'faker'
describe('Invalid Path Handler', () => {
  it('return next with HttpError', () => {
    const req = httpMocks.createRequest() as Request
    const res = httpMocks.createResponse()
    const next = jest.fn()
    const url = faker.random.alphaNumeric(10)
    req.url = url
    inValidPathHandler(req, res, next)
    expect(next).toBeCalled()
  })
})
