# Instructions Copilot pour My MonsterModel

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

#### 1. **SOLID - Application Systématique**

##### Single Responsibility Principle (SRP)
- **Règle** : Chaque module/classe/fonction a UNE SEULE raison de changer
- **Application pratique** :
  - Un composant = une responsabilité visuelle
  - Un hook = une logique métier isolée
  - Un service = une famille d'opérations cohérentes
  - Un repository = accès à une seule entité
- **Exemples à suivre** :
  ```typescript
  // ✅ BON - Responsabilité unique
  const useMonsterCreation = () => { /* logique de création */ }
  const MonsterForm = () => { /* affichage formulaire */ }
  
  // ❌ MAUVAIS - Multiples responsabilités
  const MonsterManager = () => { /* création + affichage + validation + API */ }
  ```

##### Open/Closed Principle (OCP)
- **Règle** : Ouvert à l'extension, fermé à la modification
- **Application pratique** :
  - Utiliser des interfaces/types pour définir des contrats
  - Stratégies via props ou configuration
  - Composition de composants plutôt que modification
- **Exemples** :
  ```typescript
  // ✅ BON - Extension via props
  interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
  }
  
  // ✅ BON - Extension via composition
  <Card>
    <CardHeader />
    <CardContent />
    <CardFooter />
  </Card>
  ```

##### Liskov Substitution Principle (LSP)
- **Règle** : Les sous-types doivent être substituables à leurs types de base
- **Application pratique** :
  - Respecter les contrats d'interface
  - Ne pas modifier le comportement attendu
  - Types génériques cohérents
- **Exemples** :
  ```typescript
  // ✅ BON - Contrat respecté
  interface Repository<T> {
    findById(id: string): Promise<T | null>;
    save(entity: T): Promise<T>;
  }
  
  class MonsterRepository implements Repository<MonsterModel> {
    // Implémentation qui respecte le contrat
  }
  ```

##### Interface Segregation Principle (ISP)
- **Règle** : Interfaces spécifiques plutôt qu'une interface générale
- **Application pratique** :
  - Props minimales et ciblées
  - Interfaces séparées pour différents cas d'usage
  - Pas de dépendances inutiles
- **Exemples** :
  ```typescript
  // ✅ BON - Interfaces spécifiques
  interface Readable {
    read(): Promise<Data>;
  }
  
  interface Writable {
    write(data: Data): Promise<void>;
  }
  
  // ❌ MAUVAIS - Interface trop large
  interface DataAccess {
    read(): Promise<Data>;
    write(data: Data): Promise<void>;
    delete(id: string): Promise<void>;
    update(id: string, data: Data): Promise<void>;
    // Force à implémenter tout même si besoin que read
  }
  ```

##### Dependency Inversion Principle (DIP)
- **Règle** : Dépendre d'abstractions, pas d'implémentations concrètes
- **Application pratique** :
  - Définir interfaces dans `core/models`
  - Implémenter dans `infrastructure`
  - Injecter les dépendances via props ou contexte
- **Exemples** :
  ```typescript
  // ✅ BON - Dépendance sur abstraction
  // core/repositories/monster.repository.interface.ts
  export interface IMonsterRepository {
    findAll(): Promise<MonsterModel[]>;
  }
  
  // infrastructure/repositories/monster.repository.ts
  export class MongoMonsterRepository implements IMonsterRepository {
    async findAll() { /* implémentation MongoDB */ }
  }
  
  // presentation/hooks/useMonsters.ts
  const useMonsters = (repository: IMonsterRepository) => {
    // Utilise l'interface, pas l'implémentation
  }
  ```

#### 2. **Clean Code - Règles Strictes**

##### Nommage
- **Variables** : substantifs descriptifs en camelCase
  - `monsterName`, `userProfile`, `isLoading`, `hasError`
- **Fonctions** : verbes en camelCase décrivant l'action
  - `createMonster()`, `validateEmail()`, `handleSubmit()`
- **Composants** : PascalCase, noms de choses
  - `MonsterCard`, `AuthForm`, `DashboardLayout`
- **Constantes** : UPPER_SNAKE_CASE
  - `MAX_MONSTER_LEVEL`, `API_BASE_URL`
- **Types/Interfaces** : PascalCase avec préfixe I pour interfaces
  - `IMonsterRepository`, `MonsterModel`, `UserCredentials`
- **Booléens** : préfixes is/has/can/should
  - `isValid`, `hasPermission`, `canEdit`, `shouldDisplay`

##### Fonctions
- **Taille** : Maximum 20 lignes (idéalement 5-10)
- **Paramètres** : Maximum 3 paramètres (sinon objet de configuration)
- **Niveaux d'abstraction** : Un seul niveau par fonction
- **Pas d'effets de bord** : Une fonction fait ce que son nom indique
- **Early returns** : Sortir tôt pour réduire l'imbrication
```typescript
// ✅ BON - Early return
function validateMonster(monster: MonsterModel): boolean {
  if (!monster.name) return false;
  if (monster.level < 1) return false;
  if (monster.level > 100) return false;
  return true;
}

// ❌ MAUVAIS - Imbrication profonde
function validateMonster(monster: MonsterModel): boolean {
  if (monster.name) {
    if (monster.level >= 1) {
      if (monster.level <= 100) {
        return true;
      }
    }
  }
  return false;
}
```

