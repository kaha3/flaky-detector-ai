const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, 'reports', 'root-cause-report.json');
const outputPath = path.resolve(__dirname, 'reports', 'flaky-summary.html');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found at ${inputPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const rows = [];

  for (const [name, info] of Object.entries(data)) {
    const flaky = info.flaky ? '✅' : '❌';
    const cause = info.likelyCause || '';
    const cls = info.flaky ? 'pass' : 'fail';
    rows.push(
      `<tr><td>${escapeHtml(name)}</td><td class="${cls}">${flaky}</td><td>${escapeHtml(cause)}</td></tr>`
    );
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Flaky Summary</title>
  <style>
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .pass { color: green; }
    .fail { color: gray; }
  </style>
</head>
<body>
  <table>
    <tr><th>Test Name</th><th>Flaky</th><th>Likely Cause</th></tr>
    ${rows.join("\n    ")}
  </table>
</body>
</html>`;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
  console.log('HTML report saved to reports/flaky-summary.html');
}

main();
