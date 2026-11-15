# Hourly certificate integration

This build integrates all nine hourly certificates into the supplied Liberland Digital Campus MVP.

## Open and demonstrate

Open `index.html`. On the home page select **Hourly certificates → Explore**, or go to **Study → Hourly certificates**. Open **View programme**, then **Preview learning experience**. The lesson and student workspace remain inside the same campus page.

Each certificate has its own prospectus, prerequisites, outcomes, timed modules, practical activities, project, proposed assessment, downloadable sample CSV and interactive lesson. Excel is 16 hours; the remaining programmes are 24, 24, 24, 24, 24, 40, 50 and 60 hours respectively. The six pre-existing longer programmes remain available under Study.

The learning sequence is Learn → Worked Example → Try It → Check → Continue. Each incorrect choice has explanatory feedback. A correct answer unlocks Continue. The student workspace shows the sample status for the selected programme. Sample progress is held in memory while the page remains open and resets on reload; it is not verified programme completion.

## Source and design

Source: the user-supplied `D:/Repos/Uni-LiberLand.zip`, specifically its `liberland_mvp` directory. The original approved reference was found at `courses demos/demo-excel.html`. Its paper/graphite palette, serif hierarchy, side navigation, split hero, hours column and dark learning area are preserved through scoped styling. The approved 12-month Excel planning project and function coverage are restored. The original reference file remains unchanged.

This is a local integrated build. The GitHub repository and original ZIP have not been modified or published.

## Changed and added files

- `index.html`: loads certificate content, styles and behaviour before the campus application.
- `script.js`: adds the nine courses, certificate filter, home entry, programme/lesson/workspace routes and hourly-certificate admissions handling. The existing admissions selector retains only the programmes with an established demo fee.
- `certificate-data.js`: course-specific content, hour allocations, project rubrics and sample lesson data.
- `certificates.js`: prospectus, lesson flow, sample workspace, catalogue cards and admissions information.
- `certificates.css`: scoped reference styling with light/dark and responsive adaptations.
- `certificate-data/`: nine fictional sample CSV files.
- `CERTIFICATE_QA.txt`: verification results.

No separate website, iframe or standalone certificate page is needed for the integrated journey. It works from a local file without a server.

## Remaining production work

There is one working sample lesson per certificate, not a complete teaching library. Full project datasets, remaining lessons, marking guides, academic approval, fees, enrolment, tutor arrangements and actual award issuance remain to be developed. Assessment thresholds are proposals. Hourly certificate admissions show this status instead of entering a payment flow with an undefined fee. Existing campus application functionality remains a demonstration.
