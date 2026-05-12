---
Date: 2026-05-12
Requested by: Client
Event: National Wesak Conference 2026 (slug: `national-wesak-conference-2026`)
---

# Spec: Conference Program Schedule + Guest Speaker Profiles

Two additive changes to the National Wesak Conference 2026 event page:

1. Add the **Program Schedule** image as a dedicated section near the bottom of the page (lightbox-zoomable, same UX as the existing poster).
2. Add a **Guest Speakers** section: a responsive card grid with click-to-expand bios for 12 speakers.

The existing poster (floating right at the top) and the rest of the markdown body stay untouched.

---

## Final page section order

1. Hero header (title, date, location, Register Now button) — unchanged
2. Existing top CTA + floating poster — unchanged
3. Intro paragraph — unchanged
4. Theme — unchanged
5. Event Details (date, time, location) — unchanged
6. **NEW: Program Schedule** (image only, lightbox)
7. **NEW: Guest Speakers** (card grid, accordion bios)
8. For Enquiries — unchanged (now the closing section)
9. Bottom Register Now CTA — unchanged

---

## Feature 1 — Program Schedule section

### Asset

- Source: `public/images/nationwide-grassroots-wesak-celebrations-2026-conference-schedule.jpg` (already in repo)
- ⚠ Filename inherited from client folder convention; despite the "grassroots" prefix, this is the **conference** schedule. Do **not** rename — risks breaking client-shared links.

### Markup (added inside `src/content/events/national-wesak-conference-2026.md`)

Insert immediately after the existing `## Event Details` block, before the existing `## For Enquiries`:

```html
## Program Schedule

<a href="/images/nationwide-grassroots-wesak-celebrations-2026-conference-schedule.jpg" class="glightbox block">
  <img
    src="/images/nationwide-grassroots-wesak-celebrations-2026-conference-schedule.jpg"
    alt="National Wesak Conference 2026 — Program Schedule for 23 May 2026, 08:00–17:00"
    style="width: 100%; border-radius: 0.5rem;"
    loading="lazy"
  />
</a>
```

### UX

- Lightbox is wired up by the existing GLightbox initialiser in `src/pages/events/[slug].astro` (selector `.glightbox`). No new JS needed.
- Image is full-width within the prose column (no float; the schedule needs the horizontal real estate to remain readable on mobile).
- No caption, no download link, no transcribed text version.
- No anchor ID — section is plain `<h2>`.

---

## Feature 2 — Guest Speakers section

### Section markup (in the event markdown)

Inserted after the Program Schedule, before For Enquiries:

```mdx
## Guest Speakers

<GuestSpeakers />
```

> The markdown file already supports inline component-style HTML; `<GuestSpeakers />` is a placeholder name — see "Component wiring" below for how the component is imported and resolved.

### Component wiring

Astro `.md` files cannot import Astro components directly. Two options, both acceptable — implementer's choice:

**Option A (recommended):** Convert the event content file from `.md` to `.mdx`. MDX supports `import` of Astro components.

- Rename `src/content/events/national-wesak-conference-2026.md` → `.mdx`.
- Add `import GuestSpeakers from "../../components/GuestSpeakers.astro";` at the top of the file (after frontmatter).
- Update `content.config.ts` events `glob` pattern to `"**/*.{md,mdx}"` so the loader picks up MDX too.
- Verify `@astrojs/mdx` integration is present in `astro.config.mjs`; add it if not.

**Option B (fallback):** Render the speakers section directly inside `src/pages/events/[slug].astro`, conditionally on `event.id === "national-wesak-conference-2026"`. Insert it between `<Content />` and the `event.data.photos` block. This avoids MDX setup but couples page layout to event identity (same pattern already used for the grassroots Check Status button — there is precedent).

The spec proceeds assuming **Option B** for minimum scaffolding; if you choose A, the markup moves from `[slug].astro` into the MDX file but the component itself is identical.

### Data file

New file: `src/data/national-wesak-conference-2026-speakers.ts`

