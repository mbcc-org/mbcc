# Wesak 2026 Events & Homepage Updates

**Date:** 2026-04-07
**Author:** Spec generated via interview with stakeholder
**Status:** Ready for implementation

---

## Overview

Five changes to the MBCC website: remove placeholder events, rename the homepage events section, create two new Wesak 2026 event pages, and add a promotional banner to the homepage. These changes introduce real event content to replace the demo data and promote the upcoming Wesak celebrations.

---

## Task 1: Remove Placeholder Events

### Scope

Delete both existing placeholder event markdown files:

| File | Action |
|---|---|
| `src/content/events/national-buddhist-conference-2024.md` | **Delete** |
| `src/content/events/wesak-day-celebration-2025.md` | **Delete** |

No other cleanup needed — the image paths referenced in these files (e.g., `events/conference-2024/*.jpg`, `events/wesak-2025/*.jpg`) resolve to picsum placeholders in development and don't exist as real files.

### Impact

- Homepage "Our events" section will show the 2 new events (Tasks 3 & 4) instead
- `/events` listing will show the 2 new events
- URLs `/events/national-buddhist-conference-2024` and `/events/wesak-day-celebration-2025` will 404 (no redirects needed — these were never real pages)

### Model Recommendation

**Sonnet** — Simple file deletion.

---

## Task 2: Rename "Recent Events" to "Our Events" on Homepage

### Changes in `src/pages/index.astro`

| Element | Current | New |
|---|---|---|
| Section heading (h2) | "Recent Events" | "Our Events" |
| Subheading (p) | "Latest activities and celebrations from the MBCC community." | "Activities and celebrations from the MBCC community." |

The "All events" and "View all events" link text remain unchanged.

### Model Recommendation

**Sonnet** — Two string replacements.

---

## Task 3: Create National Wesak Conference 2026 Event Page

### Event File

**Path:** `src/content/events/national-wesak-conference-2026.md`

### Frontmatter

```yaml
title: National Wesak Conference 2026
date: 2026-05-23
location: Menara Ken TTDI
description: >-
  The National Wesak Conference 2026 aims to elevate the annual Wesak
  Celebration from a purely religious observance to a national intellectual
  and spiritual conversation.
thumbnail: posters/buddhist-principles-and-the-practices-of-madani-2026.jpeg
```

### Schema Change Required

Add an optional `thumbnail` field to the event schema in `src/content.config.ts`:

```typescript
thumbnail: z.string().optional(),
```

This field provides a dedicated thumbnail image for event cards and promotional use. The `EventCard` component should check `thumbnail` first, then fall back to `photos?.[0]?.path`, then to the picsum placeholder.

### Markdown Body Content

The markdown body should include the following sections in order:

1. **Poster image** — floated right on desktop, full-width above text on mobile. Clickable to open in GLightbox lightbox for full-size viewing. Path: `public/posters/buddhist-principles-and-the-practices-of-madani-2026.jpeg` (referenced as `/posters/buddhist-principles-and-the-practices-of-madani-2026.jpeg` in the HTML).

2. **Registration CTA (top)** — "Register Now" button linking to `https://ibbn.net/events/iOv60xjo4ushuJgL1rw4`. Opens in new tab (`target="_blank" rel="noopener noreferrer"`).

3. **Event description:**
   > The National Wesak Conference 2026 aims to elevate the annual Wesak Celebration from a purely religious observance to a national intellectual and spiritual conversation.
   >
   > By coming together on 23 May 2026 (Saturday) from 8am to 5pm, this Conference seeks to explore the profound synergy between timeless Buddhist teachings and the MADANI framework - Malaysia's national policy vision emphasizing Sustainability, Prosperity, Innovation, Respect, Trust and Compassion.

4. **Theme section:**
   > Buddhist Principles & The Practices of Madani

5. **Event details:**
   - Date & Time: Saturday, 23 May 2026, 08:00 – 17:00
   - Location: Menara Ken TTDI

6. **For Enquiries section:**
   - Wong Tin Song
   - wesak.mbcc@gmail.com (mailto link)
   - +601161700123 (tel link)

7. **Registration CTA (bottom)** — same "Register Now" button as the top CTA.

### Poster Display Implementation

The poster should be rendered using inline HTML in the markdown (Astro supports HTML in .md files):

- **Desktop (md+ breakpoints):** Float right, ~40% width, with left margin and bottom margin for text wrapping. Wrapped in an `<a>` tag that opens GLightbox.
- **Mobile (below md):** Full-width block above the text content, no float. Wrapped in an `<a>` tag that opens GLightbox.

