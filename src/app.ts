import { inValidPathHandler } from './routes/inValidPathHandler'
import express from 'express'
import morgan from 'morgan'
import { TodoRouter } from './routes/todo.routes'
import { errorResponser } from './routes/errorResponser'

const app = express()

app.use(express.json())
app.use(morgan('tiny'))

app.get('/ping', (req, res) => {
  res.status(200).json('hi, there,')
})

app.use('/todos', TodoRouter)

app.use(inValidPathHandler)
app.use(errorResponser)

export default app
