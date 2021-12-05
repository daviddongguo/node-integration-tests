import express, { RequestHandler } from 'express'
import todoController from '../controllers/todo.controller'

const router = express.Router()

router.post('/', todoController.createTodo as RequestHandler)
router.get('/', todoController.getTodos as RequestHandler)
router.get('/:todoId', todoController.getTodoById as RequestHandler)

export { router as TodoRouter }
