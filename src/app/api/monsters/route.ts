import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Monster from '@/db/models/monster.model'
import { generateRandomMonster } from '@/lib/monster-generator'
import { createMonsterSchema } from '@/lib/zod_schemas/monster.schema'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Parser et valider le body
    const body = await request.json()
    const validationResult = createMonsterSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données invalides',
          details: validationResult.error.issues
        },
        { status: 400 }
      )
    }

    const { name, nickname } = validationResult.data

    // Vérifier le nombre de monstres de l'utilisateur (limite à 50)
    const monsterCount = await Monster.countDocuments({ ownerId: session.user.id })
    if (monsterCount >= 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vous avez atteint la limite de 50 monstres'
        },
        { status: 400 }
      )
    }

    // Générer un monstre aléatoire
    const monsterData = generateRandomMonster({
      name,
      nickname,
      ownerId: session.user.id
    })

    // Créer le monstre dans la base de données
    const monster = await Monster.create(monsterData)

    return NextResponse.json(
      {
        success: true,
        data: monster.toJSON(),
        message: `${name} a été adopté avec succès ! 🎉`
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de la création du monstre:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création du monstre',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Vérifier l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Récupérer tous les monstres de l'utilisateur
    const monsters = await Monster.find({ ownerId: session.user.id })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(
      {
        success: true,
        data: monsters,
        count: monsters.length
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Erreur lors de la récupération des monstres:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des monstres'
      },
      { status: 500 }
    )
  }
}
