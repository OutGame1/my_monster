export const MONSTER_STATES = ['happy', 'sad', 'gamester', 'angry', 'hungry', 'sleepy'] as const
export const BODY_SHAPES = ['round', 'pear', 'blocky'] as const
export const EYE_TYPES = ['dot', 'round', 'star'] as const
export const MOUTH_TYPES = ['simple', 'toothy', 'wavy'] as const
export const ARM_TYPES = ['short', 'long', 'tiny'] as const
export const LEG_TYPES = ['stumpy', 'long', 'feet'] as const

/**
 * Capital d'expérience de base pour le calcul du seuil d'expérience.
 * Utilisé pour connaître le montant d'XP nécessaire pour atteindre le niveau supérieur.
 */
export const MONSTER_BASE_XP = 100

/**
 * Multiplicateur de base pour le calcul du coût de création d'un monstre.
 * Utilisé dans la formule : cost = MONSTER_CREATION_BASE_COST * log2(monsterCount + 1)
 */
export const MONSTER_CREATION_BASE_COST = 100

/**
 * Calcule le capital d'expérience maximum pour un niveau donné selon la formule
 * `monsterBaseXp * (level ^ 1.5)` et arrondit à l'entier inférieur.
 *
 * @param {number} level Niveau actuel du monstre.
 * @returns {number} Seuil d'expérience à atteindre pour le prochain niveau.
 */
export function calculateMaxXp (level: number): number {
  return Math.floor(MONSTER_BASE_XP * Math.pow(level, 1.5))
}

/**
 * Calcule le coût de création d'un nouveau monstre selon le nombre de monstres déjà possédés.
 *
 * Formule : `cost = floor(MONSTER_CREATION_BASE_COST * log2(monsterCount + 1))`
 *
 * Exemples :
 * - 1er monstre (0 existants) : 0 pièce (gratuit)
 * - 2e monstre (1 existant) : 100 pièces
 * - 3e monstre (2 existants) : 158 pièces
 * - 4e monstre (3 existants) : 200 pièces
 * - 5e monstre (4 existants) : 232 pièces
 *
 * @param {number} currentMonsterCount Nombre de monstres déjà possédés par l'utilisateur.
 * @returns {number} Coût en pièces pour créer le prochain monstre.
 */
export function calculateMonsterCreationCost (currentMonsterCount: number): number {
  if (currentMonsterCount === 0) {
    return 0 // Le premier monstre est offert
  }

  return Math.floor(MONSTER_CREATION_BASE_COST * Math.log2(currentMonsterCount + 1))
}
