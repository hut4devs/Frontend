# Warm Daylight design tokens

## Status and source of truth

Issue #3 introduces the shared light-mode foundation. The five brand colors and
font families come from `FRONTEND_ENGINEERING_STANDARD.md`. Semantic assignments,
supporting shades, type hierarchy, radii, and font delivery below are **proposals
for design review**, not claims of Figma approval. No Figma reference was supplied.

`src/styles/tokens.css` is the authoritative project token source:

- `:root` holds color primitives, semantic aliases, border widths, and focus sizes.
- `@theme static` holds project typography, radius, and flat-elevation tokens.
- `@theme inline` maps semantic colors to Tailwind CSS 4 utilities by reference.
- Tailwind's default theme remains the source for the spacing, font-size,
  font-weight, container, and breakpoint scales. Do not copy these into JS or CSS.

`src/styles/global.css` imports the Tailwind theme and utilities, then project
tokens, and applies base typography and keyboard focus. Preflight is deliberately
omitted to preserve existing native element margins and form-control behavior.
Utility detection is scoped to `src/`, so examples in documentation and tests do
not change the application's CSS output. The Vite plugin compiles this CSS;
there is no Tailwind 3 configuration or second JavaScript/TypeScript palette.
Default Tailwind colors are cleared so contributors
consume semantic color utilities rather than an unrelated stock palette.

## Colors and proposed semantic roles

| Brand primitive | Value | Proposed application |
| --- | --- | --- |
| `--brand-ivory` | `#F7F1E7` | Application canvas |
| `--brand-cream` | `#FFF9EE` | Primary surface, primary-action text, inner focus band |
| `--brand-chocolate` | `#5A2D0C` | Primary text, links, primary actions, outer focus band |
| `--brand-caramel` | `#C88D3A` | Restrained decoration only |
| `--brand-golden` | `#B77620` | Stronger decorative accent only |

Caramel and golden are not normal-text colors on cream: calculated
ratios are 2.73:1 and 3.56:1 respectively. Neither is the default status color.
Use `--accent-foreground` for small accent text instead. Do not use decorative
tokens as the sole boundary or icon conveying essential information.

| Supporting primitive | Value | Rationale |
| --- | --- | --- |
| `--warm-raised` | `#FFFCF7` | Slightly lighter warm surface, without shadows |
| `--warm-subtle` | `#EFE3D1` | Secondary/disabled/neutral surface |
| `--warm-divider` | `#D8C4A9` | Decorative divider and secondary active fill |
| `--warm-control` | `#8C6B4F` | Higher-contrast essential control boundary |
| `--warm-secondary` | `#69452C` | Secondary readable warm text |
| `--warm-muted` | `#765D49` | Muted, supporting, disabled, and pending text |
| `--warm-hover` | `#472208` | Darker primary-action/link hover state |
| `--warm-active` | `#351906` | Darker primary-action/link active state |
| `--warm-accent-strong` | `#865313` | Readable restrained accent text |

Use the semantic `--surface-*`, `--text-*`, `--action-*`, `--border-*`,
`--disabled-*`, and `--focus-*` aliases in CSS. The primary action pairs chocolate
(including its darker states) with cream text. The secondary action pairs cream,
subtle hover, or divider active fills with chocolate text and a control boundary.
Disabled controls use subtle fill, muted text, and the control boundary; do not
reduce the whole control's opacity. Tokens do not implement disabled semantics:
use native `disabled` or appropriate accessible behavior in the component.

Supported text combinations are primary, secondary, muted, interactive, and
accent foregrounds on the four warm surfaces. Do not assume arbitrary token
combinations are accessible. `--border-divider` is decorative; use
`--border-control` when a visible boundary is needed to identify a control.

## Typography

Body uses `--font-body` (DM Sans, system sans-serif fallbacks); headings use
`--font-heading` (Fraunces, Georgia/serif fallbacks). `index.html` loads the fonts
from Google Fonts with `display=swap` and preconnect hints. This is a proposed
delivery choice; self-hosted assets can replace it after design/product review.
Fallbacks keep content usable if the external font request fails. No font-loader
dependency is used.

