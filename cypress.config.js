const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'mp89gp',
  viewportHeight: 800,
  viewportWidth: 1280,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://127.0.0.1:5173',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
