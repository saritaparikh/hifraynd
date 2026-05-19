# HiFraynd — Claude Code Instructions

## Project
Personal network CRM. Next.js 16 App Router, TypeScript, Supabase, Tailwind v4.

## Architecture
- `lib/data/` — raw database queries, one table per file, no business logic
- `lib/services/` — cross-table business logic and rules
- `lib/supabase/` — Supabase client configuration
- `lib/types/` — generated TypeScript types
- `app/` — Next.js App Router pages and API routes

## Rules
- Always use App Router, never Pages Router
- Server Components by default, Client Components only when needed (state, event handlers, browser APIs)
- Mark Client Components explicitly with 'use client' at the top
- All database queries go through lib/data/, never query Supabase directly from components
- Every function in lib/data/ takes userId as a parameter and filters by it
- Use generated types from lib/types/database.types.ts, never write manual types for database entities
- Errors are thrown, not returned
- Never hardcode credentials
- Tailwind v4 for styling

## What exists
- Full database schema with RLS and per-user data isolation
- Google OAuth authentication
- Auth middleware protecting all routes
- Complete data access layer for all entities
- Placeholder /contacts page

## What's next
- Contacts list page (real implementation)
- Contact detail page
- Add/edit contact forms
- Interaction logging
- Delivery tracking
