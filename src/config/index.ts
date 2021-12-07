import dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  dotenv.config()
}

export default {
  port: process.env.PORT || 3003,

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  mongoDbConnectionString: process.env.MONGODB_CONNECTION_STRING || '',
}
