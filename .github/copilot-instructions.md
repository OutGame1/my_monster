# Instructions Copilot pour My Monster

## Architecture et Principes

Ce projet suit les principes de Clean Architecture et Clean Code :

### Structure du Projet
- `src/core` : Logique métier pure (entities, use cases)
  - `models` : Interfaces et types
  - `repositories` : Interfaces des repositories
  - `services` : Services métier
- `src/infrastructure` : Implémentations techniques
  - `api` : Routes API Next.js
  - `db` : Configuration et connecteurs de base de données
  - `repositories` : Implémentations des repositories
- `src/presentation` : Logique de présentation
  - `components` : Composants spécifiques aux pages
  - `hooks` : Custom hooks réutilisables
  - `layouts` : Layouts de pages
- `src/components` : Composants UI réutilisables
  - `ui` : Composants de base (Card, Button, etc.)
  - `forms` : Composants de formulaires
  - `sections` : Sections de page réutilisables

### Principes à Suivre
1. **SOLID**
   - Single Responsibility : Un composant/fonction = une responsabilité
   - Open/Closed : Extensible sans modification
   - Liskov Substitution : Sous-types substituables
   - Interface Segregation : Interfaces spécifiques
   - Dependency Inversion : Dépendre des abstractions

2. **Clean Code**
   - DRY (Don't Repeat Yourself)
   - KISS (Keep It Simple, Stupid)
   - Nommage explicite des variables/fonctions
   - Fonctions courtes et monofonctionnelles
   - Commentaires uniquement quand nécessaire

3. **Composants**
   - Privilégier les composants fonctionnels
   - Utiliser 'use client' uniquement quand nécessaire
   - Props typées avec TypeScript
   - Composition over inheritance
   - Style intégré avec Tailwind

4. **État et Gestion des Données**
   - Hooks React appropriés (useState, useEffect)
   - État global avec Context si nécessaire
   - Séparation logique métier/présentation
   - Gestion des erreurs avec try/catch
   - Feedback utilisateur avec Toasts

## Style Guide
- **TailwindCSS**
  - Utiliser les classes utilitaires
  - Couleurs définies dans globals.css :
    - tolopea : violet (marque)
    - blood : rouge (CTA)
    - aqua-forest : vert (succès)
  - Préfixer les classes personnalisées
  - Mobile-first approach

- **Composants UI**
  - Card : conteneur avec ombre et bordure
  - Button : variants primary/secondary
  - InputField : style cohérent des formulaires
  - Animations douces (transition-all)

## Features
### Implémentées
- Page d'accueil
  - Hero section avec CTA
  - Bénéfices avec icônes
  - Galerie de monstres
  - Actions possibles
  - Newsletter (10% promo)
  - Header navigation
  - Footer légal

- Authentification
  - Page de connexion/inscription
  - Formulaires stylisés
  - Feedback avec Toasts
  - Animations de monstres

### En cours
- Dashboard utilisateur
- Création de monstre
- Interactions avec les monstres

## Base de données
- MongoDB Atlas comme BDD principale
- Connexion optimisée avec cache
- Repositories typés
- Modèles définis dans core/models

## Workflows
1. Interfaces/Types (core/models)
2. Logique métier pure (core)
3. Infrastructure technique
4. Composants UI (components)
5. Intégration et tests

## Notes de Maintenance
- Documenter les changements d'architecture
- Maintenir la cohérence du style
- Tests pour les fonctionnalités critiques
- Optimiser les performances
- Gestion des erreurs cohérente
