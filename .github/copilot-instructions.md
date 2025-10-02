# Copilot Instructions - Tamagotcho Project

## Project Overview
This is a Next.js 15.5.4 project using the App Router architecture, built for a school project (My Digital School). It's a Tamagotchi-style application using React 19, TypeScript, and Tailwind CSS 4 with custom color palette.

## Tech Stack & Key Dependencies
- **Framework**: Next.js 15.5.4 with App Router and Turbopack
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS 4 with custom color themes
- **Fonts**: Geist Sans & Geist Mono from Google Fonts
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
// Example from src/components/button.tsx
function Button ({
  children = 'Click me',
  onClick,
  size = 'md',
  variant = 'primary',
  disabled = false
}: {
  children: React.ReactNode
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'ghost' | 'underline' | 'outline'
  disabled?: boolean
}): React.ReactNode
```

### Styling Conventions
- **Custom Color Palette**: Uses `moccaccino`, `lochinvar`, and `fuchsia-blue` color scales defined in `globals.css`
- **Component Styling**: Utility functions for size/variant mapping (see `getSize()` and `getVariant()` in Button component)
- **Responsive Design**: Mobile-first approach with `sm:` breakpoints
- **Animations**: Consistent `transition-all duration-300` and `active:scale-95` for interactive elements

### Import Patterns
- Use `@/` alias for src imports: `import Button from '@/components/button'`
- Explicit return type annotations: `(): React.ReactNode`
- CSS imports in layout: `import './globals.css'`

## Project-Specific Guidelines

### Component Development
- **Size Variants**: Use `sm | md | lg | xl` pattern for consistent sizing
- **Visual Variants**: Follow `primary | ghost | underline | outline` pattern
- **Disabled States**: Always handle disabled styling separately from hover states
- **Default Props**: Provide sensible defaults in destructuring

### Color Usage Notes
- Primary brand color: `moccaccino-500` (#f7533c)
- Secondary accent: `lochinvar-500` (#469086) 
- Tertiary accent: `fuchsia-blue-500` (#8f72e0)
- Use color-50 variants for subtle backgrounds, color-700+ for emphasis

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

## Next Steps / Incomplete Areas
- `src/services/` directory is empty - likely for Tamagotchi game logic
- Layout uses generic "Create Next App" metadata - needs project-specific updates
- Only basic Button component exists - UI component library needs expansion

## File References
- **Main Page**: `src/app/page.tsx` - Shows Button component variations
- **Component Example**: `src/components/button.tsx` - Reference for component patterns
- **Styling**: `src/app/globals.css` - Custom color definitions and theme setup