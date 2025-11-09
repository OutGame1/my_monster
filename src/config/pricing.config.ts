/**
 * Table de tarification pour les packages de Coins
 *
 * Cette configuration est partagée entre le client et le serveur.
 * Elle définit les différents packages disponibles à l'achat via Stripe.
 *
 * IMPORTANT: Les productId doivent correspondre aux Product IDs créés dans Stripe Dashboard
 */

import type { PricingPackage } from '@/types/pricing'

export const pricingPackages: Record<string, PricingPackage> = {
  prod_TMDrndEWtgsT5V: {
    coins: 150,
    price: 1,
    label: 'Petit Sac',
    icon: 'Sparkles',
    popular: false,
    color: 'tolopea'
  },
  prod_TMDsMFnN4500jL: {
    coins: 350,
    price: 2,
    label: 'Sac Magique',
    icon: 'Zap',
    popular: true,
    color: 'blood'
  },
  prod_TMDsEpQ5TAwAjQ: {
    coins: 1000,
    price: 5,
    label: 'Coffre Royal',
    icon: 'Crown',
    popular: false,
    color: 'aqua-forest'
  },
  prod_TMDsMEGjIE32Rl: {
    coins: 2500,
    price: 10,
    label: 'Trésor Légendaire',
    icon: 'Flame',
    popular: false,
    color: 'golden-fizz'
  }
}
