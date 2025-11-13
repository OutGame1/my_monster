# Copilot Instructions - MyMonster Project

## Project Overview
This is a Next.js 16.0.0 project using the App Router architecture, built for a school project (My Digital School). It's a Tamagotchi-style application using React 19, TypeScript, and Tailwind CSS 4 with custom color palette.

### Game Mechanics
- **Wallet System**: Each user has a separate `Wallet` document (default balance: 25 coins)
  - Wallet is created automatically on first access via `getWallet()` server action
  - Each monster action rewards coins: 1 coin (base) or 2 coins (when action matches monster state)
  - **Total Earned Tracking**: `totalEarned` field tracks cumulative coins earned (never decreases)
  - Coin counter in header animates when coins are earned (see `CoinBadge` component)
  - Wallet stored in separate collection, not on user document
  - Balance updates via `updateWalletBalance(amount)` - auto-increments `totalEarned` on positive amounts
- **XP System**: Monsters gain experience and level up
  - Each action awards 25 XP
  - Level-up formula: `maxXp = 100 * (level ^ 1.5)`
  - Level-up triggers a dramatic full-screen celebration modal (`LevelUpModal`)
- **Monster States**: `happy | sad | gamester | angry | hungry | sleepy`
  - Actions that match the current state give double coin rewards
  - All actions return monster to `happy` state
  - Five action types: `feed`, `play`, `comfort`, `calm`, `lullaby`
- **Quest System**: Daily quests and achievements with progress tracking
  - **Daily Quests**: Reset daily, simple objectives (5-12 coins rewards)
  - **Achievements**: Permanent milestones with cumulative progress tracking
  - Quest types: `action_count`, `ownership_count`, `reach_coins`
  - Progress stored in `Quest` model (renamed from `quest-progress`)
  - Coin achievements based on `totalEarned`, not current balance
  - Claimable quests show visual indicators (ring styling)

## Tech Stack & Key Dependencies
- **Framework**: Next.js 16.0.0 with App Router and Turbopack
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS 4 with custom color themes
- **UI Utilities**: `classnames` library for conditional CSS class management
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Better Auth for session management
- **Image Upload**: Cloudinary for profile picture management
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for advanced animations
- **Notifications**: React Toastify for user feedback
- **Validation**: Zod for schema validation
- **Fonts**: Jersey 10 & Geist Mono from Google Fonts
- **Linting**: ts-standard for TypeScript linting
- **Skeleton Loading**: react-loading-skeleton for loading states

## Development Workflow
```bash
# Development with Turbopack (faster builds)
npm run dev

# Build with Turbopack
npm run build

# Linting with auto-fix
npm run lint
```

## Architecture Patterns

### File Structure
- `src/app/` - Next.js App Router pages and layouts
  - `src/app/app/` - Main dashboard and monster management
  - `src/app/profile/` - User profile page with wallet statistics
  - `src/app/quests/` - Quest system page (daily quests & achievements)
  - `src/app/buy-coins/` - Coin shop page
  - `src/app/sign-in/` & `src/app/sign-up/` - Authentication pages (redirect if logged in)
- `src/components/` - Reusable React components
  - `src/components/ui/` - Base UI components (Button, Card, Modal, Header, CoinBadge, CoinIcon, etc.)
  - `src/components/monster/` - Monster-specific components (Avatar, Display, Actions, LevelUpModal)
  - `src/components/dashboard/` - Dashboard components (MonsterCard, MonstersGrid, DashboardContentWrapper)
    - `src/components/dashboard/skeletons/` - Dashboard skeleton loading components
  - `src/components/quests/` - Quest components (QuestCard, QuestsContent, QuestsContentWrapper)
    - `src/components/quests/skeletons/` - Quest skeleton loading components
  - `src/components/gallery/` - Gallery components (GalleryContent, GalleryGrid, GalleryContentWrapper)
    - `src/components/gallery/skeletons/` - Gallery skeleton loading components
  - `src/components/shop/` - Shop components (CoinPackage, BuyCoinsContent)
  - `src/components/profile/` - Profile components (ProfileContent, ProfileImage, ProfileImageUploader)
- `src/actions/` - Server actions for data mutations
  - `monsters.actions.ts` - Monster CRUD and action handling
  - `wallet.actions.ts` - Wallet balance management
  - `quests.actions.ts` - Quest progress tracking and rewards
  - `user.actions.ts` - User profile management (profile picture upload)
