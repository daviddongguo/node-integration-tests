import request from 'supertest'
import app from '../../app'
import newTodo from '../mock-data/new-todo.json'

const endpointUrl = '/todos'
const pingUrl = '/ping'

describe(endpointUrl, () => {
  it('POST' + endpointUrl, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo)

    expect(response.statusCode).toBe(201)
    expect(response.body.title).toBe(newTodo.title)
    // expect(response.body.done).toBe(false)
  })
})

describe(pingUrl, () => {
  it('GET' + pingUrl, async () => {
    const response = await request(app).get(pingUrl)

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe('hi, there,')
  })
})
