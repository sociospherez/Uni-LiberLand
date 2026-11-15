# Stripe sandbox integration

This release adds Stripe Embedded Checkout to the Node.js student backend. All courses use a **fictitious £10 GBP test price** controlled on the server. Live API keys and live webhook events are rejected. PayPal is not enabled; checkout is restricted to eligible card payment methods.

## Start on another computer

1. Install Node.js 24 or later. Run `npm ci` in this folder to install the pinned official Stripe SDK.
2. Copy `.env.example` to `.env`. Fill in the publishable and secret API keys from the same Stripe sandbox. Never put the secret key in frontend files, screenshots, Git or chat.
3. Install the Stripe CLI if needed: `npm install -g @stripe/cli`.
4. In one terminal, run `npm run stripe:listen`. This uses the secret key through the child process environment, saves the webhook signing secret in `.env`, and forwards the relevant sandbox Checkout events to `/api/stripe/webhook`. It does not print the keys. Keep this terminal running.
5. After it reports that the signing secret is saved, start the application in a second terminal with `npm start`. If it was already running, restart it to load the signing secret.
6. Open http://127.0.0.1:3000/portal.html. Sign in as a **student** and use **Try a test payment**. Choose a course you are not already enrolled in or paused from. Staff accounts manage payment records; they do not buy courses.

The current local workspace has already been configured. Its `.env`, database and account credentials are intentionally not included in the ZIP. If the processes stop, restart the listener before the backend as above. A custom `PORT` environment variable must match in both terminals.

## Test checkout

- Successful card: `4242 4242 4242 4242`.
- Expiry: a future date, such as `12/34`.
- CVC: any three digits, such as `123`.
- Use fictional name and contact details.

These are Stripe's published sandbox values: https://docs.stripe.com/testing

After success, the return page checks the recorded payment. Signed Stripe notifications activate the enrolment automatically. The return page also offers server-to-server verification as a recovery path if a notification is delayed; it does not trust URL parameters or a browser-provided payment status.

Returning without paying does not unlock a course. Reopening an unpaid checkout resumes the same session. A pending payment must finish before another session can be created. Expired or definitively failed attempts may be replaced. Ambiguous network failures retain the same idempotency key rather than risking another charge.

## Records and safeguards

- Orders link the signed-in student and course to the Stripe Checkout session. Price, currency, quantity and identifiers are set on the backend.
- Webhooks use the raw request body and Stripe's signature verification. Events are recorded transactionally and repeat deliveries do not duplicate enrolments.
- The backend checks the session's sandbox flag, paid status, amount, currency and saved order identifiers before fulfilment.
- Students can view or reconcile only their own payment records. Staff can view the test-payment list in their dashboard.
- Staff-paused enrolments and suspended accounts are not silently reactivated by delayed payment events. Paid orders needing review are flagged for staff.
- Card numbers and CVCs are entered in Stripe's iframe, not in our API or database. We store order/session/payment references, amounts and statuses.
- Existing manual enrolment remains a separate review path; it does not mark an order paid.
- Deleting a local account unlinks the local payment records and removes its email from the stored checkout request. It does not delete Stripe's sandbox records. A live retention/deletion policy is a separate task.

## Verified on 31 October 2026

- Both API keys successfully opened the embedded Stripe checkout.
- A real **sandbox** £10 test-card payment completed for a fictional student.
- Stripe CLI delivered `checkout.session.completed`; the endpoint returned 200.
- The local course enrolment became active.
- Automated tests cover duplicate checkout requests, repeated/stale notifications, unverified signatures, mismatched amounts, live-event rejection, ownership checks, unpaid sessions, expiry, paused access and server-side reconciliation.

The test suite uses a simulated Stripe client for deterministic failure cases. The real sandbox check separately validated one successful payment; live banking, refunds, disputes, delayed payment methods and 3-D Secure challenge flows have not been validated here. Refund/revocation automation is not implemented. This remains a local review, not a production deployment.

References: https://docs.stripe.com/api/checkout/sessions/create and https://docs.stripe.com/webhooks
