# Hut4Devs Frontend Engineering Standard

**Status:** Initial shared standard
**Applies to:** All contributors, issues, pull requests, and AI-assisted changes in `hut4devs/Frontend`.

## 1. Authority and source of truth

1. **Product and domain documentation** defines user needs, product behavior, domain rules, and approved requirements.
2. **Figma** defines approved visual designs, user flows, component designs, and interaction patterns.
3. **This standard** defines frontend architecture, implementation conventions, testing, accessibility, and collaboration practices.
4. **Frontend source code and tests** define the current implementation and its verified behavior.
5. **POCs and experimental implementations** are reference material, not automatically approved production decisions.

If sources conflict, identify the conflict and request clarification or an Architecture Decision Record (ADR). Do not silently choose one.

## 2. Technology baseline

- React 18
- TypeScript with strict type checking
- Vite 6
- React Router
- Tailwind CSS 4 as the intended styling system
- Vitest and React Testing Library
- Firebase browser integration where required by the approved architecture

Inspect `package.json`, the lockfile, and installed versions before using a dependency. Do not introduce another framework, router, state-management library, styling system, or data-fetching library without a clear need and documented decision.

## 3. Architecture and ownership

- `src/app/`: bootstrap, route configuration, providers, application-level boundaries.
- `src/components/`: reusable, capability-independent interface components.
- `src/features/`: capability-specific pages, components, behavior, and tests.
- `src/services/api/`: typed backend communication.
- `src/services/auth/`: authentication integration.
- `src/hooks/`: reusable React hooks.
- `src/lib/`: shared utilities and library adapters.
- `src/types/`: shared types that genuinely cross feature boundaries.
- `tests/`: cross-feature tests and tests that do not naturally belong beside implementation.

Keep feature-specific behavior inside its feature. Share code when reuse or architecture justifies it. Avoid duplicate components and circular feature dependencies.

## 4. Routing and application boundaries

Group routes by product capability: Home, Accommodation, Members, Payments, Peer support, and Trust trails.

Provide:
- A consistent application shell and accessible primary navigation.
- An accessible not-found page for unknown URLs.
- Consistent route-level loading and error states.
- A safe route to return to after failure.
- Tests for route matching and relevant failure paths.

Do not put product-specific business logic in the application shell.

## 5. Design system

Follow the approved **Warm Daylight** direction. Reuse approved Figma components and code components. Prefer semantic design tokens over scattered hard-coded colors. Keep spacing, typography, radii, borders, elevation, and interaction states consistent. Design mobile-first.

The existing palette includes `#F7F1E7`, `#FFF9EE`, `#5A2D0C`, `#C88D3A`, and `#B77620`. Confirm semantic assignments against approved designs before use. Use DM Sans for body text and Fraunces for headings where consistent with the approved design.

Do not invent a new visual language. If a design or token is missing, identify the gap and propose a consistent addition. Support light/dark modes when required by approved design requirements.

## 6. Accessibility

- Use semantic HTML and meaningful heading order.
- Give interactive elements accessible names and keyboard operation.
- Provide visible focus indicators.
- Associate form controls with labels and expose validation errors.
- Use appropriate live regions for loading, success, and error messages.
- Maintain sufficient contrast and do not rely on color alone.
- Respect reduced-motion preferences where animation is used.

Test important accessible roles, names, and interactions.

## 7. State, API, and security boundaries

The backend is authoritative for permissions, payment verification, balances, and persisted application state.

Do not treat client checks as authorization, present client calculations as verified payments, expose credentials or server-only secrets, put sensitive personal/accommodation/payment data in public URLs or logs, or invent successful API responses after failures.

Use typed API boundaries and handle loading, empty, success, unauthorized, and error states explicitly. Use Firebase only for responsibilities approved by product/backend architecture. Do not create a parallel source of truth for backend-owned data.

## 8. Testing and quality gates

Test new behavior and relevant failure paths. Use Vitest, React Testing Library, TypeScript, and Vite according to the repository's setup.

Before a pull request, run:

```powershell
npm run typecheck
npm test
npm run build
npm audit
```

Investigate failures rather than suppressing them. Do not weaken type safety or remove meaningful tests just to make checks pass. A passing test run does not prove an untested acceptance criterion.

## 9. Collaboration and change management

For every issue:
1. Read the issue and all acceptance criteria.
2. Read this standard and relevant product/design documentation.
3. Inspect current code and history where useful.
4. Identify reusable components, affected files, dependencies, and possible conflicts.
5. Implement the smallest complete change.
6. Add or update tests.
7. Run quality checks.
8. Review the diff for unrelated changes, secrets, generated files, and inconsistent conventions.
9. Open a pull request linked to the issue.

Use one issue per feature branch. Do not commit directly to `main`.

Commit convention: `ðŸ›– type(scope): concise description`

Examples:
- `ðŸ›– feat(router): add capability route boundaries`
- `ðŸ›– fix(payments): handle failed verification`
- `ðŸ›– test(members): cover empty state`

Never commit real user data, credentials, generated build output, or `node_modules`.

## 10. AI-assisted implementation rules

AI assistants must read this standard, inspect existing code before creating/replacing files, reuse existing patterns, keep changes within issue scope, preserve approved architecture/design, ask about material conflicts, report actual test results, and identify assumptions, changed files, risks, and incomplete acceptance criteria.

## 11. Changes to this standard

Change this standard through reviewed pull requests. Do not establish project-wide conventions silently in unrelated feature branches. Document significant architectural decisions through ADRs.

**Definition of consistency:** Separate contributors should produce interfaces, architecture, tests, and pull requests that feel like parts of one product.
