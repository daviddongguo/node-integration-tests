import { NextFunction, Request, Response } from 'express'
import { Todo } from '../model/todo.model'

export default {
  createTodo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createModel = await Todo.create(req.body)
      return res.status(201).json(createModel)
    } catch (err) {
      return next(err)
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
}
