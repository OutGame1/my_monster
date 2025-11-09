import { Types } from 'mongoose'
import type { MonsterState } from '@/db/models/monster.model'
import type { ISerializedMonster } from '../serializers/monster.serializer'
import type { GalleryFiltersParams, GallerySortBy } from '@/types/gallery'

/**
 * Interface représentant un filtre MongoDB pour la galerie de monstres
 */
interface GalleryMatchFilter {
  isPublic: true
  _id?: { $lt: Types.ObjectId } | { $gt: Types.ObjectId }
  level?: { $gte?: number, $lte?: number }
  state?: MonsterState
}

/**
 * Builder pour construire les filtres MongoDB de la galerie de manière fluide
 * Implémente le pattern Builder pour une construction progressive et lisible
 */
export default class GalleryFilterBuilder {
  private readonly filter: GalleryMatchFilter = { isPublic: true }

  /**
   * Constructeur du builder
   * @param filters - Filtres optionnels à appliquer dès la construction
   */
  public constructor (filters?: GalleryFiltersParams) {
    if (filters !== undefined) {
      this.withFilters(filters)
    }
  }

  /**
   * Ajoute un filtre sur le niveau minimum
   */
  public withMinLevel (minLevel: number): this {
    if (this.filter.level === undefined) {
      this.filter.level = {}
    }
    this.filter.level.$gte = minLevel
    return this
  }

  /**
   * Ajoute un filtre sur le niveau maximum
   */
  public withMaxLevel (maxLevel: number): this {
    if (this.filter.level === undefined) {
      this.filter.level = {}
    }
    this.filter.level.$lte = maxLevel
    return this
  }

  /**
   * Ajoute un filtre sur la plage de niveaux
   */
  public withLevelRange (minLevel?: number, maxLevel?: number): this {
    if (minLevel !== undefined) {
      this.withMinLevel(minLevel)
    }
    if (maxLevel !== undefined) {
      this.withMaxLevel(maxLevel)
    }
    return this
  }

  /**
   * Ajoute un filtre sur l'état du monstre
   */
  public withState (state: MonsterState): this {
    this.filter.state = state
    return this
  }

  /**
   * Ajoute un filtre de cursor pour la pagination
   * @param cursor - ID du dernier monstre de la page précédente
   * @param isReversedSort - true pour tri croissant (oldest, level-asc), false pour décroissant
   */
  public withCursor (cursor: string, isReversedSort: boolean): this {
    if (Types.ObjectId.isValid(cursor)) {
      this.filter._id = isReversedSort
        ? { $gt: new Types.ObjectId(cursor) }
        : { $lt: new Types.ObjectId(cursor) }
    }
    return this
  }

  /**
   * Applique tous les filtres d'un objet GalleryFiltersParams
   */
  public withFilters (filters?: GalleryFiltersParams): this {
    if (filters === undefined) {
      return this
    }

    // Filtre par niveau
    this.withLevelRange(filters.minLevel, filters.maxLevel)

    // Filtre par état
    if (filters.state !== undefined) {
      this.withState(filters.state)
    }

    return this
  }

  /**
   * Construit et retourne le filtre MongoDB final
   */
  public build (): GalleryMatchFilter {
    return this.filter
  }

  /**
   * Construit un filtre pour le comptage total (sans cursor)
   */
  public buildForCount (): Omit<GalleryMatchFilter, '_id'> {
    const { _id, ...filterWithoutCursor } = this.filter
    return filterWithoutCursor
  }

  /**
   * Détermine si le tri est inversé (croissant)
   */
  public static isReversedSort (sortBy?: GallerySortBy): boolean {
    return sortBy === 'oldest' || sortBy === 'level-asc'
  }

  /**
   * Construit l'objet de tri MongoDB selon les critères
   */
  public static buildSort (sortBy?: GallerySortBy): Partial<Record<keyof ISerializedMonster, 1 | -1>> {
    switch (sortBy) {
      case 'oldest':
        return { _id: 1 }
      case 'level-asc':
        return { level: 1, _id: 1 }
      case 'level-desc':
        return { level: -1, _id: -1 }
      default:
        return { _id: -1 }
    }
  }
}
