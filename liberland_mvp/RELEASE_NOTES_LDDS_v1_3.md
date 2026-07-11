# Liberland Digital Campus — LDDS v1.3

## Day / Night Theme Release

This release adds a complete theme foundation across the runnable Digital Campus and the design-system catalogue.

### Included
- Day and night theme switcher in the main header
- Theme switcher in the mobile navigation
- Theme switcher in the LDDS component catalogue
- Automatic system preference detection on first visit
- User preference stored in local browser storage
- No page reload or journey reset when switching theme
- Flash-free theme initialisation before page rendering
- Accessible focus indicators and dark-mode contrast
- Theme-aware cards, forms, navigation, Atlas panels, journey progress, dashboards and footer
- Theme-aware motion and hover states

### Behaviour
- First visit: follows the operating-system light/dark preference
- Manual selection: remembered for future visits
- Button label shows the theme available to switch to (Night or Day)

### Files added or updated
- `theme.js` — shared theme controller
- `styles.css` — light/dark design tokens and component overrides
- `index.html` — primary theme controls and early theme initialisation
- `design-system.html` — theme preview support
