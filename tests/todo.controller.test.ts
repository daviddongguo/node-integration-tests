import TodoController from '../controllers/todo.controller'

describe('', () => {
  it('always correct', () => {
    expect(true).toEqual(true)
  })
})

describe('TodoController.createTodo', () => {
  it('should have a createTodo function', () => {
    expect(typeof TodoController.createTodo).toBe('function')
  })
})
