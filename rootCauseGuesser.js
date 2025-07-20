const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const inputPath = path.resolve(__dirname, 'reports', 'flaky-report.json');
const outputPath = path.resolve(__dirname, 'reports', 'root-cause-report.json');

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ Missing OPENAI_API_KEY environment variable.");
  process.exit(1);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const report = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

async function guessRootCause(testName, data) {
  const messages = [
    {
      role: "system",
      content: "You are a QA expert helping to identify root causes of flaky tests.",
    },
    {
      role: "user",
      content:
        `Analyze the following flaky test and suggest the most likely root cause:\n\n` +
        `Test Name: ${testName}\n` +
        `Status History: ${data.statuses.join(', ')}\n\n` +
        `Be concise.`,
    },
  ];

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
    max_tokens: 80,
    temperature: 0.4,
  });

  return res.choices[0].message.content.trim();
}

(async () => {
  const output = {};

  for (const [testName, data] of Object.entries(report)) {
    if (!data.flaky) continue;

    console.log(`🔍 Analyzing: ${testName}`);
    try {
      const cause = await guessRootCause(testName, data);
      output[testName] = {
        ...data,
        likelyCause: cause,
      };
    } catch (err) {
      console.error(`❌ Failed to analyze "${testName}":`, err.message);
      output[testName] = {
        ...data,
        likelyCause: 'AI analysis failed',
      };
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(`✅ AI root cause report saved to ${outputPath}`);
})();