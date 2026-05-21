# KSOT Redesign — UX Strategy Document

## Problem (current ksot.kr)

- Menu-heavy IA forces users to hunt for goals
- Bulletin-board aesthetic reduces trust and engagement
- Weak mobile scan patterns
- Brand feels dated vs. international OT societies

## North star

Transform KSOT from a **society website** into an **academic knowledge platform** — closer to Medium, modern university sites, and research media — not a government-style portal.

## Core UX principles applied

### 1. User flow over menu structure

The homepage is a **directed graph of actions**, not a sitemap repeat. Primary CTAs appear above the fold without opening “학회지” dropdowns.

### 2. Action-oriented

Every section ends with a verb-led link: 검색, 등록, 신청, 투고, 시청.

### 3. Platform feeling

- Bento grid for content density without clutter
- Glass surfaces for depth (header, cards)
- Large type hierarchy (hero 40px+, section 32px+)

### 4. Mobile-first

- 2-column CTA grid on phone (min 88px touch height)
- Horizontal scroll timeline on conference card
- Full-screen drawer navigation

### 5. Academic branding

Navy + teal = authority + clinical freshness. Restrained motion (no parallax overload).

## 3-click rule

`QuickPathSection` encodes paths for:

- Clinicians → CE → journal → conference
- Students → search → submit → community  
- Researchers → submit → policy → latest issue

## Section → behavior mapping

| User intent | Entry | Clicks to complete |
|-------------|-------|-------------------|
| Find paper | Hero “학회지 검색” | 1 |
| Register conference | Hero / conference poster | 2 |
| Apply CE | Hero / latest education card | 2 |
| Join society | Hero “회원가입” | 2 |
| Watch media | Media hub YouTube | 1 (external) |

## Why not “static introduction page”

Previous redesign (vercel preview) introduced bento visually but still read as **brochure**. This version adds:

- Persona quick paths
- Interactive research explorer
- Conference timeline + speaker cards
- Live-feeling content cards with status badges (신청/예정)

## Technical scalability

- Each homepage block is an isolated component → swap data source to Supabase without layout changes
- `legacyHref()` centralizes migration off static HTML
- Design tokens in Tailwind `@theme` for future dark mode / print
