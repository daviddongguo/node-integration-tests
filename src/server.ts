import app from './app'
import mongodb from './mongodb/mongodb.connect'

const port = 3000

const start = async () => {
  await mongodb.connect()
  app.listen(port, () => {
    console.log(`Server is now running on ${port}`)
  })
}

void start()
