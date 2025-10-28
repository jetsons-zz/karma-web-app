# Component Usage Examples

Complete examples for all Karma Web App components.

---

## 🎨 UI Components

### Button

```tsx
import { Button } from '@/components/ui/Button';

// Primary button (main actions)
<Button variant="primary" size="md" onClick={handleSave}>
  Save Changes
</Button>

// Secondary button (alternative actions)
<Button variant="secondary" size="md">
  Cancel
</Button>

// Outline button
<Button variant="outline" size="md">
  Learn More
</Button>

// Ghost button (subtle actions)
<Button variant="ghost" size="sm">
  Skip
</Button>

// Danger button (destructive actions)
<Button variant="danger" size="md" onClick={handleDelete}>
  Delete Account
</Button>

// Icon button
<Button variant="ghost" size="icon" aria-label="Settings">
  <SettingsIcon />
</Button>

// Loading state
<Button variant="primary" isLoading={isSubmitting}>
  Submitting...
</Button>

// Full width
<Button variant="primary" fullWidth>
  Continue
</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

<Card>
  <CardHeader>
    <CardTitle>Project Overview</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Project details and statistics...</p>
  </CardContent>
</Card>

// Clickable card
<Card
  className="cursor-pointer hover:shadow-lg transition-all"
  onClick={() => router.push(`/projects/${id}`)}
>
  <CardContent>
    <h3>{project.name}</h3>
    <p>{project.description}</p>
  </CardContent>
</Card>
```

### Modal

```tsx
import { Modal } from '@/components/ui/Modal';
import { useState } from 'react';

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        Open Modal
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Create New Project"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Project Name"
            placeholder="Enter project name"
          />
          <Textarea
            label="Description"
            placeholder="Describe your project"
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Create
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
```

### Input & Textarea

```tsx
import { Input, Textarea } from '@/components/ui';

// Basic input
<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Input with error
<Input
  label="Password"
  type="password"
  error="Password must be at least 8 characters"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// Textarea
<Textarea
  label="Description"
  placeholder="Enter description..."
  rows={4}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>

// With validation
<Input
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  onBlur={validateUsername}
  error={errors.username}
  aria-invalid={!!errors.username}
  aria-describedby="username-error"
/>
```

### Avatar

```tsx
import { Avatar } from '@/components/ui/Avatar';

// Basic avatar
<Avatar
  src="/avatars/user.jpg"
  name="John Doe"
  size="md"
/>

// With status indicator
<Avatar
  src="/avatars/user.jpg"
  name="John Doe"
  size="md"
  status="online"  // online | offline | busy | away
/>

// With role badge
<Avatar
  src="/avatars/avatar.jpg"
  name="Code Forge"
  size="lg"
  showRole
/>

// Different sizes
<Avatar src="/avatar.jpg" name="User" size="xs" /> // 24px
<Avatar src="/avatar.jpg" name="User" size="sm" /> // 32px
<Avatar src="/avatar.jpg" name="User" size="md" /> // 40px
<Avatar src="/avatar.jpg" name="User" size="lg" /> // 48px
<Avatar src="/avatar.jpg" name="User" size="xl" /> // 64px
```

### Badge

```tsx
import { Badge } from '@/components/ui/Badge';

// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Failed</Badge>
<Badge variant="info">In Progress</Badge>

// Custom colors
<Badge style={{ backgroundColor: 'var(--color-brand-primary)' }}>
  Premium
</Badge>

// With icon
<Badge variant="success">
  <CheckIcon className="h-3 w-3 mr-1" />
  Verified
</Badge>
```

### Progress

```tsx
import { Progress } from '@/components/ui/Progress';

// Basic progress bar
<Progress value={75} max={100} />

// With label
<div>
  <div className="flex justify-between mb-1">
    <span>Upload Progress</span>
    <span>75%</span>
  </div>
  <Progress value={75} max={100} />
</div>

// Different colors
<Progress value={75} max={100} className="bg-success" />
```

### Spinner

