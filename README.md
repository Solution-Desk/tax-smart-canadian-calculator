<div align="center">
TaxSmart

Canadian Sales-Tax Calculator (GST / HST / PST / QST)

Live app
 • Issues
 • Discussions

</div> <div align="center"> <img src="assets/app-image.jpg" alt="TaxSmart app showing province selector, line items, and GST/HST/PST/QST breakdown to total" width="1000"> <br/> <sub>Example scenario with province selection, line items, and clear tax breakdown.</sub> </div>
Overview

TaxSmart is a fast, privacy-first calculator for Canadian sales taxes across provinces and territories. It’s built for shoppers, freelancers, and small businesses who need clear line-item math and shareable scenarios—without accounts or tracking.

Audience: Anyone who needs accurate totals, fast.

Design goals: Simple, accessible, mobile-friendly, and safe to share.

Features

Province/territory-aware rates (GST/HST/PST/QST)

Line items with per-item price and quantity

Clear breakdown: subtotal → taxes → total

Shareable scenarios via URL (copy/paste a link)

Responsive, keyboard-friendly UI (dark/light ready)

No account required for the core calculator

Quick Start

Requires Node 20+ and npm.

npm ci            # install dependencies
npm run dev       # start local dev server (prints a localhost URL)
npm run build     # production build → dist/
npm run preview   # preview the production build locally

How to Use

Select your province/territory.

Add items (price & quantity).

Review the tax breakdown and total.

Copy the page URL to share the scenario.

Tip: Bookmark frequently used scenarios.

Project Structure
tax-smart-canadian-calculator/
├─ public/                  # static assets
├─ assets/                  # repo images (README, social, etc.)
├─ src/
│  ├─ components/           # UI components
│  ├─ lib/                  # tax helpers & utilities
│  ├─ styles/               # global styles (if applicable)
│  ├─ App.tsx               # root app
│  └─ main.tsx              # Vite entry
├─ index.html
├─ package.json
└─ vite.config.ts

Accessibility

We aim for sensible defaults:

Labeled controls, descriptive alt text, and visible focus states

Keyboard navigation for all interactive elements

Contrast targets WCAG AA where feasible

If you hit an accessibility snag, open an issue
 with your browser/OS/assistive-tech details.

Privacy & Accuracy

Privacy: The core calculator does not require accounts or collect personal data.

Accuracy: Rates are maintained with best efforts, but tax outcomes vary by context.

Disclaimer: This tool is informational only and not tax or financial advice.
For authoritative guidance, verify with the CRA and your province/territory’s tax authority.

Roadmap

CSV import/export

Saved scenarios (local-first)

Small-business presets

In-app links to official rate sources

Print-friendly layout

Have an idea? Propose it in Issues
 or start a thread in Discussions
.

Contributing

Contributions are welcome!

Fork the repo and create a feature branch.

Make focused changes with clear commit messages.

If you change tax logic or rates, update CHANGELOG.md and link sources.

Open a Pull Request describing what changed and why (screenshots welcome).

Please review: CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md, SUPPORT.md.

Troubleshooting

Blank page after deploy: Ensure the built files are served from the correct base path (vite.config.ts base option if hosted under a subpath).

Styles not applying: Confirm CSS is present in dist/ and referenced by index.html.

Module not found: Run npm ci to install a clean dependency set.

License

MIT © The Solution Desk
