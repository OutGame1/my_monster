import mongoose, { ConnectOptions } from 'mongoose'
import { Db, ServerApiVersion } from 'mongodb'
import env from '@lib/env'

const connectOptions: ConnectOptions = {
  dbName: env.MONGODB_DB_NAME,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
}

export async function connectToDatabase (): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_HOST, connectOptions)
    console.log('Mongoose connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

export function getDatabase (): Db {
  const conn = mongoose.createConnection(env.MONGODB_HOST, connectOptions)
  return conn.getClient().db(env.MONGODB_DB_NAME)
}
