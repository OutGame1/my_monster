'use server'

import { stripe } from '@/lib/stripe'
import { getSession } from '@/lib/auth'
import { pricingPackages } from '@/config/pricing.config'
import env from '@/lib/env'

/**
 * Crée une session de paiement Stripe Checkout
 *
 * @param coins - Nombre de coins à acheter (doit correspondre à un package dans pricing.config.ts)
 * @returns URL de redirection vers Stripe Checkout ou null en cas d'erreur
 */
export async function createCheckoutSession (productId: string): Promise<string | null> {
  const session = await getSession()

  if (session === null) {
    throw new Error('User not authenticated')
  }

  const pkg = pricingPackages[productId]

  if (pkg === undefined) {
    throw new Error('Invalid package')
  }

  try {
    // Créer la session Stripe Checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product: productId,
            unit_amount: Math.round(pkg.price * 100) // Prix en centimes
          },
          quantity: 1
        }
      ],
      metadata: {
        userId: session.user.id,
        productId,
        coins: pkg.coins
      },
      success_url: `${env.NEXT_PUBLIC_APP_URL}/app?payment=success`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/buy-coins?payment=cancelled`
    })

    return checkoutSession.url
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return null
  }
}