```ts
export interface Speaker {
  name: string;
  photo?: string; // path under /public, served from site root
  bio: string;    // markdown-flavoured: paragraphs separated by blank lines; "- " for bullets; "**...**:" for sub-labels
}

export const speakers: Speaker[] = [
  { name: "Pek Chee Hen", photo: "/speakers/pek-chee-han.jpg", bio: `…` },
  { name: "Chief Abbess Venerable Jue Cheng", photo: "/speakers/ven-jue-cheng.jpeg", bio: `…` },
  { name: "His Eminence The 14th Siling Tongkhor Rinpoche", photo: "/speakers/siling-tongkhor-rinpoche.png", bio: `…` },
  { name: "Venerable Ming Ji", photo: "/speakers/ven-ming-ji.jpeg", bio: `…` },
  { name: "Venerable Dhammapāla Mahāthera", photo: "/speakers/ven-dhammapala-maha-thera.jpeg", bio: `…` },
  { name: "Emeritus Professor Datuk Dr. Osman Bakar", photo: "/speakers/prof-osman-bakar.jpeg", bio: `…` },
  { name: "Most Venerable B. Sri Saranankara Nayaka Maha Thero", photo: "/speakers/ven-b-sri-saranankara-maha-thero.jpg", bio: `…` },
  { name: "Dato' Dr Bugs Tan", photo: "/speakers/dato-dr-bugs-tan.jpeg", bio: `…` },
  { name: "Dr Eddie Hu", photo: "/speakers/dr-eddie-hu.jpg", bio: `…` },
  { name: "Gerald Yong", photo: "/speakers/gerald-yong.jpeg", bio: `…` },
  { name: "Dr Lee Hoi Leong", photo: "/speakers/dr-lee-hoi-leong.jpg", bio: `…` },
  { name: "Scott Wong Soo Soon", bio: `…` }, // no photo → renders initials avatar
];
```

Notes on the data:

- **Path normalisation:** client brief wrote `/public/speakers/...` — strip the `/public/` prefix; Astro serves `public/` at site root. Final paths are `/speakers/<file>`.
- **Order:** matches the client brief exactly. Treat that order as authoritative; do not re-sort.
- **Pek Chee Hen:** the photo filename on disk is `pek-chee-han.jpg` (with an `a`), but the bio name spells it `Pek Chee Hen` (with an `e`). **Display "Hen". Keep filename as-is.** Decision recorded; flag for client re-confirmation if convenient but not blocking.
- **Scott Wong:** `photo` is omitted (not empty string) → component falls back to an initials avatar (`SW`).
- **Bios:** stored as plain template-literal strings preserving the exact paragraph structure from the client brief. Ven. Ming Ji's bullet timeline stays as bullets; Rinpoche's sub-headers (`Recognition:`, `Education & Training:`, etc.) stay as bold labels.

### `GuestSpeakers.astro` component

New file: `src/components/GuestSpeakers.astro`

Responsibilities:

- Render a responsive grid: **1 column on mobile / 2 on `sm` / 3 on `lg`**.
- Per card: circular avatar (left) + name (centre) + chevron button (right). No role line — the full honorific name acts as the title.
- Cards are NOT entirely clickable; only the chevron button toggles expansion.
- Bios are server-rendered into the HTML inside a hidden region; JS toggles `aria-expanded` + `hidden` attribute on the region. Bios are present in the DOM on initial load (good for SEO and JS-disabled fallback — see below).

Sketch (Tailwind classes follow existing patterns from `CommitteeMember.astro`):

