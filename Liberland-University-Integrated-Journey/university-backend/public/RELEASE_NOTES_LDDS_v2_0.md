# Liberland Digital Design System v2.0

## Theme engine upgrade

- Introduces a semantic colour-token layer in `theme-v2.css`.
- Removes fixed white surfaces from reusable homepage, catalogue, programme and Atlas components.
- Corrects dark-mode coverage for statistics cards, Atlas guidance panels, catalogue filters and programme content.
- Adds consistent surface, text, border, status, progress, elevation and focus tokens.
- Preserves the existing day-mode visual direction.
- Retains automatic system preference, saved theme selection and instant switching.
- Adds cache-busting stylesheet references for cleaner test-server deployment.

## Testing

Open `liberland_mvp/index.html`, switch to Night, and review Home, Courses, Programme Detail and Atlas.
A hard refresh may be required once after replacing the previous server files.
