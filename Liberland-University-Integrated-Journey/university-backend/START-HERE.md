# Liberland student backend — local review

**IIS hosting:** the integrated journey now has an explicit HTTPS origin setting
and a staged Windows deployment routine. Read **IIS-HOSTING.md** for the existing
`universityofliberland.land` site. Local startup below remains available. Hosting
does not enable live Stripe payments or email delivery.

**Stripe update:** sandbox checkout is now integrated. Read **STRIPE-TESTING.md** first for dependency installation, key configuration and the two local processes needed for payments. Earlier notes below describing payments as unconnected apply to the original backend milestone; Stripe sandbox testing is now available, while live payments remain disabled.

This is a working **local Node.js + SQLite application**, built from the reviewed Liberland campus. It does not require a software subscription, a Supabase project or a payment account. SQLite is the first local storage implementation; a hosted Supabase connection and migration have **not** been implemented yet.

## Start

1. Install Node.js 24 or newer if needed.
2. Open a terminal in this folder, run `npm ci`, then `npm start`. The only application dependency is the official Stripe SDK. For payment testing, start the listener first as described in STRIPE-TESTING.md.
3. Open **http://127.0.0.1:3000/portal.html**. Keep the terminal running.
4. Choose **First staff setup**. Copy the token from `data/setup-token.txt`, enter your staff name, email and a password of at least 12 characters.
5. Add the displayed setup key to an authenticator app as a time-based account. Enter its six-digit code to activate your staff account. Keep the authenticator setup key in protected storage for recovery. Subsequent staff sign-ins require a fresh code; already-used codes cannot be reused.
6. Open a private browser window to register a separate fictional student. Request a course as that student, approve it in the staff dashboard, then refresh the student space and begin learning.

The server binds only to 127.0.0.1. Do not upload this package to a public website as if it were the earlier static ZIP. Do not use real student information in this review. The original static campus is included under `public/`, with account-based learning connected when served by this backend.

## What to review

- Registration, sign-in, sign-out, profile name changes and record download.
- A staff dashboard showing student counts, pending approvals, active enrolments, courses in progress, completed courses and open enquiries.
- Student search, record views, CSV/JSON exports, suspension/reactivation and explicit account deletion.
- Manual enrolment, pause and reactivation. Repeated requests cannot create duplicate enrolments.
- All nine hourly certificates are available for enrolment. The six degree listings remain prospectus demonstrations; degree applications are not connected to this database.
- The existing lessons are retained: 12 Social Media Analytics lessons, two Excel lessons and one sample for each other certificate. Completing the available sample lessons does not mark those unfinished courses complete.
- Social Media Analytics activities, self-reviewed project, server-scored quiz, and persistent SAMPLE certificate. This remains a demonstration award, not a verified qualification. Written work is self-reviewed, not tutor-marked. Lesson and quiz content is available in the client, so this is not a secure examination platform.
- Account progress is restored in another browser session using the same local server. Approvals, timestamps, answer checks, completion eligibility and sample award identifiers are controlled on the backend. Conflicting changes in two windows stop saving with a clear reload message rather than silently overwriting newer work.
- Visitor enquiries without registration; student conversations; staff replies, private notes, assignment and open/resolved status. Visitor emails are unverified and are never automatically linked to a student merely because the email matches.
- Email previews in the staff dashboard. **No email is sent.** Replies sent from an external email inbox are not imported. These local previews will not be automatically delivered later.

## Storage, backups and access

Records are in `data/campus.sqlite`. Staff authenticator secrets are encrypted using `data/encryption.key`; losing that key prevents staff sign-in. Passwords use salted scrypt hashes. Sessions are stored server-side; the browser gets an HttpOnly, SameSite cookie, not a database password or role assignment. Sessions expire after eight hours. Staff suspension immediately invalidates student sessions. Students cannot grant themselves staff access or approve their own enrolments.

`npm run backup` takes a SQLite backup while the server is running and copies its matching authenticator encryption key alongside it. Store both files securely. `BACKUP_DIR` selects an external backup directory when hosted. To restore, stop the server, preserve the current data directory, and restore the matched files as `campus.sqlite` and `encryption.key` into a fresh data directory. Restart with that directory selected through `DATA_DIR`. Backup access and retention are the operator's responsibility. This package has not implemented scheduled or off-device backups.

Account deletion removes the account, enrolments, progress, linked enquiries and email previews. Historical audit entries retain opaque record identifiers. Backups and unlinked guest enquiries require separate review; deletion is not a claim of complete legal erasure across all retained copies.

## Before hosting or accepting real students

This local review is not a production or GDPR-compliance sign-off. The following are deliberate next steps:

- Choose the hosted database and authentication service (the proposed path is Supabase), design and test the migration and permissions there.
- Validate the IIS HTTPS deployment and its cookie/origin/proxy settings using IIS-HOSTING.md; the backend deliberately remains bound to loopback behind IIS.
- Connect transactional email and add verified-email registration, password recovery and a documented staff MFA recovery process. These flows are not implemented in this local build.
- Agree the privacy notice, lawful processing purposes, retention periods and staff responsibilities. This first registration collects only a name, email and password, not DOB or education history.
- Set up and test scheduled backups, restore procedures, monitoring and production abuse controls. The included per-process rate limits are intended for a single local instance.
- Review the inherited learning demonstrator's inline event handlers before applying a stricter production Content Security Policy.
- Review the sandbox integration in STRIPE-TESTING.md before planning live Stripe deployment. Real payments remain disabled.

## Tests

Run `npm test` for the backend integration suite. It creates and removes its own temporary database. It covers account permissions, staff MFA, duplicate enrolments, approvals, quiz checks, progress conflicts, private notes, cross-student isolation, persistence across restart, exports, suspension, deletion and server-file isolation.

`test/browser.mjs` is the browser regression used during development. It requires Playwright and Edge; its runtime lookup is specific to the development machine. The application itself has no such dependency.
