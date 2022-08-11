import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: "window"
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
