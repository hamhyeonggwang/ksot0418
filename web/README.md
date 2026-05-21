# KSOT Platform — Next.js Redesign

Modern academic knowledge platform for the Korean Society of Occupational Therapy.

## Stack

- **Next.js** (App Router)
- **Tailwind CSS v4**
- **Framer Motion**
- **Lucide Icons**

## Design system

| Token | Value |
|-------|--------|
| Primary Navy | `#1A2B4C` |
| Clinical Teal | `#2DD4BF` |
| Background | `#F8FAFC` |
| Font | Pretendard + Inter |

## UX architecture (homepage)

| Section | UX goal |
|---------|---------|
| `HeroSection` | Answer “what can I do here?” in 3s; 4 primary CTAs |
| `QuickPathSection` | Persona paths — max 3 clicks to goal |
| `LatestContentSection` | Bento feed — papers / CE / notices (scannable) |
| `ResearchAreasSection` | Visual topic exploration (not menu drill-down) |
| `ConferenceEducationSection` | Poster + timeline + speakers (action-oriented) |
| `MediaCommunitySection` | Retention — YouTube, gallery, community |

## Component map

```
src/
  app/page.tsx              # Homepage composition
  components/
    layout/Header.tsx       # Sticky glass nav + mobile drawer
    layout/Footer.tsx
    home/*.tsx                # Section modules
    ui/                       # GlassCard, SectionHeader, Container
  lib/
    data.ts                   # Mock / seed content (→ CMS/Supabase later)
    constants.ts              # Colors, legacy routes
```

## Development

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Legacy pages (journal, conference, member…)

Existing static HTML lives at repo root (`/pages`, `/css`, `/js`).

**Option A — same deployment:** copy into Next public folder:

```bash
cp -r ../pages ../css ../js ../files ../images public/
# Fix asset paths in legacy HTML if needed
```

**Option B — split deploy:** set in `.env.local`:

```
NEXT_PUBLIC_LEGACY_BASE=https://ksot0418.vercel.app
```

## Production build

```bash
npm run build
npm start
```

## Animations (Framer Motion)

- Hero: staggered fade-up on load
- Sections: `whileInView` scroll reveals (once)
- Cards: subtle `y` hover lift
- Research areas: panel swap on category tap
- Mobile drawer: spring slide-in

## Next steps (platform scale)

1. Migrate `pages/journal.html` → `/journal` with Supabase (`../supabase/`)
2. Conference registration flow in Next
3. Auth (member) via Supabase Auth
4. CMS for notices / hero content
5. Replace mock `lib/data.ts` with API routes

## Deploy (Vercel)

Root directory: `web`
