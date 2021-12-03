import request from 'supertest'
import app from '../../app'
import newTodo from '../mock-data/new-todo.json'
import mongodb from '../../mongodb/mongodb.connect'
import { TodoDoc } from '../../model/todo.model'

const endpointUrl = '/todos'
const pingUrl = '/ping'

describe(pingUrl, () => {
  it(`GET ${pingUrl}`, async () => {
    const response = await request(app).get(pingUrl)

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe('hi, there,')
  })
})

describe(endpointUrl, () => {
  it(`POST ${endpointUrl}`, async () => {
    await mongodb.connect()

    const response = await request(app).post(endpointUrl).send(newTodo)

    expect(response.statusCode).toBe(201)
    const body = response.body as TodoDoc
    expect(body.title).toBe(newTodo.title)
    expect(body.done).toBe(false)
  }, 5000)
})
