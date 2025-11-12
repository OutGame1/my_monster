
import { v2 as cloudinary } from 'cloudinary'
import env from './env'

/**
 * Configuration de l'instance Cloudinary avec les identifiants d'environnement
 * Cette configuration est nécessaire pour toutes les opérations d'upload et de manipulation d'images
 */
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET
})

/**
 * Vérifie si la connexion à l'API Cloudinary est fonctionnelle
 * Utilise la méthode `ping` de l'API Cloudinary pour tester la connectivité
 *
 * @returns {Promise<boolean>} `true` si la connexion est établie, `false` sinon
 *
 * @example
 * const connected = await isCloudinaryConnected()
 * if (!connected) {
 *   throw new Error('Service d\'upload indisponible')
 * }
 */
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
