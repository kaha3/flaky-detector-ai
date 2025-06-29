const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, 'logs', 'test-results.json');
const outputPath = path.resolve(__dirname, 'reports', 'flaky-report.json');

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found at ${inputPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const groups = {};

  data.forEach(({ testName, status }) => {
    if (!testName || !status) return;
    if (!groups[testName]) {
      groups[testName] = { statuses: [], flaky: false };
    }
    groups[testName].statuses.push(status);
  });

  for (const name in groups) {
    const statuses = new Set(groups[name].statuses);
    if (statuses.has('passed') && statuses.has('failed')) {
      groups[name].flaky = true;
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(groups, null, 2));
  const rel = path.relative(process.cwd(), outputPath);
  console.log(`Flaky report saved to ${rel}`);
}

main();
