# Validation — 7 October 2026

Source: the user-supplied liberland_mvp.zip. This is a full website package, not a homepage-only patch.

Passed in Microsoft Edge:
- Homepage at 390, 768 and 1440 pixels, in light and dark themes; no horizontal overflow.
- Five genuine full-resolution homepage images decode successfully.
- Exactly two active stylesheets on home; section styles load when needed and disable on return.
- Nineteen campus routes render without JavaScript errors or failed requests.
- Every local image reference in the five maintained stylesheets resolves to an existing file.
- Complete Social Media Analytics enrolment, 12 lessons, incorrect/correct answers, saved progress, activities, project submission, failed/passed final quiz, certificate gating, PDF and badge export.
- Existing programme catalogue and Excel learning checks in the course regression suite.

Visual review: desktop light homepage and mobile dark homepage.

Live read-only checks: the production card-degree-programmes.webp endpoint returned 404, while card-degree-programmes.jpg returned 200 with image/jpeg. The uploaded ZIP contains the WebP file, but the live deployment's file inventory and IIS logs were not accessible. No claim is made that the live 404 is already fixed.

Deployment: upload all files in liberland_mvp, including web.config and the images folder. Preserve any additional live server configuration when merging web.config. Check the direct WebP endpoint after deployment. The homepage uses real PNG files and the Atlas/research backgrounds use existing JPEG files, so those images do not depend on WebP support.

Some older CSS files remain because separate demonstration HTML pages still reference them. They are not loaded by index.html. Shared compatibility styles for other campus pages are retained in campus.css; this cleanup does not claim that every legacy selector is unused or removable.
