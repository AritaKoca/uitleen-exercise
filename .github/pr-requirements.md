# PR requirements

Every pull request is checked against each requirement below, using only the diff.
Use stable IDs so results stay comparable between PRs.

<!--
Notes for humans (these comments are NOT sent to the AI agent):
- Keep each requirement specific and checkable from a diff.
- Add the requirements that belong to this project's topic in the T-series at the bottom.
- The script reads this file from the BASE branch, so changes here apply from the next PR on.
-->

## General requirements

- **R1 Migrations are append-only:** A database change is made in a new file in `migrations/`. No existing migration file is edited, renamed or deleted.
- **R2 Reversible migrations:** Every new migration has a working `down` function that exactly undoes `up`, including any data it moved.
- **R3 Whitelisted input:** Endpoints in `main.ts` pick the fields they accept from `req.body` one by one. `req.body` is never passed straight to the database.
- **R4 Correct responses:** New or changed endpoints return fitting status codes (201 created, 400 invalid input, 404 unknown id, 500 on database errors) and log errors with `console.error`.
- **R5 Frontend and backend stay in sync:** A new or changed API field or endpoint is reflected in `public/` (the class, `script.ts`, `index.html`), and the other way around.
- **R6 Escaped output:** Values typed by visitors that end up in an HTML string are escaped.
- **R7 Sources only:** Only `.ts` sources are committed. No compiled `.js`, no `db/*.db` files, no `node_modules`, no `.env` files.
- **R8 No secrets:** No API keys, tokens, passwords or private URLs are committed.
- **R9 Docs are updated:** When endpoints or migrations change, the API table and the migration log in `README.md` are updated.
- **R10 Scope:** The change does what the PR title and description say, without unrelated refactors. Any new dependency is mentioned in the description.

## Topic-specific requirements

No topic-specific requirements yet. Add them here as `T1`, `T2`, ...