### Registration CTA Button Styling

Use inline HTML for the CTA buttons in the markdown body:

- Saffron background (`bg-saffron-600`), white text, rounded, hover state (`hover:bg-saffron-700`)
- Full width on mobile, auto width on desktop
- Opens in new tab
- Consistent styling for both top and bottom CTAs

### Model Recommendation

**Opus** — Requires poster float layout with responsive breakpoints, GLightbox integration, and styled inline HTML in markdown. Design judgment needed for visual balance.

---

## Task 4: Create Nationwide Grassroots Wesak Celebrations 2026 Event Page

### Event File

**Path:** `src/content/events/nationwide-grassroots-wesak-celebrations-2026.md`

### Frontmatter

```yaml
title: Nationwide Grassroots Wesak Celebrations 2026
date: 2026-05-31
location: Individual Buddhist organization, temple or vihara across the country
description: >-
  Registration for the Sambutan Hari Wesak 2026 Peringkat Akar Umbi is now
  open. Every participating Buddhist organization, temple or vihara across
  Malaysia will receive support from the Federal Government.
thumbnail: posters/nationwide-grassroots-wesak-celebrations-2026.jpeg
```

### Markdown Body Content

Same structural pattern as Task 3, with these specifics:

1. **Poster image** — same float-right pattern. Path: `/posters/nationwide-grassroots-wesak-celebrations-2026.jpeg`. Clickable GLightbox.

2. **Registration CTA (top)** — "Register Now" linking to `https://ibbn.net/events/JFEW5Wc4xQ8mKrybIhpp`. New tab.

3. **Event description:**
   > The Malaysia Madani Government together with the Malaysian Buddhist Consultative Council (MBCC) are pleased to announce that registration for the Sambutan Hari Wesak 2026 Peringkat Akar Umbi is now open.

4. **Objective section:**
   > To broaden community participation and foster inclusivity in the observance of Wesak Day across Malaysia.

5. **Support Mechanism section:**
   > In recognition of Wesak Day, every participating Buddhist organization, temple or vihara across Malaysia will receive support from the Federal Government. The grant amount will be determined and disbursed after the celebration, with each organization required to comply with the stipulated terms and conditions.

6. **Participation Guidelines download** — a styled download card/button (not a plain link) with:
   - File icon
   - Text: "Participation Guidelines and Terms & Conditions" (or similar)
   - Links to `/files/participation-guidelines-and-terms-and-conditions-for-wesak-2026.pdf`
   - Visual treatment: bordered card with download icon, distinct from prose links. Use inline HTML.

7. **Important Notes section:**
   > This registration form is intended to collect organizational, contact, and bank details for internal coordination and grant disbursement purposes only.
   >
   > All information submitted will be treated with strict confidentiality and will be accessed solely by authorized personnel.

8. **Event details:**
   - Date: Sunday, 31 May 2026
   - Location: Individual Buddhist organization, temple or vihara across the country

9. **For Enquiries section:**
   - Wong Tin Song
   - wesak.mbcc@gmail.com (mailto link)
   - +601161700123 (tel link)

10. **Registration CTA (bottom)** — same as top.

### Model Recommendation

**Opus** — Same complexity as Task 3, plus the styled file download card component.

---

## Task 5: Homepage Wesak 2026 Banner

### Design

A thin, non-dismissible promotional strip positioned **above the hero section** on the homepage only. No client-side JavaScript required.

### Visual Treatment

- **Background:** `bg-saffron-50` or `bg-saffron-100` (saffron/gold tones)
- **Text colour:** `text-saffron-800` or `text-saffron-700`
- **Link colour:** `text-saffron-700` with underline or `hover:text-saffron-900`
- **Padding:** `py-2.5 sm:py-2` (compact)
- **Text size:** `text-sm` or `text-xs`
- **Centered content**

### Layout

**Desktop (sm+):**

```
National Wesak 2026: Conference (23 May) · Celebrations (31 May) →
```

Single line, centered. "Conference (23 May)" links to `/events/national-wesak-conference-2026`. "Celebrations (31 May)" links to `/events/nationwide-grassroots-wesak-celebrations-2026`. The `·` separator and `→` arrow are decorative.

**Mobile (below sm):**

```
National Wesak 2026
Conference (23 May) →
Celebrations (31 May) →
```

