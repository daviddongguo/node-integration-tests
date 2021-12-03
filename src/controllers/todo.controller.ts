import { NextFunction, Request, Response } from 'express'
import { Todo } from '../model/todo.model'

export default {
  createTodo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const createModel = await Todo.create(req.body)
      // const createModel = { title: 'Make first unit test without completed' }
      return res.status(201).json(createModel)
    } catch (error) {
      return next(error)
    }
  },
}
