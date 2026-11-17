# Hosted sandbox sign-off: course, account, payment and learning

This release completes the certificate journey from a prospectus. It keeps a course selection through account creation/sign-in, routes signed-in students to checkout, and sends active enrolments to learning. Shared account menus show the signed-in name and role on the campus, account portal, checkout and payment confirmation. Learning pages use a focused header and an enrolment status strip.

All prices remain fictitious GBP 10. Live Stripe keys/events remain rejected. Email verification, password recovery and outgoing email are not connected. This is sandbox sign-off, not approval for production payments or academic delivery. Most courses have sample lessons only; the Social Media Analytics demonstrator includes activities and a sample award.

## Validation recorded for this release

| Check | Evidence | Status |
| --- | --- | --- |
| Accounts, staff MFA, student boundaries, enquiries, progress and persistence | `npm test` API integration suite | Pass |
| Explicit HTTPS origin, secure cookies, portal aliases, private files and matched database/key backups | Hosting integration suite | Pass |
| Fixed amount, student ownership, idempotent checkout, signed notifications, duplicate events, paused accounts and access after payment | Payment integration suite; Stripe API simulated | Pass |
| A failed payment stays failed after reconciliation and permits a new checkout without granting access | Payment regression test | Pass |
| Active, paused, unavailable, paid/pending and staff journeys; bounded local return paths | Journey decision tests | Pass |
| Course selection, account/sign-in screens and direct signed-in checkout | Local browser with disposable account and Stripe fixture | Pass |
| Leaving checkout keeps learning locked | Local browser | Pass |
| Verified fixture payment opens learning; sign-out/return retains a saved lesson step | Local browser | Pass |
| Staff identity, staff checkout guard, manual pause/restore and the paid student pause screen | Local browser with disposable staff/student accounts | Pass |
| Learning header at 320, 375, 780 and 936px in Light/Dark, account menu and role label | Local browser fixtures | Pass |
| Actual hosted Stripe checkout and 200 webhook deliveries | Confirmed by site owner before this release | Previously passed; repeat below after deployment |

No test runs against the owner's real student records. Local browser tests use disposable fixture accounts; they do not replace the hosted checks below.

## Run after activation

Use fictional student details and the same Stripe sandbox currently configured on the server. Keep staff and student sessions in separate browser profiles or private windows.

| ID | Action | Expected result | Hosted result |
| --- | --- | --- | --- |
| 1 | Browse a certificate, select **Enrol now**, switch between registration and sign-in | The course, sandbox price and next step remain visible | Pending |
| 2 | Create a new student account from that course | The correct course opens in Stripe test checkout; no staff MFA requested | Pending |
| 3 | Sign out; repeat with an existing student account | Sign-in retains the course and continues to its checkout | Pending |
| 4 | Leave checkout without paying; open My learning | No enrolment or learning access is granted; the open checkout can be resumed | Pending |
| 5 | Try Stripe's declined-card test details | Stripe shows a decline; the course remains locked; retry is available | Pending |
| 6 | Complete a successful Stripe sandbox payment | Payment is confirmed; the right course becomes available; the webhook destination records `checkout.session.completed` with HTTP 200 | Pending |
| 7 | Resend that completed event from Stripe | HTTP 200; exactly one enrolment/payment fulfilment remains | Pending |
| 8 | Revisit Enrol now and checkout for that paid, active course | The student returns to learning; no second charge or checkout is created | Pending |
| 9 | Start a lesson, advance a step, sign out and return | The student's name is shown; saved progress remains; **Continue learning** resumes it | Pending |
| 10 | Sign in as a different student and try the other student's payment reference or learning course | No access to another account's payment or saved learning | Pending |
| 11 | Staff approve a manual request, then pause an enrolment | Dashboard updates; paused learning is blocked and another payment does not restore it | Pending |
| 12 | Sign in as staff from a selected course | Staff dashboard/status is shown; student checkout requires a student account | Pending |
| 13 | On phone and desktop, test Light/Dark, account menu, Contact admissions and sign-out | Readable header; visible identity; keyboard/touch controls work; no horizontal overflow | Pending |

If a check fails, record its ID, course, time, expected/actual behaviour and a screenshot without credentials. For payment failures include the Stripe event ID and HTTP response, never API keys or signing secrets. Stop sign-off until failures are resolved.

## Sign-off record

- Source commit:
- Hosted release path:
- Test date:
- Tester:
- Failed checks / fixes:
- Decision: Pending hosted validation
