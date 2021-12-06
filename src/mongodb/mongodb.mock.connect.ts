// eslint-disable-next-line import/no-extraneous-dependencies
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

const connect = async (): Promise<MongoMemoryServer> => {
  const mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri(), {})
  console.log('mock mongodb connected.')
  return mongoServer
}

const close = async (mongoServer: MongoMemoryServer): Promise<void> => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  if (mongoServer) {
    await mongoServer.stop()
  }
  console.log('mock mongodb closed.')
}

export default { connect, close }
