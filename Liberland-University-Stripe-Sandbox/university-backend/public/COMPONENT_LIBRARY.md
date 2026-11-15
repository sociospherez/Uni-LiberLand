# Liberland Digital Design System (LDDS)

This folder contains the reusable front-end component layer for the Liberland Digital Campus.

## Files

- `styles.css` — existing application styles and page-specific layouts.
- `components.css` — reusable tokens, primitives and component variants.
- `design-system.html` — visual component catalogue for product/design review.
- `index.html` — runnable EP1 demonstration.

## Core component classes

### Buttons
- `.btn`
- `.btn-primary`
- `.btn-secondary`
- `.btn-ghost`
- `.btn-sm`
- `.btn-icon`

### Cards
- `.ui-card`
- `.ui-card--accent`
- `.ui-card--research`
- `.ui-card--success`
- `.ui-card__icon`
- `.ui-card__footer`

### Status and progress
- `.badge` with colour variants
- `.ui-progress`
- `.alert`
- `.stat-card`

### Signature experience
- `.hero-shell`
- `.journey-timeline`
- `.journey-node`
- `.ai-panel`

### Layout primitives
- `.stack`
- `.stack-sm`
- `.cluster`
- `.surface`
- `.surface-soft`
- `.surface-blue`

## Rules

1. A screen should have one visually dominant primary action.
2. Use blue for action and orientation, green for successful completion, and gold sparingly for distinction.
3. Prefer white space and progressive disclosure over dense dashboards.
4. Motion should explain hierarchy or state; it should not compete with the task.
5. Components must remain usable with reduced-motion settings and keyboard navigation.


## LDDS 2.0 theme tokens

Load `theme-v2.css` after `components.css`. New components must use semantic tokens such as `--surface`, `--text`, `--border`, `--accent`, and `--surface-blue` instead of fixed neutral colours.
