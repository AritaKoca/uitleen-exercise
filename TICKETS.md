# Tickets

Every ticket needs three things: a **migration**, a **backend change** (endpoints) and a **frontend change**. Each ticket has its own **branch**: create it from `main`, work on it, and open a pull request when you are done.

Remember: never change a migration that already ran, always make a new one (`npm run migrate:make name_of_the_migration`), make one migration per change, and write a working `down` function.

Every pull request is checked automatically against `.github/pr-requirements.md`. When a ticket brings its own rules, add them there as `T4`, `T5`, ...

---

## ML-1 · Loan history

**Branch:** `feature/ml-1-loan-history`

**Story:** As a visitor, I want to see how often a tool has been lent out, by whom (first name only) and for how long, so I know how much a tool is used.

**Migration**
- Create a new `loans` table with: `id`, `toolId` (foreign key to `tools.id`), `studentId` (foreign key to `students.id`), `lentAt` (required) and `returnedAt` (empty until the tool is returned).
- Tip: store dates as text with `new Date().toISOString()`.
- Think about it: tools that are lent out right now have no row in `loans` yet. What happens when they are returned?

**Endpoints**
- Change `POST /api/tools/:id/lend`: besides marking the tool as lent out, it adds a row to `loans`.
- Change `POST /api/tools/:id/return`: it fills in `returnedAt` of the open loan (the row of this tool where `returnedAt` is empty).
- New: `GET /api/tools/:id/history`: returns the loans of one tool, newest first, with `firstName`, `lentAt` and `returnedAt`. Never return the student number. Returns `404` when the tool does not exist (tip: `join`).

**Frontend**
- Make a `Loan` class in `public/`, like the `Tool` class, with a `renderHtmlString()` that renders one row of a table.
- Add a **History** button to every tool. It shows a history table for that tool, with the text "Lent out 3 times" above it and one row per loan: first name, lent on, and for how long (e.g. `3 days` or `2 hours`).
- A loan that was not returned yet shows "Still lent out" instead of a duration.

**Acceptance criteria**
- [ ] Lend a tool and return it: the history shows one row with the first name and a duration.
- [ ] A tool that was lent out three times shows "Lent out 3 times" and three rows, newest first.
- [ ] A tool that is lent out right now shows "Still lent out".
- [ ] The response of `GET /api/tools/:id/history` contains no student numbers.
- [ ] The history of a tool that does not exist returns `404`.
- [ ] `npx knex migrate:rollback` followed by `npm run migrate` works without errors.

---

## ML-2 · Report broken tools when returning

**Branch:** `feature/ml-2-broken-reports`

**Story:** As a student returning a tool, I want to tell the coordinator when something is broken, so the coordinator knows what to repair and the next student is not surprised.

**Migration**
- Create a new `broken_reports` table with: `id`, `toolId` (foreign key to `tools.id`), `description` (required), `unusable` (boolean, default `false`) and `createdAt`.
- In a separate migration, add an `unusable` boolean column (default `false`) to `tools`.
- Think about it: why is `unusable` stored in both tables?

**Endpoints**
- New: `POST /api/tools/:id/broken-reports` with body `{ description, unusable }`: saves the report and returns `201` with it. Returns `400` when the description is empty and `404` when the tool does not exist. When `unusable` is `true`, the tool itself is marked as unusable too.
- New: `GET /api/broken-reports`: returns all reports, newest first, including the `name` of the tool (tip: `join`).
- Change `POST /api/tools/:id/lend`: returns `409` when the tool is unusable.
- Change `GET /api/tools` if needed, so the frontend knows which tools are unusable.

**Frontend**
- Clicking **Return** no longer returns the tool immediately. A small form appears: "Did everything go right?" with the radio buttons **Yes** and **No**.
  - **Yes**: the tool is returned, like before.
  - **No**: two more fields appear: "What is broken?" (text) and two radio buttons, **Still usable** and **Unusable**. On submit the report is saved and the tool is returned.
- An unusable tool shows "Unusable" on the front page and has no **Lend** button.
- Add a "Broken reports" section for the coordinator that lists all reports: tool name, description, whether it is unusable, and the date.

**Acceptance criteria**
- [ ] Returning with **Yes** works as before and saves no report.
- [ ] Returning with **No** and a description saves a report and returns the tool.
- [ ] Returning with **No** and an empty description is not possible (`400` from the API, and a message in the frontend).
- [ ] A report marked **Unusable** makes the tool show "Unusable" and it cannot be lent out, not even by calling `POST /api/tools/:id/lend` directly (`409`).
- [ ] A report marked **Still usable** does not block lending.
- [ ] One tool can have multiple reports.
- [ ] A description like `<b>cracked</b>` is shown as plain text, not as bold.
- [ ] `npx knex migrate:rollback` followed by `npm run migrate` works without errors.

**Stretch:** Without more work, an unusable tool stays unusable forever. Let `PATCH /api/tools/:id` accept `unusable` and add a **Repaired** button for unusable tools.

---

## ML-3 · Categories

**Branch:** `feature/ml-3-categories`

**Story:** As a visitor, I want tools grouped in categories (phones, VR headsets, cameras, ...), so I can find what I need faster.

**Migration**
- Create a new `categories` table with: `id` and `name` (required, unique).
- In a separate migration, add a `categoryId` column (foreign key to `categories.id`) to `tools`. It is empty for tools without a category, so the tools that already exist keep working.

**Endpoints**
- New: `GET /api/categories`: returns all categories, sorted by name.
- New: `POST /api/categories` with body `{ name }`: returns `201` with the new category, `400` when the name is empty and `409` when a category with that name already exists.
- Change `POST /api/tools` and `PATCH /api/tools/:id`: they accept an optional `categoryId`. Return `404` when that category does not exist.
- Change `GET /api/tools`: every tool also comes with the `categoryName`, and the list can be filtered with `?categoryId=2`. Tip: use `leftJoin`, so tools without a category stay in the list.

**Frontend**
- Add `categoryId` and `categoryName` to the `Tool` class and show the category on every tool.
- Add a `<select>` with the categories to the "Add a tool" form, plus a small form to create a new category.
- Add a filter `<select>` above the list ("All categories", "Phones", ...) that shows only the tools of that category.

**Acceptance criteria**
- [ ] A new tool can be added with a category, and the category is shown on the tool.
- [ ] Tools that were added before this ticket are still in the list, without a category.
- [ ] Filtering on a category only shows the tools of that category, and "All categories" shows everything again.
- [ ] Creating a category that already exists returns `409`.
- [ ] Adding a tool with a category that does not exist returns `404`.
- [ ] `npx knex migrate:rollback` followed by `npm run migrate` works without errors.
