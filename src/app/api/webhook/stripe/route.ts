import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'
import { connectMongooseToDatabase } from '@/db'
import Wallet from '@/db/models/wallet.model'
import { pricingPackages } from '@/config/pricing.config'
import env from '@/lib/env.server'

export const runtime = 'nodejs'

/**
 * Webhook Stripe pour gérer les paiements
 * Route: POST /api/webhook/stripe
 *
 * IMPORTANT:
 * 1. Créer un webhook dans Stripe Dashboard: https://dashboard.stripe.com/webhooks
 * 2. URL du webhook: https://votre-domaine.com/api/webhook/stripe
 * 3. Événements à écouter: checkout.session.completed
 * 4. Copier le Signing Secret dans STRIPE_WEBHOOK_SECRET
 */
export async function POST (req: Request): Promise<Response> {
  const sig = (await headers()).get('stripe-signature')
  const payload = await req.text() // Corps brut requis par Stripe

  if (sig === null) {
    return new Response('Missing stripe-signature header', { status: 400 })
  }

  let event: Stripe.Event

  // Vérification de la signature du webhook
  try {
    event = stripe.webhooks.constructEvent(payload, sig, env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    let message: string

    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === 'string') {
      message = err
    } else {
      message = 'Unknown error'
    }

    console.error('⚠️ Webhook signature verification failed:', message)
    return new Response(`Webhook Error: ${message}`, { status: 400 })
  }

  // Traitement des événements Stripe
  switch (event.type) {
    case 'checkout.session.completed': {
      console.log('✅ Checkout session completed')

      const session = event.data.object
      const userId = session.metadata?.userId
      const productId = session.metadata?.productId

      if (userId === undefined || productId === undefined) {
        console.error('❌ Missing userId or productId in metadata')
        return new Response('Missing metadata', { status: 400 })
      }

      await connectMongooseToDatabase()

      // Récupérer le nombre de coins à ajouter
      const pkg = pricingPackages[productId]

      if (pkg === undefined) {
        console.error('❌ Unknown productId:', productId)
        return new Response('Unknown product', { status: 400 })
      }

      // Mettre à jour le wallet de l'utilisateur
      const wallet = await Wallet.findOne({ ownerId: userId }).exec()

      if (wallet === null) {
        console.error('❌ Wallet not found for user:', userId)
        return new Response('Wallet not found', { status: 404 })
      }

      const coinsToAdd = pkg.coins
      wallet.balance += coinsToAdd
      wallet.totalEarned += coinsToAdd

      await wallet.save()

      console.log(`💰 Added ${coinsToAdd} coins to user ${userId}. New balance: ${wallet.balance}`)
      break
    }

    case 'payment_intent.succeeded': {
      console.log('✅ Payment intent succeeded')
      // Optionnel: gérer d'autres types de paiements
      break
    }

    case 'payment_intent.payment_failed': {
      console.log('❌ Payment failed')
      // Optionnel: notifier l'utilisateur
      break
    }

    default:
      console.log(`ℹ️  Unhandled event type: ${event.type}`)
  }

  return new Response('ok', { status: 200 })
}
