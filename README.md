# Canada Tax Smart Calc

Canada Tax Smart Calc is a modern web app that helps Canadians—and the people who invoice them—combine GST, HST, PST, and Quebec QST in a single, shareable workspace.

## Quick links
- **Live calculator:** https://solutionsrme.github.io/canada-tax-smart-calc/
- **Product background:** [`ABOUT.md`](ABOUT.md)
- **Changelog:** [`CHANGELOG.md`](CHANGELOG.md)
- **Support:** [`SUPPORT.md`](SUPPORT.md)
- **Security policy:** [`SECURITY.md`](SECURITY.md)

## Product at a glance
- **All provinces covered** – swap between AB and YT to see the right GST/HST/PST/QST mix instantly.
- **Category intelligence** – restaurant meals, children's goods, books, and more follow CRA and provincial rebates.
- **Dark-first interface** – sleek default theme with a one-click light mode for print-friendly moments.
- **Clipboard superpowers** – copy totals or share a calculator snapshot without leaving the page.
- **Reference-ready** – built-in links to CRA and provincial bulletins for quick fact checks.

## Why teams use it
- **Retail and hospitality** – quote accurate taxes for bundled goods or meals across provinces.
- **Accounting and bookkeeping** – review exemptions with clients via shareable URLs instead of PDFs.
- **E-commerce** – sanity-check storefront tax rules before rollout.

## Experience walkthrough
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

## Community & governance
- Follow the contribution process outlined in [`CONTRIBUTING.md`](CONTRIBUTING.md).
- We enforce the [Code of Conduct](CODE_OF_CONDUCT.md) and will moderate issues, PRs, and discussions accordingly.
- Questions? Start a topic in [GitHub Discussions](https://github.com/solutionsrme/canada-tax-smart-calc/discussions) or review [`SUPPORT.md`](SUPPORT.md).
- Vulnerability to report? See [`SECURITY.md`](SECURITY.md) for responsible disclosure guidelines.
- Release history and planned notes live in [`CHANGELOG.md`](CHANGELOG.md).

## For developers
Want to extend or self-host the calculator? Follow these steps:

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

### Contribution checklist
- Fork the repo and create a feature branch.
- Keep business logic inside `src/lib`, UI inside `src/components`, and shared concerns as hooks.
- Cite CRA or provincial sources in PRs when you update tax rules.
- Run `npm run build` before opening a pull request and fill in the PR template.

## Deployment
GitHub Actions builds and deploys to GitHub Pages whenever `main` is updated.

1. Update `vite.config.ts` `base` if the repository name changes.
2. The workflow (`.github/workflows/deploy.yml`) runs `npm ci`, `npm run build`, and uploads `dist/`.
3. GitHub Pages serves the app at `https://<your-user>.github.io/<repo-name>/`.

Other static hosts (Netlify, Vercel, Cloudflare Pages, etc.) can deploy the `dist/` directory without extra configuration.

## License
MIT License – full text in [`LICENSE`](LICENSE).