- `src/db/` - Database models and connection
  - `src/db/models/` - Mongoose schemas (monster, wallet, quest)
- `src/lib/` - Shared utilities and configurations
  - `src/lib/serializers/` - Data serializers for client transfer
  - `src/lib/utils.ts` - Utility functions (count, cn)
  - `src/lib/cloudinary.ts` - Cloudinary SDK configuration and connectivity check
- `src/config/` - Configuration files
  - `monsters.config.ts` - Monster generation parameters
  - `rewards.config.ts` - Reward calculation constants
  - `quests.config.ts` - Quest definitions and objectives
- `specs/` - Project specifications (PDF documentation)
- `public/` - Static assets (coin.svg)

### Component Patterns
Components follow a functional approach with explicit TypeScript interfaces:

```tsx
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'ghost' | 'underline' | 'outline'
  disabled?: boolean
}

// Example from src/components/button.tsx
export default function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false
}: ButtonProps): ReactNode
```

### Styling Conventions
- **Custom Color Palette**: Uses `blood`, `tolopea`, `aqua-forest`, `golden-fizz`, and `seance` color scales defined in `globals.css`
- **Component Styling**: 
  - Use `classnames` library (imported as `cn`) for conditional CSS class management
  - **CRITICAL**: Never use template literals for dynamic Tailwind classes (e.g., `from-${color}-400`)
  - **Instead**: Create color mapping objects with complete class strings for Tailwind purging
  - Example pattern:
    ```tsx
    import cn from 'classnames'
    
    const colorClasses = {
      tolopea: 'bg-tolopea-500',
      blood: 'bg-blood-500'
    }
    
    <div className={cn('base-class', { 'active-class': active }, colorClasses[color])} />
    ```
- **Responsive Design**: Mobile-first approach with `sm:` breakpoints
- **Animations**: Custom keyframe animations for monster interactions (wave-arms, wiggle-arms, shake-arms-hungry, chomp-mouth, gaming-eyes, bounce-body, tears)
- **🚨 NO EMOJIS IN COMPONENTS**: Avoid using emojis directly in component JSX (except for monster state emojis from data). Use Lucide React icons instead for decorative elements.

### Import Patterns
- Use `@/` alias for src imports: `import Button from '@/components/button'`
- Import types from React: `import type { ReactNode } from 'react'`
- Explicit return type annotations: `(): ReactNode`
- CSS imports in layout: `import './globals.css'`

## Project-Specific Guidelines

### Component Development
- **Size Variants**: Use `sm | md | lg | xl` pattern for consistent sizing
- **Visual Variants**: Follow `primary | ghost | underline | outline` pattern
- **Disabled States**: Always handle disabled styling separately from hover states
- **Default Props**: Provide sensible defaults in destructuring

### Skeleton Loading Pattern
- **Library**: Use `react-loading-skeleton` for all loading states
- **CSS Import**: Do NOT import the CSS file (`'react-loading-skeleton/dist/skeleton.css'`) - it's automatically imported by the component
- **Organization**: Skeleton components are placed in a `skeletons/` subdirectory within the feature folder
  - Example: `src/components/quests/skeletons/QuestCardSkeleton.tsx`
  - NOT in a centralized `src/components/ui/skeletons/` folder
- **Naming Convention**: `[ComponentName]Skeleton.tsx` (e.g., `QuestCardSkeleton`, `QuestsContentSkeleton`)
- **No Index Files**: Do not create `index.ts` files for skeleton exports
- **Documentation**: Do NOT document each new skeleton in README.md - just know they're in `skeletons/` folders
- **Client-Side Data Fetching**: 
  - Create a `[Feature]ContentWrapper.tsx` component that handles client-side data fetching
  - Use `useState` and `useEffect` to load data asynchronously
  - Show skeleton while `isLoading === true`
  - Pass loaded data to the actual content component
- **Page Structure**: Server components only handle authentication, then render the wrapper component
- **Import Pattern**: 
  ```tsx
  import Skeleton from 'react-loading-skeleton'
  // NO CSS IMPORT - automatic
  import ComponentSkeleton from './skeletons/ComponentSkeleton'
  // NOT from '@/components/ui/skeletons'
  ```