```tsx
import { Spinner } from '@/components/ui/Spinner';

// Loading spinner
<Spinner size="sm" /> // 16px
<Spinner size="md" /> // 24px
<Spinner size="lg" /> // 32px

// With label
<div className="flex items-center gap-2">
  <Spinner size="sm" />
  <span>Loading...</span>
</div>
```

---

## 🎯 Feature Components

### Message Bubble

```tsx
import { MessageBubble } from '@/components/features/MessageBubble';

// Text message
<MessageBubble
  message={{
    id: '1',
    sender: 'user',
    type: 'text',
    content: 'Hello, how can I help you?',
    timestamp: new Date().toISOString(),
  }}
/>

// Code message
<MessageBubble
  message={{
    id: '2',
    sender: 'avatar',
    type: 'code',
    content: 'const greeting = "Hello World";',
    language: 'javascript',
    timestamp: new Date().toISOString(),
  }}
/>

// File message
<MessageBubble
  message={{
    id: '3',
    sender: 'user',
    type: 'file',
    fileName: 'document.pdf',
    fileSize: 1024000,
    fileUrl: '/files/document.pdf',
    timestamp: new Date().toISOString(),
  }}
/>
```

### File Analysis

```tsx
import { FileAnalysis } from '@/components/features/FileAnalysis';

<FileAnalysis
  analysis={{
    fileName: 'app.tsx',
    language: 'typescript',
    quality: {
      score: 85,
      grade: 'A',
    },
    complexity: {
      cyclomatic: 5,
      cognitive: 8,
    },
    issues: [
      {
        severity: 'warning',
        message: 'Consider extracting this to a separate function',
        line: 42,
      },
    ],
    suggestions: [
      'Add TypeScript strict mode',
      'Implement error boundaries',
    ],
  }}
/>
```

### Command Palette

```tsx
import { CommandPalette } from '@/components/features/CommandPalette';

<CommandPalette
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  commands={[
    {
      id: 'new-project',
      name: 'New Project',
      icon: <PlusIcon />,
      action: () => router.push('/projects/create'),
      shortcut: 'Cmd+N',
    },
    {
      id: 'search',
      name: 'Search',
      icon: <SearchIcon />,
      action: () => focusSearch(),
      shortcut: 'Cmd+K',
    },
  ]}
/>
```

---

## ♿ Accessibility Components

### Skip Link

```tsx
import { SkipLink } from '@/components/ui/accessibility';

// In your layout
<SkipLink href="#main-content">
  Skip to main content
</SkipLink>

<main id="main-content">
  {/* Your content */}
</main>
```

### Keyboard Shortcuts

```tsx
import { KeyboardShortcuts } from '@/components/ui/accessibility';

// Add to your main layout - it handles everything automatically
<KeyboardShortcuts />

// Shortcuts are automatically available:
// - ? : Show help
// - Cmd+1 : Go to Dashboard
// - Cmd+2 : Go to Projects
// - Cmd+3 : Go to Avatars
// - Cmd+4 : Go to Conversations
// - Cmd+K : Command palette
// - Esc : Close modals
```

### Focus Trap

```tsx
import { useFocusTrap } from '@/lib/hooks/useAccessibility';

function Modal({ isOpen }: { isOpen: boolean }) {
  const containerRef = useFocusTrap(isOpen);

  return (
    <div ref={containerRef}>
      {/* Modal content - focus will be trapped inside */}
      <input />
      <button>Save</button>
      <button>Cancel</button>
    </div>
  );
}
```

---

## 🛡️ Error Handling

### Error Boundary

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Wrap your app or specific components
<ErrorBoundary
  fallback={
    <div className="p-8 text-center">
      <h2>Something went wrong</h2>
      <Button onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  }
  onError={(error, errorInfo) => {
    // Log to error tracking service
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
  }}
>
  <YourApp />
</ErrorBoundary>

// Use multiple boundaries for better error isolation
<ErrorBoundary>
  <Header />
</ErrorBoundary>

<ErrorBoundary>
  <MainContent />
</ErrorBoundary>

