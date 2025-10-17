import mongoose from 'mongoose'
import { ServerApiVersion } from 'mongodb'
import env from '@lib/env'

export const conn = await mongoose.connect(env.MONGODB_HOST, {
  dbName: env.MONGODB_DB_NAME,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const db = conn.connection.getClient().db(env.MONGODB_DB_NAME)
