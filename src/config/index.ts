import { config } from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  const result = config()
  if (result.error) {
    console.log(result.error)
  }
  console.log(result.parsed)
}

export default {
  port: process.env.PORT || 3003,

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  mongoDbConnectionString: process.env.MONGODB_CONNECTION_STRING || '',
}
