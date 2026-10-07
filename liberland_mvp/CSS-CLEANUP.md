# Styles and asset cleanup

The uploaded ZIP is the source for this complete site.

- campus.css: shared foundations, theme, components and motion. Existing shared compatibility rules are retained for the campus pages.
- home.css: homepage layout and all homepage photography.
- study.css: catalogue, learning paths, lessons, assessment and certificate styles.
- admissions.css: application and student workspace refinements.
- research.css: research pages and their image treatment.

route-styles.js loads section files on demand and disables them when leaving the section. Home loads only campus.css and home.css. Edit these maintained CSS files directly; there are no CSS imports or hidden build dependencies. Retired stylesheets are removed where no other HTML entry point uses them.

Hero and four homepage cards use genuine PNG originals in images/homepage-v2. Atlas and research use existing JPG files. Image paths occur in one maintained section stylesheet. WebP originals remain available; web.config now registers image/webp for IIS without duplicating inherited mappings. Merge this configuration if your live server has additional rules. Upload the COMPLETE folder contents together, then check the direct WebP URL and clear any cached 404 response if necessary. Local tests cannot prove the live host has applied the mapping or deployed the files.

Removed mislabeled duplicates: images/production/atlas-journey.png, images/production/card-global-community.png. A filename extension change does not convert an image.

Removed the unused CSS building placeholder and card pseudo-illustrations. Retained intentional background grids, text readability overlays and reduced-motion support. The malformed first rule in the supplied journey stylesheet was repaired. Course content, enrolments, assessment rules and certificate generation remain unchanged.
