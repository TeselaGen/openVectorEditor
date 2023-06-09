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
  babel: {
    // runtime: false, //tnr: comment this back in once we're at a higher version of cypress on lims
    // env: {
    //   targets: {
    //     chrome: "59"
    //   }
    // },
    ...(process.env.WITH_COVERAGE && {
      plugins: ["istanbul"]
    })
  },
  webpack: {
    aliases: {
      // **** You can comment one or more of these in to override an npm module with a local module. *****
      // **** Just be sure to comment them back out before committing! *****
      // "@teselagen/range-utils":
      //   console.log("comment me back out!") ||
      //   path.resolve(__dirname, "../tg-oss/packages/range-utils/src/"),
      // "@teselagen/sequence-utils":
      //   console.log("comment me back out!") ||
      //   path.resolve(__dirname, "../tg-oss/packages/sequence-utils/src/"),
      // "@teselagen/bio-parsers":
      //   console.log("comment me back out!") ||
      //   path.resolve(__dirname, "../tg-oss/packages/bio-parsers/src/"),
      //downgrade to nwb @ 0.24.5 to get this to work for now
      // "teselagen-react-components":
      //   console.log("comment me back out!") ||
      //   path.resolve(__dirname, "../teselagen-react-components/src/"),
      // "react-draggable":
      //   console.log("comment me back out!") ||
      //   path.resolve(__dirname, "../react-draggable"),

      //don't comment this out!
      // "../teselagen-react-components/node_modules/@blueprintjs/core/": path.join(
      //   __dirname,
      //   "node_modules/@blueprintjs/core"
      // ),
      react: path.join(__dirname, "node_modules/react"),
      "@blueprintjs/core": path.join(
        __dirname,
        "node_modules/@blueprintjs/core"
      ),
      "@blueprintjs/datetime": path.join(
        __dirname,
        "node_modules/@blueprintjs/datetime"
      ),
      "react-dom": path.join(__dirname, "node_modules/react-dom"),
      "react-redux": path.join(__dirname, "node_modules/react-redux"),
      "redux-form": path.join(__dirname, "node_modules/redux-form"),
      redux: path.join(__dirname, "node_modules/redux")
      // "@blueprintjs/core/lib": path.join(
      //   __dirname,
      //   "node_modules/@blueprintjs/core/lib"
      // ),
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
