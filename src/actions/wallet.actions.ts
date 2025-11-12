'use server'

import { Types } from 'mongoose'
import { connectMongooseToDatabase } from '@/db'
import Wallet, { type IWalletDocument } from '@/db/models/wallet.model'
import { getSession } from '@/lib/auth'
import walletSerializer, { type ISerializedWallet } from '@/lib/serializers/wallet.serializer'

/**
 * Récupère le portefeuille associé à un propriétaire ou le crée s'il n'existe pas encore.
 *
 * @param {string} ownerId Identifiant MongoDB du propriétaire du portefeuille.
 * @returns {Promise<IWalletDocument>} Document Mongoose du portefeuille créé ou existant.
 */
async function getWalletByOwnerId (ownerId: string): Promise<IWalletDocument> {
  // Recherche d'un portefeuille existant
  let wallet = await Wallet.findOne({ ownerId }).exec()

  // Création à la volée si absent
  if (wallet === null) {
    wallet = new Wallet({ ownerId })
    await wallet.save()
  }

  return wallet
}

/**
 * Récupère ou crée un portefeuille pour l'utilisateur correspondant à l'identifiant fourni.
 * Valide le format de l'identifiant puis sérialise le document pour la couche de présentation.
 *
 * @param {string} ownerId Identifiant MongoDB de l'utilisateur propriétaire du portefeuille.
 * @returns {Promise<ISerializedWallet>} Portefeuille sous forme sérialisée.
 * @throws {Error} Si l'identifiant fourni n'est pas un ObjectId valide.
 */
export async function getWallet (ownerId: string): Promise<ISerializedWallet> {
  if (!Types.ObjectId.isValid(ownerId)) {
    throw new Error('Invalid owner ID format')
  }

  await connectMongooseToDatabase()
  const wallet = await getWalletByOwnerId(ownerId)
  return walletSerializer(wallet)
}

/**
 * Met à jour le solde du portefeuille de l'utilisateur actuellement connecté.
 * Ajoute ou soustrait un montant après validation de l'authentification et du solde disponible.
 * Si le montant est positif (gain), il est aussi ajouté au total de pièces gagnées.
 *
 * @param {number} amount Montant à appliquer (positif pour créditer, négatif pour débiter).
 * @returns {Promise<number>} Nouveau solde disponible après mise à jour.
 * @throws {Error} Si l'utilisateur n'est pas authentifié ou si le solde deviendrait négatif.
 */
export async function updateWalletBalance (amount: number): Promise<number> {
  if (amount === 0) {
    return 0
  }

  const session = await getSession()
  if (session === null) {
    throw new Error('Non authentifié')
  }

  const wallet = await getWalletByOwnerId(session.user.id)

  const newBalance = wallet.balance + amount
  if (newBalance < 0) {
    throw new Error('Votre solde est insuffisant.')
  }

  wallet.balance = newBalance

  // Si on ajoute des pièces (gain), incrémenter aussi le total gagné
  if (amount > 0) {
    wallet.totalEarned += amount
  }

  await wallet.save()

  return newBalance
}
