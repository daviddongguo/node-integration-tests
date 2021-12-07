import config from '../config'
import mongoose from 'mongoose'

const connect = async (): Promise<void> => {
  await mongoose.connect(config.mongoDbConnectionString)
  console.log('mongodb connected.')
}

export default { connect }
