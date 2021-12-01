import { NextFunction, Request, Response } from 'express'
import TodoModel from '../model/todo.model'

export default {
  createTodo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const createModel = await TodoModel.create(req.body)
      return res.status(201).json(createModel)
    } catch (error) {
      next(error)
    }
  },
}
