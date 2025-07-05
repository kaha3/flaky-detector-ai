#!/usr/bin/env node

const args = require('minimist')(process.argv.slice(2));
const path = require('path');

if (args.help || args.h) {
  console.log(`
Usage: flaky-detector [--input <path>] [--output <folder>]

Options:
  --input      Path to input test results JSON (default: logs/test-results.json)
  --output     Folder to save reports to (default: reports/)
  --help       Show this help message

Examples:
  flaky-detector
  flaky-detector --input logs/test-results.json --output custom-reports
`);
  process.exit(0);
}

// Set env vars for other modules to access
if (args.input) process.env.FLAKY_INPUT_PATH = args.input;
if (args.output) process.env.FLAKY_OUTPUT_DIR = args.output;

function run(stepName, fn) {
  try {
    fn();
    console.log(`✅ ${stepName}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run('Flaky report generated', () => require('./flakinessAnalyzer'));
run('Root cause guessed', () => require('./rootCauseGuesser'));
run('Markdown summary generated', () => require('./flakySummary'));
run('CSV report generated', () => require('./csvExporter'));
run('HTML report generated', () => require('./htmlReporter'));

try {
  require('./pdfExporter');
  console.log('✅ PDF report generated');
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND' && /puppeteer/.test(err.message)) {
    console.log('⚠️ Skipped PDF export (Puppeteer not installed). To enable: npm install puppeteer');
  } else {
    throw err;
  }
}
