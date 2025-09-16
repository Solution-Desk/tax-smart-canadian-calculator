# Canada Tax Smart Calc

A modern, open‑source Canadian sales‑tax calculator for GST, HST, PST, and Quebec QST — built with Vite + TypeScript. Calculate, explain, and share results fast.

**Live app:** https://solutionsrme.github.io/canada-tax-smart-calc/

## Free vs. Pro

| Feature | Free | Pro |
|---------|------|-----|
| **Line items** | Up to 5 | Unlimited |
| **Provinces** | Single province | Multi-province comparison |
| **Export** | Copy to clipboard | CSV/PDF export |
| **Share links** | Public (24h expiry) | Private with revoke |
| **Save calculations** | ❌ | ✅ Saved templates |
| **Client workspaces** | ❌ | ✅ Per-client organization |
| **Support** | Community | Priority email |
| **Price** | Free | $9/month |

This repository contains the free, open‑source calculator. A hosted Pro experience (open‑core model) is planned.

⚠️ **Until Pro ships, all logic runs client‑side and no accounts or payments are required.**

## Features

- **All provinces/territories** — correct GST/HST/PST/QST mixes per region
- **Category intelligence** — common exemptions/rebates (books, children's goods, restaurant meals, etc.)
- **Dark‑first UI** with one‑click light mode (nice for printing)
- **Share & copy** — snapshot a calculation or copy totals quickly
- **Reference links** — jump to CRA/provincial bulletins used for rules

## Quick start (local)

```bash
# 1) Install dependencies
npm install

# 2) Run the dev server
npm run dev
# Visit http://localhost:5173

# 3) Production build
npm run build
# Preview the static output
npm run preview
```

## Local development (for contributors)

**Self‑hosting a production service is not supported.** This repo contains the free, open‑source calculator intended for local use and contributions. For a managed experience and Pro features, use the hosted app.

- **Preview locally:** `npm run build && npm run preview`
- **Static hosts for previews:** Any static host works if you want to share a test build with teammates.

## Hosting model

- **Live demo (Free):** Hosted on GitHub Pages (static). This is the public link shown in the repo.
- **Pro (paid):** Hosted separately where serverless/backend is available (e.g., Vercel, Cloudflare Pages + Workers, Netlify). The SPA calls `api.*` endpoints for auth, billing webhooks, and entitlements.

You can keep GitHub Pages for the free demo while the Pro app runs elsewhere. The free app can call external APIs via `VITE_API_BASE_URL`.

## How it works

- **Tax data & metadata:** `src/lib/taxData.ts`
- **Computation engine:** `src/lib/taxCalculator.ts` (e.g., `calculateTotals`)
- **Share‑link helpers:** `src/lib/share.ts`
- **Dark‑mode state:** `src/hooks/useDarkMode.ts`
- **Main UI:** `src/components/TaxSmartCalculator/`

## Notes on sharing

Share‑links may include calculation details in the URL. If you need privacy‑preserving sharing, wait for the Pro/tokenized links or self‑host behind your own short‑link service.

## Accuracy, data sources & limits

- Rates/rules are implemented to the best of our knowledge and linked to CRA/provincial references.
- **Not legal/tax advice.** Validate for your use case and keep rules up to date for your deployment.

## Testing

We're building out a Vitest suite with golden cases per province and category. Contributions welcome — see Contributing.

## Roadmap

- **Pro:** multi‑province comparison, CSV/PDF export, saved templates, private share links
- **Pro:** per‑user workspaces and entitlement checks  
- **Data:** effective‑date ranges for rules + changelog PR bot
- **Accessibility:** keyboard table navigation and WCAG 2.1 AA audits

## Contributing

PRs are welcome.

- Keep business logic in `src/lib`, UI in `src/components`, shared concerns as hooks.
- Include links to CRA/provincial sources when changing tax rules.
- Run `npm run build` before opening a PR and fill in the PR template.
- Be kind — we follow the Code of Conduct.

See: [`CONTRIBUTING.md`](CONTRIBUTING.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md).

## Security & privacy

- **Static SPA:** no server, no accounts, no telemetry by default
- If you discover a vulnerability, please follow [`SECURITY.md`](SECURITY.md) for responsible disclosure

## License

MIT — see [`LICENSE`](LICENSE).

## Acknowledgements

Thanks to Canadian merchants, accountants, and developers who contributed test cases and references. ❤️
