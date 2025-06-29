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
