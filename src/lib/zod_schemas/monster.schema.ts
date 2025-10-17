import { z } from 'zod'

// Schéma de validation pour la création de monstre
export const createMonsterSchema = z.object({
  name: z.string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  nickname: z.string()
    .max(30, 'Le surnom ne peut pas dépasser 30 caractères')
    .trim()
    .optional()
})

// Schéma de validation pour la mise à jour de monstre
export const updateMonsterSchema = z.object({
  nickname: z.string()
    .max(30, 'Le surnom ne peut pas dépasser 30 caractères')
    .trim()
    .optional(),
  stats: z.object({
    happiness: z.number().min(0).max(100).optional(),
    hunger: z.number().min(0).max(100).optional(),
    energy: z.number().min(0).max(100).optional(),
    health: z.number().min(0).optional()
  }).optional()
}).partial()

// Types inférés depuis les schémas
export type CreateMonsterInput = z.infer<typeof createMonsterSchema>
export type UpdateMonsterInput = z.infer<typeof updateMonsterSchema>
