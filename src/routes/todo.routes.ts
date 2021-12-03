import express from 'express'
import todoController from '../controllers/todo.controller'

const router = express.Router()

router.post('/', todoController.createTodo)

export { router as TodoRouter }
