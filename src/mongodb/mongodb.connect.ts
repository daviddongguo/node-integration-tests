import mongoose from 'mongoose'

const connect = async (): Promise<void> => {
  await mongoose.connect(
    'mongodb+srv://mongodbuser:Fmctq1PNdU4W56eY@cluster0.lt6xf.azure.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  )
  console.log('mongodb connected.')
}

export default { connect }
