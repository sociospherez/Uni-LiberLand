# University of Liberland

The complete student/staff account application and Stripe **sandbox** integration
are in [Liberland-University-Integrated-Journey/university-backend](Liberland-University-Integrated-Journey/university-backend).
For the existing Windows/IIS website, see its [IIS hosting guide](Liberland-University-Integrated-Journey/university-backend/IIS-HOSTING.md).
The `liberland_mvp` folder and the older archives remain demonstration snapshots;
use the integrated journey source folder for the hosting changes on this branch.

## Earlier static demonstrator

[README.txt](https://github.com/user-attachments/files/29932473/README.txt)
LIBERLAND DIGITAL CAMPUS — EXPERIENCE PREVIEW EP1

RUNNING THE DEMO
1. Extract the ZIP archive.
2. Open the liberland_mvp folder.
3. Double-click index.html, or open it in Chrome or Microsoft Edge.

RECOMMENDED DEMONSTRATION ROUTE
Home → Explore Courses → View Programme → Start Application → Payment → Welcome → Student Hub

OPTIONAL ATLAS ROUTE
Home → Discover Your Path with Atlas → Personalised Path → Application

RESEARCH ROUTE
Use Research in the main navigation.

DEMO NOTES
- This is a front-end experience demonstrator.
- No real payment is processed.
- No uploaded document is transmitted.
- Form and journey state are stored locally in the browser using localStorage.
- To reset the demonstration, clear the browser's site data/localStorage for the file or use a private browser window.

LOGO
The current build uses a temporary letter crest. To use the official logo, add the image to an images folder and replace the crest span in index.html with an img element.
