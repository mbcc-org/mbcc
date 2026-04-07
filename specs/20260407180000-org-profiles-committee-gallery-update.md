# MBCC Website — Org Profiles, Committee & Gallery Update

**Date:** 2026-04-07
**Author:** Spec generated via interview with stakeholder
**Status:** Ready for implementation

---

## Overview

Three tasks: (1) Update all 6 member org profiles with real logos, rich descriptions, and corrected metadata, (2) remove the photo gallery section from organisation pages, and (3) replace the committee list with the new office bearers.

---

## Task 1: Update Member Organisation Profiles

### 1A. Logo Path Migration

**Decision:** Switch from `getImageUrl()` indirection to direct static paths from `/public/logos/`.

Current frontmatter pattern:
```yaml
logo: organisations/bmsm/logo.jpg  # Goes through getImageUrl() → Picsum in dev, R2 in prod
```

New frontmatter pattern:
```yaml
logo: /logos/bmsm.png  # Direct static path, works in dev and prod
```

**Files to modify:**

| File | Change |
|---|---|
| `src/content/organisations/*.md` (all 6) | Update `logo` field to `/logos/{name}.{ext}` |
| `src/components/OrgCard.astro` | Remove `getImageUrl()` import and call; use `logo` prop directly as `<img src={logo}>` |
| `src/pages/organisations/[slug].astro` | Remove `getImageUrl()` call for logo; use `org.data.logo` directly |

**Logo file mapping:**

| Organisation | Frontmatter `logo` value | File on disk |
|---|---|---|
| BLIA (Malaysian Fo Guang Buddhist Association) | `/logos/blia.png` | `public/logos/blia.png` (1.6MB) |
| BMSM | `/logos/bmsm.png` | `public/logos/bmsm.png` (875KB) |
| SAWS | `/logos/saws.jpeg` | `public/logos/saws.jpeg` (12KB) |
| TBCM | `/logos/tbcm.png` | `public/logos/tbcm.png` (439KB) |
| VBCM | `/logos/vbcm.png` | `public/logos/vbcm.png` (714KB) |
| YBAM | `/logos/ybam.png` | `public/logos/ybam.png` (1.4MB) |

**Note:** The `getImageUrl()` utility in `src/lib/image.ts` should be left intact — it's still used by `EventCard` for thumbnails. Only remove its usage from logo rendering paths.

### 1B. Content Replacement

**Decision:** Fully replace each org's markdown body with the new descriptions provided below. Also update the `description` frontmatter field with concise 1-2 sentence summaries optimized for card previews and SEO meta tags.

### 1C. Frontmatter Updates

For each org, apply these changes beyond logo and body:

**BLIA (Malaysian Fo Guang Buddhist Association):**
- Keep `name: Malaysian Fo Guang Buddhist Association` (BLIA relationship explained in body)
- Keep `abbreviation: BLIA`
- Keep `tradition: mahayana`
- Keep existing contact fields as-is (body text only for new contact details)
- Write new concise `description` for card preview