| Role | Token/utility | Size | Line height / weight |
| --- | --- | --- | --- |
| Caption/supporting | `text-caption` / `small` | 0.875rem | 1.5 / 400 |
| Body | `text-base` | 1rem | 1.5 / 400 |
| Label | `text-label` / `label` | 1rem | 1.5 / 600 |
| h6, h5 | `text-base` | 1rem | 1.25 / 600 |
| h4 | `text-lg` | 1.125rem | 1.25 / 600 |
| h3 | `text-xl` | 1.25rem | 1.25 / 600 |
| h2 | `text-2xl` | 1.5rem | 1.25 / 600 |
| h1 | `text-3xl` | 1.875rem | 1.25 / 600 |

Use Tailwind's normal (400), medium (500), semibold (600), and bold (700) weight
utilities. Body and heading line heights are `--leading-body` and
`--leading-heading`; heading tracking is `--tracking-heading` (-0.015em).
Preserve semantic heading order independently of visual size. Text is rem-based;
the root font size is not fixed and text is not capped with viewport-only units.

## Spacing and responsive assumptions

Reuse Tailwind's `--spacing` (0.25rem) scale. Common steps are 1, 2, 3, 4, 6, 8,
and 12: 0.25, 0.5, 0.75, 1, 1.5, 2, and 3rem. Suggested conventions:

- Labels/supporting text: `gap-2`; controls and status panels: `p-3`.
- Cards/forms: `p-4`, `gap-4`, optionally `sm:p-6`.
- Page sections: `gap-8` or `gap-12` as the approved screen warrants.
- Shell padding: `p-4 sm:p-6` (implemented).
- Interactive targets: allow `min-h-11` and suitable padding where applicable.

Retain default mobile-first breakpoints: `sm` 40rem, `md` 48rem, `lg` 64rem.
Use wrapping layouts, flexible widths, and min-width constraints only when
justified; do not hide overflow to conceal reflow defects. Base text can wrap long
content. No fixed-height text boxes or motion are introduced. Form layouts and
screen-specific target sizing remain responsibilities of their owning features.

## Borders, radius, and elevation

- Border widths: `--border-width-default` 1px; `--border-width-emphasis` 2px.
- `rounded-control`: 0.5rem; `rounded-panel`: 1rem; `rounded-pill`: 999rem.
- `shadow-panel`: none. No new raised shadow design is assumed.
- `.status-message` consumes the default border width and solid border style.

## Focus and interactions

All `:focus-visible` elements receive a 3px chocolate outline with a 3px offset,
plus a 3px cream inner band. The contrasting bands provide visibility against
warm light surfaces and dark chocolate actions without relying on a subtle color
change. The band-to-band contrast calculation is 11.04:1. In forced-colors mode,
the outline uses system `Highlight` and the shadow is removed.

Existing navigation and return-home links consume this treatment. Links remain
underlined and have darker hover/active states. Do not remove focus outlines or
override the shadow without an equivalent treatment. Allow at least 6px around
focused elements, avoid clipping overflow, and verify multiline links and nested
scroll containers in a browser. The shared focus treatment is not a dark theme.

## Status roles

Each `--status-{role}-*` group has `foreground`, `surface`, `border`, and `icon`
tokens. Strong foreground, border, and icon roles reference the same primitive.

| Role | Strong primitive | Surface primitive | Verified text contrast |
| --- | --- | --- | --- |
| Success | `--sage-strong` `#285C3B` | `--sage-surface` `#EDF5EA` | 7.02:1 |
| Warning | `--amber-strong` `#754B0B` | `--amber-surface` `#FFF2D6` | 6.84:1 |
| Danger/error | `--red-strong` `#9B3026` | `--red-surface` `#FFF0EB` | 6.65:1 |
| Information | `--blue-strong` `#285975` | `--blue-surface` `#EDF4F7` | 6.80:1 |
| Neutral/pending | `--warm-muted` `#765D49` | `--warm-subtle` `#EFE3D1` | 4.83:1 |

Green, amber, red, blue, and warm neutral retain distinct status meanings. Their
pale surfaces harmonize with the warm canvas. Always include meaningful status
text; icons may supplement it. Existing loading and route-error messages retain
`role="status"` and `role="alert"` respectively. Do not use an alert for every
status or imply backend success from a decorative color.

## Theme behavior

