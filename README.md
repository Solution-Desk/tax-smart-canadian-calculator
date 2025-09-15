# Canada Tax Smart Calc (Vite + React)

Free, shareable Canada sales‑tax calculator (GST/HST/PST/QST) with per‑province category rules.

## Local dev
```bash
npm i
npm run dev
```

## Build
```bash
npm run build
```

## Deploy to GitHub Pages
This repo is preconfigured for Pages via GitHub Actions.

- Ensure the `base` in `vite.config.ts` matches the repo name (already set to `/canada-tax-smart-calc/`).
- Push to `main`. The workflow at `.github/workflows/deploy.yml` will publish the site.

After the action finishes, your app will be live at:

https://solutionsrme.github.io/canada-tax-smart-calc/

## Notes
- **Share link** copies a URL that encodes the current province + line items (in the hash).
- **Share calculator** copies the base app link.
- Excise duties/markups and deposits/levies are not included in tax totals.
