const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, 'reports', 'root-cause-report.json');
const outputPath = path.resolve(__dirname, 'reports', 'flaky-summary.md');

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found at ${inputPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const lines = [];
  lines.push('| Test Name | Flaky | Likely Cause |');
  lines.push('|-----------|-------|--------------|');

  for (const [name, info] of Object.entries(data)) {
    const flaky = info.flaky ? '✅' : '❌';
    const cause = info.likelyCause || '';
    lines.push(`| ${name} | ${flaky} | ${cause} |`);
  }

  const markdown = lines.join('\n') + '\n';
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, markdown);
  console.log('Markdown summary saved to reports/flaky-summary.md');
}

main();
