# Backgrounds System - Documentation

## Architecture Simplifiée

Le système de backgrounds a été simplifié pour combiner l'achat et la sélection dans un seul modal accessible depuis la page d'un monstre.

## Composants

### 1. `BackgroundSelector.tsx`
Modal unique qui :
- Affiche **tous** les backgrounds disponibles
- Permet d'**acheter** les backgrounds non débloqués (bouton avec prix)
- Permet de **sélectionner** les backgrounds possédés
- Option "Par défaut" pour retirer le background

**Props :**
```tsx
interface BackgroundSelectorProps {
  monsterId: string
  monsterName: string
  currentBackgroundId: string | null
  isOpen: boolean
  onClose: () => void
  onBackgroundChanged?: () => void
}
```

### 2. `MonsterBackgroundDisplay.tsx`
Composant wrapper qui :
- Affiche le monstre avec son background équipé
- Fournit un bouton "Changer l'arrière-plan"
- Gère l'ouverture du modal `BackgroundSelector`

**Props :**
```tsx
interface MonsterBackgroundDisplayProps {
  monsterId: string
  monsterName: string
  backgroundId: string | null
  children: ReactNode  // Le composant monstre à afficher
  showChangeButton?: boolean
}
```

## Utilisation

### Exemple 1 : Page monstre avec background

```tsx
import MonsterBackgroundDisplay from '@/components/backgrounds/MonsterBackgroundDisplay'
import MonsterAvatar from '@/components/monster/MonsterAvatar'

export default function MonsterPage({ monster }) {
  return (
    <MonsterBackgroundDisplay
      monsterId={monster._id}
      monsterName={monster.name}
      backgroundId={monster.backgroundId}
      showChangeButton={true}
    >
      <MonsterAvatar monster={monster} size="large" />
    </MonsterBackgroundDisplay>
  )
}
```

### Exemple 2 : Intégration manuelle du modal

```tsx
'use client'

import { useState } from 'react'
import BackgroundSelector from '@/components/backgrounds/BackgroundSelector'
import Button from '@/components/ui/Button'

export default function MonsterPage({ monster }) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <div>
        {/* Votre affichage de monstre */}
        <Button onClick={() => setIsModalOpen(true)}>
          Changer l'arrière-plan
        </Button>
      </div>

      <BackgroundSelector
        monsterId={monster._id}
        monsterName={monster.name}
        currentBackgroundId={monster.backgroundId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBackgroundChanged={() => window.location.reload()}
      />
    </>
  )
}
```

## Flux utilisateur

1. **Ouvrir le modal** : Clic sur "Changer l'arrière-plan"
2. **Parcourir** : Voir tous les backgrounds avec état (débloqué/verrouillé)
3. **Acheter** : Clic sur "Acheter" → Débit du wallet → Background débloqué et auto-sélectionné
4. **Sélectionner** : Clic sur un background possédé → Bordure rouge de sélection
5. **Confirmer** : Clic sur "Enregistrer" → Équipement du background sur le monstre
6. **Résultat** : Page rechargée avec le nouveau background affiché

## Points techniques

- **Achat** : Appelle `purchaseBackground(backgroundId, monsterId)`
  - Vérifie le solde du wallet
  - Crée l'entrée dans la collection `backgrounds`
  - Auto-sélectionne le background après achat

- **Équipement** : Appelle `equipBackground(monsterId, backgroundId)`
  - Met à jour `monster.backgroundId`
  - Permet `null` pour retirer le background

- **Prix** : `basePrice × rarityMap[rarity].priceMultiplier`
  - Common: ×1
  - Uncommon: ×1.5
  - Rare: ×2.5
  - Epic: ×4
  - Legendary: ×10

## TODO

- [ ] Créer des images de background dans `public/backgrounds/`
- [ ] Intégrer dans les pages monstres existantes
- [ ] Afficher le background sur les `MonsterCard` du dashboard
- [ ] Ajouter des animations de transition lors du changement
- [ ] Page galerie pour voir tous les backgrounds débloqués
