# Copilot Instructions - MyMonster Project

## Project Overview
This is a Next.js 16.0.0 project using the App Router architecture, built for a school project (My Digital School). It's a Tamagotchi-style application using React 19, TypeScript, and Tailwind CSS 4 with custom color palette.

### Game Mechanics
- **Wallet System**: Each user has a separate `Wallet` document (default balance: 100 coins)
  - Wallet is created automatically on first access via `getWallet()` server action
  - Each monster action rewards coins: 1 coins (base) or 2 coins (when action matches monster state)
  - Coin counter in header animates when coins are earned
  - Wallet stored in separate collection, not on user document
- **XP System**: Monsters gain experience and level up
  - Each action awards 25 XP
  - Level-up formula: `maxXp = 100 * (level ^ 1.5)`
  - Level-up triggers a dramatic full-screen celebration modal
- **Monster States**: `happy | sad | gamester | angry | hungry | sleepy`
  - Actions that match the current state give double coin rewards
  - All actions return monster to `happy` state

## Tech Stack & Key Dependencies
- **Framework**: Next.js 16.0.0 with App Router and Turbopack
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS 4 with custom color themes
- **Fonts**: Jersey 10 & Geist Mono from Google Fonts
- **Linting**: ts-standard for TypeScript linting

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
- `src/components/` - Reusable React components
- `src/services/` - Service layer (currently empty, planned for Tamagotchi logic)
- `specs/` - Project specifications (PDF documentation)

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
- **Component Styling**: Utility functions for size/variant mapping (see `getSize()` and `getVariant()` in Button component)
- **Responsive Design**: Mobile-first approach with `sm:` breakpoints
- **Animations**: Custom keyframe animations for monster interactions (wave-arms, wiggle-arms, shake-arms-hungry, chomp-mouth, gaming-eyes, bounce-body, tears)

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
- **No Custom Serializers**: Avoid creating serializer/deserializer utilities for database models; rely on Mongoose's native `.lean()` for clean data transfer
- **Type Casting**: When using `.lean()`, the result is supposed to be the appropriate TypeScript interface. Use casting only when strictly necessary.
- **Example Pattern**: `const monster = await MonsterModel.findById(id).lean()`
- **Wallet Pattern**: Use separate Wallet collection instead of storing credits on user document. Access via `getWallet()` which auto-creates if missing.
- **Wallet Updates**: Use `updateWalletBalance(amount)` for atomic balance updates with upsert support

### Implementation Checklist
- **Design First**: Capture the intended responsibility, collaborators, and dependencies before coding; validate the design against SOLID and Clean Architecture boundaries.
- **Enforce Abstractions**: Introduce interfaces or type aliases at layer boundaries and depend on them instead of concrete implementations.
- **Keep Layers Pure**: Prohibit presentation components from importing domain or infrastructure code directly; rely on application-level adapters housed in `src/services/`.
- **Traceability**: Document how each new module maps to its domain concept with a short comment or README snippet when the rationale is non-trivial.
- **Testing Strategy**: Prefer fast unit tests around pure domain logic, component tests for UI behaviour, and adapters/tests at boundaries to keep regression risk low.
- **Refinement Loop**: After implementation, review the change by explicitly checking SRP adherence, dependency direction, naming clarity, and absence of duplications or magic values.

## Next Steps / Incomplete Areas
- `src/services/` directory is empty - likely for Tamagotchi game logic
- Layout uses generic "Create Next App" metadata - needs project-specific updates
- Only basic Button component exists - UI component library needs expansion

## File References
- **Main Page**: `src/app/page.tsx` - Shows Button component variations
- **Component Example**: `src/components/button.tsx` - Reference for component patterns
- **Styling**: `src/app/globals.css` - Custom color definitions and theme setup