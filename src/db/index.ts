import { MongoClient, ServerApiVersion } from 'mongodb'
import env from '@lib/env'

export const client = new MongoClient(env.MONGODB_HOST, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})
