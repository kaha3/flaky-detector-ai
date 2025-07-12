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
  const flakyCount = { flaky: 0, stable: 0 };
  const causeCounts = {};

  for (const [name, info] of Object.entries(data)) {
    const flaky = info.flaky ? '✅' : '❌';
    const cause = info.likelyCause || 'Unknown';
    const cls = info.flaky ? 'pass' : 'fail';
    rows.push(
      `<tr><td>${escapeHtml(name)}</td><td class="${cls}">${flaky}</td><td>${escapeHtml(cause)}</td></tr>`
    );

    if (info.flaky) {
      flakyCount.flaky++;
      causeCounts[cause] = (causeCounts[cause] || 0) + 1;
    } else {
      flakyCount.stable++;
    }
  }

  const pieData = JSON.stringify({ labels: ['Flaky', 'Stable'], data: [flakyCount.flaky, flakyCount.stable] });
  const barData = JSON.stringify({
    labels: Object.keys(causeCounts),
    data: Object.values(causeCounts)
  });

  const html = `
    <html>
      <head>
        <style>
          table { border-collapse: collapse; width: 100%; margin-bottom: 30px; }
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

        <h3>Flaky vs. Stable Tests</h3>
        <canvas id="flakyPie" width="400" height="200"></canvas>

        <h3>Flaky Tests by Root Cause</h3>
        <canvas id="causeBar" width="600" height="300"></canvas>

        <script>
          const pie = ${pieData};
          const bar = ${barData};

          new Chart(document.getElementById('flakyPie'), {
            type: 'pie',
            data: {
              labels: pie.labels,
              datasets: [{
                data: pie.data,
                backgroundColor: ['#f39c12', '#27ae60']
              }]
            }
          });

          new Chart(document.getElementById('causeBar'), {
            type: 'bar',
            data: {
              labels: bar.labels,
              datasets: [{
                label: 'Flaky Tests',
                data: bar.data,
                backgroundColor: '#e74c3c'
              }]
            },
            options: {
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
