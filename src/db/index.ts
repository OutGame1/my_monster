import { ServerApiVersion } from 'mongodb'
import mongoose, { type ConnectOptions } from 'mongoose'
import env from '@/lib/env.server'

const connectOptions: ConnectOptions = {
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
}

export async function connectMongooseToDatabase (): Promise<void> {
  try {
    // State 0 -> Déconnecté
    if (mongoose.connection.readyState === 0) {
      // On se connecte seulement si c'est pas déjà fait
      await mongoose.connect(env.MONGODB_HOST, connectOptions)
      console.log('Mongoose connected to MongoDB database')
    }
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

const conn = mongoose.createConnection(env.MONGODB_HOST, connectOptions)

export default conn.getClient().db()
