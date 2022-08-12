import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// yarn add --dev @esbuild-plugins/node-globals-polyfill
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
// yarn add --dev @esbuild-plugins/node-modules-polyfill
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
// import path from "path";
// import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "window",
    module: "undefined"
  },
  build: {
    target: "esnext",
    commonjsOptions: {
      include: [/node_modules/]
    }
    // rollupOptions: {

    //   // https://rollupjs.org/guide/en/#big-list-of-options
    // }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: "window",
        module: undefined
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        }),
        NodeModulesPolyfillPlugin()
        // esbuildCommonjs(['hoist-non-react-statics']),
      ]
    }
  },
  resolve: {
    alias: [
      {
        find: "stream",
        replacement: "rollup-plugin-node-polyfills/polyfills/stream"
      },
      {
        // this is required for the SCSS modules
        find: /^~(.*)$/,
        replacement: "$1"
      }
      //tnr: these don't work quite yet but should work soon
      // {
      //   find: "ve-sequence-utils",
      //   replacement:
      //     console.log("comment me back out!") ||
      //     path.resolve(__dirname, "../../ve-sequence-utils/src/")
      // }
      //  {
      //   find:
      //   "teselagen-react-components",
      //   replacement:
      //   console.log("comment me back out!") ||
      //   path.resolve(__dirname, "../../teselagen-react-components/src/"),
      // }
    ]
  }
});
