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
  beforeAll(async () => {
    await mongodb.connect()
  })
  it(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl)

    expect(response.statusCode).toBe(200)
    const body = response.body as TodoDoc[]
    expect(Array.isArray(body)).toBe(true)
    expect(body[0].title).toBeDefined()
    expect(body[0].done).toBeDefined()
  })
  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo)

    expect(response.statusCode).toBe(201)
    const body = response.body as TodoDoc
    expect(body.title).toBe(newTodo.title)
    expect(body.done).toBe(false)
  }, 5000)

  it('should return error 500 on malformed data', async () => {
    const response = await request(app).post(endpointUrl).send({})

    expect(response.statusCode).toBe(500)
    const body = response.body as {
      message?: string
    }
    expect(body.message).toContain('validation failed')
  })
})
