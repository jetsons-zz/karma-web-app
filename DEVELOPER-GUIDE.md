# Karma Web App - Developer Guide

**Version**: 1.2.0
**Last Updated**: 2025-10-28

This guide will help you understand the Karma Web App codebase and contribute effectively.

---

## 📚 Table of Contents

1. [Project Structure](#project-structure)
2. [Design System](#design-system)
3. [Component Guide](#component-guide)
4. [State Management](#state-management)
5. [Accessibility](#accessibility)
6. [Form Validation](#form-validation)
7. [Error Handling](#error-handling)
8. [Performance](#performance)
9. [Testing](#testing)
10. [Best Practices](#best-practices)

---

## 🏗️ Project Structure

```
karma-web/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Homepage
│   │   ├── conversations/       # Chat features
│   │   ├── projects/            # Project management
│   │   ├── avatars/             # AI avatars
│   │   ├── store/               # Avatar marketplace
│   │   ├── settings/            # User settings
│   │   └── api/                 # API routes
│   │
│   ├── components/
│   │   ├── features/            # Feature-specific components
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── FileAnalysis.tsx
│   │   │   └── CommandPalette.tsx
│   │   │
│   │   ├── layout/              # Layout components
│   │   │   ├── MainLayout.tsx
│   │   │   ├── TopNav.tsx
│   │   │   └── LeftSidebar.tsx
│   │   │
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── accessibility/   # A11y components
│   │   │
│   │   ├── ErrorBoundary.tsx    # Global error handling
│   │   └── ThemeProvider.tsx    # Dark mode management
│   │
│   ├── lib/
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useAccessibility.ts
│   │   │   ├── useFormValidation.ts
│   │   │   └── useKeyboardShortcuts.ts
│   │   │
│   │   ├── stores/              # Zustand stores
│   │   │   ├── layoutStore.ts
│   │   │   └── uiStore.ts
│   │   │
│   │   ├── services/            # API services
│   │   │   └── chatService.ts
│   │   │
│   │   ├── utils/               # Utility functions
│   │   │   ├── dateHelpers.ts
│   │   │   └── haptics.ts
│   │   │
│   │   └── mock/                # Mock data
│   │       └── data.ts
│   │
│   ├── types/                   # TypeScript types
│   │   └── index.ts
│   │
│   └── styles/                  # Global styles
│       └── globals.css
│
├── public/                      # Static assets
├── tokens/                      # Design tokens
│   └── tokens.json
│
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies

```

---

## 🎨 Design System

### Design Tokens

All design values are defined in `tokens/tokens.json` and available as CSS variables.

#### Colors

```css
/* Brand Colors */
--color-brand-primary: #2196F3
--color-brand-secondary: #9C27B0

/* Neutral Colors */
--color-neutral-50 to --color-neutral-900

/* Semantic Colors */
--color-accent-success: #4CAF50
--color-accent-warning: #FF9800
--color-accent-danger: #F44336

/* Dark Mode */
--color-dark-bg-default: #121212
--color-dark-text-primary: rgba(255, 255, 255, 0.87)
```

#### Typography

```css
/* Font Sizes */
--font-size-display-1: 32px
--font-size-h1: 24px
--font-size-body: 16px
--font-size-caption: 12px

/* Font Weights */
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-bold: 700
```

#### Spacing

```css
/* 8px Grid System */
--spacing-xs: 4px   (0.5x)
--spacing-sm: 8px   (1x)
--spacing-md: 16px  (2x)
--spacing-lg: 24px  (3x)
--spacing-xl: 32px  (4x)
--spacing-xxl: 48px (6x)
```

### Tailwind Utilities

#### Responsive Breakpoints (iOS-centric)

```typescript
'xs': '320px',   // iPhone SE
'sm': '375px',   // iPhone 13 Pro
'md': '428px',   // iPhone 13 Pro Max
'lg': '744px',   // iPad Mini
'xl': '1024px',  // iPad Pro
'2xl': '1280px', // MacBook
'3xl': '1920px', // iMac 5K
```

#### Touch Targets

All interactive elements must meet the **44x44pt minimum** (iOS HIG):

```typescript
min-h-touch     // 44px height
min-w-touch     // 44px width
min-h-touch-sm  // 40px (special cases)
min-h-touch-lg  // 48px (large buttons)
```

#### Elevation Shadows

```css
shadow-elevation-1  /* Subtle */
shadow-elevation-2  /* Raised */
shadow-elevation-3  /* Floating */
shadow-elevation-4  /* Overlay */
shadow-elevation-5  /* Modal */
```

---

## 🧩 Component Guide

### Button Component

```tsx
import { Button } from '@/components/ui/Button';

<Button
  variant="primary"    // primary | secondary | outline | ghost | danger
  size="md"           // sm | md | lg | icon
  isLoading={false}
  fullWidth={false}
  onClick={() => {}}
>
  Click me
</Button>
```

**Variants**:
- `primary`: Main actions (filled, brand color)
- `secondary`: Secondary actions (bordered)
- `outline`: Alternative actions (outlined)
- `ghost`: Tertiary actions (transparent)
- `danger`: Destructive actions (red)

### Card Component

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content goes here
  </CardContent>
</Card>
```

### Modal Component

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"  // sm | md | lg | xl | full
>
  Modal content
</Modal>
```

### Error Boundary

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary
  fallback={<CustomErrorUI />}
  onError={(error, errorInfo) => {
    // Log to error service
    console.error(error);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### Optimized Image

```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage';

<OptimizedImage
  src="/images/avatar.jpg"
  alt="User avatar"
  width={400}
  height={400}
  loading="lazy"      // lazy | eager
  placeholder="blur"  // blur | empty
/>
```

---

## 🔄 State Management

### Zustand Stores

#### Layout Store

```typescript
import { useLayoutStore } from '@/lib/stores/layoutStore';

function MyComponent() {
  const { leftSidebarOpen, toggleLeftSidebar } = useLayoutStore();

  return (
    <button onClick={toggleLeftSidebar}>
      Toggle Sidebar
    </button>
  );
}
```

**Available State**:
- `leftSidebarOpen`: boolean
- `rightSidebarOpen`: boolean
- `toggleLeftSidebar()`: function
- `toggleRightSidebar()`: function

---

## ♿ Accessibility

### ARIA Labels

Always add proper ARIA labels to interactive elements:

```tsx
<button
  aria-label="Close dialog"
  aria-pressed={isActive}
  aria-expanded={isExpanded}
  onClick={handleClick}
>
  <CloseIcon />
</button>
```

### Keyboard Navigation

Use the `useKeyboardNavigation` hook for list navigation:

```tsx
import { useKeyboardNavigation } from '@/lib/hooks/useAccessibility';

function ListComponent() {
  const containerRef = useKeyboardNavigation(items.length);

  return (
    <ul ref={containerRef} role="menu">
      {items.map(item => (
        <li key={item.id} role="menuitem" tabIndex={0}>
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

### Focus Trap

For modals and dialogs:

```tsx
import { useFocusTrap } from '@/lib/hooks/useAccessibility';

function Modal() {
  const containerRef = useFocusTrap(true);

  return (
    <div ref={containerRef}>
      {/* Modal content */}
    </div>
  );
}
```

### Screen Reader Announcements

```typescript
import { announceToScreenReader } from '@/lib/hooks/useAccessibility';

announceToScreenReader('Item added to cart', 'polite');
announceToScreenReader('Error occurred', 'assertive');
```

---

## 📝 Form Validation

### Using the Form Validation Hook

```tsx
import { useFormValidation, validators } from '@/lib/hooks/useFormValidation';

function LoginForm() {
  const form = useFormValidation({
    initialValues: {
      email: '',
      password: '',
    },
    validationRules: {
      email: [
        validators.required(),
        validators.email(),
      ],
      password: [
        validators.required(),
        validators.minLength(8),
      ],
    },
    onSubmit: async (values) => {
      await login(values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={(e) => form.handleChange('email', e.target.value)}
        onBlur={() => form.handleBlur('email')}
        aria-invalid={!!form.errors.email}
        aria-describedby={form.errors.email ? 'email-error' : undefined}
      />
      {form.touched.email && form.errors.email && (
        <span id="email-error" role="alert">{form.errors.email}</span>
      )}

      <Button type="submit" isLoading={form.isSubmitting}>
        Submit
      </Button>
    </form>
  );
}
```

### Built-in Validators

- `validators.required()`
- `validators.email()`
- `validators.minLength(n)`
- `validators.maxLength(n)`
- `validators.min(n)`
- `validators.max(n)`
- `validators.pattern(regex)`
- `validators.url()`
- `validators.matches(fieldName)`
- `validators.custom(validate, message)`

---

## 🚨 Error Handling

### Component-Level Error Boundary

```tsx
<ErrorBoundary
  fallback={<div>Something went wrong</div>}
  onError={(error, errorInfo) => {
    // Log to Sentry, LogRocket, etc.
    logErrorToService(error, errorInfo);
  }}
>
  <RiskyComponent />
</ErrorBoundary>
```

### API Error Handling

```typescript
try {
  const data = await fetchData();
  return data;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle authentication error
    redirectToLogin();
  } else if (error.response?.status === 404) {
    // Handle not found
    showNotFoundPage();
  } else {
    // Generic error
    showErrorToast(error.message);
  }
}
```

---

## ⚡ Performance

### Code Splitting

Use dynamic imports for large components:

```tsx
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('./HeavyComponent'),
  { loading: () => <Spinner /> }
);
```

### Image Optimization

Always use `OptimizedImage` instead of regular `<img>`:

```tsx
<OptimizedImage
  src="/large-image.jpg"
  alt="Description"
  loading="lazy"
  placeholder="blur"
/>
```

### Memoization

Use `React.memo`, `useMemo`, and `useCallback` appropriately:

```tsx
const MemoizedComponent = React.memo(ExpensiveComponent);

const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

---

## 🧪 Testing

### Unit Tests (Coming Soon)

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### E2E Tests (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can log in', async ({ page }) => {
  await page.goto('/login');
  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

---

## ✅ Best Practices

### 1. Component Organization

```tsx
// 1. Imports (grouped)
import { useState, useEffect } from 'react';  // React
import { useRouter } from 'next/navigation';  // Next.js
import { Button } from '@/components/ui';     // Local

// 2. Types
interface MyComponentProps {
  title: string;
  onSave: () => void;
}

// 3. Component
export function MyComponent({ title, onSave }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  const router = useRouter();

  // 5. Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // 6. Handlers
  const handleClick = () => {
    // Handler logic
  };

  // 7. Render
  return (
    // JSX
  );
}
```

### 2. TypeScript

Always use explicit types:

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Bad
function getUser(id) {
  // ...
}
```

### 3. CSS Variables

Use CSS variables instead of hard-coded values:

```tsx
// ✅ Good
<div style={{ color: 'var(--color-text-primary)' }}>

// ❌ Bad
<div style={{ color: '#000000' }}>
```

### 4. Accessibility

Always include:
- Alt text for images
- ARIA labels for icons
- Keyboard navigation
- Focus indicators
- Screen reader support

```tsx
// ✅ Good
<button aria-label="Close dialog" onClick={close}>
  <CloseIcon aria-hidden="true" />
</button>

// ❌ Bad
<button onClick={close}>
  <CloseIcon />
</button>
```

### 5. Error Handling

Always handle errors gracefully:

```tsx
// ✅ Good
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error(error);
  showErrorToast('Failed to load data');
}

// ❌ Bad
const data = await fetchData();
setData(data);
```

---

## 🔗 Related Documentation

- [README.md](./README.md) - Project overview
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md) - Deployment instructions
- [API-KEY-SECURITY-GUIDE.md](./API-KEY-SECURITY-GUIDE.md) - Security best practices

---

## 🤝 Contributing

### Code Style

- Use TypeScript for all new files
- Follow the existing code structure
- Add comments for complex logic
- Keep components small and focused
- Write meaningful commit messages

### Pull Request Process

1. Create a feature branch
2. Make your changes
3. Add tests if applicable
4. Update documentation
5. Submit PR with detailed description

---

**Last Updated**: 2025-10-28
**Maintainer**: Karma Development Team
**Version**: 1.2.0
