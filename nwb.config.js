const path = require("path");

module.exports = {
  type: "react-component",
  npm: {
    umd: {},
    // comment out the next line and comment in the following lines to avoid building anything but the umd build
    esModules: true
    // esModules: console.log("commentMeBackOut") || false,
    // cjs: console.log("commentMeBackOut") || false
  },
  ...(process.env.WITH_COVERAGE && {
    babel: {
      plugins: ["istanbul"]
    }
  }),
  webpack: {
    aliases: {
      // **** You can comment one or more of these in to override an npm module with a local module. *****
      // **** Just be sure to comment them back out before committing! *****
      // "ve-range-utils":
      //   console.log("comment me back out!") ||
      //   path.join("../ve-range-utils/src/"),
      // "ve-sequence-utils":
      //   console.log("comment me back out!") ||
      //   path.join("../ve-sequence-utils/src/"),
      // "bio-parsers":
      //   console.log("comment me back out!") ||
      //   path.join("../ve-sequence-parsers/src/parsers/"),
      // "teselagen-react-components": //downgrade to nwb @ 0.24.5 to get this to work for now
      //   console.log("comment me back out!") ||
      //   path.join(__dirname, "../teselagen-react-components/src/"),
      
      //don't comment this out!
      react: path.join(__dirname, "node_modules/react"),
      // "../teselagen-react-components/node_modules/@blueprintjs/core/": path.join(
      //   __dirname,
      //   "node_modules/@blueprintjs/core"
      // ),
      "@blueprintjs/core": path.join(
        __dirname,
        "node_modules/@blueprintjs/core"
      ),
      // "@blueprintjs/core/lib": path.join(
      //   __dirname,
      //   "node_modules/@blueprintjs/core/lib"
      // ),
      "react-dom": path.join(__dirname, "node_modules/react-dom")
    },
    extra: {
      devtool: "source-map"
    },
    extractCSS: {
      filename: "[name].css"
    }
  }
};

// webpack: {
//     extra: {
//         devtool: 'inline-source-map'
//     }
// }
