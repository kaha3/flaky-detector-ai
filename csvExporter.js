const fs = require('fs');
const path = require('path');

// Use CLI-provided or fallback output directory
const outputDir = process.env.FLAKY_OUTPUT_DIR || path.resolve(__dirname, 'reports');
const inputPath = path.resolve(outputDir, 'root-cause-report.json');
const outputPath = path.resolve(outputDir, 'flaky-summary.csv');

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found at ${inputPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const lines = [];
  lines.push('Test Name,Flaky,Likely Cause');

  for (const [name, info] of Object.entries(data)) {
    const flaky = info.flaky ? 'TRUE' : 'FALSE';
    const cause = info.flaky ? (info.likelyCause || '') : '';
    // Escape double quotes in test names and causes
    const safeName = `"${name.replace(/"/g, '""')}"`;
    const safeCause = cause ? `"${cause.replace(/"/g, '""')}"` : '';
    lines.push(`${safeName},${flaky},${safeCause}`);
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, lines.join('\n') + '\n');
  console.log(`CSV report saved to ${path.relative(process.cwd(), outputPath)}`);
}

main();
