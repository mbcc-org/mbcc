# MBCC Website Specification

## Overview

The Malaysian Buddhist Consultative Council (MBCC) website is a mostly-static informational site built with Astro 6, styled with Tailwind CSS, and deployed to Cloudflare Workers with static assets. It serves as the public-facing platform for MBCC — a non-profit interfaith organization that promotes collective effort and cooperation amongst registered Buddhist organizations in Malaysia.

The site targets journalists, researchers, government officials, Buddhist community members, and the general public seeking information about MBCC, its member organizations, and Buddhist community events in Malaysia.

---

## Organization Background

MBCC was officially registered under the Registrar of Society on 29 April 2015, though its formation commenced in 1999 when YB Dato Ong Ka Ting and Buddhist community leaders identified the need for a united voice to liaise with the government.

**Two main objectives:**

1. Discuss and resolve common issues of the Buddhist community.
2. Coordinate with government authorities on matters of the Buddhist religion.

**Founding member:** Malaysia Buddhist Association (MBA) — whose President serves as the permanent President of MBCC.

**National Buddhist Organization members:**

- Malaysian Fo Guang Buddhist Association (BLIA)
- Buddhist Missionary Society Malaysia (BMSM)
- Sasana Abhiwurdhi Wardhana Society (SAWS)
- Theravada Buddhist Council of Malaysia (TBCM)
- Vajrayana Buddhist Council of Malaysia (VBCM)
- Young Buddhist Association of Malaysia (YBAM)

**Key statistics:**

- 600 Buddhist Organisations / Temples
- ~600,000 registered members
- 5.4 million Buddhists in Malaysia (16% of the population)

---

## Tech Stack

| Layer            | Choice                                   |
| ---------------- | ---------------------------------------- |
| Framework        | Astro 6 (static output)                  |
| Styling          | Tailwind CSS                             |
| Typography       | System font stack (handles Latin + CJK)  |
| Image hosting    | Cloudflare R2 + Image Resizing           |
| Deployment       | Cloudflare Workers (static asset serving)|
| SEO              | JSON-LD structured data, XML sitemap     |
| Lightbox gallery | Vanilla JS (~2-5KB)                      |
| Package manager  | pnpm                                     |
| Node             | >= 22.12.0                               |

---

## Architecture

### Repository Structure

```
/
├── public/                    # Static assets (favicon, logos, robots.txt)
├── src/
│   ├── assets/                # Build-processed assets (SVGs, icons)
│   ├── components/            # Reusable Astro components
│   ├── content/               # Astro Content Collections
│   │   ├── events/            # Event Markdown files
│   │   └── organisations/     # Member org Markdown files
│   ├── layouts/               # Page layouts
│   ├── pages/                 # Astro pages (file-based routing)
│   │   ├── index.astro        # Homepage
│   │   ├── about.astro        # About + History + Committee
│   │   ├── organisations/     # Member org listing + [slug] pages
│   │   └── events/            # Events listing + [slug] pages
│   ├── styles/                # Global styles, Tailwind config
│   └── lib/                   # Utilities (image URL builder, etc.)
├── worker/                    # Cloudflare Worker (locale routing)
├── scripts/                   # CLI tools (photo upload script)
├── astro.config.mjs
├── tailwind.config.mjs
├── wrangler.toml              # Cloudflare config
└── package.json
```

### Static Output & Deployment

Astro builds to static HTML. The output is deployed to Cloudflare Workers with static assets served from the edge.

### i18n Strategy

- **Current:** English only.
- **Architecture:** Built for separate static builds per locale from day one. Content collections and page structure support locale prefixes (e.g., `/en/about`, `/ms/about`).
- **Cloudflare Worker:** A worker in `/worker` handles locale routing by inspecting `Accept-Language` headers and a saved language preference cookie. Redirects to the appropriate locale directory.
- **No locale switcher UI** until a second language is actually available. When translations ship, the Worker serves the correct locale build and a header locale switcher is added.

### Content Management

- Content lives in **Markdown files** within Astro Content Collections.
- Structured for future CMS integration (Keystatic, Tina, or Decap) without refactoring.
- Content frontmatter schemas are well-defined so a CMS can generate compatible files.

### Image Management

- **Storage:** Cloudflare R2 bucket.
- **Optimization:** Cloudflare Image Resizing (on-the-fly transforms via URL parameters).
- **References:** Markdown frontmatter stores **relative paths** (e.g., `events/wesak-2025/001.jpg`). A configurable base URL is prepended at build time.
- **Upload workflow:** A CLI script (`pnpm upload-photos`) takes a local folder of images, uploads them to R2, and generates/updates a JSON manifest in the repo.

