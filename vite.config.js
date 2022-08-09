import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";


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
    ]
  }
});
