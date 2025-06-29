const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('puppeteer');

const inputPath = path.resolve(__dirname, 'reports', 'flaky-summary.html');
const outputPath = path.resolve(__dirname, 'reports', 'flaky-summary.pdf');

async function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found at ${inputPath}`);
    process.exit(1);
  }

  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(inputPath).href, { waitUntil: 'networkidle0' });
    await page.pdf({ path: outputPath, format: 'A4', landscape: true });
    console.log('PDF saved to reports/flaky-summary.pdf');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
