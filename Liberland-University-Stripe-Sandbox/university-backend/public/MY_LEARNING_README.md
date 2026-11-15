# My learning — demo enrolment and saved learning paths

Built from GitHub HEAD 26a69e2c9b0d6ada22918153a8f2f30d0765f4d8, verified against the clean local repository on 29 September 2026.

## Try the journey

1. Open index.html. Choose My learning to see the empty student area.
2. Explore Excel, choose Enrol in demo, and confirm. Tuition is assumed paid; no payment is taken.
3. Open the learning path and start lesson 1.1.
4. Follow Learn → Worked Example → Try It → Check → Continue.
5. Close and reopen the page, or reload during a lesson. The step and selected answer are restored.
6. Complete the first lesson and continue to the available lesson 2.2.
7. Enrol in another certificate. My learning shows both courses with independent progress.
8. Browse an unrelated programme and return to My learning; your enrolled courses remain unchanged.

## Included

- A single demo learner with explicit confirmation of simulated enrolment.
- All nine certificates support independent enrolment and their own learning path.
- Excel has two working lessons, in modules 01 and 02. Other certificates retain one sample lesson each.
- Module outlines clearly distinguish available lessons from future content.
- Selected answers, lesson steps and completion survive reload in the same browser.
- Repeat enrolment does not duplicate a course or erase its progress.
- Lesson completion does not imply completion of a whole module or programme.
- Project submission, portfolio and certificate states remain separate and explicitly pending.
- Light/dark themes and mobile layouts; no changes to the source archive or live GitHub repository.

## Storage and boundaries

Learning data is stored under ldc-learning-v1 in browser localStorage, separate from the existing ldc-state navigation/application record. Each enrolment has its own active lesson and per-lesson progress. There is no backend, authentication or cross-device synchronisation. Data is local to the browser/origin (local-file behaviour can vary between browsers). Clearing browser data removes progress. If storage is blocked or full, the interface warns that only the current visit is retained.

No real tuition payment, university enrolment, project upload, tutor assessment or certificate issuance is implemented. There are no fabricated course-completion percentages. Available lesson counts are explicitly partial. Existing no-enrolment sample previews still work and do not write into enrolled progress.

## Files for integration

New: my-learning.js, my-learning.css, MY_LEARNING_README.md and MY_LEARNING_QA.txt.
Updated: index.html, script.js and certificates.js.
The complete ZIP contains the full liberland_mvp directory; use its index.html as the entry point. Existing assets, content and reference files are retained.

The earlier CERTIFICATE_INTEGRATION.md describes the previous release. This document supersedes its statements about enrolment and in-memory-only progress for enrolled lessons.
