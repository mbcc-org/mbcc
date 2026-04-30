# Grassroots Wesak 2026 — Poster & Bunting Previews

**Date:** 2026-04-30
**Scope:** Single page — `src/content/events/nationwide-grassroots-wesak-celebrations-2026.md`
**Source request:** Client meeting — *"Maybe can show how the bunting and poster look like without and before they download."*

This spec layers on top of `specs/20260430-grassroots-promotional-materials.md`. That spec added two PDF download cards. This spec replaces those two cards with image-led previews so visitors can see the bunting and poster before committing to a 12–20 MB PDF download.

---

## 1. Goal

Show the visual content of the Wesak 2026 poster and bunting on the event page (as JPEG previews) so users can see what they look like before downloading the print-ready PDFs.

## 2. Non-goals

- No changes to any other event page, the events listing, the homepage, navigation, or any shared component.
- No changes to the existing `Participation Guidelines` download card — its current pattern stays untouched.
- No changes to the floated **hero poster image** at the top of the page (lines 66–70). It stays as the event's identity image. The new previews live further down in the `Promotional Materials` section and serve a different purpose (download affordance, not page identity).
- No image-optimization pipeline work. The JPEGs ship as-is from `/public/images/`.
- No new shared components or layouts. All markup and CSS live inline in the existing event page, alongside its existing inline `<style>` block.
- No `download` attribute. Match the existing pattern: open PDFs in a new tab.
- No GLightbox gallery grouping. Each preview opens its own one-off lightbox (matches the hero poster's existing behavior).

## 3. Source files (already in repo)

```
public/images/nationwide-grassroots-wesak-celebrations-2026-poster.jpeg
public/images/nationwide-grassroots-wesak-celebrations-2026-bunting.jpeg
public/files/nationwide-grassroots-wesak-celebrations-2026-poster.pdf    (~20 MB)
public/files/nationwide-grassroots-wesak-celebrations-2026-bunting.pdf   (~12 MB)
```

The JPEGs are uncompressed exports of the print artwork. Per client direction, ship them as-is — do not re-export, optimize, or convert to WebP/Astro `<Image>`.

## 4. Page change — single-file edit

**File:** `src/content/events/nationwide-grassroots-wesak-celebrations-2026.md`

The `## Promotional Materials` section (currently lines 110–144) becomes:

1. `## Promotional Materials` H2 heading — **unchanged**.
2. Intro paragraph — **unchanged verbatim**: *"Download the official Wesak 2026 poster and bunting to promote your grassroots celebration."*
3. **NEW** — A two-column grid containing the poster preview (left) and bunting preview (right). See §5.
4. Email-request paragraph — **unchanged verbatim**: *"Grassroots organisations who wish to print additional copies are warmly invited to email [wesak.mbcc@gmail.com](mailto:wesak.mbcc@gmail.com) to request the HD versions of the poster and bunting."*

The two `<a class="event-download-card">` blocks for the poster and bunting (lines 114–142) are **removed** and replaced by the grid in §5. The cream-coloured `event-download-card` for `Participation Guidelines` higher up the page is **not** touched.

## 5. Markup — the new preview grid

Replace the two existing `event-download-card` blocks (poster + bunting) with this:

```html
<div class="event-promo-grid">
  <div class="event-promo-col">
    <a href="/images/nationwide-grassroots-wesak-celebrations-2026-poster.jpeg" class="glightbox event-promo-img-wrap">
      <img src="/images/nationwide-grassroots-wesak-celebrations-2026-poster.jpeg" alt="Wesak 2026 Poster" />
    </a>
    <div class="event-promo-meta">
      <p class="event-promo-caption">Wesak 2026 Poster</p>
      <a href="/files/nationwide-grassroots-wesak-celebrations-2026-poster.pdf" target="_blank" rel="noopener noreferrer" class="event-cta-btn">
        Download PDF (20 MB)
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
      </a>
    </div>
  </div>
  <div class="event-promo-col">
    <a href="/images/nationwide-grassroots-wesak-celebrations-2026-bunting.jpeg" class="glightbox event-promo-img-wrap">
      <img src="/images/nationwide-grassroots-wesak-celebrations-2026-bunting.jpeg" alt="Wesak 2026 Bunting" />
    </a>
    <div class="event-promo-meta">
      <p class="event-promo-caption">Wesak 2026 Bunting</p>
      <a href="/files/nationwide-grassroots-wesak-celebrations-2026-bunting.pdf" target="_blank" rel="noopener noreferrer" class="event-cta-btn">
        Download PDF (12 MB)
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
      </a>
    </div>
  </div>
</div>
```

Notes on the markup:

- **Source order is poster first, then bunting.** This is also the mobile stack order (CSS preserves DOM order).
- **Lightbox wiring** — `class="glightbox"` matches the hero poster's existing pattern. The page's existing GLightbox initialization picks these up automatically; **no new JS, no new dependency, no init code changes.**
- **`href` on the lightbox link points to the JPEG** (not the PDF). The lightbox shows the full JPEG; the PDF download is a separate, explicit action via the button below.
- **No `data-gallery` attribute** — each preview opens its own independent lightbox. The user closes one to open the other (matches the hero's behavior).
- **Download button reuses `.event-cta-btn`** — the same orange/saffron CTA style used by Register Now / Check Status. The trailing SVG is the same external-link icon used elsewhere on the page; preserves visual consistency.
- **`alt` text is the short asset name only** (`"Wesak 2026 Poster"` / `"Wesak 2026 Bunting"`). It mirrors the visible caption.
- **`target="_blank" rel="noopener noreferrer"`** on the PDF link matches the existing `event-download-card` pattern.

## 6. CSS — additions to the existing inline `<style>` block

Append the following rules to the page's existing inline `<style>` block (lines 13–64). Do **not** edit existing rules; do not move them to a global stylesheet.

```css
.event-promo-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: stretch;
  margin: 1.25rem 0;
}
.event-promo-col {
  display: flex;
  flex-direction: column;
}
.event-promo-img-wrap {
  display: block;
  margin-bottom: 0.75rem;
}
.event-promo-img-wrap img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 0.5rem;
}
.event-promo-meta {
  margin-top: auto; /* bottom-aligns caption + button to the column floor */
}
.event-promo-caption {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--color-charcoal-700);
}
@media (max-width: 640px) {
  .event-promo-grid {
    grid-template-columns: 1fr;
  }
  .event-promo-meta {
    margin-top: 0; /* in stacked mode, caption sits directly under the image */
  }
}
```

### 6.1 Why these specific choices

- **`align-items: stretch`** + **`margin-top: auto` on `.event-promo-meta`** is what bottom-aligns the captions/buttons across columns when image heights differ (poster is portrait, bunting is wide and short). This is the geometry the client picked from the side-by-side mockup: poster column is tall, bunting column is short, but the caption rows line up at the same baseline.
- **Native aspect ratio** is preserved by `width: 100%; height: auto;` on the `<img>`. No cropping, no forced aspect ratio.
- **`border-radius: 0.5rem`** matches the hero poster image's styling for visual coherence.
- **640px breakpoint** is the standard "small phone vs. tablet" split. On phones the columns stack; the `margin-top: auto` is reset so caption + button sit immediately under each image (no awkward whitespace).
- **No `loading="lazy"`** is added to the `<img>` tags. Per client direction we ship as-is and accept the page weight; the JPEGs are well below the fold of a long event page so the perceived hit is small.

## 7. Resulting page outline (after change)

```
Hero poster (existing — unchanged)
Register / Check Status CTA buttons (existing)
Intro paragraph (existing)
## Objective                      (existing)
## Support Mechanism              (existing)
## Participation Guidelines       (existing — single download card, untouched)
## Promotional Materials          (CHANGED)
   intro paragraph              (unchanged verbatim)
   ┌─────────────┬─────────────┐
   │ Poster JPEG │ Bunting JPG │  ← side-by-side; click → GLightbox
   │  (portrait) │   (wide)    │
   │             │             │
   │             │             │
   │ Wesak 2026  │ Wesak 2026  │  ← captions bottom-aligned across columns
   │  Poster     │  Bunting    │
   │ [⬇ PDF 20MB]│ [⬇ PDF 12MB]│  ← .event-cta-btn (existing style)
   └─────────────┴─────────────┘
   email-request paragraph     (unchanged verbatim)
## Important Notes                (existing)
## Event Details                  (existing)
## For Enquiries                  (existing)
Final Register / Check Status CTA buttons (existing)
```

On mobile (<640px) the two columns stack vertically: poster first, then bunting. Each image fills the content column at native ratio.

## 8. Out-of-scope decisions explicitly considered and rejected

| Considered | Decision | Reason |
|---|---|---|
| Lightbox gallery group (swipe between poster and bunting) | Rejected | Each lightbox stays independent. Matches the hero poster's existing pattern; avoids one-off JS configuration. |
| `loading="lazy"` on `<img>` | Rejected | Client opted to ship the JPEGs as-is with no perf affordances. Section is below the fold so impact is small. |
| Astro `<Image>` component / WebP / responsive `srcset` | Rejected | Would require switching the file from `.md` to `.mdx` or restructuring the asset import path. Disproportionate to the goal. |
| Re-exporting JPEGs at web-friendly sizes/quality | Rejected | Client opted to ship as-is. |
| "Click to enlarge" hint text or magnifier-icon overlay | Rejected | Cursor pointer on hover is enough; the hero poster has no hint and follows the same convention. |
| Captions as italic / centred / single-word ("Poster" / "Bunting") | Rejected | Plain `"Wesak 2026 Poster"` / `"Wesak 2026 Bunting"` matches prior label phrasing and is unambiguous when the section is shared/screenshotted out of context. |
| Re-wording the section intro to mention "preview" | Rejected | The existing intro ("Download the official Wesak 2026 poster and bunting to promote your grassroots celebration.") still reads correctly with previews above the buttons. |
| Re-wording the email-request sentence to clarify "JPEGs are previews, PDFs are print-ready" | Rejected | The button label `"Download PDF (20 MB)"` already signals print-ready; the JPEG/lightbox flow is intuitive. |
| Removing the hero poster image at the top of the page | Rejected | Hero serves event-identity role; new preview serves download role. They have different purposes despite sharing the same image. |
| Replacing the existing `Participation Guidelines` download card with a similar preview pattern | Rejected | Out of scope for this request. That card links to a multi-page T&Cs document for which a single preview image would be misleading. |
| Forcing download via `download` attribute on the PDF button | Rejected | Inconsistent with the existing pattern; users get inline browser PDF preview + manual save. |
| `data-gallery` to group both lightboxes | Rejected | See above. Independent lightboxes per client direction. |

## 9. Acceptance criteria

1. Navigating to `/events/nationwide-grassroots-wesak-celebrations-2026/` shows the `## Promotional Materials` section with **two side-by-side image previews** between the existing intro paragraph and the existing email-request paragraph.
2. The poster preview is on the **left**, the bunting preview is on the **right**, and both images render at their **native aspect ratio** (poster portrait, bunting wide/short).
3. Each image has a `pointer` cursor on hover. **Clicking either image opens GLightbox** with that JPEG. The two lightboxes are independent (no next/prev arrows between them).
4. Below each image, the caption (`Wesak 2026 Poster` / `Wesak 2026 Bunting`) and the orange `Download PDF (X MB)` button appear; the caption + button rows of the two columns are **bottom-aligned** even though image heights differ.
5. The `Download PDF` button uses the same visual style as the existing `Register Now` / `Check Status` buttons (`.event-cta-btn`) and links to the correct PDF, opening in a new tab.
6. On viewports narrower than 640px, the grid collapses to a single column. **Poster appears first**, then bunting. Caption + button sit directly under each image (no large gap).
7. The hero poster at the top of the page is **unchanged**. The `Participation Guidelines` download card is **unchanged**. The `Promotional Materials` section heading and intro paragraph are **unchanged**. The email-request paragraph is **unchanged**.
8. No new files are created in `src/`. No global CSS, no new component, no new layout, no JS changes. All edits are within `src/content/events/nationwide-grassroots-wesak-celebrations-2026.md`.
9. No console errors; existing GLightbox initialization continues to work for the hero poster image.
