# Hut4Devs Frontend

Dedicated web-client repository for Hut4Devs. The canonical application currently uses React 18, TypeScript, Vite 6, Tailwind CSS 4, and Firebase browser integration. This repository defines the target boundary; it does not claim code has already been migrated.

## Responsibilities
- Accessible, mobile-first experiences for members and authorized coordinators.
- Typed client integration with the Hut4Devs Backend.
- Presentation of accommodation, payment, peer support, recognition, and trust-trail information.
- Frontend unit, component, accessibility, and end-to-end tests.

## Target structure
```text
src/
  app/                 # shell, routes, providers
  components/          # shared UI primitives
  features/
    accommodation/
    payments/
    members/
    support/
    trust-trails/
  services/
    api/
    auth/
  hooks/
  lib/
  types/
tests/
  unit/
  component/
  integration/
  e2e/
docs/
  ARCHITECTURE.md
  API_CONTRACT.md
  ACCESSIBILITY.md
```

## Rules
- Backend is authoritative for permissions, payment verification, balances, and persisted state.
- Never expose server secrets or call private provider APIs from the browser.
- Never put private accommodation or identity data on a public blockchain.
- Preserve accessible interaction states and the warm, readable visual system.
- Use focused changes and automated tests.

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Design system

Use the shared [Warm Daylight design tokens](docs/DESIGN_TOKENS.md) for semantic
colors, typography, spacing, borders, focus indicators, and status styling.
Project tokens live in `src/styles/tokens.css` and integrate with Tailwind CSS 4.
The guide includes proposed design assignments, light-mode limitations,
contributor examples, and unit/browser validation commands.