**BMSM:**
- **Remove** `contact.address` (was incorrectly listing Buddhist Maha Vihara — that's SAWS)
- Keep `foundingYear: 1962`
- Write new concise `description`

**SAWS:**
- **Add** `foundingYear: 1894`
- Write new concise `description`

**TBCM:**
- **Add** `foundingYear: 2012` (official registration year)
- Write new concise `description`

**VBCM:**
- **Add** `foundingYear: 2002` (official registration year)
- Write new concise `description`

**YBAM:**
- **Remove** `tradition` field entirely (YBAM embraces all three traditions; schema only allows one value)
- Keep `foundingYear: 1970`
- Write new concise `description`

### 1D. Schema Cleanup

**File:** `src/content.config.ts`

- Remove `founding-member` from the `role` enum — all orgs are `national-org`, and MBA (the only founding member) has been removed
- Change: `role: z.enum(["founding-member", "national-org"])` → `role: z.enum(["national-org"])`

### 1E. Org Detail Page — Remove Founding Member Badge

**File:** `src/pages/organisations/[slug].astro`

Remove the conditional rendering of "Founding Member" badge (lines 69-71):
```astro
{org.data.role === "founding-member" && (
  <p class="text-sm font-medium text-saffron-600 mt-2">Founding Member</p>
)}
```

**Decision:** No new badges for tradition or founding year — keep header minimal. These details are covered in body text.

### 1F. New Content for Each Organisation

#### Malaysian Fo Guang Buddhist Association (BLIA)

**Frontmatter `description`:** "Part of the global Fo Guang Shan network, promoting Humanistic Buddhism through education, culture, charity, and spiritual practice in Malaysia."

**Markdown body:**

The Malaysian Fo Guang Buddhist Association is part of the global network of Fo Guang Shan, a major international Buddhist order founded in Taiwan by Venerable Master Hsing Yun. Its mission is rooted in Humanistic Buddhism, emphasising the integration of Buddhist teachings into everyday life through education, culture, charity, and spiritual practice.

Closely connected is the Buddhist Light International Association (BLIA), which serves as the lay Buddhist arm of Fo Guang Shan. BLIA was established to unite lay practitioners worldwide under the vision of promoting peace, compassion, and harmony. In Malaysia, BLIA collaborates with Fo Guang Shan temples and associations to organise Dharma talks, cultural events, youth activities, and charitable outreach.

Both organisations often work hand-in-hand: Fo Guang Shan provides the spiritual and monastic guidance, while BLIA mobilises lay members to bring Buddhist values into society through service and cultural activities.

#### Buddhist Missionary Society Malaysia (BMSM)

**Frontmatter `description`:** "One of Malaysia's oldest Buddhist organisations, spreading Theravāda Buddhism through publishing, education, and interfaith dialogue since 1962."

**Markdown body:**

The Buddhist Missionary Society Malaysia (BMSM) is one of the oldest and most established Buddhist organisations in Malaysia. Founded in 1962 by the late Venerable K. Sri Dhammananda, it has played a pivotal role in spreading Theravāda Buddhism and promoting interfaith understanding in the country.

## Key Features

- **Theravāda Tradition:** Rooted in the teachings of the Pali Canon, emphasising mindfulness, meditation, and ethical living.
- **Educational Outreach:** Publishes books, pamphlets, and translations of Buddhist texts to make the Dhamma accessible to Malaysians in English, Malay, and Chinese.
- **Community Engagement:** Organises Dharma talks, meditation retreats, Sunday schools, and youth activities.
- **Interfaith Dialogue:** Actively participates in Malaysian inter-religious councils, promoting harmony among diverse faiths.
- **Charitable Work:** Supports welfare projects, disaster relief, and community service initiatives.

#### Sasana Abhiwurdhi Wardhana Society (SAWS)

**Frontmatter `description`:** "Founding body of the Buddhist Maha Vihara in Brickfields, Kuala Lumpur — a central hub for Theravāda Buddhism in Malaysia since 1894."

**Markdown body:**

The Sasana Abhiwurdhi Wardhana Society (SAWS) is the founding body of the Buddhist Maha Vihara (BMV) in Brickfields, Kuala Lumpur, established in 1894. It is the oldest registered Buddhist society in the Klang Valley and remains a central hub for Theravāda Buddhism in Malaysia, especially during Wesak celebrations.

## Key Facts

- **Founded:** 1894 in Kuala Lumpur.
- **Role:** Established the Buddhist Maha Vihara (BMV), also known as the Brickfields Buddhist Temple.
- **Tradition:** Rooted in Sri Lankan Theravāda Buddhism, preserving over 130 years of practice and teachings.
- **Community Support:** Managed historically by the Sinhala Buddhist community, but financially equally supported by Chinese and Indian communities as well, reflecting Malaysia's multicultural Buddhist landscape.
- **Annual Wesak Festival:** SAWS and BMV are focal points for Kuala Lumpur's Wesak celebrations, drawing thousands of devotees.

## Buddhist Maha Vihara (BMV) — SAWS' Legacy

Jalan Berhala, Brickfields, Kuala Lumpur.

- **Main Shrine Hall:** First structure completed in the early 20th century, funded by donors recorded in the Selangor Government Gazette (1896).
- **Pillars of Practice:**
  - *Dhamma:* Teachings of the Buddha, meditation, study sessions.
  - *Dana:* Generosity and compassion through community service.
  - *Sangha:* Support for monastic life and spiritual guidance.

#### Theravāda Buddhist Council of Malaysia (TBCM)

**Frontmatter `description`:** "The umbrella body unifying Theravāda Buddhist organisations across Malaysia, providing representation, coordination, and governance since 2012."

**Markdown body:**

The Theravāda Buddhist Council of Malaysia (TBCM) is the umbrella body officially registered in 2012 to unify Theravāda Buddhist organisations across Malaysia, providing representation, coordination, and governance for temples, societies, and practitioners.

## Key Facts

- **Formation:** Established in 2011, officially registered on 9 May 2012.
- **Headquarters:** A2-16-3A, Arcoris Mont Kiara, No 10, Jalan Kiara, 50480 Kuala Lumpur, Malaysia. Tel No. +6011-17120134

## Objectives

- To unite and promote understanding among Theravada Buddhist organisations and followers in Malaysia through common activities and fellowship programmes.
- To provide guidance and interpretation on Theravada doctrines and practices among Malaysian Buddhists.
- To make public statements and influence public opinion on issues affecting the Buddhist community in general, and Theravada community in particular.
- To address issues of common concern for its constituent members, including being an agency for members to work with Federal and State Government agencies.
- To maintain contact and enhance cooperation with international Theravada Councils and bodies worldwide to propagate Theravada teachings, practices, arts, culture and heritage.
- To publish and distribute relevant printed and multi-media resources in pursuance of its objectives.
- To appeal for, collect and receive funds and to acquire, develop, deal with and maintain facilities and property in pursuance of its objectives.

#### Vajrayāna Buddhist Council of Malaysia (VBCM)

**Frontmatter `description`:** "The national body representing Tibetan Vajrayāna Buddhist traditions in Malaysia, uniting the four major schools: Nyingma, Kagyu, Sakya, and Gelug."

**Markdown body:**

The Vajrayāna Buddhist Council of Malaysia (VBCM) is the national umbrella body representing Tibetan Vajrayāna Buddhist traditions in Malaysia, founded in 1998 and registered in 2002. It unites the four major Tibetan schools (Nyingma, Kagyu, Sakya, Gelug).

## Key Facts

- **Formation:** Initiated in 1998, officially registered on 12 June 2002.
- **Purpose:** To provide a platform for Tibetan Vajrayāna practitioners in Malaysia to interact, collaborate, and pursue common goals, while promoting unity and harmony among the traditions.
- **Headquarters:** Petaling Jaya, Selangor.
- **Membership:** Comprises Vajrayāna Buddhist societies and centres across Malaysia, with associate membership open to individuals inclined toward Vajrayāna practice.
- **Administrative Role:** VBCM upholds organisational integrity through compliance, facilitates visiting teachers, and coordinates Sangha activities. These responsibilities strengthen credibility, ensure good governance, and foster meaningful connections between the Sangha, lay members, and wider society.

## Activities

- Dharma talks and teachings by Tibetan masters.
- Inter-tradition events fostering unity among Nyingma, Kagyu, Sakya, and Gelug schools.
- Cultural and spiritual programs marking anniversaries and special occasions.
- Publications and outreach to promote understanding of Vajrayāna Buddhism.

#### Young Buddhist Association of Malaysia (YBAM)

**Frontmatter `description`:** "Malaysia's leading Buddhist youth organisation, uniting over 270 member organisations to cultivate wisdom, compassion, and gratitude since 1970."

**Markdown body:**

The Young Buddhist Association of Malaysia (also known as Persatuan Belia Buddhist Malaysia and YBAM) is the country's leading Buddhist youth organisation, officially recognised by the government as the national representative body for Buddhist youths. Founded in 1970, it now coordinates over 270 member organisations through 13 state liaison committees.

## Key Facts

- **Founded:** 1970.
- **Vision:** To develop a society of wisdom, compassion, and gratitude.
- **Mission:** To unite the Buddhist youth and to inspire them in cultivating wisdom, compassion, and gratitude.
- **Recognition:** The only national Buddhist youth organisation formally recognised by the Malaysian government.
- **Membership:** Over 270 member organisations (MOs) coordinated nationwide.
- **Structure:** Operates through 13 State Liaison Committees, ensuring grassroots representation across Malaysia.
- **Embracing Three Traditions:** YBAM is firmly rooted in the Dharma and actively promotes the unity of the three major Buddhist traditions: Theravada, Mahayana, and Tibetan Buddhism.

## Activities & Contributions

- **Youth Leadership Training:** Equips young Buddhists with organisational and leadership skills.
- **Dharma Propagation:** Organises camps, talks, pictorial books, Buddhist hymns composition camp, and study sessions for all sectors of society.
- **Community Development:** Helps establish local Buddhist organisations and supports their growth.
- **Social Welfare and Mental Wellness Support:** Provides community-based psychological support through PELITA Psychological Guidance Unit and various welfare initiatives such as disaster relief and blood donation drives.
- **Media Outreach:** Runs YBAM TV (YouTube channel) to share teachings, events, and youth-focused content.

### Model Recommendation

**Sonnet** — The content is fully specified. This is a mechanical content replacement and frontmatter update task with clear instructions. No design judgment needed.

---

## Task 2: Remove Photo Gallery from Organisation Pages

### Scope

| Area | Action |
|---|---|
| `src/pages/organisations/[slug].astro` | Remove the photo gallery section (lines 123-129): the conditional check for `org.data.photos` and the `<PhotoGallery>` component rendering. Also remove the `PhotoGallery` import. |
| `src/content.config.ts` | Remove `photos` field from the `organisations` schema |
| `src/content/organisations/*.md` | Remove any `photos` frontmatter arrays (none currently exist, but clean up if found) |
| `src/components/PhotoGallery.astro` | **Keep** — still used by event detail pages (`src/pages/events/[slug].astro`) |
| `events` schema | **Keep** `photos` field — unaffected |

### Model Recommendation

**Sonnet** — Straightforward removal with well-defined scope. Two files to modify, one schema field to remove.

---

## Task 3: Update Committee List

### Current Committee (to be removed)

```typescript
{ name: "Venerable Sing Kan", title: "President", organisation: "Malaysia Buddhist Association (MBA)" },
{ name: "Venerable Wei Wu", title: "Deputy President", organisation: "Buddhist Missionary Society Malaysia (BMSM)" },
{ name: "Dato Dr. Ooi Hock Lye", title: "Vice President", organisation: "Young Buddhist Association of Malaysia (YBAM)" },
{ name: "Venerable Jue Cheng", title: "Vice President", organisation: "Malaysian Fo Guang Buddhist Association (BLIA)" },
{ name: "Mr. Lim Kooi Fong", title: "Secretary General", organisation: "Sasana Abhiwurdhi Wardhana Society (SAWS)" },
{ name: "Mr. Tan Ah Chai", title: "Treasurer", organisation: "Theravada Buddhist Council of Malaysia (TBCM)" },
{ name: "Lama Karma Samten", title: "Committee Member", organisation: "Vajrayana Buddhist Council of Malaysia (VBCM)" },
```

### New Committee (to replace)

```typescript
{ name: "Chang Chooi Kwan", title: "President" },
{ name: "Ng Hui Chen", title: "Deputy President" },
{ name: "Loh Pai Ling", title: "Vice President" },
{ name: "Chew Eng Ghee", title: "Vice President" },
{ name: "Wong Tin Song", title: "Secretary" },
{ name: "A. Hemadasa", title: "Treasurer" },
```

### Changes Summary

| Aspect | Old | New |
|---|---|---|
| Count | 7 members | 6 members |
| Organisation field | Included for all | **Dropped entirely** |
| "Secretary General" | Mr. Lim Kooi Fong | Renamed to "Secretary" — Wong Tin Song |
| "Committee Member" role | Lama Karma Samten | Role removed (no generic member) |
| Portraits | Initials avatars (no photos) | **Keep initials avatars** |

### Files to Modify

| File | Change |
|---|---|
| `src/pages/about.astro` — committee array (lines 44-52) | Replace with new 6-member array; remove `organisation` property |
| `src/pages/about.astro` — contact section (line 267) | Change "Secretary of MBCC" to "Secretary" |
| `src/components/CommitteeMember.astro` | Remove `organisation` from Props interface and rendering. The component currently displays org name below the title — remove that display logic. |
| Grid layout | Currently `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`. With 6 members, this still works well (2×3 on mobile, 3×2 on tablet, fits in 4-col on desktop). **No change needed.** |

### Model Recommendation

**Sonnet** — Simple data replacement and minor component prop cleanup.

---

## Implementation Order

All three tasks are independent and can be implemented in parallel. However, Task 1 (org profiles) and Task 3 (committee) both modify `src/pages/about.astro`, so if running in parallel, merge carefully.

**Recommended approach:**

```
Phase 1 (parallel):
├── Task 2: Remove photo gallery (smallest scope, no conflicts)
└── Task 3: Update committee list

Phase 2:
└── Task 1: Update org profiles (largest scope, touches many files)
```

Alternatively, all three can be done sequentially in a single pass since the changes are well-defined.

### Model Recommendations Summary

| Task | Model | Rationale |
|---|---|---|
| Task 1: Update org profiles | **Sonnet** | Content is fully specified; mechanical replacement of frontmatter + body + logo paths |
| Task 2: Remove photo gallery | **Sonnet** | Small, well-scoped removal from 2 files |
| Task 3: Update committee | **Sonnet** | Data replacement + minor component cleanup |

All three tasks are Sonnet-appropriate since the content, decisions, and exact changes are fully specified in this document. No design judgment, copywriting, or architectural decisions remain.

---

## Files Modified (Complete List)

```
# Task 1: Org profiles
MODIFY  src/content/organisations/malaysian-fo-guang-buddhist-association.md
MODIFY  src/content/organisations/buddhist-missionary-society-malaysia.md
MODIFY  src/content/organisations/sasana-abhiwurdhi-wardhana-society.md
MODIFY  src/content/organisations/theravada-buddhist-council-of-malaysia.md
MODIFY  src/content/organisations/vajrayana-buddhist-council-of-malaysia.md
MODIFY  src/content/organisations/young-buddhist-association-of-malaysia.md
MODIFY  src/components/OrgCard.astro          (remove getImageUrl for logos)
MODIFY  src/pages/organisations/[slug].astro  (remove getImageUrl for logos, remove founding badge)
MODIFY  src/content.config.ts                 (remove founding-member from role enum)

# Task 2: Remove photo gallery
MODIFY  src/pages/organisations/[slug].astro  (remove gallery section + import)
MODIFY  src/content.config.ts                 (remove photos from org schema)

# Task 3: Committee
MODIFY  src/pages/about.astro                 (replace committee array, update contact title)
MODIFY  src/components/CommitteeMember.astro   (remove organisation prop + display)
```

**Files NOT modified:**
- `src/components/PhotoGallery.astro` — kept for event pages
- `src/lib/image.ts` — kept for event thumbnails
- `src/pages/index.astro` — org cards render dynamically from collection; changes propagate automatically
- `src/pages/organisations/index.astro` — same, renders from collection automatically

---

## Decisions Log

All decisions were made during stakeholder interview on 2026-04-07:

1. **Logo serving:** Direct static paths from `/public/logos/`, bypass `getImageUrl()`
2. **BLIA naming:** Keep as "Malaysian Fo Guang Buddhist Association", mention BLIA in body
3. **YBAM tradition:** Remove tradition field (embraces all three)
4. **Committee orgs:** Drop organisation affiliations entirely
5. **Content strategy:** Full replacement of markdown bodies (not merge)
6. **Gallery removal scope:** Remove from org pages + org schema; keep PhotoGallery component for events
7. **SAWS logo filename:** Confirmed `saws.jpeg` on disk (typo was in task description only)
8. **MBA status:** Removed/excluded as member org (already deleted in prior spec)
9. **Contact details:** Body text only — don't update frontmatter contact fields from new descriptions
10. **Card descriptions:** Write concise 1-2 sentence summaries for card previews
11. **Contact section title:** Update "Secretary of MBCC" → "Secretary"
12. **BMSM address:** Remove incorrect Buddhist Maha Vihara address from frontmatter
13. **Founding years:** Add with registration dates — SAWS 1894, TBCM 2012, VBCM 2002
14. **Org ordering:** Alphabetical by abbreviation (current behavior, no change)
15. **Committee portraits:** Keep initials-only avatars
16. **Schema cleanup:** Remove `founding-member` from role enum
17. **Org header badges:** Keep minimal — no tradition or founding year badges
18. **Logo frontmatter:** Update values to direct static paths (e.g., `/logos/bmsm.png`)
