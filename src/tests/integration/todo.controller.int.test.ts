import request from 'supertest'
import app from '../../app'
import newTodo from '../mock-data/new-todo.json'
import mongodb from '../../mongodb/mongodb.connect'
import { TodoDoc } from '../../model/todo.model'
import mongoose from 'mongoose'
import faker from 'faker'

const endpointUrl = '/todos'
const pingUrl = '/ping'
let firstTodo: TodoDoc

describe(pingUrl, () => {
  it(`GET ${pingUrl}`, async () => {
    const response = await request(app).get(pingUrl)

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe('hi, there,')
  })
})

// describe.skip(endpointUrl, () => {
describe(endpointUrl, () => {
  beforeAll(async () => {
    await mongodb.connect()
  })
  afterAll(async () => {})

  it(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl)

    expect(response.statusCode).toBe(200)
    const body = response.body as TodoDoc[]
    expect(Array.isArray(body)).toBe(true)
    firstTodo = body[0]
    expect(body[0].title).toBeDefined()
    expect(body[0].done).toBeDefined()
  })
  it(`GET by id ${endpointUrl}:todoId`, async () => {
    const url = `${endpointUrl}/${firstTodo._id as string}`
    const response = await request(app).get(url)
    expect(response.statusCode).toBe(200)
    const todo = response.body as TodoDoc
    expect(todo.title).toBe(firstTodo.title)
    expect(todo.done).toBe(firstTodo.done)
  })
  it(`GET by invalid id ${endpointUrl}:todoId`, async () => {
    const id = new mongoose.Types.ObjectId().toHexString() + 'invalid'
    const url = `${endpointUrl}/${id}`
    const response = await request(app).get(url)
    expect(response.statusCode).toBe(400)
  })
  it(`PUT ${endpointUrl}`, async () => {
    const title = faker.random.words(6)
    const toUpdateTodo = {
      title,
    }
    const url = `${endpointUrl}/${firstTodo._id as string}`
    const response = await request(app).put(url).send(toUpdateTodo)
    expect(response.statusCode).toBe(200)
    const updatedTodo = response.body as TodoDoc
    expect(updatedTodo.title).toBe(title)
  })
  it(`return 400 on PUT ${endpointUrl}`, async () => {
    const url = `${endpointUrl}/${new mongoose.Types.ObjectId().toHexString()}`
    const response = await request(app).put(url).send(newTodo)
    expect(response.statusCode).toBe(400)
    expect(response).toHaveProperty('body')
    const body = response.body as {
      message: string
    }
    expect(body.message).toBe('todo not found')
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
