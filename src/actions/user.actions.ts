'use server'

import { headers } from 'next/headers'
import { auth, getSession } from '@/lib/auth'
import cloudinary, { isCloudinaryConnected } from '@/lib/cloudinary'

/**
 * Met à jour la photo de profil de l'utilisateur en utilisant Cloudinary
 *
 * Workflow:
 * 1. Validation du type de données reçu (doit être une string data URL)
 * 2. Vérification de la disponibilité du service Cloudinary
 * 3. Authentification de l'utilisateur via session Better Auth
 * 4. Upload de l'image sur Cloudinary avec transformations automatiques:
 *    - Recadrage intelligent centré sur le visage (96x96px)
 *    - Optimisation qualité/format automatique
 *    - Stockage dans le dossier `my_monster/profile_pictures`
 * 5. Mise à jour du champ `image` de l'utilisateur via Better Auth API
 *
 * @param dataUrl - Image au format data URL (base64) obtenue depuis FileReader
 * @returns L'URL sécurisée de l'image uploadée sur Cloudinary
 * @throws {Error} Si le format de données est invalide
 * @throws {Error} Si le service Cloudinary n'est pas disponible
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 * @throws {Error} Si l'upload ou la mise à jour échoue
 *
 * @example
 * // Dans un composant React avec FileReader
 * const reader = new FileReader()
 * reader.onloadend = async () => {
 *   try {
 *     const imageUrl = await updateProfileImage(reader.result)
 *     console.log('Image uploadée:', imageUrl)
 *   } catch (error) {
 *     console.error('Erreur upload:', error)
 *   }
 * }
 * reader.readAsDataURL(file)
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
