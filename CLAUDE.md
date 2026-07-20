# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Next.js 16 monorepo** for a personal blog site, managed with **pnpm workspaces** and **Turborepo**. The blog content is authored in MDX and rendered with dynamic imports.

## Commands

All commands run from the monorepo root:

```bash
# Development (starts Next.js dev server)
pnpm dev

# Build all packages and apps
pnpm build

# Type-check all packages and apps
pnpm typecheck

# Lint all packages and apps
pnpm lint

# Format all packages and apps
pnpm format

# Add a shadcn/ui component to the shared UI package
pnpm addCom <component-name>
# Example: pnpm addCom @magicui/icon-cloud
# This runs: pnpm dlx shadcn@latest add <name> -c packages/ui
```

There are no tests yet in this codebase.

## Architecture

```
next-blog/
├── apps/web/          # Next.js 16 blog application
│   ├── app/           # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout (fonts, theme cookie, DockMenu)
│   │   ├── page.tsx         # Home page (HeroCloud + FlickeringGrid)
│   │   ├── not-found.tsx    # Custom 404 page
│   │   └── blog/[slug]/     # Dynamic blog post pages (MDX)
│   ├── components/    # App-specific components (TableOfContents, MagicCard, ThemeStorageSync)
│   ├── content/       # MDX blog post files (1.mdx, 2.mdx, …)
│   └── lib/
│       ├── blog.ts           # Blog utilities: postExists(), getPostToc() for heading extraction
│       └── ui/               # App-specific UI widgets (PageContainer, HeroCloud, HeroText, DockMenu, DotBackground)
├── packages/
│   ├── ui/            # Shared shadcn/ui component library (@workspace/ui)
│   │   └── src/
│   │       ├── components/   # Shared components (button, dock, flickering-grid, icon-cloud, morphing-text, …)
│   │       ├── lib/utils.ts  # cn() — clsx + tailwind-merge
│   │       └── styles/       # Global CSS with Tailwind 4 + shadcn CSS variables + light/dark theme tokens
│   ├── eslint-config/       # Shared ESLint configs (base, next.js, react-internal)
│   └── typescript-config/   # Shared TS configs (base, nextjs, react-library)
└── scripts/
    └── addComponent.ts       # CLI helper that wraps `pnpm dlx shadcn@latest add`
```

## Key Design Decisions

### MDX Blog System

Blog posts live as `.mdx` files in `apps/web/content/`. Each file is dynamically imported at `apps/web/app/blog/[slug]/page.tsx:14`:

```tsx
const [{ default: Post }, toc] = await Promise.all([
  import(`@/content/${slug}.mdx`),
  getPostToc(slug),
])
```

MDX files can freely mix markdown and JSX — components like `<PageContainer>` can be used directly inside `.mdx` files.

### Table of Contents

`apps/web/lib/blog.ts` extracts headings from MDX source via regex (`/^(#{2,6})\s+(.+?)\s*#*\s*$/`). Only h2–h6 are included. The `stripMarkdown()` function removes inline markdown formatting (backticks, links, emphasis) to produce clean heading text. Slugs are generated with `github-slugger`.

### Theme Handling (Dark Mode)

Dark mode uses a **cookie-first** approach:
1. Server reads the `theme` cookie in `layout.tsx` and sets the `dark` class on `<html>`.
2. `ThemeStorageSync` (client component) runs once on first visit — if no cookie exists, it reads `localStorage` or `prefers-color-scheme`, applies the class, and writes a cookie for subsequent SSR visits.
3. `AnimatedThemeToggler` from `@workspace/ui` handles toggling via `next-themes`.

### Component Library

The shared UI package (`@workspace/ui`) is a shadcn/ui component library. Components are added via `pnpm addCom` or directly with `pnpm dlx shadcn@latest add <name> -c packages/ui`. Components are imported as:

```tsx
import { Button } from "@workspace/ui/components/button"
```

The package uses Tailwind CSS 4 with `@source` directives in `globals.css` to scan both the package and consuming apps for class usage.

### cn() Utility

There are two `cn()` utilities that do the same thing (clsx + tailwind-merge):
- `packages/ui/src/lib/utils.ts` — the canonical one, exported via `@workspace/ui/lib/utils`
- `apps/web/lib/utils/tool.ts` — a local duplicate used by `PageWigets.tsx`

New code should import from `@workspace/ui/lib/utils`.

### DockMenu

The fixed bottom dock (`apps/web/lib/ui/DockMenu.tsx`) uses the shared `Dock` and `DockIcon` components from `@workspace/ui`. It displays navigation links, social icons, a separator, and the theme toggler — all wrapped in `TooltipProvider`/`Tooltip`.

### Tech Stack

- **Framework**: Next.js 16 with React 19, App Router
- **Styling**: Tailwind CSS 4 with `tw-animate-css` and shadcn CSS custom properties (oklch colors, design tokens for light/dark)
- **Content**: MDX via `@next/mdx` + `rehype-slug` for heading IDs
- **Animation**: `motion` (formerly framer-motion)
- **Icons**: `lucide-react`
- **Package manager**: pnpm 10.x
- **Build**: Turborepo 2.x
- **Node**: >= 20
