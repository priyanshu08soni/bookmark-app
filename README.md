# 🔖 BookmarkVault

A **private, real-time bookmark manager** built with Next.js 16 (App Router), Supabase, and Tailwind CSS.

## ✨ Features

- 🔐 **Google OAuth only** — no email/password
- 🔒 **Private bookmarks** — Row Level Security ensures User A cannot see User B's bookmarks
- ⚡ **Real-time updates** — open two tabs, add a bookmark in one, it appears in the other instantly
- 🗑️ **Delete bookmarks** — users can delete their own bookmarks
- 🌐 **Favicon display** — automatically fetches site favicons
- 🎨 **Beautiful dark UI** — glassmorphism, smooth animations, gradient accents

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Auth | Supabase Auth (Google OAuth) |
| Database | Supabase PostgreSQL + RLS |
| Realtime | Supabase Realtime |
| Styling | Tailwind CSS v4 + Custom CSS |
| Deployment | Vercel |

---

## 🚀 Setup Guide

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready

### Step 2: Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `supabase/schema.sql`
3. Click **Run**

This creates:
- `bookmarks` table with UUID primary key
- Row Level Security (RLS) policies
- Realtime enabled for the table

### Step 3: Enable Google OAuth

1. In Supabase dashboard, go to **Authentication → Providers**
2. Enable **Google**
3. You'll need a Google OAuth Client ID and Secret:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or use existing)
   - Go to **APIs & Services → Credentials**
   - Create **OAuth 2.0 Client ID** (Web application)
   - Add authorized redirect URIs:
     - `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local dev)
4. Copy the Client ID and Secret into Supabase

### Step 4: Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

Find these in Supabase: **Settings → API**

### Step 5: Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deploy to Vercel

### Option A: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B: Vercel Dashboard

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project**
3. Import your GitHub repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click **Deploy**

### After Deploying to Vercel

Add your Vercel URL to Supabase allowed redirect URLs:

1. Supabase → **Authentication → URL Configuration**
2. Add to **Redirect URLs**: `https://your-app.vercel.app/auth/callback`
3. Also update Google OAuth Console with the Vercel redirect URI:
   `https://YOUR_SUPABASE_PROJECT_REF.supabase.co/auth/v1/callback`

---

## 📁 Project Structure

```
bookmark-app/
├── app/
│   ├── actions/
│   │   └── auth.ts          # Server actions (signIn, signOut)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts     # OAuth callback handler
│   ├── dashboard/
│   │   └── page.tsx         # Protected dashboard page
│   ├── globals.css          # Global styles + design system
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Login page (redirects if authed)
├── components/
│   ├── AddBookmarkForm.tsx  # Form to add new bookmarks
│   ├── BookmarkCard.tsx     # Individual bookmark card
│   ├── Dashboard.tsx        # Main dashboard with realtime
│   ├── EmptyState.tsx       # Empty state UI
│   └── LoginPage.tsx        # Login page UI
├── lib/
│   └── supabase/
│       ├── client.ts        # Browser Supabase client
│       └── server.ts        # Server Supabase client
├── supabase/
│   └── schema.sql           # Database schema + RLS policies
├── proxy.ts                 # Next.js 16 proxy (auth guard)
├── .env.example             # Environment variables template
└── vercel.json              # Vercel deployment config
```

## 🔒 Security

- **Row Level Security (RLS)** is enabled on the `bookmarks` table
- Users can only SELECT, INSERT, UPDATE, DELETE their **own** bookmarks
- The `user_id` is always set server-side from the authenticated session
- No email/password — Google OAuth only reduces attack surface

## ⚡ Real-time Architecture

The dashboard subscribes to Supabase Realtime with a filter:

```typescript
supabase
  .channel(`bookmarks:${user.id}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'bookmarks',
    filter: `user_id=eq.${user.id}`,  // Only this user's changes
  }, handler)
  .subscribe()
```

This means:
- Adding a bookmark in Tab A → instantly appears in Tab B
- Deleting in Tab A → instantly removed in Tab B
- Each user only receives their own events
