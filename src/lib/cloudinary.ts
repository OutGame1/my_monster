
import { v2 as cloudinary } from 'cloudinary'
import env from './env'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

export async function isCloudinaryConnected (): Promise<boolean> {
  try {
    await cloudinary.api.ping()
    console.log('Cloudinary connected and configured.')
    return true
  } catch (error) {
    console.log('Error connecting to cloudinary', error)
    return false
  }
}

export default cloudinary