### Color Usage Notes
- **Primary brand color**: `blood-500` (`#ff2d34`) - Main brand red
- **Secondary accent**: `tolopea-500` (`#5f47ff`) - Purple accent
- **Tertiary accent**: `aqua-forest-500` (`#428751`) - Green accent
- **Energy/Highlight**: `golden-fizz-500` (`#e3f401`) - Bright yellow for energy/highlights
- **Special/Magic**: `seance-500` (`#ff16f4`) - Magenta for special effects
- **Background tones**: Use color-50 variants for subtle backgrounds, color-700+ for emphasis
- **Monster animations**: Custom animations available (see globals.css for animate-* classes)

### TypeScript Configuration
- **Strict Mode**: All strict TypeScript rules enabled
- **Path Mapping**: `@/*` resolves to `./src/*`
- **Target**: ES2017 for compatibility
- **JSX**: Preserve mode for Next.js processing

## Programming Principles & Architecture

### SOLID Principles
- **Single Responsibility**: Each component/function should have one reason to change (e.g., Button component only handles UI rendering)
- **Open/Closed**: Components should be open for extension, closed for modification (use composition and props for variations)
- **Liskov Substitution**: Derived components should be substitutable for their base types
- **Interface Segregation**: Create small, focused interfaces rather than large ones
- **Dependency Inversion**: Depend on abstractions, not concrete implementations (use dependency injection for services)

### Clean Code Standards
- **Meaningful Names**: Use descriptive names for variables, functions, and components (`getSize()`, `getVariant()`)
- **Small Functions**: Keep functions focused and under 20 lines when possible
- **Pure Functions**: Prefer pure functions for utilities (see `getSize()` and `getVariant()` in Button)
- **No Magic Numbers**: Use named constants for sizes, colors, and configuration values
- **Consistent Formatting**: Follow ts-standard linting rules strictly
- **🚨 STRICT EQUALITY OPERATORS**: 
  - **ALWAYS use `===` and `!==`** for comparisons
  - **NEVER use `==` or `!=`** - these are FORBIDDEN
  - This applies to ALL comparisons: strings, numbers, booleans, null, undefined, objects
  - Examples:
    ```ts
    // ✅ CORRECT
    if (value === null) { }
    if (completedAt !== null) { }
    if (count === 0) { }
    
    // ❌ FORBIDDEN - DO NOT USE
    if (value == null) { }  // WRONG
    if (completedAt != null) { }  // WRONG
    if (count == 0) { }  // WRONG
    ```

### Clean Architecture Layers
- **Presentation Layer**: `src/components/` - UI components with no business logic
- **Application Layer**: `src/app/` - Next.js routing and page composition
- **Domain Layer**: `src/services/` - Business logic and entities (Tamagotchi game rules)
- **Infrastructure Layer**: External APIs, local storage, and data persistence
- **Dependency Flow**: Always point inward (UI → Application → Domain), never the reverse

### Code Organization Rules
- **Feature-Based Structure**: Group related components, services, and types together
- **Barrel Exports**: Use index files for clean imports from feature folders
- **Type Safety**: Always define explicit interfaces for component props and service contracts
- **Error Boundaries**: Implement proper error handling at component and service levels

### Database & Data Handling
- **Mongoose Queries**: Use `.lean()` method to convert Mongoose documents to plain JavaScript objects
- **Serializers**: Use dedicated serializer functions in `src/lib/serializers/` for converting Mongoose documents to client-safe objects
  - `monster.serializer.ts` - Serializes monster documents with traits
  - `wallet.serializer.ts` - Serializes wallet documents with balance and totalEarned
  - `quest.serializer.ts` - Serializes quest progress documents (renamed from quest-progress)
- **Type Casting**: When using `.lean()`, cast to the appropriate TypeScript interface
- **Example Pattern**: 
  ```ts
  const monster = await MonsterModel.findById(id).lean()
  return monsterSerializer(monster)
  ```
- **Wallet Pattern**: Use separate Wallet collection instead of storing credits on user document
  - Access via `getWallet(ownerId)` which auto-creates if missing (default: 25 coins, 25 totalEarned)
  - Updates via `updateWalletBalance(amount)` with automatic `totalEarned` tracking
  - Zero-amount updates are no-op (early return)
- **Database Connection**: Conditional connection in `src/db/index.ts` - only connects when needed

