
/**
 * Compte le nombre d'éléments dans un tableau qui satisfont la fonction de prédicat fournie.
 *
 * Cette fonction est similaire à `Array.prototype.filter().length`, mais plus efficace car elle
 * compte uniquement les éléments correspondants sans créer de nouveau tableau.
 *
 * @template T - Le type des éléments dans le tableau
 * @param array - Le tableau dans lequel compter les éléments
 * @param predicate - Une fonction qui teste chaque élément. Renvoie `true` pour compter l'élément, `false` sinon
 * @param thisArg - Optionnel. Un objet auquel le mot-clé `this` peut se référer dans la fonction de prédicat.
 *                  Le type `any` est utilisé ici car il s'agit d'un paramètre optionnel de contexte dynamique
 *                  dont le type exact ne peut pas être déterminé à l'avance et qui dépend de l'implémentation
 *                  du prédicat fourni par l'utilisateur.
 * @returns Le nombre d'éléments qui satisfont la fonction de prédicat
 *
 * @example
 * ```typescript
 * const numbers = [1, 2, 3, 4, 5];
 * const evenCount = count(numbers, (n) => n % 2 === 0);
 * // evenCount = 2
 * ```
 *
 * @example
 * ```typescript
 * const users = [{ active: true }, { active: false }, { active: true }];
 * const activeCount = count(users, (user) => user.active);
 * // activeCount = 2
 * ```
 */
export function count<T> (array: T[], predicate: (item: T) => boolean, thisArg?: any): number {
  let count = 0

  for (const item of array) {
    if (predicate.call(thisArg, item)) {
      count++
    }
  }

  return count
}
