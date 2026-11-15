# Local release validation — 31 October 2026

Passed the Node backend integration suite and an Edge browser walkthrough.

Backend checks: staff setup and mandatory time-based authenticator codes; student registration cannot elevate role; unauthenticated and cross-student requests rejected; cross-origin writes rejected; approval required to access progress; duplicate enrolment requests remain one record; incorrect answers cannot complete a lesson; conflicting progress revisions rejected; course completion requires all Social Media Analytics requirements; award identity comes from the stored profile; sample award issuance is idempotent; staff-only notes omitted from student messages and exports; matching an unverified guest email does not grant account access; persistence across server restart; new session restores progress; logout and account suspension invalidate access; deletion confirmation enforced; server source files are not served; SQLite backup can be reopened and read.

Browser checks: first staff setup using an authenticator key; student registration; enrolment request and manual approval; all 12 Social Media Analytics lessons; assessment/project submission; server-scored final quiz; sample certificate; staff replies and private notes; restored progress in a separate browser context; desktop and 390px mobile screens without horizontal page overflow. No page JavaScript errors during the walkthrough.

Visual review: staff desktop dashboard and student mobile enquiry thread. Review screenshots in examples/backend-review use fictional people and are not preloaded records.

Stripe sandbox integration was subsequently added and verified; see STRIPE-TESTING.md for its separate test results. No production deployment, Supabase connection, email delivery, live payment processing or regulatory compliance certification has been performed. Tests use disposable local databases, except the explicitly labelled fictional Stripe sandbox review account. Live data, API keys, encryption keys, staff passwords, sessions and setup tokens are excluded from the downloadable package.
