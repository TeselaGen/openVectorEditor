import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";
import path from "path";

export default defineConfig({
  projectId: "mp89gp",
  viewportHeight: 800,
  viewportWidth: 1280,
  video: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on(
        "file:preprocessor",
        vitePreprocessor({
          configFile: path.resolve(__dirname, "./vite.config.js"),
          mode: "development"
        })
      );

      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3344",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}"
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack"
    }
  }
});
