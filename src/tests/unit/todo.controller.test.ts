import { NextFunction, Request, Response } from 'express'
import httpMocks, { MockResponse } from 'node-mocks-http'
import TodoController from '../../controllers/todo.controller'
import TodoModel from '../../model/todo.model'
import newTodo from '../mock-data/new-todo.json'

TodoModel.create = jest.fn()

let req: Request, res: MockResponse<Response>, next: NextFunction
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = () => {}
})

describe('TodoController.createTodo', () => {
  beforeEach(async () => {
    req.body = newTodo
  })
  it('should have a createTodo function', async () => {
    await TodoController.createTodo(req, res, next)
    expect(typeof TodoController.createTodo).toBe('function')
  })

  it('should call TodoModel.create', async () => {
    await TodoController.createTodo(req, res, next)
    expect(TodoModel.create).toBeCalledWith(newTodo)
  })
  it('should return 201 response status code', async () => {
    await TodoController.createTodo(req, res, next)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBe(true)
  })
  it('should return json body in response', async () => {
    TodoModel.create = jest.fn().mockImplementation(() => {
      return Promise.resolve(newTodo)
    })
    await TodoController.createTodo(req, res, next)
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })
})
