const { merge }  = require('mochawesome-merge');
const { create } = require('mochawesome-report-generator');

module.exports = (on) => {
  // after Cypress finishes the run
  on('after:run', async () => {
    // look for any .json files anywhere under reports/html
    const jsonReport = await merge({ files: ['cypress/reports/html/**/*.json'] });

    // generate the final HTML into cypress/reports/html
    await create(jsonReport, { reportDir: 'cypress/reports/html' });
  });
};
