import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
    module: undefined
    // module: undefined, //tried all of the following:
    // module: "window",
    // module: {},
  },
  build: {
    target: "esnext"
    // rollupOptions: {

    //   // https://rollupjs.org/guide/en/#big-list-of-options
    // }
  },
  resolve: {
    alias: [
      {
        stream: 'rollup-plugin-node-polyfills/polyfills/stream',
      },
      // {
      //   // this is required for the SCSS modules
      //   find: /^~(.*)$/,
      //   replacement: "$1"
      // }
    ]
  }
});