##### Code Organization
- **DRY** : Extraire code dupliqué dans des fonctions/hooks
- **KISS** : Solution la plus simple qui fonctionne
- **YAGNI** : Ne pas anticiper des besoins futurs
- **Commentaires** : Expliquer le "pourquoi", pas le "quoi"
```typescript
// ✅ BON - Commentaire utile
// Utilisation de setTimeout pour éviter le rate limiting de l'API (max 10 req/sec)
await delay(100);

// ❌ MAUVAIS - Commentaire inutile
// Incrémente le compteur de 1
counter++;
```

##### Gestion des Erreurs
- **Try/catch** : Toujours autour des appels async
- **Messages explicites** : Décrire ce qui s'est passé
- **Logging** : Console.error en développement
- **Feedback utilisateur** : Toast ou message d'erreur contextuel
```typescript
// ✅ BON
try {
  await createMonster(data);
  toast.success('Monstre créé avec succès');
} catch (error) {
  console.error('Erreur lors de la création du monstre:', error);
  toast.error('Impossible de créer le monstre. Veuillez réessayer.');
}
```

#### 3. **Clean Architecture - Couches et Flux**

##### Règle des Dépendances
- **Flux** : `Presentation → Core ← Infrastructure`
- **Core** : Ne dépend de RIEN (logique métier pure)
- **Infrastructure** : Dépend du Core (implémente les interfaces)
- **Presentation** : Dépend du Core (utilise les interfaces)

##### Structure des Fichiers par Feature
```
feature/
  ├── core/
  │   ├── models/
  │   │   └── monster.model.ts          # Types/Interfaces
  │   ├── repositories/
  │   │   └── monster.repository.interface.ts
  │   └── services/
  │       └── monster.service.ts         # Logique métier pure
  ├── infrastructure/
  │   ├── repositories/
  │   │   └── monster.repository.mongo.ts
  │   └── api/
  │       └── monsters/
  │           └── route.ts               # API handlers
  └── presentation/
      ├── components/
      │   └── MonsterCard.tsx
      └── hooks/
          └── useMonsters.ts
```

##### Use Cases
- **Localisation** : `src/core/use-cases/`
- **Responsabilité** : Une action métier par use case
- **Signature** : `execute(input: Input): Promise<Output>`
- **Exemple** :
```typescript
// src/core/use-cases/create-monster.use-case.ts
export class CreateMonsterUseCase {
  constructor(private repository: IMonsterRepository) {}
  
  async execute(input: CreateMonsterInput): Promise<MonsterModel> {
    // 1. Validation
    this.validateInput(input);
    
    // 2. Logique métier
    const monster = this.buildMonster(input);
    
    // 3. Persistance
    return await this.repository.save(monster);
  }
  
  private validateInput(input: CreateMonsterInput): void {
    // Validation rules
  }
  
  private buildMonster(input: CreateMonsterInput): MonsterModel {
    // Business logic
  }
}
```

##### Repositories Pattern
- **Interface** : `src/core/repositories/`
- **Implémentation** : `src/infrastructure/repositories/`
- **Méthodes standard** :
  - `findById(id: string): Promise<T | null>`
  - `findAll(): Promise<T[]>`
  - `save(entity: T): Promise<T>`
  - `update(id: string, entity: Partial<T>): Promise<T>`
  - `delete(id: string): Promise<void>`

##### Services vs Use Cases
- **Services** : Opérations techniques réutilisables (email, crypto, cache)
- **Use Cases** : Scénarios métier complets (créer un monstre, combattre)

#### 4. **React/Next.js - Bonnes Pratiques**

##### Composants
- **Server Components par défaut** : Pas de 'use client' sauf nécessaire
- **'use client' requis pour** :
  - useState, useEffect, useContext
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, window)
  - Librairies client-only
- **Props destructuring** : Toujours déstructurer les props
- **TypeScript strict** : Typer toutes les props et retours
```typescript
// ✅ BON - Server Component
export default function MonsterList({ monsters }: { monsters: MonsterModel[] }) {
  return (
    <div>
      {monsters.map(monster => (
        <MonsterCard key={monster.id} monster={monster} />
      ))}
    </div>
  );
}

// ✅ BON - Client Component avec types
'use client';

interface MonsterFormProps {
  onSubmit: (data: MonsterData) => Promise<void>;
  initialData?: Partial<MonsterData>;
}

export default function MonsterForm({ onSubmit, initialData }: MonsterFormProps) {
  const [data, setData] = useState<MonsterData>(initialData || {});
  // ...
}
```

##### Custom Hooks
- **Préfixe** : Toujours commencer par 'use'
- **Responsabilité** : Une logique métier isolée
- **Localisation** : `src/presentation/hooks/`
- **Retour** : Objet avec valeurs et fonctions nommées
```typescript
// ✅ BON
export function useMonsterCreation() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createMonster = async (data: MonsterData) => {
    setIsCreating(true);
    setError(null);
    try {
      const result = await monsterService.create(data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsCreating(false);
    }
  };
  
  return { createMonster, isCreating, error };
}
```

