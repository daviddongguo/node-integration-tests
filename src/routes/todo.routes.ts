import express, { RequestHandler } from 'express'
import todoController from '../controllers/todo.controller'

const router = express.Router()

router.post('/', todoController.createTodo as RequestHandler)

export { router as TodoRouter }
