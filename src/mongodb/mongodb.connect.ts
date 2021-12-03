import mongoose from 'mongoose'

const mongoDbConnectionString =
  'mongodb+srv://mongodbuser:Fmctq1PNdU4W56eY@cluster0.lt6xf.azure.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

const connect = async (): Promise<void> => {
  await mongoose.connect(mongoDbConnectionString)
  console.log('mongodb connected.')
}

export default { connect }