### Implementation Checklist
- **Design First**: Capture the intended responsibility, collaborators, and dependencies before coding; validate the design against SOLID and Clean Architecture boundaries.
- **Enforce Abstractions**: Introduce interfaces or type aliases at layer boundaries and depend on them instead of concrete implementations.
- **Keep Layers Pure**: Prohibit presentation components from importing domain or infrastructure code directly; rely on server actions in `src/actions/`.
- **Traceability**: Document how each new module maps to its domain concept with a short comment or README snippet when the rationale is non-trivial.
- **Testing Strategy**: Prefer fast unit tests around pure domain logic, component tests for UI behaviour, and adapters/tests at boundaries to keep regression risk low.
- **Refinement Loop**: After implementation, review the change by explicitly checking SRP adherence, dependency direction, naming clarity, and absence of duplications or magic values.
- **Utility Functions**: Extract reusable logic into `src/lib/utils.ts` (e.g., `count()` for array filtering, `cn()` for classnames)

## Utility Functions & Helpers

### `src/lib/utils.ts`
Contains generic utility functions used across the application:

- **`count<E, T = undefined> (array: E[], predicate: (this: T, item: E) => boolean, thisArg?: T): number`**
  - Counts elements in an array matching a predicate function
  - More efficient than `filter().length` as it doesn't create intermediate arrays
  - Example: `count(quests, q => q.progress.completed && !q.progress.claimed)`
  - The `thisArg` parameter uses a generic type as it's a dynamic context that depends on user implementation

- **`cn(...classes)`** 
  - Re-export of `classnames` library for conditional CSS class management
  - Use instead of template literals for dynamic classes
  - Example: `cn('base-class', isActive && 'active-class')`

## Configuration Files

### `src/config/monsters.config.ts`
- Monster generation parameters (sizes, colors, trait types)
- Defines available body shapes, eye types, mouth types, arm types, leg types
- Used by monster generator to create random monsters

### `src/config/rewards.config.ts`
- Reward calculation constants
- Base coin rewards per action (1 coin base, 2 coins when matching state)
- XP rewards per action (25 XP)
- Level-up formula parameters

### `src/config/quests.config.ts`
- Complete quest definitions (daily quests + achievements)
- **Structure**: Uses Maps for O(1) lookup performance
  - `dailyQuestsMap: Map<string, QuestDefinition>` - 8 daily quests indexed by ID
  - `achievementsMap: Map<string, QuestDefinition>` - 29 achievements indexed by ID
  - `getQuestById(id)` - Helper function using nullish coalescing across both maps
- **Daily Quests**: 8 quests with 5-12 coin rewards
  - Simple objectives: feed, play, comfort, calm, lullaby monsters
  - Reset daily for recurring engagement
- **Achievements**: 29 permanent milestones
  - Action count tiers: 250/500/1000 for each action type (feed, play, comfort, calm, lullaby)
  - Ownership quests: 1/3/5 monsters
  - Coin milestones: 500/1000/2500/5000 coins earned (10% cashback rewards)
  - Progressive icon usage for visual hierarchy
- Quest types: `daily` | `achievement`
- Objective types: `action_count` | `ownership_count` | `reach_coins`

### `src/config/pricing.config.ts`
- Stripe pricing configuration with dual access patterns (iteration + lookup)
- **Structure**: Array source of truth + Maps for fast lookups
  - `pricingPackages: PricingPackage[]` - Source of truth array with 4 packages (150, 350, 1000, 2500 coins)
  - `pricingByCoins: Map<number, PricingPackage>` - O(1) lookup by coin amount
  - `pricingByProductId: Map<string, PricingPackage>` - O(1) lookup by Stripe Product ID
  - `getPackageByCoins(coins)` - Returns package or null using Map.get()
  - `getCoinsByProductId(productId)` - Returns coins or null using Map.get()
- **Usage**: 
  - UI components iterate over `pricingPackages` array for display
  - Server actions use Maps for fast validation (checkout creation, webhook processing)
- **Real Product IDs**: Contains production Stripe Product IDs (prod_TMDrndEWtgsT5V, etc.)

## Recent Development History

### Authentication & Routing Improvements
- **Sign-in/Sign-up Protection**: Auth pages now redirect to `/app` if user is already logged in (prevents duplicate sessions)
- **Profile Page**: Created comprehensive user profile with account info and logout functionality
- **Header Navigation**: Updated with profile link and wallet display
- **Profile Picture Upload**: Cloudinary integration for user avatar management
  - Client-side validations (file type, 5MB max size)
  - Automatic image transformation (96x96px, face-centered cropping)
  - Hover overlay and loading states for UX feedback
  - Fallback to User icon when no image or loading error
  - Storage in `my_monster/profile_pictures` folder on Cloudinary

