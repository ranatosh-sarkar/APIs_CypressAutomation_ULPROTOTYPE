const { defineConfig } = require('cypress');

// Get the dynamic port from environment variable or fallback to 8082
const port = process.env.API_PORT || '8082';

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports/html',
    overwrite: false,
    html: true,
    json: true,
    autoOpen: false,
    embeddedScreenshots: true,
    saveAllAttempts: false,
    quiet: true
  },
  defaultCommandTimeout: 90000,  // ⏱️ wait up to 90 seconds for commands
  requestTimeout: 90000,         // ⏱️ wait up to 90 seconds for cy.request
  e2e: {
    baseUrl: `http://localhost:${port}/UL_SavingsAccount-API_prototype`,
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    }
  }
});
