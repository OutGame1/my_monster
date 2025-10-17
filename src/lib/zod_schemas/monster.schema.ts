import { z } from 'zod'

// Schéma de validation pour la création d'un monstre
export const createMonsterSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim()
})

// Schéma de validation pour la mise à jour d'un monstre
export const updateMonsterSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim()
    .optional()
})

// Types inférés depuis les schémas
export type CreateMonsterInput = z.infer<typeof createMonsterSchema>
export type UpdateMonsterInput = z.infer<typeof updateMonsterSchema>