### Coin System & Shop
- **Coin Icon**: Custom SVG icon component (`CoinIcon.tsx`) with coin.svg asset
- **CoinBadge**: Animated coin counter in header (renamed from `CreditBadge`)
- **Buy Coins Page**: Complete shop interface with purchasable coin packages
- **CoinPackage Component**: Reusable card for displaying coin bundles with pricing
- **Wallet Balance**: Reduced default from 100 to 25 coins for better game balance
- **Conditional DB Connection**: Database only connects when needed (performance optimization)
- **Stripe Integration**: Full payment processing with Stripe Checkout
  - Real Product IDs configured in pricing.config.ts
  - Webhook handler for secure payment verification
  - Automatic wallet balance update on successful payment

### Quest System
- **Quest Models**: Renamed from `quest-progress` to `quest` for clarity
- **Quest Types**: Daily quests (reset daily) and achievements (permanent)
- **Quest Progress Tracking**: Automatic progress updates via server actions
- **Quest Claiming**: Users can claim rewards for completed quests
- **Quest Page**: Full-featured UI with tabs for daily/achievements
- **Visual Indicators**: Ring styling on claimable quests
- **Action Hooks**: Monster actions automatically check and update quest progress
- **Maps Optimization**: Uses Map data structures for O(1) quest lookups by ID
- **Virtual Fields**: `completed` field is virtual, derived from `completedAt !== null`

### Wallet Enhancements
- **Total Earned Tracking**: New `totalEarned` field tracks cumulative coins (never decreases)
- **Coin Achievements**: Based on `totalEarned` rather than current balance
- **Auto-increment**: `updateWalletBalance()` automatically updates `totalEarned` on gains
- **Profile Statistics**: Wallet stats section shows both current balance and total earned
- **Zero-amount Guard**: No-op for zero-amount wallet updates (performance)
- **Animation System**: Centralized in WalletContext with actualBalance/balance states
  - Coin change animations (gain up/green, loss down/red)
  - Smooth counter animation over 1 second (30 steps)
  - Visual feedback for all coin transactions

### Configuration & Architecture
- **Config Files**: Extracted magic numbers to dedicated config files
  - `monsters.config.ts` - Monster generation parameters
  - `rewards.config.ts` - Reward calculation constants  
  - `quests.config.ts` - Quest definitions with Maps (8 daily + 29 achievements)
  - `pricing.config.ts` - Stripe pricing with dual structure (array + Maps)
- **Serializers**: Proper serializer pattern for all database models
- **Utility Functions**: `count()` helper for efficient array filtering
- **Performance Optimization**: Maps for O(1) lookups instead of O(n) filters/finds

### UI/UX Improvements
- **classnames Integration**: Replaced template literals with `cn()` utility across all components
- **Tailwind Dynamic Classes**: Fixed dynamic class generation with complete class mappings
- **Button Variants**: `width` prop added for flexible button sizing
- **Modal Integration**: Button component properly integrated in Modal footer
- **SectionTitle Component**: Reusable section headers across pages

### Code Quality
- **Consistent Imports**: `import cn from 'classnames'` pattern
- **Type Safety**: Explicit interfaces for all server action returns
- **Documentation**: French JSDoc comments for utility functions
- **Linting**: All code follows ts-standard conventions

## Next Steps / Incomplete Areas
- `src/services/` directory is empty - likely for future Tamagotchi logic extraction
- Quest reset mechanism for daily quests (needs cron job or similar)
- Achievement notification system when unlocked
- Stripe testing with Stripe CLI (see STRIPE_IMPLEMENTATION.md)
- Payment success/cancel redirect handling with toast notifications
- Loading states for CoinPackage buttons during checkout

## File References
- **Main Dashboard**: `src/app/app/page.tsx` - Monster grid and create form
- **Quest System**: `src/app/quests/page.tsx` - Daily quests and achievements
- **Profile**: `src/app/profile/page.tsx` - User account and wallet stats
- **Shop**: `src/app/buy-coins/page.tsx` - Coin purchase packages
- **Component Library**: `src/components/ui/` - Reusable UI components
- **Styling**: `src/app/globals.css` - Custom color definitions and animations