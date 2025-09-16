# Canada Tax Smart Calc

Free, shareable GST / HST / PST / QST calculator with province-specific category rules and deep-linking.

## Use the calculator
- Live app: https://solutionsrme.github.io/canada-tax-smart-calc/
- Share snapshots directly from the interface or copy totals as plain text.

## About the project
Canada Tax Smart Calc brings federal and provincial sales-tax rules into one modern interface. The goal is to make quoting and invoicing faster for Canadian teams by:
- Combining GST, HST, PST, and Quebec QST into a single calculation flow.
- Encoding popular rebates and exemptions per province and per category.
- Providing dark-first design for long working sessions, while keeping accessibility in mind.

Product background, roadmap ideas, and guiding principles are captured in [`ABOUT.md`](ABOUT.md).

## Highlights
- Real-time totals with granular federal and provincial breakdowns.
- Category overrides matching CRA and provincial guidance.
- Shareable state so teams can collaborate on quotes.
- Dark mode by default with a global light toggle.
- Vite build ready for GitHub Pages or any static host.

## Project layout
```
├── src
│   ├── components/TaxSmartCalculator   feature component and styles
│   ├── hooks/useDarkMode.ts            global theme management
│   └── lib                             tax data, calculations, share helpers
├── public                              static assets
├── index.html                          root HTML shell with metadata
├── package.json
└── README.md
```

## Getting started
```bash
npm install
npm run dev
```
Open `http://localhost:5173` to see the calculator (dark theme loads by default).

### Production build
```bash
npm run build
```
Outputs land in `dist/`. Run `npm run preview` to inspect the static build locally.

## Working on the project
1. Fork and clone the repository.
2. Install dependencies with `npm install`.
3. Use `npm run dev` for the development server; `npm run build` verifies production output.
4. Keep shared logic in `src/lib`, hooks in `src/hooks`, and UI inside `src/components`.
5. Reference official CRA or provincial documentation when adjusting rates or category rules.

Additional collaboration guidelines live in [`CONTRIBUTING.md`](CONTRIBUTING.md) and the community expectations are described in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Deployment notes
GitHub Actions builds and deploys to GitHub Pages automatically when you push to `main`.
1. If the repo name changes, update the `base` option in `vite.config.ts`.
2. The workflow located at `.github/workflows/deploy.yml` runs `npm ci`, `npm run build`, and publishes `dist/`.
3. GitHub Pages serves the site at `https://<your-user>.github.io/<repo-name>/`.

Other static hosts (Netlify, Vercel, Cloudflare Pages, etc.) simply need the Vite build output.

## License
Released under the MIT License. See [`LICENSE`](LICENSE).