```astro
---
import { speakers } from "../data/national-wesak-conference-2026-speakers";
import { getImageUrl } from "../lib/image";
import { marked } from "marked"; // see "Bio rendering" below

const items = speakers.map((s, i) => {
  const initials = s.name
    .replace(/[^\p{L}\s]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return {
    ...s,
    id: `speaker-${i}`,
    photoUrl: s.photo ? getImageUrl(s.photo, { width: 160, height: 160 }) : null,
    initials,
    bioHtml: marked.parse(s.bio.trim()),
  };
});
---

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((s) => (
    <div class="speaker-card bg-white border border-cream-200 rounded-xl overflow-hidden hover:border-cream-300 hover:shadow-sm transition-all duration-200">
      <div class="flex items-center gap-4 p-4">
        {s.photoUrl ? (
          <img src={s.photoUrl} alt={s.name} class="w-14 h-14 rounded-full object-cover shrink-0" loading="lazy" />
        ) : (
          <div class="w-14 h-14 rounded-full bg-saffron-100 flex items-center justify-center shrink-0">
            <span class="text-sm font-bold text-saffron-600">{s.initials}</span>
          </div>
        )}
        <h3 class="text-sm font-semibold text-charcoal-800 leading-snug flex-1 min-w-0">{s.name}</h3>
        <button
          type="button"
          class="speaker-toggle shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-charcoal-500 hover:text-charcoal-800 hover:bg-cream-100 transition-colors"
          aria-expanded="false"
          aria-controls={`${s.id}-bio`}
          aria-label={`Show bio for ${s.name}`}
        >
          <svg class="w-5 h-5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      </div>
      <div id={`${s.id}-bio`} class="speaker-bio px-4 pb-4 pt-0 border-t border-cream-100 prose prose-sm max-w-none text-charcoal-600" hidden set:html={s.bioHtml} />
    </div>
  ))}
</div>

<script>
  const init = () => {
    document.querySelectorAll<HTMLButtonElement>(".speaker-toggle").forEach((btn) => {
      if (btn.dataset.wired === "1") return;
      btn.dataset.wired = "1";
      btn.addEventListener("click", () => {
        const expanded = btn.getAttribute("aria-expanded") === "true";
        const panelId = btn.getAttribute("aria-controls");
        const panel = panelId ? document.getElementById(panelId) : null;
        btn.setAttribute("aria-expanded", String(!expanded));
        const icon = btn.querySelector("svg");
        icon?.classList.toggle("rotate-180", !expanded);
        if (panel) panel.hidden = expanded;
      });
    });
  };
  document.addEventListener("astro:page-load", init);
  init();
</script>
```

### Bio rendering

Bios are stored as markdown-like strings. They must render paragraphs, bullet lists, and inline bolds correctly:

- Use `marked` (already common in Astro projects, lightweight) parsed at build time inside the `.astro` frontmatter — the resulting HTML is server-rendered into the page. **Do not** parse markdown at runtime in the browser.
- If `marked` is not yet a dependency: `pnpm add marked`. Acceptable alternative: write a tiny custom renderer (paragraphs split on `\n\n`, bullets on lines starting with `- `, bolds on `**...**`). For 12 bios this is fine, but `marked` is more robust.
- The bio container uses Tailwind's `prose prose-sm` so paragraphs, bullets, and bolds inherit the same styling rules already used by the rest of the event page. Verify `@tailwindcss/typography` is installed (it should be — the rest of the page already uses `.prose`).
- For Rinpoche specifically: render lines like `Recognition:` from a paragraph that starts with `**Recognition:**` (transform the bio source to wrap those labels in `**...**` before storing — easier than a custom parser).

### Accordion behaviour

| Behaviour | Decision |
|---|---|
| Multiple cards open simultaneously | ✅ Yes — independent toggles |
| Default state on load | All collapsed |
| Toggle target | Chevron button at the right edge of card header only — clicking the card body or avatar does **not** toggle |
| Scroll on expand | None — user scrolls manually |
| Keyboard | Tab to focus chevron, Enter/Space to toggle (native `<button>` behaviour) |
| ARIA | `aria-expanded`, `aria-controls`, `aria-label` (descriptive per speaker) |
| JS-disabled fallback | Bios are server-rendered with `hidden` attribute. Without JS the chevron does nothing. Acceptable trade-off; bios are still in the HTML for SEO. If a no-JS-visible fallback is required, add `<noscript><style>.speaker-bio { display: block !important; }</style></noscript>`. |
| Animation | Chevron rotates 180° via `rotate-180` class. No height-transition on the bio panel (instant show/hide) — height transitions on `hidden` are awkward and not worth the JS complexity for this use case. |

---

