# AB FAST CAR — supplied customer reviews

The homepage renders the four Google reviews supplied by the agency directly
from `lib/customer-reviews.ts`: Ayoub Bhalli, Driss Rachdi, Meryama Belomari and
Hamza Boughazi. Their names, supplied avatar URLs and full original comments
are preserved verbatim. Hamza's supplied owner response, “Thank you”, is available
in a native expandable details area.

**No Google API key, API request, loading placeholder or Google Maps redirect is
needed to read these reviews.** All four cards are in the initial page HTML and
remain readable without JavaScript. The old Places endpoint and server adapter
were removed. This supersedes the previous API integration and its test report.

## Source and unknown information

These are the four reviews explicitly provided by the agency on 31 October
2026, not independently fetched or verified through Google. The UI describes
them as a selection of reviews, not a live or complete feed. Individual ratings,
publication dates, author-profile links, original review links, business-average
rating and total Google review count were not provided or verified; none are
invented or displayed. The number in the carousel is its position among the
four supplied cards, not the business's total Google review count.

Avatar URLs point directly to the exact supplied `lh3.googleusercontent.com`
addresses. They are not downloaded into the repository or replaced with stock
portraits. A failed or absent avatar displays initials (AB, DR, MB, HB).
Google may stop serving a profile image; text and layout continue to work.
The supplied content should be kept current by the agency in the local dataset.

The unmodified official Google Maps attribution logo and compact per-card
Google Maps attribution remain visible. The small optional listing link opens
the exact owner-supplied business URL. No per-review destination is invented.
No review or aggregate-rating structured data is added.

## Interface

The section defaults to a dark graphite palette matching the site. Its scoped
colour variables follow the existing root theme switch: enabling light mode
changes the background, cards, text, borders, avatars, focus rings and controls
to the light palette. It honours a saved visitor preference without requiring
another theme control. Official white and dark-gray Google Maps logos are used
unmodified for their corresponding backgrounds.

The site's display fonts, framed avatars, decorative quote marks, fine card
dividers, soft shadows and equal-height cards give the section a more finished
automotive style. Short reviews have larger, vertically balanced type; long
comments remain complete. The carousel includes a subtle position indicator
and high-contrast circular controls. Native horizontal scrolling shows
one card on phones, two on tablets and three on desktop. Labelled 44px controls,
keyboard arrows, mobile swipe, reduced-motion support and visible focus are
preserved. Full comments are never clamped. Arabic reviews use explicit RTL
direction and the site's Cairo font regardless of the interface language.

The old rating-summary and empty-state spacing are gone. The heading and compact
Google link share one desktop row; scroll margin clears the fixed navbar.
Card footers override the existing global `body footer` performance placeholder
so offscreen cards cannot acquire a spurious 900px height.

FR, EN, NL and AR use the existing next-intl routes. Spanish labels remain
prepared in `messages/reviews/es.json`, as previously requested; no new Spanish
routes or hreflang entries were added. Booking, navigation, vehicle listings and
SEO configuration are unchanged.

## Verification commands

```sh
node --test scripts/check-google-reviews.mjs
pnpm exec tsc --noEmit
pnpm lint
pnpm build
node scripts/check-google-reviews-browser.mjs --base=http://localhost:3000
```

The data check can also compare directly against the provided original brief:

```sh
node scripts/check-google-reviews.mjs --source="path/to/Pasted text.txt"
```

The browser script checks the actual supplied data, without synthetic review
API fixtures. It checks initial HTML, full text, all four cards, layout, RTL,
navbar clearance, arrow and touch navigation, owner response, avatar failure,
absence of API requests, booking, SEO and rendering without JavaScript. Real
Google avatar response statuses are recorded separately; image failures are
allowed only with the corresponding initials fallback.
It also checks the dark default without any saved preference, light and dark
palettes and official logos, the actual header theme switch, and persistence
after reloading in both modes.

Screenshots and browser JSON results are written locally to
`reports/google-reviews-supplied/`, which is ignored by git. The older
`reports/google-reviews/` captures refer to the superseded API implementation.

## Files

- Added `lib/customer-reviews.ts` with the four exact supplied reviews.
- Reworked `components/google-reviews-section.tsx`, `components/google-reviews.tsx`
  and `components/google-reviews.module.css` for immediate static content.
- Simplified `lib/google-reviews.ts` to the exact owner-supplied listing URL.
- Updated the `reviews` namespace in `messages/{fr,en,nl,ar}.json` and prepared
  Spanish labels in `messages/reviews/es.json`.
- Removed `app/api/google-reviews/route.ts` and `lib/google-reviews-server.ts`.
- Removed the unused Google Places key entry from `.env.example`.
- Replaced the API-specific checks in `scripts/check-google-reviews.mjs` and
  `scripts/check-google-reviews-browser.mjs` with supplied-content checks.
- Updated this document.

The existing `app/[locale]/page.tsx` section placement and official attribution
asset remain in use. No commit or deployment is authorized by this work.

## Initial supplied-data verification — 31 October 2026

- 4 data checks passed, including verbatim comparison of all four names,
  comments and avatar URLs against the original supplied brief.
- 164 browser checks passed at localhost:3000 across all existing languages,
  320/390/820/1440px widths, both themes and forced-avatar failures.
- All four supplied Google avatar URLs returned HTTP 200 in the browser.
- Zero Google review API requests were made. All four reviews also rendered
  with JavaScript disabled.
- Navbar clearance, equal card heights, complete text, Arabic direction,
  keyboard and touch navigation, owner response, booking and home SEO passed.
- `pnpm exec tsc --noEmit` passed.
- `pnpm build` passed with 111 static pages generated. The generated French
  homepage contains four review articles and no old empty-placeholder text.
- `git diff --check` passed.
- `pnpm lint` was attempted but cannot run: ESLint is not installed in the
  existing project. No unrelated dependency or lint configuration was added.

The existing build advisory about the age of `baseline-browser-mapping` remains
non-blocking. The dev server remains available at <http://localhost:3000/#reviews>.
No commit or deployment was made.

## Dark-default design update — 31 October 2026

The section now follows the site's existing dark-default/light-toggle behaviour.
Dark graphite cards, framed avatars, decorative quotation marks, balanced larger
type for short comments, fine dividers, a progress indicator and contrasting
navigation controls replace the forced-light styling. Light mode has its own
matching neutral palette. Review text and customer data are unchanged.

The official white Google Maps logo was added at
`public/images/google-maps-attribution-white.svg`; CSS selects the appropriate
unmodified logo for the active theme. No new theme setting or preference key
was introduced.

Visual and interaction checks passed for French and Arabic at mobile and desktop
widths, including forced avatar failures. The final targeted desktop rerun passed
34 checks, including both palettes, initial dark mode with no stored preference,
the actual theme switch, reload persistence in both modes, complete text,
keyboard navigation, booking and rendering without JavaScript. TypeScript,
the production build and the diff whitespace check passed after the final change.
