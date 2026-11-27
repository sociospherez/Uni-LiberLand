# Integrated course enrolment review

Open http://127.0.0.1:3000/index.html using the running Node backend.
Choose a certificate prospectus and select Enrol on this course. Your course follows you through student registration or sign-in. Continue to test payment, then Start learning after verified confirmation. Existing active enrolments open learning; paused enrolments need staff review. My learning shows saved progress.

Start with Social Media Analytics: 12 lessons, activities, self-reviewed project, quiz and sample certificate. The other courses retain their existing sample content; this update does not turn those samples into complete courses. All certificate documents remain samples, not valid qualifications.

The 29 approved professional certificate tuition fees are defined in public/professional-certificates.js and used by both the catalogue and the server. Stripe is test-only. Start the Stripe listener and backend following STRIPE-TESTING.md. If checkout is unavailable, the selected-course page offers a staff approval request.

## Validation
API and payment safeguard tests passed. Browser walkthrough passed all 12 Social Media lessons, assessment, sample award, separate-browser persistence, staff controls and mobile layout. Integrated checkout browser test passed guest redirect, retained selection, unpaid access denial, verified fulfilment, duplicate-purchase prevention and invalid-course handling. Stripe responses were simulated for this update; the earlier real sandbox payment was not repeated.

## Updating an existing installation
Keep data/, .env and backups/. Replace application code only. Do not extract this release over private files from another installation. The archive deliberately excludes accounts, database files, credentials, dependencies and backups. For a new installation run npm ci, then Start-local.cmd. A fresh database needs first staff setup.

This is a local integration. Hosting, real email, live payments, degree applications and production certificate issuance are not included.
