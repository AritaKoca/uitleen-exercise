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
- **R4 Correct responses:** New or changed endpoints return fitting status codes (201 created, 400 invalid input, 401 student not recognised, 404 unknown id, 409 conflict such as a tool that is already lent out, 500 on database errors) and log errors with `console.error`.
- **R5 Frontend and backend stay in sync:** A new or changed API field or endpoint is reflected in `public/` (the class, `script.ts`, `index.html`), and the other way around.
- **R6 Escaped output:** Values typed by visitors that end up in an HTML string are escaped.
- **R7 Sources only:** Only `.ts` sources are committed. No compiled `.js`, no `db/*.db` files, no `node_modules`, no `.env` files.
- **R8 No secrets:** No API keys, tokens, passwords or private URLs are committed.
- **R9 Docs are updated:** When endpoints or migrations change, the API table and the migration log in `README.md` are updated.
- **R10 Scope:** The change does what the PR title and description say, without unrelated refactors. Any new dependency is mentioned in the description.
- **R11 Git conventions:** The branch is named after the ticket (`feature/ml-<number>-<short-name>`). Commit messages follow Conventional Commits (`type(scope): description`, where the type is feat, fix, build, chore, ci, docs, style, refactor, perf or test), and every commit has one purpose.

## Topic-specific requirements

- **T1 Student check:** A student can only lend out a tool after the combination of student number and first name is checked against the `students` table. No endpoint lends out a tool on a student number alone.
- **T2 Lending state:** A tool that is already lent out cannot be lent out again (409), and a tool that is not lent out cannot be returned (409).
- **T3 Seeds are safe to rerun:** Seed files can run more than once without creating duplicates or failing, and contain only made-up data, no real student numbers or names.
