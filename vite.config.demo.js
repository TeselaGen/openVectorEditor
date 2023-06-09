// vite.config.js
import { defineConfig } from "vite";
import config from "./vite.config";
config.build = {
  ...config.build,
  lib: undefined, //remove the lib build so we just get the demo build
  outDir: "demo/dist",
};

export default defineConfig(config);