Stacked vertically, centered. "National Wesak 2026" is a label (not a link). Each event is a separate line with its own arrow.

### Placement in `src/pages/index.astro`

Insert the banner as the first element inside `<BaseLayout>`, before the hero `<section>`. This positions it below the fixed navigation header and flag strip, above the hero.

### Not a Shared Component

Since this banner is homepage-only, it does not need to be extracted into a separate component or added to `BaseLayout.astro`. It lives directly in `index.astro`.

### Model Recommendation

**Sonnet** — Straightforward HTML/CSS with responsive breakpoint. No complex logic.

---

## Schema Changes Summary

### `src/content.config.ts`

Add one field to the events collection schema:

```diff
 const events = defineCollection({
   loader: glob({ pattern: "**/*.md", base: "./src/content/events" }),
   schema: z.object({
     title: z.string(),
     date: z.coerce.date(),
     endDate: z.coerce.date().optional(),
     location: z.string().optional(),
     description: z.string().optional(),
+    thumbnail: z.string().optional(),
     photos: z
       .array(
         z.object({
           path: z.string(),
           caption: z.string().optional(),
         }),
       )
       .optional(),
   }),
 });
```

---

## Component Changes Summary

### `src/components/EventCard.astro`

Update the thumbnail resolution logic:

```
Current:  thumbnail={event.data.photos?.[0]?.path}
New:      thumbnail={event.data.thumbnail || event.data.photos?.[0]?.path}
```

This must be updated in both:
- `src/pages/index.astro` (homepage recent events)
- `src/pages/events/index.astro` (events listing page)

The `EventCard` component itself does not need changes — it already accepts a `thumbnail` prop.

---

## Files Modified

```
# Task 1: Remove placeholder events
- DELETE  src/content/events/national-buddhist-conference-2024.md
- DELETE  src/content/events/wesak-day-celebration-2025.md

# Task 2: Rename section heading
- MODIFY  src/pages/index.astro (h2 text + subheading text)

# Task 3: National Wesak Conference event
- CREATE  src/content/events/national-wesak-conference-2026.md
- MODIFY  src/content.config.ts (add thumbnail field)
- MODIFY  src/pages/index.astro (thumbnail prop fallback)
- MODIFY  src/pages/events/index.astro (thumbnail prop fallback)

# Task 4: Grassroots Wesak Celebrations event
- CREATE  src/content/events/nationwide-grassroots-wesak-celebrations-2026.md
- EXISTS  public/posters/buddhist-principles-and-the-practices-of-madani-2026.jpeg
- EXISTS  public/posters/nationwide-grassroots-wesak-celebrations-2026.jpeg
- EXISTS  public/files/participation-guidelines-and-terms-and-conditions-for-wesak-2026.pdf

# Task 5: Homepage banner
- MODIFY  src/pages/index.astro (add banner section above hero)
```

---

## Implementation Order (Recommended)

```
Phase 1 (Independent — can run in parallel):
├── Task 1: Delete placeholder event files
├── Task 2: Rename "Recent Events" → "Our Events"
└── Schema change: Add thumbnail field to content.config.ts

Phase 2 (Depends on Phase 1 — schema must exist):
├── Task 3: Create National Wesak Conference event page
└── Task 4: Create Grassroots Wesak Celebrations event page

Phase 3 (Depends on Phase 2 — event slugs must exist for links):
└── Task 5: Add homepage banner with links to both events
```

### Model Recommendations Summary

| Task | Model | Rationale |
|---|---|---|
| Task 1: Remove placeholder events | **Sonnet** | File deletion only |
| Task 2: Rename section heading | **Sonnet** | Two string replacements |
| Task 3: Wesak Conference event | **Opus** | Responsive poster layout, GLightbox, styled inline HTML |
| Task 4: Grassroots Celebrations event | **Opus** | Same as Task 3 + download card component |
| Task 5: Homepage banner | **Sonnet** | Responsive banner strip, no JS |

---

## Open Items / Future Work

- **Banner removal:** After the Wesak events pass (post 31 May 2026), the banner should be removed from the homepage. This is a manual cleanup task.
- **Event archival:** Consider adding an `upcoming`/`past` segmentation on the /events listing page once more events accumulate. Not needed now with only 2 events.
- **Registration link expiry:** The ibbn.net registration links will likely close at some point. No automatic handling — event pages remain as historical records after registration closes. Consider updating the CTA text from "Register Now" to "Registration Closed" when the time comes.
