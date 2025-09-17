# Canada Tax Smart Calculator

A modern, responsive Canadian tax calculator that helps you calculate GST/HST/PST/QST with per-province overrides.

## Features

- Calculate Canadian sales taxes (GST/HST/PST/QST)
- Province-specific tax rates
- Shareable calculation links
- Responsive design

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Solution-Desk/tax-smart-canadian-calculator.git
   cd tax-smart-canadian-calculator
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Development

Start the development server:

```bash
npm run dev
```

### Building for Production

Build the project:

```bash
npm run build
```

### Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```


## Live URL

Recommended: Host at [taxapp.thesolutiondesk.ca](https://taxapp.thesolutiondesk.ca) (subdomain of your site).

If you prefer GitHub's default domain instead, you can use:
[GitHub Pages](https://solutionsrme.github.io/canada-tax-smart-calc/)

## Product Overview

### Free Categories (Always Available)

- Standard
- Zero-rated (basic groceries)
- Children's clothing & footwear
- Children's diapers
- Children's car seats & booster seats
- Feminine hygiene products
- Prescription drugs / medical
- Public transit fares
- Printed books (qualifying) & Newspapers (qualifying)
- Exempt / GST only / Provincial only (overrides)

### Premium (Gated Categories)

- Prepared food / restaurant
- Snack foods / candy
- Sweetened carbonated beverages
- Cannabis (non-medical)
- Tobacco / alcohol

### Free Features

- Unlimited calculations (no account)
- Share link (encodes line items)
- Copy totals
- One local preset (browser)
- Dark mode
- Transparent **References** list

### Pro Features (Suggested)

- PDF & CSV export
- Unlimited presets & per-client projects
- Batch import (CSV)
- Multi-currency display
- "Audit footnotes" (which rule triggered)

> **Scope:** This app models GST/HST/PST/QST at checkout. Excise duties/markups (alcohol, tobacco, cannabis) and deposits/levies are **not** included.

---

## Pricing (recommended)

- **Pro: CAD $14.99/year** (headline) or **$2.49/month**
- Optional **Supporter: CAD $19.99/year** (same features; helps fund free access)
- Essentials remain free for everyone

You can adjust these copy/values in the paywall later.

---

## Tech stack

- Vite + React (TypeScript)
- Lightweight CSS (`src/index.css`)
- Pure static build → GitHub Pages (or any static host)

---

## Local Development

```bash
npm i
npm run dev
```

Open the URL Vite prints (e.g., `http://localhost:5173/`).

## Build

```bash
npm run build
```

Outputs static files to `dist/`.

## Deploy

### Option A — Custom Subdomain (Recommended)

Host at [taxapp.thesolutiondesk.ca](https://taxapp.thesolutiondesk.ca).

**DNS:** add a CNAME record at your DNS provider

- Name/Host: `taxapp`
- Target/Value: `solutionsrme.github.io`
- TTL: default/auto
- (Cloudflare: set to DNS only / grey cloud)

**Vite base path:** custom domain serves at the root → set base to `/`

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // custom domain -> root path
})
```

**Permanent CNAME file (recommended):**

Create `public/CNAME` containing:

```text
taxapp.thesolutiondesk.ca
```

Vite will include this in every build so Pages auto-detects the domain.

**GitHub Pages settings:**

- Repo → Settings → Pages → Custom domain: `taxapp.thesolutiondesk.ca`
- Check "Enforce HTTPS"

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
