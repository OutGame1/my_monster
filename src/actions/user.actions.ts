'use server'

import { headers } from 'next/headers'
import { connectMongooseToDatabase } from '@/db'
import { auth, getSession } from '@/lib/auth'
import cloudinary, { isCloudinaryConnected } from '@/lib/cloudinary'

/**
 * Met à jour la photo de profil de l'utilisateur en utilisant Cloudinary
 *
 * @param {string} dataUrl - Image au format data URL (base64)
 * @returns {Promise<string>} L'URL de l'image
 */
export async function updateProfileImage (dataUrl: string | ArrayBuffer | null): Promise<string> {
  try {
    if (typeof dataUrl !== 'string') {
      throw new Error('Une erreur s\'est produite lors de la lecture du fichier')
    }

    const cloudinaryConnected = await isCloudinaryConnected()
    if (!cloudinaryConnected) {
      throw new Error('Le service responsable des images de profil n\'est pas disponible. Veuillez réessayer plus tard.')
    }

    const session = await getSession()
    if (session === null) {
      throw new Error('Utilisateur non authentifié')
    }

    await connectMongooseToDatabase()

    // Upload l'image sur Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUrl, {
      folder: 'my_monster/profile_pictures',
      transformation: [
        { width: 96, height: 96, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    console.log('image uploaded successfully:', uploadResult)

    await auth.api.updateUser({
      headers: await headers(),
      body: {
        image: uploadResult.secure_url
      },
      query: {
        userId: session.user.id
      }
    })

    console.log('profile image updated successfully')

    return uploadResult.secure_url
  } catch (error) {
    console.error('Error updating profile image:', error)
    throw error
  }
}
