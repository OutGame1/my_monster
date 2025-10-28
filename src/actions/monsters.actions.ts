'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster, { type IMonster } from '@/db/models/monster.model'
import { getSession } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import type { CreateMonsterFormValues } from '@/types/forms/create-monster-form'
import { Types } from 'mongoose'
import monsterSerizalizer from '@/lib/serializers/monster.serializer'

/**
 * Crée un nouveau monstre pour l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Crée un nouveau document Monster dans MongoDB
 * 3. Revalide le cache de la page dashboard
 *
 * Responsabilité unique : orchestrer la création d'un monstre
 * en coordonnant l'authentification, la persistence et le cache.
 *
 * @async
 * @param {CreateMonsterFormValues} monsterData - Données validées du monstre à créer
 * @returns {Promise<void>} Promise résolue une fois le monstre créé
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 *
 * @example
 * await createMonster({
 *   name: "Pikachu",
 *   traits: '{"bodyColor": "#FFB5E8", ...}',
 *   state: "happy",
 *   level: 1
 * })
 */
export async function createMonster (monsterData: CreateMonsterFormValues): Promise<void> {
  // Connexion à la base de données
  await connectMongooseToDatabase()

  // Vérification de l'authentification
  const session = await getSession()

  if (session === null) {
    throw new Error('User not authenticated')
  }

  // Création et sauvegarde du monstre
  const monster = new Monster({
    ownerId: session.user.id,
    name: monsterData.name,
    traits: monsterData.traits,
    state: monsterData.state,
    level: monsterData.level
  })

  await monster.save()

  // Revalidation du cache pour rafraîchir le dashboard
  revalidatePath('/dashboard')
}

/**
 * Récupère tous les monstres de l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Récupère tous les monstres appartenant à l'utilisateur
 * 3. Retourne un tableau vide en cas d'erreur (résilience)
 *
 * Responsabilité unique : récupérer la liste complète des monstres
 * de l'utilisateur depuis la base de données.
 *
 * @async
 * @returns {Promise<IMonster[]>} Liste des monstres ou tableau vide en cas d'erreur
 *
 * @example
 * const monsters = await getMonsters()
 * // [{ _id: "...", name: "Pikachu", ... }, ...]
 */
export async function getMonsters (): Promise<IMonster[]> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await getSession()

    if (session === null) {
      throw new Error('User not authenticated')
    }

    // Récupération des monstres de l'utilisateur
    const monsters = await Monster.find({ ownerId: session.user.id }).lean().exec()

    return monsters.map(monsterSerizalizer)
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}

/**
 * Récupère un monstre spécifique par son identifiant
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Valide le format de l'identifiant MongoDB
 * 3. Récupère le monstre s'il appartient à l'utilisateur
 * 4. Retourne null si le monstre n'existe pas ou n'appartient pas à l'utilisateur
 *
 * Responsabilité unique : récupérer un monstre spécifique
 * en garantissant la propriété et l'existence.
 *
 * @async
 * @param {string} _id - Identifiant du monstre (premier élément du tableau de route dynamique)
 * @returns {Promise<IMonster | null>} Le monstre trouvé ou null
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 *
 * @example
 * const monster = await getMonsterById("507f1f77bcf86cd799439011")
 * // { _id: "507f1f77bcf86cd799439011", name: "Pikachu", ... }
 *
 * const notFound = await getMonsterById("invalid-id")
 * // null
 */
export async function getMonsterById (_id: string): Promise<IMonster | null> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await getSession()

    if (session === null) {
      throw new Error('User not authenticated')
    }

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(_id)) {
      console.error('Invalid monster ID format')
      return null
    }

    // Récupération du monstre avec vérification de propriété
    const monster = await Monster.findOne({ ownerId: session.user.id, _id }).lean().exec()

    return monster !== null ? monsterSerizalizer(monster) : null
  } catch (error) {
    console.error('Error fetching monster by ID:', error)
    return null
  }
}
