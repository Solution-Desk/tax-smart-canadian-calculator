# TaxSmart · Canadian Sales-Tax Calculator

A modern GST/HST/PST/QST calculator built for Canadian operators, accountants, and teams that need quick answers without spinning up spreadsheets.

## Live Site
- Production: https://taxapp.thesolutiondesk.ca
- Status page: https://taxapp.thesolutiondesk.ca/health.html

## Core Capabilities
- Province-aware calculations with CRA-backed tax tables.
- Category presets for common goods and services.
- Shareable URLs so collaborators can review the same configuration.
- Dark/light themes with responsive layout for desktop and mobile.

## Getting Started

### Prerequisites
- Node.js 18 or newer
- npm 9+

### Installation
```bash
git clone https://github.com/Solution-Desk/tax-smart-canadian-calculator.git
cd tax-smart-canadian-calculator
npm install
```

### Development
```bash
npm run dev
```
Open the Vite dev URL (default http://localhost:5173) to make changes with hot reload.

### Production Build
```bash
npm run build
```
The optimized assets live in `dist/`. Preview the build locally with:
```bash
npm run preview
```

### Deployment
Use the helper script to produce the GitHub Pages payload:
```bash
./gh-pages-deploy.sh
```
The script rebuilds the app and refreshes the `docs/` folder (the Pages publishing source). Commit and push the changes to update https://taxapp.thesolutiondesk.ca.

## Premium Roadmap
Premium add-ons are in private beta. Join the waitlist by emailing [taxapp@thesolutiondesk.ca](mailto:taxapp@thesolutiondesk.ca) with your use case, and we’ll share release updates directly.

## Support
- Email: [taxapp@thesolutiondesk.ca](mailto:taxapp@thesolutiondesk.ca)
- Issues: https://github.com/Solution-Desk/tax-smart-canadian-calculator/issues

## Contributing
We welcome improvements! Review [`CONTRIBUTING.md`](CONTRIBUTING.md) for coding guidelines and the preferred pull-request workflow.

## License
MIT — see [`LICENSE`](LICENSE) for details.
