# Social Media Analytics — complete self-paced demo journey

30 September 2026. Based on the user's clean GitHub/local revision 7d7b1fe5d452c74ef0be9d45de77e10528b4c661. Includes the preceding homepage images, all nine course prospectuses, catalogue, demo enrolment and My learning.

## Start here

Open index.html. Select Study → Hourly certificates → Social Media Analytics → View programme → Enrol in demo → Confirm → Open my learning path.

The completed journey is enrolment → 12 short lessons across six modules → six practical responses → campaign decision plan → final quiz → personalised sample certificate and badge.

Each lesson follows Learn → Worked Example → Try It → Check → Continue. Learners can revisit content and work at their own pace. “24 hours” is an indicative estimate covering practice and reflection, not a deadline, attendance requirement or timer. The core text lessons are deliberately concise, with optional deeper practice.

## Completion rules

- Complete the checks in all 12 lessons.
- Save all six activity responses, each at least 40 characters.
- Submit the four-part campaign plan and complete three self-review checks.
- Score at least five of six on the final quiz; retries are allowed and the best result is retained.
- Enter a display name to issue the sample award.

Written work is self-reviewed. Length checks establish that a draft was supplied; they do not assess its academic quality. There is no tutor marking or AI marking. A learner can compare activities with worked guidance. The final quiz is automatically scored.

## Awards

The certificate has an ivory/graphite/gold design based on the approved concept, a proposed L monogram, the learner name, course, indicative study effort, issue date and a persistent random local certificate ID. Signatures are not invented. Every export says SAMPLE — NOT VALID.

Download PDF generates a real one-page landscape A4 PDF in the browser using the bundled pdf-lib library. Its licence is included in vendor/. Print / Save as PDF provides a separate printable page. The downloadable badge is a crisp SVG graphic, not a verified Open Badge credential. No QR verification or public credential registry is claimed.

examples/ contains a sample certificate and badge using fictional learner details. They are examples, not evidence of a live award.

## Saved state and integration

The existing ldc-learning-v1 record still owns enrolments and per-lesson progress. ldc-social-journey-v1 saves activities, project draft and self-review, quiz answers, best attempt and certificate details. Browser storage is local, not a server or cross-device account. Clearing browser data removes it. Keep the website at the same origin/path when updating if you want to retain local progress; file:// storage behaviour varies by browser.

Existing Social Media Analytics sample completion migrates to the equivalent lesson 3.1. Other courses retain their previous sample content (Excel: two lessons; the remaining seven: one each). The Social Media Analytics course alone has the complete lesson-to-award journey in this release.

New files: social-course-content.js, social-journey.js, social-course.css, certificate-data/social-media-campaign.csv and vendor/pdf-lib.min.js with licence.
Updated: index.html, script.js, my-learning.js and certificates.js. Prior designs, assets and other course content remain included.

This full ZIP is a local release of the liberland_mvp folder. It has not been pushed to GitHub. Academic approval, authentication, server-side assessment enforcement, real payment, tutor review, credential verification and live award issuance remain production work.

## Review evidence

See SOCIAL_COURSE_QA.txt. The journey was exercised through the UI, including incorrect answers, a failed final quiz, a five-of-six pass, missing-project lockout, reloading saved responses, certificate persistence and PDF/badge downloads. Light/dark themes and mobile/tablet/desktop widths were checked. PDF output was rendered and visually inspected; print export is one A4 landscape page and a non-Latin learner-name case was checked.
