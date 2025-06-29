const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(__dirname, 'reports', 'flaky-report.json');
const outputPath = path.resolve(__dirname, 'reports', 'root-cause-report.json');

function guessCause(name) {
  const lower = name.toLowerCase();
  if (lower.includes('login')) return 'Possible race condition in auth flow';
  if (lower.includes('cart')) return 'UI element not clickable';
  return 'Intermittent timing issue';
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found at ${inputPath}`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const result = {};

  for (const [name, info] of Object.entries(data)) {
    result[name] = { ...info };
    if (info.flaky) {
      result[name].likelyCause = guessCause(name);
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  const rel = path.relative(process.cwd(), outputPath);
  console.log(`Root cause report saved to ${rel}`);
}

main();
