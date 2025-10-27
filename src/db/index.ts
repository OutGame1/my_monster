import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'
import env from '@lib/env'

export const client = new MongoClient(env.MONGODB_HOST, {
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export async function connectMongooseToDatabase (): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_HOST)
    console.log('Mongoose connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

export async function connectToDatabase (): Promise<void> {
  try {
    await client.connect()
    console.log('Connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}
