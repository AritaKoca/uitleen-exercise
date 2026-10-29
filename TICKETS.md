# Tickets

> **TOPIC:** Replace the example ticket below with the tickets of your project, ordered from easiest to hardest.

Every ticket needs three things: a **migration**, a **new endpoint** and **changes in the frontend**.

Remember: never change a migration that already ran, always make a new one (`npm run migrate:make name_of_the_migration`), and write a working `down` function.

Every pull request is checked against `.github/pr-requirements.md`. When a ticket brings its own rules, add them there as `T1`, `T2`, ...

---

## T-1 · Short title of the ticket

**Story:** As a <who>, I want <what> so that <why>.

**Migration**
- What changes in the database?

**Endpoint**
- Which endpoint(s) are added or changed, and which status codes can they return?

**Frontend**
- What does the visitor see and do?

**Acceptance criteria**
- [ ] A checkable statement about the result.
- [ ] Another checkable statement.