<ErrorBoundary>
  <Footer />
</ErrorBoundary>
```

---

## 📋 Form Validation

### Complete Form Example

```tsx
import { useFormValidation, validators } from '@/lib/hooks/useFormValidation';
import { Input, Button } from '@/components/ui';

function SignupForm() {
  const form = useFormValidation({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      username: [
        validators.required(),
        validators.minLength(3),
        validators.maxLength(20),
      ],
      email: [
        validators.required(),
        validators.email(),
      ],
      password: [
        validators.required(),
        validators.minLength(8),
        validators.pattern(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          'Password must contain uppercase, lowercase, and number'
        ),
      ],
      confirmPassword: [
        validators.required(),
        validators.matches('password', 'Passwords must match'),
      ],
    },
    onSubmit: async (values) => {
      await signup(values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit} className="space-y-4">
      <Input
        label="Username"
        name="username"
        value={form.values.username}
        onChange={(e) => form.handleChange('username', e.target.value)}
        onBlur={() => form.handleBlur('username')}
        error={form.touched.username ? form.errors.username : undefined}
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={form.values.email}
        onChange={(e) => form.handleChange('email', e.target.value)}
        onBlur={() => form.handleBlur('email')}
        error={form.touched.email ? form.errors.email : undefined}
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={form.values.password}
        onChange={(e) => form.handleChange('password', e.target.value)}
        onBlur={() => form.handleBlur('password')}
        error={form.touched.password ? form.errors.password : undefined}
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={form.values.confirmPassword}
        onChange={(e) => form.handleChange('confirmPassword', e.target.value)}
        onBlur={() => form.handleBlur('confirmPassword')}
        error={form.touched.confirmPassword ? form.errors.confirmPassword : undefined}
      />

      <Button
        type="submit"
        variant="primary"
        fullWidth
        isLoading={form.isSubmitting}
        disabled={!form.isValid}
      >
        Sign Up
      </Button>
    </form>
  );
}
```

---

## 🎨 Theme Provider

### Setup

```tsx
// app/layout.tsx
import { ThemeProvider, ThemeScript } from '@/components/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript storageKey="karma-theme" />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Usage

```tsx
import { useTheme } from '@/components/ThemeProvider';

function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>

      <Button onClick={toggleTheme}>
        Toggle Theme
      </Button>

      <Button onClick={() => setTheme('light')}>
        Light
      </Button>

      <Button onClick={() => setTheme('dark')}>
        Dark
      </Button>

      <Button onClick={() => setTheme('system')}>
        System
      </Button>
    </div>
  );
}
```

---

## 🖼️ Optimized Image

### Basic Usage

```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage';

// Simple image with lazy loading
<OptimizedImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  loading="lazy"
/>

// Priority image (above fold)
<OptimizedImage
  src="/images/logo.png"
  alt="Company logo"
  width={200}
  height={50}
  priority
  loading="eager"
/>

// With blur placeholder
<OptimizedImage
  src="/images/photo.jpg"
  alt="Photo"
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Avatar variant
import { OptimizedAvatar } from '@/components/ui/OptimizedImage';

<OptimizedAvatar
  src="/avatars/user.jpg"
  name="John Doe"
  size="md"
/>
```

---

## 📱 Responsive Design

### Mobile First

```tsx
// Always design for mobile first, then scale up
<div className="
  flex flex-col gap-4           // Mobile: vertical stack
  md:flex-row md:gap-6          // Tablet: horizontal
  lg:gap-8                      // Desktop: more space
">
  <div className="
    w-full                      // Mobile: full width
    md:w-1/2                    // Tablet: half width
    lg:w-1/3                    // Desktop: third width
  ">
    Content
  </div>
</div>
```

### Hide/Show by Breakpoint

```tsx
<div className="
  block md:hidden              // Show on mobile only
">
  Mobile content
</div>

<div className="
  hidden md:block              // Show on tablet and above
">
  Desktop content
</div>
```

---

**Last Updated**: 2025-10-28
**Version**: 1.2.0
