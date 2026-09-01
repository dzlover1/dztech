# Prompt Gallery

A professional, modern, responsive platform to **organize, store, browse, search, preview, edit, copy, and manage AI prompts** — each one with its own visual image.

**Stack:** Next.js 16 (App Router) · Supabase (PostgreSQL + Auth + Storage) · Tailwind CSS 4

---

## Features

- **Visual gallery** — responsive grid (4/3/1 cards), every prompt has a dedicated image with professional placeholder fallback
- **Dashboard** — live stats (total prompts, categories, images, favorites) + recent & most-used prompt grids
- **Prompt CRUD** — create, edit, delete, duplicate (auto "— Copy" rename)
- **Image system** — upload (PNG/JPG/JPEG/WEBP) with drag & drop and preview; Supabase Storage; full-screen image viewer (zoom/navigate/download)
- **Search & filters** — instant search across title/content/category/tags/model/language; filters by category, AI model, language, favorites
- **Sorting** — newest, oldest, most used, alphabetical, recently updated
- **Copy system** — full prompt to clipboard with visual confirmation, preserving JSON/Markdown/Arabic RTL
- **Download** — prompt as .txt, prompt as JSON, image
- **Collections** — create/manage collections, prompts can belong to multiple
- **Favorites** — star any prompt, dedicated Favorites page
- **Import** — JSON / TXT / Markdown / CSV with auto title/tags/language/model detection
- **Auth** — Supabase Auth (email/password), protected routes, per-user ownership + Row Level Security
- **RTL / Arabic** — full Arabic translation + automatic RTL layout switching
- **Dark / Light mode** — theme switcher
- **Versioning schema** — prompt_versions table ready for history/restore flow

---

## 1. Local Setup

### Prerequisites
- Node.js 20+ (`node -v`)
- npm

### Install
```bash
npm install
```

### Configure environment
Copy the example and fill in your Supabase values:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-only, optional for now
```

### Run
```bash
npm run dev
```
Open http://localhost:3000

---

## 2. Set Up Supabase (free)

1. Create a free account at **https://supabase.com**
2. **New project** → pick a region, set a database password
3. Open **SQL Editor** → paste the contents of `supabase/migrations/001_initial_schema.sql` → **Run**
   - This creates: `profiles`, `prompts`, `prompt_versions`, `collections`, `collection_prompts`, storage bucket `prompt-images`, and all Row Level Security policies (so each user only sees their own data).
4. **Authentication → Providers → Email** → enable. (No SMTP needed for testing; register + confirm via email, or use the "disable email confirmation" option during early testing.)
5. **Storage** — the bucket `prompt-images` is created by the migration (public read, authenticated write).
6. In **Project Settings → API**, copy the **Project URL** and **anon public key** into `.env.local`.

### Optional: seed sample data
Open `supabase/seed.sql`, replace `YOUR_USER_ID` with a real user id from `auth.users`, then run it in the SQL Editor.

---

## 3. Build & Verify

```bash
npm run build
npm start
```

---

## 4. Deploy to Hostinger (Cloud Hosting / Node.js)

Hostinger runs Next.js in **server mode** using the Softaculous/Node.js Web Apps manager. The app is configured with `output: "standalone"` and a `start.command` so it runs correctly on Hostinger.

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# create a repo and push
```

### Step 2 — Create a Node.js Web App in hPanel
1. hPanel → **Websites** → select your domain → **Web Apps / Node.js**
2. Click **New Application** (or "Add Node.js app")
3. Set:
   - **Application type:** `next` (or Node.js)
   - **Node.js version:** 20+
   - **Build script / Build command:** `npm run build`
   - **Start command:** `npm start`
   - **Application root:** `public_html` (or a subfolder like `/app`)
4. Deploy via **Git** connected to your GitHub repo (auto-deploy on push), or upload the project files.

> ⚠ **Important:** `.env.local` values must be set in **hPanel → Environment variables** (Node.js Web App settings), because `.env.local` is not committed to git and not read in production on Hostinger. Add:
> ```
> NEXT_PUBLIC_SUPABASE_URL=...
> NEXT_PUBLIC_SUPABASE_ANON_KEY=...
> PORT=3000
> ```

### Step 3 — Verify
- Open your domain → you should see the landing page.
- Register an account, log in, add a prompt with an image.
- If you get a blank page, check **Runtime Logs** in hPanel; most issues are missing environment variables.

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/login, register       # Auth pages
│   ├── (dashboard)/                 # Authenticated app shell (sidebar + header)
│   │   ├── page.tsx                 # Dashboard (stats)
│   │   ├── dashboard/page.tsx       # Dashboard alias
│   │   ├── prompts/                 # Gallery, [id] detail, new/edit form
│   │   ├── categories/              # Category grid + [slug] pages
│   │   ├── collections/             # Collections + [id]
│   │   ├── favorites/               # Favorites
│   │   ├── import/                  # Import prompts (JSON/TXT/MD/CSV)
│   │   └── settings/                # Profile, theme, language, export
│   ├── page.tsx                     # Public landing page
│   ├── layout.tsx                   # Providers (theme, language)
│   └── globals.css                  # Design system tokens
├── components/
│   ├── layout/                      # Sidebar, Header
│   ├── prompts/                     # PromptCard, Gallery, SearchFilterBar, ImageViewer
│   └── ui/                          # Button, Card, Input, Textarea, Select, Badge
├── hooks/use-prompts.ts             # Data layer (CRUD, collections, upload)
├── lib/supabase/                    # Supabase clients (client + server context)
├── proxy.ts                         # Auth-protected route proxy (Next 16)
├── types/index.ts                   # Types + constants (categories, AI models)
└── providers/                       # ThemeProvider, LanguageProvider (i18n + RTL)
```

## Database Schema
- `prompts` — the core prompt records (title, prompt, image_url, category, ai_model, language, tags, favorite, usage_count, timestamps)
- `prompt_versions` — version history (version no, changes, old prompt)
- `collections` + `collection_prompts` — many-to-many collections
- `profiles` — user profile/language/theme
- Storage bucket: `prompt-images`

All tables use **Row Level Security** — users can only access their own data. Image uploads are validated (image types, ≤5MB).

---

## Future / Optional
- **AI preview generation** — connect an image-generation API (the `image_url` field and "Generate Preview" placeholder point are ready).
- **Full version history UI** — restore previous versions (schema is in place).
- **Admin dashboard** — role-gated admin routes.
