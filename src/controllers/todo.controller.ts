import { HttpError } from '../routes/http.error'
import { NextFunction, Request, Response } from 'express'
import Todo, { TodoDoc } from '../model/todo.model'
import mongoose from 'mongoose'

export default {
  createTodo: async (req: Request, res: Response, next: NextFunction) => {
    const toAddTodo = req.body as TodoDoc
    if (!toAddTodo || !toAddTodo.title) {
      return next(new HttpError('validation failed', 400))
    }
    try {
      const createModel = await Todo.create(req.body)
      res.status(201).json(createModel)
    } catch (err) {
      next(err)
    }
  },
  getTodos: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const filter = {}
      const allTodos = await Todo.find(filter)
      res.status(200).json(allTodos)
    } catch (err) {
      next(err)
    }
  },
  getTodoById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.todoId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(
          new HttpError(`${id} is not a valid mongoose objectId`, 400)
        )
      }
      const todo = await Todo.findById(id)
      res.status(200).json(todo)
    } catch (err) {
      next(err)
    }
  },
  updateTodo: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.todoId
    const toUpdateTodo = req.body as TodoDoc
    try {
      const updatedTodo = await Todo.findByIdAndUpdate(id, toUpdateTodo, {
        new: true,
      })
      if (!updatedTodo) {
        return next(new HttpError('todo not found', 400))
      }
      res.status(200).json(updatedTodo)
    } catch (err) {
      next(err)
    }
  },
  deleteTodo: async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.todoId
    try {
      const deletedTod = await Todo.findByIdAndDelete(id)
      if (!deletedTod) {
        return next(new HttpError('todo not found', 400))
      }
      res.status(200).json(deletedTod)
    } catch (err) {
      next(err)
    }
  },
}
