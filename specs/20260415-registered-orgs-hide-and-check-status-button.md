# Spec: Hide Registered Organisations & Add Check Status Button

**Date:** 2026-04-15  
**Requested by:** Client

---

## Overview

Two discrete changes:

1. **Remove all navigation links and section references to Registered Organisations** — the `/registered-organisations` page stays live (no 404), but nothing on the site links to it and it is excluded from the sitemap.
2. **Add a "Check Status" button** alongside the existing "Register Now" button on the grassroots event page.

---

## Feature 1: Hide Registered Organisations

### Scope

- Remove **links and section headings** that explicitly say "Registered Organisations".
- Body text that mentions registration in passing (e.g., "organisations registered with MBCC for Wesak 2026") is **not touched**.
- MBCC's own registration number in the footer (`Registration No: PPM-023-10-29042015`) is **not touched** — it is a legal identifier, not a reference to the feature.

### Files to Change

#### `src/components/Navigation.astro`
- Remove the `{ label: "Registered Organisations", href: "/registered-organisations" }` nav item entry.
- Remove the dead active-state condition `currentPath.startsWith("/registered-organisations") ||` (and any orphaned `||` operators left behind).

#### `src/components/Footer.astro`
- Remove the `{ label: "Registered Organisations", href: "/registered-organisations" }` footer link entry.

#### `src/pages/index.astro`
- Remove the entire **"Registered Organisations" section block** — the section heading, the descriptive paragraph, and the "View All Registered Organisations" link.
- For the **StatCounter** with `value="600+"`, `label="Buddhist Organisations"`, and `href="/registered-organisations"`: remove the `href` prop so it renders as an unlinked stat. The number and label stay.
- After removing the section, verify no awkward gap or orphaned spacing appears between the adjacent sections.

#### `src/pages/member-organisations/index.astro`
- Remove the **entire CTA block** that reads "Looking for grassroots registered organisations?" — including its container, the descriptive text, and the link to `/registered-organisations`.

#### `astro.config.mjs`
- Exclude `/registered-organisations` from the sitemap by adding it to the `exclude` array in the `sitemap()` integration options:

```js
integrations: [
  sitemap({
    filter: (page) => !page.includes("/registered-organisations"),
  }),
],
```

> Note: `@astrojs/sitemap` uses a `filter` function (not an `exclude` array). The filter receives the full page URL and returns `false` to exclude it.

### What Is NOT Changed
- The `/registered-organisations` page file itself (`src/pages/registered-organisations/index.astro`) — it stays exactly as-is. Direct URL access continues to work.
- Any body copy that references "registration" generically.
- MBCC's own registration number in the footer.

---

## Feature 2: Check Status Button (Grassroots Event Page)

### Context

- **Event:** Nationwide Grassroots Wesak Celebrations 2026
- **Slug:** `nationwide-grassroots-wesak-celebrations-2026`
- **Existing button:** "Register Now" → `https://ibbn.net/events/JFEW5Wc4xQ8mKrybIhpp`
- **New button:** "Check Status" → `https://ibbn.net/events/JFEW5Wc4xQ8mKrybIhpp/check-registration`

### Implementation Decisions

| Decision | Choice |
|---|---|
| Schema | Hardcoded to this event's slug only — no new schema field |
| Link target | `target="_blank" rel="noopener noreferrer"` |
| Visual weight | Equal weight — same classes/styling as Register Now |
| Button text | "Check Status" |
| Coupling | Only renders when `registrationUrl` is set (paired with Register Now) |

### Locations to Add the Button

The Check Status button must be added in **three places**:

#### 1. `src/pages/events/[slug].astro` — Sidebar section (top of page)

The existing block (around line 116):
```astro
{event.data.registrationUrl && (
  <a href={event.data.registrationUrl} target="_blank" rel="noopener noreferrer"
     class="register-btn mt-6 inline-flex items-center gap-2 ...">
    Register Now
    <svg .../>
  </a>
)}
```

Change to: when the event slug is `nationwide-grassroots-wesak-celebrations-2026`, render a row containing both buttons side by side. When it is any other event, render just Register Now as today.

The Check Status button should use the same CSS classes as Register Now (same size, same visual weight), but without the `register-btn` animation class (that class carries the `pulse-ring` animation which should remain exclusive to Register Now to preserve its primary draw).

