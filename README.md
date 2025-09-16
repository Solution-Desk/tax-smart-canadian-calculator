# Canada Tax Smart Calc

Canada Tax Smart Calc is a modern web app that helps Canadians (and the people who invoice them) combine GST, HST, PST, and Quebec QST in a single, shareable workspace.

## Try it now
- **Live calculator:** https://solutionsrme.github.io/canada-tax-smart-calc/
- **Snapshot sharing:** use the “Share snapshot” button inside the app to generate a link that encodes the current province, categories, and amounts.

## Product at a glance
- **All provinces covered** - switch between AB and YT and instantly see the right GST/HST/PST/QST mix.
- **Category intelligence** - restaurant meals, children's goods, books, and more follow CRA and provincial rebates.
- **Dark-first interface** - sleek default theme with one-tap light mode for print-friendly moments.
- **Clipboard superpowers** - copy totals or share the base calculator link without leaving the page.
- **Reference-ready** - built-in links to CRA and provincial bulletins for quick fact checks.

![Screenshot of Canada Tax Smart Calc](docs/screenshot-placeholder.png)

## Why teams use it
- **Retail and hospitality** - quote accurate taxes for bundled goods or meals across provinces.
- **Accounting and bookkeeping** - review exemptions with clients via shareable URLs instead of PDFs.
- **E-commerce** - sanity-check storefront tax rules before rollout.

## What's on the screen
1. **Province selector** with real-time rate tiles (federal vs. provincial blend).
2. **Line item grid** to capture label, category, and amount for each entry.
3. **Totals dashboard** with GST/HST/PST/QST breakdown, total tax, and grand total.
4. **Action tray** housing “Calculate tax,” “Copy totals,” and sharing shortcuts.
5. **Reference drawer** linking to CRA and provincial documents used for the rules.

## Under the hood
- Province metadata and rates live in [`src/lib/taxData.ts`](src/lib/taxData.ts).
- Calculation engine (`calculateTotals`) is in [`src/lib/taxCalculator.ts`](src/lib/taxCalculator.ts).
- Share-link encode/decode helpers sit in [`src/lib/share.ts`](src/lib/share.ts).
- Dark-mode state and DOM integration are handled by [`src/hooks/useDarkMode.ts`](src/hooks/useDarkMode.ts).
- The main experience is composed in [`src/components/TaxSmartCalculator`](src/components/TaxSmartCalculator).

More product background, roadmap ideas, and principles: see [`ABOUT.md`](ABOUT.md).

## For developers
Want to extend or self-host the calculator? Follow these steps.

```bash
npm install
npm run dev
```
Visit `http://localhost:5173` in your browser. The local build mirrors production, including dark mode.

### Production build
```bash
npm run build
```
Artifacts land in `dist/`. Use `npm run preview` to sanity-check the static output.

### Contribution guide
- Fork the repo and create a feature branch.
- Keep business logic inside `src/lib`, UI inside `src/components`, and shared concerns as hooks.
- When updating tax rules, cite CRA or provincial sources in your PR.
- Run `npm run build` before opening a pull request.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for more process details and [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) for community standards.

## Deployment
GitHub Actions builds and deploys to GitHub Pages whenever `main` is updated.

1. Update `vite.config.ts` `base` if the repository name changes.
2. The workflow (`.github/workflows/deploy.yml`) runs `npm ci`, `npm run build`, and uploads `dist/`.
3. GitHub Pages serves the app at `https://<your-user>.github.io/<repo-name>/`.

Other static hosts (Netlify, Vercel, Cloudflare Pages, etc.) can deploy the `dist/` directory without extra configuration.

## License
MIT License - full text in [`LICENSE`](LICENSE).
