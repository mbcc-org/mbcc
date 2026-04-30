# Grassroots Wesak 2026 — Promotional Materials (Poster & Bunting)

**Date:** 2026-04-30
**Scope:** Single page — `src/content/events/nationwide-grassroots-wesak-celebrations-2026.md`
**Source request:** Client meeting — "Upload the Grassroots Poster and Bunting onto our website, and inform the grassroot organisations that they can request the HD version by emailing us at wesak.mbcc@gmail.com should they wish to print additional copies themselves."

---

## 1. Goal

Make the official Wesak 2026 poster and bunting downloadable from the Nationwide Grassroots Wesak Celebrations 2026 event page, and tell organisations how to obtain higher-resolution versions for their own printing.

## 2. Non-goals

- No changes to other event pages (e.g. National Wesak Conference).
- No changes to the events listing, homepage, navigation, or any other page.
- No new components, layouts, routes, or shared UI primitives — reuse the existing `event-download-card` markup pattern already defined inline in the event page.
- No image/JPEG previews or thumbnails for the new files — link the PDFs directly.

## 3. Source files (already in repo)

```
public/files/nationwide-grassroots-wesak-celebrations-2026-poster.pdf   (~20 MB)
public/files/nationwide-grassroots-wesak-celebrations-2026-bunting.pdf  (~12 MB)
```

These PDFs **are** the HD print-grade versions. The "email us for HD" line exists as a courtesy fallback for organisations that cannot download large files directly, want source files (AI/PSD), or need a custom size.

## 4. Page change — single-file edit

**File:** `src/content/events/nationwide-grassroots-wesak-celebrations-2026.md`

Insert a new `## Promotional Materials` section **between** the existing `## Participation Guidelines` section and the existing `## Important Notes` section.

### 4.1 Section structure (in order)

1. `## Promotional Materials` H2 heading.
2. One-line intro paragraph (see §5.1).
3. Download card #1 — **Poster** (see §5.2).
4. Download card #2 — **Bunting** (see §5.2).
5. Email-request sentence in body copy (see §5.3).

### 4.2 Card markup pattern

Reuse the existing `event-download-card` class block already used by the Participation Guidelines card (same PDF icon, same external-link icon, same styles — no new CSS). Open in a new tab via `target="_blank" rel="noopener noreferrer"` (matches the existing pattern; no `download` attribute).

## 5. Exact copy

### 5.1 Section intro (single line, plain paragraph above the cards)

> Download the official Wesak 2026 poster and bunting to promote your grassroots celebration.

### 5.2 Card labels (include file size in MB)

- Card 1: **`Wesak 2026 Poster (PDF, 20 MB)`** → links to `/files/nationwide-grassroots-wesak-celebrations-2026-poster.pdf`
- Card 2: **`Wesak 2026 Bunting (PDF, 12 MB)`** → links to `/files/nationwide-grassroots-wesak-celebrations-2026-bunting.pdf`

Order: Poster first, then Bunting.

If actual byte sizes drift after any future re-export, round to the nearest MB and update the labels.

### 5.3 Email-request sentence (plain paragraph below the cards, no callout box)

> Grassroots organisations who wish to print additional copies are warmly invited to email [wesak.mbcc@gmail.com](mailto:wesak.mbcc@gmail.com) to request the HD versions of the poster and bunting.

The mailto link is a plain `mailto:` — **no pre-filled subject/body**.

## 6. Resulting page outline (after change)

```
Hero poster (existing)
Register / Check Status CTA buttons (existing)
Intro paragraph (existing)
## Objective                      (existing)
## Support Mechanism              (existing)
## Participation Guidelines       (existing — single download card)
## Promotional Materials          (NEW)
   intro paragraph
   Poster card
   Bunting card
   email-request paragraph
## Important Notes                (existing)
## Event Details                  (existing)
## For Enquiries                  (existing)
Final Register / Check Status CTA buttons (existing)
```

## 7. Out-of-scope decisions explicitly considered and rejected

| Considered | Decision | Reason |
|---|---|---|
| Generating JPEG previews of the PDFs as inline thumbnails | Rejected | Adds asset-pipeline work; client did not ask for it. |
| Pre-filled mailto subject/body | Rejected | Plain prose link kept consistent with the existing Enquiries section. |
| Styled callout/info box for the email line | Rejected | Plain paragraph keeps the page rhythm; the existing `> Important Notes` blockquote already owns the "callout" visual slot. |
| Forcing download via `download` attribute | Rejected | Inconsistent with the Participation Guidelines card pattern; users get inline preview + browser save. |
| Distinct icons per asset (image vs banner) | Rejected | Reusing the existing PDF icon keeps the three downloads on the page visually coherent. |
| Surfacing the materials on the events listing or homepage | Rejected | Only relevant to registered grassroots orgs who will already be on this page. |

## 8. Acceptance criteria

- [ ] `## Promotional Materials` section appears in the rendered grassroots event page between Participation Guidelines and Important Notes.
- [ ] Both PDFs open from their cards in a new tab and serve from `/files/...`.
- [ ] Card labels show "(PDF, 20 MB)" and "(PDF, 12 MB)" respectively.
- [ ] Card visual style is identical to the existing Participation Guidelines card (same PDF icon, same hover state, same border/background).
- [ ] Email-request paragraph is present below the cards with a clickable `mailto:wesak.mbcc@gmail.com` link.
- [ ] No other event page, listing, or homepage is modified.
- [ ] No new components, CSS files, or assets are introduced — all changes confined to the single markdown file plus the two already-present PDFs in `public/files/`.

## 9. Risks / notes

- **File size on mobile.** 20 MB is heavy on cellular. Mitigated by surfacing the size in the label so users can decide. If complaints emerge later, revisit by generating compressed web versions and keeping the HD via email.
- **Email channel volume.** The same address (`wesak.mbcc@gmail.com`) is already published in the Enquiries section of the same page; no new inbox to monitor, but Wong Tin Song should be informally notified that HD requests will route to the same inbox.
