# 🧪 Flaky Test Detector

A CLI tool to detect flaky tests and generate detailed reports with AI-powered root cause analysis. Built with Node.js and ready for CI/CD workflows.

---

## 📦 Features

- Detect flaky tests from test result history
- Analyze root causes using OpenAI GPT-4o
- Generate reports in Markdown, CSV, HTML (with charts), and PDF
- One-command execution with `generateReports.js` or CLI
- Ready for CI/CD integration via GitHub Actions

---

## 📁 Project Structure

```
logs/
└── test-results.json              # Input file with test history

reports/
├── flaky-report.json             # Output of flaky test analysis
├── root-cause-report.json        # AI-generated root cause analysis
├── flaky-summary.md              # Markdown report
├── flaky-summary.csv             # CSV report
├── flaky-summary.html            # HTML report (with charts)
└── flaky-summary.pdf             # PDF version of the HTML report
```

---

## 📦 Installation

```bash
npm install
```

---

## 🚀 Generate All Reports (1 Command)

```bash
node generateReports.js
```

---

## 🧩 Generate Reports Manually

```bash
node flakinessAnalyzer.js      # Detect flaky tests
node rootCauseGuesser.js       # AI root cause analysis
node flakySummary.js           # Markdown summary
node csvExporter.js            # CSV report
node htmlReporter.js           # HTML + chart report
node pdfExporter.js            # PDF report (requires puppeteer)
```

---

## 🖥️ CLI Usage

```bash
npx flaky-detector

# With custom paths
npx flaky-detector --input logs/test-results.json --output custom-reports
```

---

## 🤖 AI Root Cause Detection Setup

1. Install the OpenAI package:

```bash
npm install openai
```

2. Set your OpenAI API key (e.g., in terminal):

```bash
# Windows (PowerShell)
$env:OPENAI_API_KEY="your-key"

# macOS/Linux (bash)
export OPENAI_API_KEY="your-key"
```

3. Run:

```bash
node rootCauseGuesser.js
```

---

## 🔁 GitHub CI Integration

See the workflow file in:

```
.github/workflows/reports.yml
```

This runs reports automatically on each push to `main`.

---

## 📦 Publish to npm (Optional)

In your `package.json`:

```json
"bin": {
  "flaky-detector": "./generateReports.js"
}
```

Then:

```bash
npm login
npm publish
```

Now anyone can run:

```bash
npx flaky-detector
```

---

## ✅ Requirements

- Node.js v18 or higher
- Optional: `puppeteer` (for PDF reports)
- Optional: OpenAI API key (for root cause guessing)

---

## 🪪 License

MIT

---

## 👤 Author

Built with ❤️ by [Kakha Kitiashvili](https://github.com/kaha3)

---

Let me know if you want to add:

- 📸 Example screenshots  
- 🎥 Demo GIF  
- 📊 Sample report outputs  
