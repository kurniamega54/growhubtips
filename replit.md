# GrowHubTips

A gardening-focused CMS and blog platform built with Next.js 16, featuring a block-based editor with gardening-specific content blocks.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 with custom organic design system
- **UI**: shadcn/ui, Framer Motion, Lucide React
- **Editor**: Tiptap (block-based, Notion-style)
- **Database**: PostgreSQL via Neon (serverless)
- **ORM**: Drizzle ORM
- **Package Manager**: npm

## Project Structure

- `app/` - Next.js App Router pages
  - `(site)/` - Public-facing pages
  - `admin/` - Admin dashboard and post management
  - `blog/[slug]/` - Dynamic blog post pages
- `src/app/admin/new-post/` - Advanced block editor implementation
- `lib/` - Core business logic
  - `lib/db/` - Database schema and connection
  - `lib/editor/` - Tiptap editor extensions
  - `lib/validations/` - Zod validation schemas
- `scripts/` - Utility scripts (seed, etc.)
- `drizzle/` - Database migration files

## Environment Variables

- `DATABASE_URL` - Neon PostgreSQL connection string (required)

## Running the App

- **Development**: `npm run dev` (runs on 0.0.0.0:5000)
- **Database migrations**: `npm run db:push`
- **Database seeding**: `npm run db:seed`

## Workflow

- **Start application**: `npm run dev` → port 5000 (webview)

## Deployment

- Target: autoscale
- Build: `npm run build`
- Run: `npm run start`
