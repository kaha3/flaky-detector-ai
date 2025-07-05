const fs = require('fs');
const path = require('path');

// Use CLI-provided or fallback output directory
const outputDir = process.env.FLAKY_OUTPUT_DIR || path.resolve(__dirname, 'reports');
const inputPath = path.resolve(outputDir, 'root-cause-report.json');
const outputPath = path.resolve(outputDir, 'flaky-summary.html');

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
  let flakyCount = 0;
  let stableCount = 0;

  for (const [name, info] of Object.entries(data)) {
    const flaky = info.flaky ? '✅' : '❌';
    const cause = info.likelyCause || '';
    const cls = info.flaky ? 'pass' : 'fail';
    if (info.flaky) flakyCount++;
    else stableCount++;

    rows.push(
      `<tr><td>${escapeHtml(name)}</td><td class="${cls}">${flaky}</td><td>${escapeHtml(cause)}</td></tr>`
    );
  }

  const html = `
    <html>
      <head>
        <style>
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          .pass { color: green; }
          .fail { color: red; }
        </style>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
      </head>
      <body>
        <h2>Flaky Test Summary</h2>
        <table>
          <tr><th>Test Name</th><th>Flaky</th><th>Likely Cause</th></tr>
          ${rows.join('\n')}
        </table>

        <h3>Flaky vs Stable Tests</h3>
        <canvas id="flakyChart" width="400" height="200"></canvas>
        <script>
          const ctx = document.getElementById('flakyChart').getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Flaky Tests', 'Stable Tests'],
              datasets: [{
                label: '# of Tests',
                data: [${flakyCount}, ${stableCount}],
                backgroundColor: ['#f39c12', '#2ecc71']
              }]
            },
            options: {
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { beginAtZero: true }
              }
            }
          });
        </script>
      </body>
    </html>
  `;

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html.trim());
  console.log(`HTML report saved to ${path.relative(process.cwd(), outputPath)}`);
}

main();
