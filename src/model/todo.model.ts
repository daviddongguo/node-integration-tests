import mongoose from 'mongoose'

interface TodoAttrs {
  title: string
  done?: boolean
}

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  done: {
    type: Boolean,
    required: true,
    default: false,
  },
})
interface TodoDoc extends mongoose.Document {
  title: string
  done: boolean
  id: string
}

interface TodoModel extends mongoose.Model<TodoDoc> {
  build(attrs: TodoAttrs): TodoDoc
}

const Todo = mongoose.model<TodoDoc, TodoModel>('Todo', TodoSchema)

export { Todo, TodoDoc, TodoAttrs }
