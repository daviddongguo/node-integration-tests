import { NextFunction, Request, Response } from 'express'
import httpMocks, { MockResponse } from 'node-mocks-http'
import TodoController from '../../controllers/todo.controller'
import { Todo } from '../../model/todo.model'
import newTodo from '../mock-data/new-todo.json'
import allTodos from '../mock-data/all-todos.json'
import faker from 'faker'
import mongoose from 'mongoose'
import { HttpError } from '../../routes/http.error'

let req: Request, res: MockResponse<Response>, next: NextFunction
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn()
})

describe('TodoController.updateTodo', () => {
  it('should have a updateTodo function', () => {
    expect(typeof TodoController.updateTodo).toBe('function')
  })
  it('should call Todo.findByIdAndUpdate', async () => {
    Todo.findByIdAndUpdate = jest.fn()
    const id = new mongoose.Types.ObjectId().toHexString()
    req.params.todoId = id
    req.body = newTodo
    await TodoController.updateTodo(req, res, next)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(Todo.findByIdAndUpdate).toBeCalledWith(id, newTodo, {
      new: true,
      useFindAndModify: false,
    })
  })
  it('should return 200 and json data', async () => {
    const todo = {
      title: faker.random.words(6),
    }
    Todo.findByIdAndUpdate = jest.fn().mockReturnValue(Promise.resolve(todo))
    req.params.todoId = new mongoose.Types.ObjectId().toHexString()
    req.body = newTodo
    await TodoController.updateTodo(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(todo)
  })

  it('should return next with http error when on todo found', async () => {
    Todo.findByIdAndUpdate = jest.fn().mockReturnValue(Promise.resolve(null))
    await TodoController.updateTodo(req, res, next)
    expect(next).toBeCalledWith(new HttpError('todo not found', 400))
  })

  it('should handle errors', async () => {
    const err = new Error(faker.random.words(10))
    Todo.findByIdAndUpdate = jest.fn().mockReturnValue(Promise.reject(err))
    await TodoController.updateTodo(req, res, next)
    expect(next).toBeCalledWith(err)
  })
})

describe.skip('TodoController.getTodoById', () => {
  it('should have a getTodoById function', () => {
    expect(typeof TodoController.getTodoById).toBe('function')
  })
  it('should return 400 on invalid todo id', async () => {
    await TodoController.getTodoById(req, res, next)
    expect(next).toBeCalled()
    expect(res._isEndCalled()).not.toBe(true)
  })
  it('should call Todo.findById with valid route parameters', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    req.params.todoId = id
    Todo.findById = jest.fn()
    await TodoController.getTodoById(req, res, next)
    expect(next).not.toBeCalled()
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(Todo.findById).toBeCalledWith(id)
  })
  it('should return 200 and json body', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    req.params.todoId = id
    Todo.findById = jest.fn().mockReturnValue(Promise.resolve(newTodo))
    await TodoController.getTodoById(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(newTodo)
    expect(res._isEndCalled()).toBe(true)
  })
  it('should return 200 and null', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    req.params.todoId = id
    Todo.findById = jest.fn().mockReturnValue(Promise.resolve(null))
    await TodoController.getTodoById(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(null)
    expect(res._isEndCalled()).toBe(true)
  })
  it('should handle errors', async () => {
    const id = new mongoose.Types.ObjectId().toHexString()
    req.params.todoId = id
    const errMsg = faker.datatype.string(50)
    Todo.findById = jest.fn().mockReturnValue(Promise.reject(errMsg))
    await TodoController.getTodoById(req, res, next)
    expect(next).toBeCalledWith(errMsg)
  })
})

describe.skip('TodoController.createTodo', () => {
  let spyTodoCreate: jest.SpyInstance

  beforeEach(() => {
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

describe.skip('TodoController.getTodos', () => {
  beforeEach(() => {
    Todo.find = jest.fn().mockReturnValue(Promise.resolve(allTodos))
  })

  afterEach(() => {})

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
