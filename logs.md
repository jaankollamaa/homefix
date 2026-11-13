# HomeFix development log

Activity log for the HomeFix project (Household Maintenance and Repair Tracker). Newest entries are at the bottom.

## 2026-11-09 – Project setup and README
**Phase:** 1 – Project setup and planning
**What I did:**
- Checked that the GitHub repository `jaankollamaa/homefix` exists and contains the README project plan.
- Reviewed the README against the assignment and fixed it: full project name everywhere, removed the "warranties" mention (it is a future feature), added a note about LocalStorage limitations and changed the status to "In development".
- Created the project skeleton: `css/`, `js/`, `js/views/`, `docs/screenshots/`, empty source files and a `.gitignore`.
**Files changed:** README.md, .gitignore, index.html, css/styles.css, js/*.js, js/views/*.js
**Decisions and why:**
- Plain HTML, CSS and JavaScript with no framework, because it suits my beginner level and teaches the fundamentals.
- Code split into layers (views, data operations, storage, validation) so no single file gets huge.
- Data kept as three linked lists (appliances, tasks, repairs) connected by IDs.
- Overdue status will be calculated from the due date and never saved, so it can't become outdated.
**Problems and fixes:** Git warned that LF would be replaced by CRLF. This is normal on Windows and harmless.
**Tested:** Not applicable (setup only).
**What I learned:** What `.gitignore` does, the difference between `git commit` and `git push`, and the risks of LocalStorage.
**Next:** Build the layout and navigation (Phase 2).

## 2026-11-09 – Layout, navigation and dark mode
**Phase:** 2 – User interface
**What I did:**
- Built the app layout: a sidebar on desktop that becomes a bottom bar on mobile.
- Added navigation between Dashboard, My Appliances, Maintenance and Repair History using the URL hash (for example `#appliances`), with placeholder pages.
- Added a sun/moon slider switch for dark mode that remembers my choice.
**Files changed:** index.html, css/styles.css, js/main.js, js/theme.js, js/views/dashboard.js, js/views/appliances.js, js/views/maintenance.js, js/views/repairs.js
**Decisions and why:**
- Hash-based navigation keeps refresh and the back button working and works on GitHub Pages without a server.
- All colors are CSS variables, so dark mode only needs a second set of values.
- A tiny script in the page head sets the theme before the page is drawn, to avoid a white flash.
- Route names are checked with `Object.hasOwn` so odd URLs like `#constructor` fall back to the dashboard.
**Problems and fixes:** None noted.
**Tested:** Manual checks in the browser only (no automated tests).
**What I learned:** CSS grid and media queries, ES modules, and how the `hashchange` event works.
**Next:** Appliance management (Phase 3).

## 2026-11-13 – Appliance management
**Phase:** 3 – Appliance management
**What I did:**
- Built the appliance form: add, edit and delete, with validation. Only the name is required, because details like the manufacturer are often unknown.
- Added a category dropdown with common household items plus an "Other" option where I can type my own (for example a vinyl player).
- Added appliance cards, an empty state and success and error messages.
- Added a delete confirmation that asks whether I have actually got rid of the appliance.
- Appliances are saved in LocalStorage and still there after a refresh.
**Files changed:** js/constants.js (new), js/storage.js, js/utils.js, js/store.js, js/validation.js, js/views/appliances.js, css/styles.css
**Decisions and why:**
- Data is saved before the screen is updated, so I never see data that was not really saved.
- If saved data is corrupted, a backup copy is kept before it can be overwritten.
- User-typed text is inserted with `textContent`, never `innerHTML`, to prevent HTML injection.
- The native `<dialog>` element is used for the delete confirmation because it is accessible and needs no library.
- Deleting an appliance will also delete its tasks and repairs later, so no records point to something that no longer exists.
**Problems and fixes:** No problems found during manual testing.
**Tested:** I tested adding, editing, deleting and refreshing manually and confirmed everything works. No automated tests yet.
**What I learned:** Form handling in JavaScript, `try/catch` around `JSON.parse`, spread syntax for copying objects, and why user input must never be inserted as HTML.
**Next:** Maintenance tracking (Phase 4): tasks, due dates, overdue status and completion.

## 2026-11-13 – Added the activity log
**Phase:** Documentation
**What I did:**
- Created this `logs.md` file for the school homework.
- Added an activity logging requirement to the project instructions.
**Files changed:** logs.md
**Decisions and why:**
- The log lives in the repository root, so it is versioned together with the code.
- Entries are written in the first person at the end of each work session, so they can later be reused for daily summaries or blog posts.
**Problems and fixes:** None.
**Tested:** Not applicable.
**What I learned:** How to keep a development diary that can later become blog posts.
**Next:** Start working on Phase 4 and submit the repository link in Kriit.