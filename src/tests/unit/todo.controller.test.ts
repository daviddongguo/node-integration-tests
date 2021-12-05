import { NextFunction, Request, Response } from 'express'
import httpMocks, { MockResponse } from 'node-mocks-http'
import TodoController from '../../controllers/todo.controller'
import { Todo } from '../../model/todo.model'
import newTodo from '../mock-data/new-todo.json'
import allTodos from '../mock-data/all-todos.json'

describe('TodoController.createTodo', () => {
  let req: Request, res: MockResponse<Response>, next: NextFunction
  let spyTodoCreate: jest.SpyInstance

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = () => {}
    req.body = newTodo
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    spyTodoCreate = jest.spyOn(Todo, 'create').mockImplementation((json) => {
      return Promise.resolve(json)
    })
  })

  afterEach(() => {
    spyTodoCreate.mockRestore()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should have a createTodo function', async () => {
    expect(typeof TodoController.createTodo).toBe('function')
  })

  it('should call Todo.create', async () => {
    await Todo.create(req.body)
    expect(spyTodoCreate).toHaveBeenCalledTimes(1)
    expect(spyTodoCreate).toBeCalledWith(newTodo)
  })

  it('should call Todo.create on calling TodoController.createTodo', async () => {
    await TodoController.createTodo(req, res, next)
    expect(spyTodoCreate).toBeCalledWith(newTodo)
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
  it('should handle errors', async () => {
    const errMsg = 'Title property missing'
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    spyTodoCreate.mockImplementation(() => {
      return Promise.reject(errMsg)
    })
    const spyNext = jest.fn() as NextFunction
    await TodoController.createTodo(req, res, spyNext)
    expect(spyNext).toBeCalledWith(errMsg)
  })
})

describe('TodoController.getTodos', () => {
  let req: Request, res: MockResponse<Response>, next: NextFunction
  // let spyTodoFind: jest.SpyInstance

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = () => {}
    // spyTodoFind = jest
    //   .spyOn(Todo, 'find')
    //   .mockReturnValue(Promise.resolve(allTodos))
    Todo.find = jest.fn().mockReturnValue(Promise.resolve(allTodos))
  })

  afterEach(() => {
    // Todo.find.mockRestore()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
  it('should have a getTodos function', async () => {
    expect(typeof TodoController.getTodos).toBe('function')
  })
  it('should call Todo.find on calling TodoController.getTodos', async () => {
    await TodoController.getTodos(req, res, next)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(Todo.find).toBeCalledTimes(1)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(Todo.find).toBeCalledWith({})
  })
  it('should return response with status 200 and all todos', async () => {
    await TodoController.getTodos(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBe(true)
    expect(res._getJSONData()).toStrictEqual(allTodos)
  })
  it('should handle errors', async () => {
    const errMsg = 'Error finding'
    const spyNext = jest.fn()
    Todo.find = jest.fn().mockReturnValue(Promise.reject(errMsg))
    await TodoController.getTodos(req, res, spyNext)
    expect(spyNext).toHaveBeenCalledWith(errMsg)
  })
})
