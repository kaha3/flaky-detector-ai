# codex-test

This repository includes simple scripts for demonstrating Codex features.

## Flaky report script

Run `node flakinessAnalyzer.js` to analyze `/logs/test-results.json` and
create `/reports/flaky-report.json`. Tests appearing with both `passed` and
`failed` statuses are flagged as flaky.

## Root cause and summaries

After generating the flaky report, run `node rootCauseGuesser.js` to
create `/reports/root-cause-report.json` with guessed causes. You can then
produce various summaries:

- `node flakySummary.js` writes `/reports/flaky-summary.md`
- `node csvExporter.js` writes `/reports/flaky-summary.csv`
- `node htmlReporter.js` writes `/reports/flaky-summary.html`
- `node pdfExporter.js` writes `/reports/flaky-summary.pdf`

Run `node generateReports.js` to execute every step sequentially. If Puppeteer
isn't installed, the script will skip the PDF generation step and show a
warning.