```astro
{event.data.registrationUrl && (
  <div class="mt-6 flex flex-wrap gap-3 lg:self-start">
    <a href={event.data.registrationUrl} target="_blank" rel="noopener noreferrer"
       class="register-btn inline-flex items-center gap-2 px-5 py-2.5 bg-saffron-500 hover:bg-saffron-400 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-saffron-500/30">
      Register Now
      <svg .../>
    </a>
    {event.slug === "nationwide-grassroots-wesak-celebrations-2026" && (
      <a href="https://ibbn.net/events/JFEW5Wc4xQ8mKrybIhpp/check-registration"
         target="_blank" rel="noopener noreferrer"
         class="inline-flex items-center gap-2 px-5 py-2.5 bg-saffron-500 hover:bg-saffron-400 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-saffron-500/30">
        Check Status
        <svg .../>
      </a>
    )}
  </div>
)}
```

> The wrapper `div` with `flex flex-wrap gap-3` handles side-by-side layout and graceful wrapping on narrow viewports.

#### 2. `src/pages/events/[slug].astro` — Bottom CTA / aside section (around line 290)

Same pattern: conditionally add Check Status alongside Register Now:

```astro
{event.data.registrationUrl && (
  <div class="flex flex-col gap-3">
    <a href={event.data.registrationUrl} target="_blank" rel="noopener noreferrer"
       class="register-btn flex items-center justify-center gap-2 w-full px-5 py-4 bg-saffron-500 ...">
      <svg .../>
      Register Now
    </a>
    {event.slug === "nationwide-grassroots-wesak-celebrations-2026" && (
      <a href="https://ibbn.net/events/JFEW5Wc4xQ8mKrybIhpp/check-registration"
         target="_blank" rel="noopener noreferrer"
         class="flex items-center justify-center gap-2 w-full px-5 py-4 bg-saffron-500 hover:bg-saffron-400 text-white text-base font-bold rounded-xl transition-all duration-150 shadow-lg shadow-saffron-500/30 hover:shadow-saffron-400/40 hover:scale-[1.02]">
        Check Status
      </a>
    )}
  </div>
)}
```

> In the aside, buttons are full-width and stacked — this matches the narrow aside column layout. `flex-col gap-3` stacks them vertically.

#### 3. `src/content/events/nationwide-grassroots-wesak-celebrations-2026.md` — Markdown content (two instances)

The markdown contains two `event-cta-wrap` blocks (around lines 90 and 142). Each currently has one Register Now anchor. Add the Check Status anchor using the **exact same CSS classes** (`event-cta-btn`) immediately after:

```html
<div class="event-cta-wrap">
  <a href="https://ibbn.net/events/JFEW5Wc4xQ8mKrybIhpp" target="_blank" rel="noopener noreferrer" class="event-cta-btn">
    Register Now
  </a>
  <a href="https://ibbn.net/events/JFEW5Wc4xQ8mKrybIhpp/check-registration" target="_blank" rel="noopener noreferrer" class="event-cta-btn">
    Check Status
  </a>
</div>
```

Apply this change to both instances (top CTA wrap and bottom CTA wrap).

---

## Summary of Files Changed

| File | Change |
|---|---|
| `src/components/Navigation.astro` | Remove Registered Organisations nav item + dead active-state condition |
| `src/components/Footer.astro` | Remove Registered Organisations footer link |
| `src/pages/index.astro` | Remove Registered Organisations section; unlink StatCounter |
| `src/pages/member-organisations/index.astro` | Remove entire "grassroots registered organisations" CTA block |
| `astro.config.mjs` | Exclude `/registered-organisations` from sitemap |
| `src/pages/events/[slug].astro` | Add Check Status button in sidebar + bottom aside (slug-gated) |
| `src/content/events/nationwide-grassroots-wesak-celebrations-2026.md` | Add Check Status anchor in both `event-cta-wrap` blocks |

---

## Open Questions / Notes for Implementation

- The `StatCounter` component must accept an optional `href` prop. Verify it handles `undefined`/absent `href` gracefully (renders as non-clickable `<div>` rather than a broken `<a>`).
- After removing the Registered Organisations section on the homepage, do a visual check of the section order to confirm no layout gap between the preceding and following sections.
- The `event-cta-btn` CSS class is defined globally in `[slug].astro` (in the `<style is:global>` block). It currently hides on `sm` breakpoint and above. Two buttons inside `event-cta-wrap` should still lay out correctly — verify `event-cta-wrap` can flex two children side by side. If it currently uses `flex-col` or block layout, adjust to `display: flex; gap: 0.75rem;` if needed.
