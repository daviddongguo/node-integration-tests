import { NextFunction, Request, Response } from 'express'
import { Callback } from 'mongoose'
import httpMocks, { MockResponse } from 'node-mocks-http'
import TodoController from '../../controllers/todo.controller'
import { Todo, TodoDoc } from '../../model/todo.model'
import newTodo from '../mock-data/new-todo.json'

// Todo.create = jest.fn().mockImplementation(() => {
//   return Promise.resolve(newTodo)
// })

describe('TodoController.createTodo', () => {
  let req: Request, res: MockResponse<Response>, next: NextFunction
  let spy: jest.SpyInstance<
    void,
    [doc: unknown, callback: Callback<TodoDoc & { _id: string }>]
  >

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = () => {}
    req.body = newTodo
    // spy = jest.spyOn(Todo, 'create').mockImplementation((json) => {
    // void (async () => {
    //  await Promise.resolve(json)
    // })()
    // })
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    spy = jest.spyOn(Todo, 'create').mockImplementation((json) => {
      return Promise.resolve(json)
    })
  })

  afterEach(() => {
    spy.mockRestore()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should have a createTodo function', async () => {
    expect(typeof TodoController.createTodo).toBe('function')
  })

  it('check called times', async () => {
    await Todo.create(req.body)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toBeCalledWith(newTodo)
  })

  it('should call Todo.create', async () => {
    await TodoController.createTodo(req, res, next)
    expect(spy).toBeCalledWith(newTodo)
  })
  it('should return 201 response status code', async () => {
    await TodoController.createTodo(req, res, next)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBe(true)
  })
  it('should return json body in response', async () => {
    await TodoController.createTodo(req, res, next)
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })
})
