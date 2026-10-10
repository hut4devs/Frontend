# Frontend Architecture

The frontend is a presentation and interaction client. Backend owns persistence, authorization, payment verification, and domain invariants.

- Organize by product feature; shared primitives live in `src/components`.
- Call the backend through a typed API client.
- Treat realtime events as prompts to refresh authoritative API state.
- Display a payment as verified only when backend state says it is verified.
- Keep personal identity and accommodation-sensitive information off public-chain data.
- Require keyboard support, semantic structure, responsive layouts, and accessible status messages.

Routing, state-management, end-to-end tooling, and final API schema must be decided in tracked issues before adoption.