---

## Design

### Visual Identity

- **Tone:** Pan-Buddhist — uses shared Buddhist symbols (Dharma wheel, lotus) without favoring any single tradition. Warm, dignified, and inclusive.
- **Color palette:** Derived from the Buddhist flag colors (blue, yellow, red, white, orange). Implemented as a Tailwind theme with carefully balanced primary, secondary, and accent colors that avoid visual clutter.
- **Theme:** Light only. No dark mode.
- **Accessibility:** WCAG AA compliance — proper contrast ratios, alt text on all images, keyboard navigation, semantic HTML, focus indicators.

### Typography

System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji"`. This provides native CJK support when Chinese locale is added later, with zero font loading overhead.

### Responsive Design

- Mobile-first approach.
- **Desktop:** Flat top navigation bar (Home | About | Organisations | Events).
- **Mobile:** Hamburger icon that opens a **full-screen overlay** with centered navigation links.
- Breakpoints follow Tailwind defaults (`sm`, `md`, `lg`, `xl`).

---

## Pages

### 1. Homepage (`/`)

**Sections (top to bottom):**

1. **Hero section** — Mission-forward. Large headline with MBCC's mission statement, subtle background (gradient or muted image). Clear visual hierarchy. No CTA button needed (static site).
2. **Statistics counters** — Summary display of key numbers: 600 organisations, ~600k members, 5.4M Buddhists. Static (no animation). Links to About page for full context.
3. **Member organisations grid** — Logo + profile card for each of the 7 member organisations. Each card shows: logo, org name, tradition tag (Mahayana/Theravada/Vajrayana), and a one-line description. Cards link to their dedicated pages.
4. **Upcoming/recent events** — A small preview of the most recent or next upcoming event with photo thumbnail and date. Links to the Events page.
5. **Minimal footer.**

### 2. About Page (`/about`)

**Sections:**

1. **History narrative** — The founding story from 1999 to 2015 registration. Key figures mentioned: YB Dato Ong Ka Ting, Dato Fu Ah Kiow, the late Venerable Seck Chek Huang, the late Venerable Dr. K. Sri Dhammananda Nāyaka Mahā Thero. Timeline or narrative prose format.
2. **Objectives** — MBCC's two main objectives, clearly stated.
3. **Statistics (detailed)** — Full breakdown of the numbers with supporting context about the Buddhist community in Malaysia.
4. **Current committee** — Office bearers displayed as cards with: photo (optional, graceful fallback to initials/placeholder when unavailable), name, title, and affiliated organisation.

### 3. Member Organisations Listing (`/organisations`)

A page listing all member organisations with cards. Each card shows:

- Logo
- Organisation name
- Tradition (Mahayana / Theravada / Vajrayana)
- Brief description
- Link to dedicated page

Founding member (MBA) should be visually distinguished from National Buddhist Organisation members.

### 4. Member Organisation Detail (`/organisations/[slug]`)

Generated from Content Collection. Each page contains:

**Frontmatter schema:**

```yaml
name: string              # Full organisation name
slug: string              # URL slug
abbreviation: string      # e.g., "BLIA", "BMSM"
tradition: enum           # "mahayana" | "theravada" | "vajrayana"
role: enum                # "founding-member" | "national-org"
foundingYear: number      # optional
website: string           # optional, external URL
contact:                  # optional
  email: string
  phone: string
  address: string
logo: string              # relative path to logo image
photos:                   # optional gallery
  - path: string          # relative image path
    caption: string       # optional
```

**Page content:**

- Header with logo and name
- Basic profile info (tradition, founding year, website link, contact)
- Markdown body (free-form description/history)
- Optional photo gallery (lightbox) if photos are provided

### 5. Events Listing (`/events`)

Reverse-chronological list of all events. Each entry shows:

- Event name
- Date
- Thumbnail photo
- Short description
- Link to detail page

No filtering or grouping — simple flat chronological list.

### 6. Event Detail (`/events/[slug]`)

Generated from Content Collection. Each page contains:

**Frontmatter schema:**

```yaml
title: string             # Event name
slug: string              # URL slug
date: date                # Event date
endDate: date             # optional, for multi-day events
location: string          # Venue name and/or address
description: string       # Short description for listing/SEO
photos:                   # optional gallery
  - path: string          # relative image path (prepend R2 base URL at build)
    caption: string       # optional
```

