/**
 * Types et interfaces pour le système de tarification
 * Définit les packages de coins disponibles à l'achat
 */

/**
 * Package de pièces disponible à l'achat via Stripe
 */
export interface PricingPackage {
  coins: number // Nombre de pièces dans le package
  price: number // Prix en euros
  label: string // Nom du package
  icon: string // Icône (emoji ou lucide icon name)
  popular: boolean
  color: 'tolopea' | 'blood' | 'aqua-forest' | 'golden-fizz'
}
