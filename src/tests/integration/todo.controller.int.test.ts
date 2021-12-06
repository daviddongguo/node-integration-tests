import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import app from '../../app'
import newTodo from '../mock-data/new-todo.json'
import mockMongoDb from '../../mongodb/mongodb.mock.connect'
import { TodoDoc } from '../../model/todo.model'
import mongoose from 'mongoose'
import faker from 'faker'

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
  let firstTodo: TodoDoc
  let rndId: string
  let mongoServer: MongoMemoryServer
  const title = faker.random.words(6)
  beforeAll(async () => {
    // await mongodb.connect()
    mongoServer = await mockMongoDb.connect()
  })
  beforeEach(() => {
    rndId = new mongoose.Types.ObjectId().toHexString()
  })
  afterAll(async () => {
    await mockMongoDb.close(mongoServer)
  })
  it('should return error 400 on malformed data', async () => {
    const response = await request(app).post(endpointUrl).send({})

    expect(response.statusCode).toBe(400)
    const body = response.body as {
      message?: string
    }
    expect(body.message).toContain('validation failed')
  })
  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo)

    expect(response.statusCode).toBe(201)
    firstTodo = response.body as TodoDoc
    expect(firstTodo.title).toBe(newTodo.title)
    expect(firstTodo.done).toBe(false)
  })

  it(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl)

    expect(response.statusCode).toBe(200)
    const body = response.body as TodoDoc[]
    expect(Array.isArray(body)).toBe(true)
    firstTodo = body[0]
    expect(firstTodo.title).toBeDefined()
    expect(firstTodo.done).toBeDefined()
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
    const url = `${endpointUrl}/${'invalid-todo-id'}`
    const response = await request(app).get(url)
    expect(response.statusCode).toBe(400)
  })
  it(`PUT ${endpointUrl}`, async () => {
    const url = `${endpointUrl}/${firstTodo._id as string}`
    const response = await request(app).put(url).send({ title })
    expect(response.statusCode).toBe(200)
    expect((response.body as TodoDoc).title).toBe(title)
  })
  it(`return 400 on PUT ${endpointUrl}`, async () => {
    const url = `${endpointUrl}/${rndId}`
    const response = await request(app).put(url).send(newTodo)
    expect(response.statusCode).toBe(400)
    expect(response).toHaveProperty('body')
    const body = response.body as {
      message: string
    }
    expect(body.message).toBe('todo not found')
  })

  // the last test
  it('HTTP DELETE', async () => {
    const url = `${endpointUrl}/${firstTodo._id as string}`
    const response = await request(app).delete(url).send()
    expect(response.statusCode).toBe(200)
    const deletedTodo = response.body as TodoDoc
    expect(deletedTodo.title).toBe(title)
    expect(deletedTodo.done).toBe(firstTodo.done)
  })
  it('HTTP DELETE 400', async () => {
    const url = `${endpointUrl}/${firstTodo._id as string}`
    const response = await request(app).delete(url).send()
    expect(response.statusCode).toBe(400)
    const body = response.body as {
      message?: string
    }
    expect(body.message).toContain('todo not found')
  })
})