**Page content:**

- Header with title, date, and location
- Markdown body (event description, recap)
- Embedded lightbox photo gallery (if photos exist)

---

## Components

### Layout

- **`BaseLayout.astro`** — HTML shell with `<head>` (meta, structured data, Tailwind), header nav, main content slot, footer.
- **`Navigation.astro`** — Flat top bar (desktop), full-screen overlay (mobile). Links: Home, About, Organisations, Events.
- **`Footer.astro`** — Minimal: copyright line, MBCC name, and a few essential links.

### Shared

- **`StatCounter.astro`** — Displays a single statistic (number + label).
- **`OrgCard.astro`** — Member org card (logo, name, tradition tag, description). Used on homepage and listing page.
- **`EventCard.astro`** — Event preview card (thumbnail, title, date, excerpt).
- **`CommitteeMember.astro`** — Office bearer card with optional photo fallback.
- **`PhotoGallery.astro`** — Lightbox gallery component. Renders a grid of thumbnails; clicking opens a minimal vanilla JS lightbox with swipe and keyboard navigation (~2-5KB).
- **`SEOHead.astro`** — Handles `<title>`, `<meta>`, Open Graph, Twitter cards, and JSON-LD injection per page.

---

## SEO & Structured Data

### Per-page meta

Every page gets:

- `<title>` and `<meta name="description">`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`)
- Twitter card meta (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)

### JSON-LD Schemas

- **Homepage:** `Organization` schema (name, description, logo, member organizations, founding date, URL).
- **Events:** `Event` schema (name, startDate, endDate, location, description, image).
- **All pages:** `BreadcrumbList` schema for navigation context.

### Sitemap & Robots

- XML sitemap generated by `@astrojs/sitemap`.
- `robots.txt` in `/public` allowing all crawlers, pointing to sitemap URL.

---

## Cloudflare Worker (`/worker`)

A Cloudflare Worker that handles locale-based routing:

1. **Check for language cookie** (`mbcc-lang`). If set, serve that locale.
2. **Parse `Accept-Language` header.** Map to supported locales.
3. **Fallback to English** (`en`).
4. **Serve static assets** from the appropriate locale directory (e.g., `/en/about.html`).

At launch, only English exists, so the Worker passes through to the default build. The routing logic is in place for when additional locales are added.

**Config:** `wrangler.toml` in the repo root. Worker source in `/worker/src/index.ts`.

---

## CLI Upload Script (`/scripts`)

A Node.js script for uploading event photos to R2:

```
pnpm upload-photos --event wesak-2025 --source ./photos/wesak-2025/
```

**Behavior:**

1. Reads all image files from the source directory.
2. Uploads each to R2 under the path `events/{event-slug}/{filename}`.
3. Generates or updates a JSON manifest at `src/content/events/{event-slug}/photos.json` with the list of uploaded paths and optional captions.
4. Outputs a summary of uploaded files.

**Dependencies:** `@cloudflare/r2` or Wrangler's S3-compatible API.

---

## Build & Development

### Commands

| Command                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `pnpm dev`             | Start Astro dev server                         |
| `pnpm build`           | Build static site                              |
| `pnpm preview`         | Preview built site locally                     |
| `pnpm upload-photos`   | Upload photos to R2 and update manifest        |
| `pnpm deploy`          | Build + deploy to Cloudflare Workers           |

### Environment Variables

| Variable               | Purpose                                        |
| ---------------------- | ---------------------------------------------- |
| `R2_BUCKET`            | R2 bucket name                                 |
| `R2_ACCESS_KEY_ID`     | R2 API credentials                             |
| `R2_SECRET_ACCESS_KEY` | R2 API credentials                             |
| `R2_ENDPOINT`          | R2 S3-compatible endpoint                      |
| `IMAGE_BASE_URL`       | Public base URL for R2-hosted images           |
| `SITE_URL`             | Canonical site URL (for sitemap, OG tags)      |

---

## Non-Goals (Explicitly Out of Scope)

- Dark mode
- Contact forms or any server-side form processing
- Newsletter signup
- Event RSVP functionality
- Member org login / admin area
- CMS integration (architecture supports it, but not implementing now)
- Locale switcher UI (until a second language ships)
- Animated counters or scroll-triggered animations
- Blog / news section (events serve this purpose)
- Search functionality
