# Contributing

Thank you for considering a contribution! This project thrives on accurate tax data and thoughtful UX.

## Development workflow
1. **Fork & clone** the repository.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Build before submitting: `npm run build`
5. Open a pull request describing:
   - The feature or fix.
   - Any new tax sources (include URLs).
   - Screenshots when UI changes are introduced.

## Coding guidelines
- TypeScript and React functional components only.
- Prefer extracting shared logic into `src/lib` or hooks.
- Keep CSS token-driven using the global variables in `src/index.css`.
- Target WCAG AA contrast ratios.

## Issue reporting
- Use the GitHub issue templates to flag bugs or propose enhancements.
- For tax rule corrections, please link to CRA or provincial resources confirming the change.

We appreciate every improvement and will respond promptly to questions.