##### API Routes (Next.js)
- **Localisation** : `src/app/api/`
- **Validation** : Toujours valider les entrées (Zod)
- **Gestion d'erreurs** : Try/catch avec codes HTTP appropriés
- **Réponses structurées** : Format JSON cohérent
```typescript
// ✅ BON
export async function POST(request: Request) {
  try {
    // 1. Parse et valide
    const body = await request.json();
    const validatedData = monsterSchema.parse(body);
    
    // 2. Use case
    const useCase = new CreateMonsterUseCase(repository);
    const monster = await useCase.execute(validatedData);
    
    // 3. Réponse
    return Response.json(
      { success: true, data: monster },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { success: false, error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error creating monster:', error);
    return Response.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

#### 5. **TypeScript - Typage Strict**

##### Configuration
- **strict**: true dans tsconfig.json
- **noImplicitAny**: true
- **strictNullChecks**: true

##### Bonnes Pratiques
- **Pas de 'any'** : Utiliser 'unknown' si type inconnu
- **Types explicites** : Pour paramètres et retours de fonction
- **Interfaces pour objets** : Types pour unions/primitives
- **Génériques** : Pour composants/fonctions réutilisables
```typescript
// ✅ BON
interface MonsterModel {
  id: string;
  name: string;
  level: number;
  stats: MonsterStats;
}

function getMonster(id: string): Promise<MonsterModel | null> {
  // ...
}

// ❌ MAUVAIS
function getMonster(id: any): Promise<any> {
  // ...
}
```

#### 6. **Testing - À Implémenter**

##### Structure
```
__tests__/
  ├── unit/           # Tests unitaires (fonctions pures)
  ├── integration/    # Tests d'intégration (API, DB)
  └── e2e/           # Tests end-to-end (Playwright)
```

##### Principes
- **AAA** : Arrange, Act, Assert
- **Un test = un scénario**
- **Noms descriptifs** : Décrire le comportement testé
- **Indépendance** : Tests isolés les uns des autres

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

### Workflow de Développement d'une Feature

1. **Définir les Interfaces (Core)**
   - Créer les types/interfaces dans `src/core/models/`
   - Définir les interfaces de repository dans `src/core/repositories/`
   - Pas de dépendances externes

2. **Implémenter la Logique Métier (Core)**
   - Créer les use cases dans `src/core/use-cases/`
   - Créer les services dans `src/core/services/`
   - Tests unitaires de la logique

3. **Implémenter l'Infrastructure**
   - Repositories dans `src/infrastructure/repositories/`
   - Configuration DB dans `src/infrastructure/db/`
   - API routes dans `src/app/api/`

4. **Créer les Composants UI**
   - Composants réutilisables dans `src/components/`
   - Composants spécifiques dans `src/presentation/components/`
   - Hooks custom dans `src/presentation/hooks/`

5. **Intégrer et Tester**
   - Tests d'intégration
   - Tests E2E si nécessaire
   - Review et refactoring

### Checklist Avant Commit

- [ ] Code respecte SOLID (vérifier chaque principe)
- [ ] Pas de duplication (DRY)
- [ ] Fonctions < 20 lignes
- [ ] Nommage explicite et cohérent
- [ ] Types TypeScript complets
- [ ] Gestion d'erreurs appropriée
- [ ] Pas de console.log (sauf console.error pour erreurs)
- [ ] Commentaires pertinents seulement
- [ ] Composants dans la bonne couche (core/infra/presentation)
- [ ] Tests unitaires pour logique métier critique

## Notes de Maintenance
- Documenter les changements d'architecture
- Maintenir la cohérence du style
- Tests pour les fonctionnalités critiques
- Optimiser les performances
- Gestion des erreurs cohérente

## Références Rapides

### Commandes à Éviter
- ❌ `any` en TypeScript
- ❌ Fonctions > 20 lignes sans refactoring
- ❌ Composants > 200 lignes
- ❌ Modification directe du state
- ❌ Logique métier dans les composants
- ❌ Appels API directs (passer par use cases)

### Patterns Recommandés
- ✅ Repository Pattern pour accès données
- ✅ Use Case Pattern pour logique métier
- ✅ Custom Hooks pour logique réutilisable
- ✅ Composition de composants
- ✅ Dependency Injection via props/context
- ✅ Error Boundaries pour erreurs React
- ✅ Suspense pour chargement asynchrone

### Questions à se Poser
1. **SRP** : Ce module a-t-il une seule responsabilité ?
2. **OCP** : Puis-je étendre sans modifier ?
3. **LSP** : Mes implémentations respectent-elles les contrats ?
4. **ISP** : Mes interfaces sont-elles minimales et ciblées ?
5. **DIP** : Mes dépendances pointent-elles vers des abstractions ?
6. **Clean Code** : Le nom décrit-il clairement le comportement ?
7. **Clean Archi** : Cette dépendance va-t-elle dans le bon sens ?