Only Warm Daylight light mode is currently supported. `color-scheme: light`
keeps native controls consistent even under a dark system preference. There was
no existing theme switching to preserve. No dark media query, dark token mapping,
or preference script is introduced. Static light rendering needs no theme
initialization script. Approved dark mappings and switching requirements remain
a design decision before any project-wide dark palette is added.

## Consumption examples

```tsx
<button className="rounded-control border border-control bg-action-primary px-4 py-3 font-body font-semibold text-on-primary hover:bg-action-primary-hover active:bg-action-primary-active">
  Continue
</button>

<p role="status" className="status-message rounded-control border-success-border bg-success-surface p-3 text-success-foreground">
  Changes saved
</p>
```

```css
.feature-panel {
  background: var(--surface-primary);
  color: var(--text-primary);
  border: var(--border-width-default) solid var(--border-divider);
  border-radius: var(--radius-panel);
  padding: calc(var(--spacing) * 4);
}
```

Add new primitives only in the source file, state their design rationale, and
expose semantic aliases appropriate to their role. Extend the Tailwind mapping
by reference, not by copying a hex value. Validate every new supported pairing
and theme mapping, including failure paths. Read resolved CSS variables in a
browser if JavaScript genuinely needs them; do not maintain a parallel palette.

## Validation status

Ratios above were calculated with the WCAG sRGB relative-luminance formula and
are now covered by tests against the actual CSS source. Primary text/canvas is
10.30:1, control border/canvas is 4.32:1, and accent text/secondary surface is
5.08:1. Minimum targets: normal text 4.5:1, large text 3:1, and relevant non-text
UI boundaries/icons 3:1. The supported text combinations meet the normal-text
threshold, including headings, without relying on the large-text exemption.

`tests/design-tokens.test.ts` parses project and imported Tailwind tokens with
PostCSS and checks all supported light-mode pairs, token categories, references,
and semantic utility mappings. The test-only helper supports opaque six-digit
sRGB hex colors and plain CSS aliases. Unsupported color formats and reference
syntax fail explicitly; it is not a general browser CSS evaluator. Known black/
white and near-threshold reference ratios validate the contrast calculation.
Failure fixtures include insufficient contrast, missing tokens, cycles, invalid
input/thresholds, and missing or incorrect semantic mappings. Dark-theme contrast
tests are inapplicable until an approved dark mapping exists.

React Testing Library checks actual loading/error text, live-region roles, token
classes, and accessible error recovery. These tests do not claim computed CSS
or visual focus verification.

`tests/e2e/design-tokens.spec.ts` uses Playwright Chromium against a production
build. Eight checks passed for:

- Actual shell keyboard tab order and Enter navigation at 320, 768, and 1280px.
- Computed outline widths/colors, cream focus band, and viewport edge clearance.
- Warm body text contrast, relative text size, and lack of horizontal overflow.
- A controlled status/form fixture consuming the built CSS variables, including
  rendered status text/border contrast and 200% root text enlargement at all sizes.
- Keyboard focus on the fixture's chocolate action and usable control height.
- Static light rendering with a dark system preference and a system-color
  outline under forced-colors emulation.

The fixture exists only in the browser tests and does not add production UI.
Font requests are deliberately blocked in these checks to verify resilient
fallback rendering. Google-hosted font loading, Firefox/Safari, OS high-contrast
settings, screen-reader announcements, and actual browser zoom at 400% remain
unverified. The 320px layout check covers the CSS viewport equivalent of a
1280px-wide viewport at 400% zoom; it does not simulate the zoom control itself.

Run validation with:

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm audit
npx playwright install chromium
npm run test:e2e
```

`test:e2e` builds and starts an isolated Vite preview server automatically; no
server needs to be started manually. On Linux, use
`npx playwright install --with-deps chromium` if browser system libraries are
missing. Browser artifacts are ignored by Git. Playwright, PostCSS, and Node
type declarations are development-only validation dependencies; no runtime
dependency or production contrast utility was added.

Issue #3 implementation validation passed: `npm run typecheck`, 48 Vitest tests
across four files, `npm run build`, `npm audit` (zero vulnerabilities), and eight
Chromium tests. The existing CI runs the typecheck, Vitest, and build gates;
Chromium verification is currently a separate `test:e2e` command.