## Files changed / added

| File | Change |
|---|---|
| `src/content/events/national-wesak-conference-2026.md` | Add `## Program Schedule` section with the lightbox image. Add `## Guest Speakers` heading. (If Option A chosen: rename to `.mdx` and import `GuestSpeakers`.) |
| `src/pages/events/[slug].astro` | **(Option B only)** Import `GuestSpeakers`; render it conditionally where the H2 marker sits, OR inject between `<Content />` and the photo gallery gated on `event.id === "national-wesak-conference-2026"`. |
| `src/components/GuestSpeakers.astro` | **New** — the responsive card grid + accordion logic. |
| `src/data/national-wesak-conference-2026-speakers.ts` | **New** — speakers array with name, optional photo path, and markdown-flavoured bio string. |
| `package.json` (potentially) | Add `marked` dependency if not present; add `@astrojs/mdx` if Option A. |
| `src/content.config.ts` | **(Option A only)** Update events `glob` pattern to `**/*.{md,mdx}`. |
| `astro.config.mjs` | **(Option A only)** Add `mdx()` to integrations. |

---

## What is NOT changed

- The existing top poster (`buddhist-principles-and-the-practices-of-madani-2026.jpeg`) and its float-right placement.
- The two existing Register Now CTA blocks.
- Hero header, sidebar, footer, navigation.
- The grassroots event page (this is a separate event).
- No new event frontmatter fields. The schedule image is referenced inline in markdown; speakers live in a sidecar TS file.

---

## Open items / risks

1. **Pek Chee Hen / Han spelling mismatch** — bio says "Hen", filename says "Han". Implementing as "Hen" per decision; flag to client when convenient.
2. **Scott Wong photo** — currently no photo. Renders an "SW" initials avatar. If client supplies a photo later, the only change is adding `photo: "/speakers/scott-wong.jpg"` (or similar) to the data file.
3. **`marked` choice** — verify it isn't already pulled in transitively by another dep before adding. If the project already has `markdown-it` or similar in deps, prefer that for consistency.
4. **Schedule image filename** — currently named with a `grassroots-` prefix although it belongs to the conference. Confirmed with implementer: leave alone, don't rename. Worth a note to the client if they want the file renamed in a follow-up.
5. **Photo aspect ratios** — circular avatars (`object-cover`) crop from centre. A couple of speaker photos may centre awkwardly (e.g., wide shots). Visual QA after build; if any portrait looks bad, swap the per-image `object-position` to `object-top`.
6. **Honorific characters** — names contain diacritics (`Dhammapāla Mahāthera`). Ensure source file is UTF-8 and no editors strip the macrons during the import/transcription step. The initials extractor uses `\p{L}` Unicode classes so diacritic letters count as initials correctly.
7. **Bio length variability** — Ven. Jue Cheng and Saranankara have very long bios. Inside the `prose` container they're readable; no truncation requested. Visual QA on mobile to confirm scroll comfort.

---

## Acceptance checklist

- [ ] Program Schedule section appears between Event Details and For Enquiries.
- [ ] Schedule image opens in lightbox on tap/click.
- [ ] Guest Speakers section appears between Program Schedule and For Enquiries.
- [ ] All 12 speakers render in client-brief order.
- [ ] Scott Wong renders with an "SW" initials avatar (no broken `<img>`).
- [ ] Pek Chee Hen displays with an "e" in the name; photo loads from `/speakers/pek-chee-han.jpg`.
- [ ] Chevron toggles each bio independently; aria-expanded flips; chevron icon rotates.
- [ ] Multiple cards can be open simultaneously.
- [ ] Bios render paragraphs, bullets (Ven. Ming Ji), and bold sub-labels (Rinpoche) correctly.
- [ ] Grid is 1 col on mobile, 2 on `sm`, 3 on `lg`.
- [ ] Keyboard: Tab focuses chevron, Enter/Space toggles, Shift+Tab moves backwards.
- [ ] No layout regressions in the existing poster, CTAs, sidebar, or footer.
- [ ] Lighthouse a11y score for the page is unchanged or improved.
