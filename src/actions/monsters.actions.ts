'use server'

import { connectToDatabase } from '@/db'
import Monster, { MonsterType } from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import { MonsterVisualService } from '@/core/services/monster-visual.service'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { SerializedMonster } from '@/types/monster.types'
import { serializeMonster, serializeMonsters } from '@/lib/serializers/monster.serializer'

// ========================================
// ACTIONS SERVEUR - MONSTRES
// ========================================
// Actions pour interagir avec la base de données MongoDB

interface CreateMonsterInput {
  name: string
  type: MonsterType
  rarity?: string
  level?: number
}

/**
 * Crée un nouveau monstre et l'enregistre en base de données
 */
export async function createMonster (monsterData: CreateMonsterInput): Promise<{ success: boolean, monsterId?: string, error?: string }> {
  try {
    await connectToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return { success: false, error: 'User not authenticated' }
    }

    const { user } = session

    // Générer le profil visuel du monstre
    const visualService = new MonsterVisualService()
    const level = monsterData.level || 1
    const bodyType = 'medium' // Par défaut pour la génération

    // Stats de base selon le niveau
    const baseAttack = 30 + level * 2
    const baseDefense = 30 + level * 2
    const baseSpeed = 30 + level * 2

    const visualProfile = visualService.generateVisualProfile(
      monsterData.name,
      monsterData.type,
      level,
      bodyType,
      baseAttack,
      baseDefense,
      baseSpeed,
      Math.random() > 0.95 // 5% chance d'être shiny
    )

    // Créer le monstre avec toutes les données nécessaires
    const monster = new Monster({
      name: monsterData.name,
      type: monsterData.type,
      rarity: monsterData.rarity || 'Commun',
      level,
      experience: 0,
      experienceToNextLevel: 100,
      stats: {
        health: 100,
        maxHealth: 100,
        attack: baseAttack,
        defense: baseDefense,
        speed: baseSpeed,
        energy: 100,
        maxEnergy: 100,
        happiness: 100,
        hunger: 100
      },
      abilities: [],
      appearance: {
        primaryColor: visualProfile.colorPalette.primary,
        secondaryColor: visualProfile.colorPalette.secondary,
        emoji: '🐾',
        bodyShape: visualProfile.traits.bodyShape
      },
      mood: 'Joyeux', // Utiliser la valeur française de l'enum
      description: `Un adorable monstre de type ${monsterData.type}`,
      ownerId: user.id,
      birthDate: new Date().toISOString(),
      isShiny: visualProfile.isShiny,
      achievements: []
    })

    await monster.save()

    revalidatePath('/dashboard')

    return {
      success: true,
      monsterId: monster._id.toString()
    }
  } catch (error) {
    console.error('Error creating monster:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Récupère tous les monstres de l'utilisateur connecté
 */
export async function getMonsters (): Promise<SerializedMonster[]> {
  try {
    await connectToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    const monsters = await Monster.find({ ownerId: user.id }).exec()
    return serializeMonsters(monsters)
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}

/**
 * Récupère un monstre spécifique par son ID
 */
export async function getMonsterById (monsterId: string): Promise<SerializedMonster | null> {
  try {
    await connectToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    const monster = await Monster.findOne({
      _id: monsterId,
      ownerId: user.id
    }).exec()

    return (monster != null) ? serializeMonster(monster) : null
  } catch (error) {
    console.error('Error fetching monster:', error)
    return null
  }
}

/**
 * Met à jour les statistiques d'un monstre
 */
export async function updateMonsterStats (
  monsterId: string,
  stats: Partial<{
    health: number
    energy: number
    happiness: number
    hunger: number
  }>
): Promise<{ success: boolean, error?: string }> {
  try {
    await connectToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return { success: false, error: 'User not authenticated' }
    }

    const { user } = session

    const monster = await Monster.findOne({
      _id: monsterId,
      ownerId: user.id
    })

    if (monster == null) {
      return { success: false, error: 'Monster not found' }
    }

    // Mettre à jour les stats
    Object.assign(monster.stats, stats)

    await monster.save()

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/monster/${monsterId}`)

    return { success: true }
  } catch (error) {
    console.error('Error updating monster stats:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Nourrit un monstre (augmente hunger et health)
 */
export async function feedMonster (monsterId: string): Promise<{ success: boolean, error?: string }> {
  try {
    await connectToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return { success: false, error: 'User not authenticated' }
    }

    const { user } = session

    const monster = await Monster.findOne({
      _id: monsterId,
      ownerId: user.id
    })

    if (monster == null) {
      return { success: false, error: 'Monster not found' }
    }

    // Augmenter la faim et la santé
    monster.stats.hunger = Math.min(100, monster.stats.hunger + 20)
    monster.stats.health = Math.min(monster.stats.maxHealth, monster.stats.health + 10)
    monster.lastFed = new Date()

    await monster.save()

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/monster/${monsterId}`)

    return { success: true }
  } catch (error) {
    console.error('Error feeding monster:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Joue avec un monstre (augmente happiness et energy)
 */
export async function playWithMonster (monsterId: string): Promise<{ success: boolean, error?: string }> {
  try {
    await connectToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return { success: false, error: 'User not authenticated' }
    }

    const { user } = session

    const monster = await Monster.findOne({
      _id: monsterId,
      ownerId: user.id
    })

    if (monster == null) {
      return { success: false, error: 'Monster not found' }
    }

    // Augmenter le bonheur, réduire l'énergie
    monster.stats.happiness = Math.min(100, monster.stats.happiness + 15)
    monster.stats.energy = Math.max(0, monster.stats.energy - 10)
    monster.lastPlayed = new Date()

    await monster.save()

    revalidatePath('/dashboard')
    revalidatePath(`/dashboard/monster/${monsterId}`)

    return { success: true }
  } catch (error) {
    console.error('Error playing with monster:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Supprime un monstre
 */
export async function deleteMonster (monsterId: string): Promise<{ success: boolean, error?: string }> {
  try {
    await connectToDatabase()

    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (session === null || session === undefined) {
      return { success: false, error: 'User not authenticated' }
    }

    const { user } = session

    const result = await Monster.deleteOne({
      _id: monsterId,
      ownerId: user.id
    })

    if (result.deletedCount === 0) {
      return { success: false, error: 'Monster not found' }
    }

    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error deleting monster:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Génère un profil visuel pour un monstre sans l'enregistrer en base
 * Utilisé pour les previews et la génération côté client
 */
export async function generateMonsterVisual (params: {
  name: string
  type: MonsterType
  level?: number
  bodyType?: 'small' | 'medium' | 'large' | 'giant'
  attack?: number
  defense?: number
  speed?: number
  isShiny?: boolean
}) {
  try {
    const visualService = new MonsterVisualService()

    const visualProfile = visualService.generateVisualProfile(
      params.name,
      params.type,
      params.level || 1,
      params.bodyType || 'medium',
      params.attack || 50,
      params.defense || 50,
      params.speed || 50,
      params.isShiny || false
    )

    return { success: true, visualProfile }
  } catch (error) {
    console.error('Error generating monster visual:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
