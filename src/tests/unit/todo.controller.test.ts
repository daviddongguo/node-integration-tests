/* eslint-disable @typescript-eslint/unbound-method */
import { NextFunction, Request, Response } from 'express'
import httpMocks, { MockResponse } from 'node-mocks-http'
import TodoController from '../../controllers/todo.controller'
import Todo from '../../model/todo.model'
import newTodo from '../mock-data/new-todo.json'
import allTodos from '../mock-data/all-todos.json'
import faker from 'faker'
import mongoose from 'mongoose'
import { HttpError } from '../../routes/http.error'

let req: Request, res: MockResponse<Response>, next: NextFunction
const getRandomId = () => {
  return new mongoose.Types.ObjectId().toHexString()
}
const todoId = getRandomId()

jest.mock('../../model/todo.model')

beforeEach(() => {
  req = httpMocks.createRequest()
  req.params.todoId = todoId
  res = httpMocks.createResponse()
  next = jest.fn()
})

describe('TodoController.deleteTod', () => {
  it('should have a deleteTodo function', () => {
    expect(typeof TodoController.deleteTodo).toBe('function')
  })
  it('should call Todo.findByIdAndDelete', async () => {
    await TodoController.deleteTodo(req, res, next)
    expect(Todo.findByIdAndDelete).toBeCalledWith(todoId)
  })
  it('should return 200 and deleted todo', async () => {
    Todo.findByIdAndDelete = jest.fn().mockReturnValue(Promise.resolve(newTodo))
    await TodoController.deleteTodo(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(newTodo)
    expect(res._isEndCalled()).toBe(true)
    expect(next).not.toBeCalled()
  })
  it('should return next when no todo found', async () => {
    Todo.findByIdAndDelete = jest.fn().mockReturnValue(Promise.resolve(null))
    await TodoController.deleteTodo(req, res, next)
    expect(res._isEndCalled()).toBe(false)
    expect(next).toBeCalled()
  })
  it('should handle errors', async () => {
    const err = new Error(faker.random.words(10))
    Todo.findByIdAndDelete = jest.fn().mockReturnValue(Promise.reject(err))
    await TodoController.deleteTodo(req, res, next)
    expect(res._isEndCalled()).toBe(false)
    expect(next).toBeCalledWith(err)
  })
})
describe('TodoController.updateTodo', () => {
  it('should have a updateTodo function', () => {
    expect(typeof TodoController.updateTodo).toBe('function')
  })
  it('should call Todo.findByIdAndUpdate', async () => {
    req.body = newTodo
    await TodoController.updateTodo(req, res, next)
    expect(Todo.findByIdAndUpdate).toBeCalledWith(todoId, newTodo, {
      new: true,
    })
  })
  it('should return 200 and json data', async () => {
    const toUpdateTodo = {
      title: faker.random.words(6),
    }
    Todo.findByIdAndUpdate = jest
      .fn()
      .mockReturnValue(Promise.resolve(toUpdateTodo))
    req.body = newTodo
    await TodoController.updateTodo(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(toUpdateTodo)
    expect(res._isEndCalled()).toBe(true)
    expect(next).not.toBeCalled()
  })

  it('should return next with http error when no todo found', async () => {
    Todo.findByIdAndUpdate = jest.fn().mockReturnValue(Promise.resolve(null))
    await TodoController.updateTodo(req, res, next)
    expect(res._isEndCalled()).toBe(false)
    expect(next).toBeCalledWith(new HttpError('todo not found', 400))
  })

  it('should handle errors', async () => {
    const err = new Error(faker.random.words(10))
    Todo.findByIdAndUpdate = jest.fn().mockReturnValue(Promise.reject(err))
    await TodoController.updateTodo(req, res, next)
    expect(res._isEndCalled()).toBe(false)
    expect(next).toBeCalledWith(err)
  })
})

describe('TodoController.getTodoById', () => {
  it('should have a getTodoById function', () => {
    expect(typeof TodoController.getTodoById).toBe('function')
  })
  it('should call Todo.findById with valid route parameters', async () => {
    await TodoController.getTodoById(req, res, next)
    expect(Todo.findById).toBeCalledWith(todoId)
  })
  it('should return next on invalid todo id', async () => {
    req.params.todoId = 'invalid-todo-id'
    await TodoController.getTodoById(req, res, next)
    expect(res._isEndCalled()).toBe(false)
    expect(next).toBeCalled()
  })
  it('should return 200 and json body', async () => {
    Todo.findById = jest.fn().mockReturnValue(Promise.resolve(newTodo))
    await TodoController.getTodoById(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(newTodo)
    expect(res._isEndCalled()).toBe(true)
    expect(next).not.toBeCalled()
  })
  it('should return 200 and null', async () => {
    Todo.findById = jest.fn().mockReturnValue(Promise.resolve(null))
    await TodoController.getTodoById(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(null)
    expect(res._isEndCalled()).toBe(true)
    expect(next).not.toBeCalled()
  })
  it('should handle errors', async () => {
    const errMsg = faker.datatype.string(50)
    Todo.findById = jest.fn().mockReturnValue(Promise.reject(errMsg))
    await TodoController.getTodoById(req, res, next)
    expect(res._isEndCalled()).toBe(false)
    expect(next).toBeCalledWith(errMsg)
  })
})

describe('TodoController.createTodo', () => {
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
    expect(spyTodoCreate).toBeCalledWith(newTodo)
  })

  it('should call Todo.create on calling TodoController.createTodo', async () => {
    await TodoController.createTodo(req, res, next)
    expect(spyTodoCreate).toBeCalledWith(newTodo)
  })
  it('should return 201 and json body', async () => {
    await TodoController.createTodo(req, res, next)
    expect(res.statusCode).toBe(201)
    expect(res._getJSONData()).toStrictEqual(newTodo)
    expect(res._isEndCalled()).toBe(true)
    expect(next).not.toBeCalled()
  })
  it('should handle errors', async () => {
    const errMsg = 'Title property missing'
    spyTodoCreate.mockImplementation(() => {
      return Promise.reject(errMsg)
    })
    await TodoController.createTodo(req, res, next)
    expect(res._isEndCalled()).toBe(false)
    expect(next).toBeCalledWith(errMsg)
  })
})

describe('TodoController.getTodos', () => {
  beforeEach(() => {
    Todo.find = jest.fn().mockReturnValue(Promise.resolve(allTodos))
  })

  it('should have a getTodos function', async () => {
    expect(typeof TodoController.getTodos).toBe('function')
  })
  it('should call Todo.find on calling TodoController.getTodos', async () => {
    await TodoController.getTodos(req, res, next)
    expect(Todo.find).toBeCalledTimes(1)
    expect(Todo.find).toBeCalledWith({})
  })
  it('should return response with status 200 and all todos', async () => {
    await TodoController.getTodos(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(allTodos)
    expect(res._isEndCalled()).toBe(true)
    expect(next).not.toBeCalled()
  })
  it('should handle errors', async () => {
    const errMsg = 'Error finding'
    Todo.find = jest.fn().mockReturnValue(Promise.reject(errMsg))
    await TodoController.getTodos(req, res, next)
    expect(res._isEndCalled()).toBe(false)
    expect(next).toHaveBeenCalledWith(errMsg)
  })
})
