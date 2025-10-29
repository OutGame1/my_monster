'use server'

import { Types } from 'mongoose'
import { connectMongooseToDatabase } from '@/db'
import Wallet, { type IWalletDocument } from '@/db/models/wallet.model'
import { getSession } from '@/lib/auth'
import walletSerializer, { type ISerializedWallet } from '@/lib/serializers/wallet.serializer'

async function getWalletByOwnerId (ownerId: string): Promise<IWalletDocument> {
  // Try to find existing wallet
  let wallet = await Wallet.findOne({ ownerId }).exec()

  // Create wallet if it doesn't exist
  if (wallet === null) {
    wallet = new Wallet({ ownerId })
    await wallet.save()
  }

  return wallet
}

/**
 * Get or create a wallet for the authenticated user
 *
 * This server action:
 * 1. Verifies user authentication
 * 2. Attempts to find existing wallet
 * 3. Creates new wallet with default balance (100) if none exists
 * 4. Returns the wallet data
 *
 * Responsibility: Ensure every authenticated user has a wallet
 *
 * @async
 * @returns {Promise<IWallet>} The user's wallet
 * @throws {Error} If user is not authenticated
 *
 * @example
 * const wallet = await getWallet()
 * // { _id: "...", ownerId: "...", balance: 100 }
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
 * Update wallet balance
 *
 * @async
 * @param {number} amount - Amount to add (positive) or subtract (negative)
 * @returns {Promise<number>} New balance
 * @throws {Error} If user is not authenticated or wallet not found
 *
 * @example
 * const newBalance = await updateWalletBalance(20) // Add 20 coins
 * const afterSpending = await updateWalletBalance(-50) // Subtract 50 coins
 */
export async function updateWalletBalance (amount: number): Promise<number> {
  await connectMongooseToDatabase()

  const session = await getSession()
  if (session === null) {
    throw new Error('User not authenticated')
  }

  const wallet = await getWalletByOwnerId(session.user.id)

  const newBalance = wallet.balance + amount
  if (newBalance < 0) {
    throw new Error('Insufficient balance')
  }

  wallet.balance = newBalance

  await wallet.save()

  return newBalance
}
