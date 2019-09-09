const path = require("path");

module.exports = {
  type: "react-component",
  npm: {
    esModules: true,
    umd: {}
  },
  babel: {
    presets: ["es2015", "react", "stage-0"]
  },
  webpack: {
    aliases: {
      // **** You can comment one or more of these in to override an npm module with a local module. *****
      // **** Just be sure to comment them back out before committing! *****
      // "ve-range-utils":
      //   console.log("comment me back out!") ||
      //   path.resolve("../ve-range-utils/src/"),
      // "ve-sequence-utils":
      //   console.log("comment me back out!") ||
      //   path.resolve("../ve-sequence-utils/src/"),
      // "bio-parsers":
      //   console.log("comment me back out!") ||
      //   path.resolve("../ve-sequence-parsers/src/parsers/"),
      // "teselagen-react-components":
      //   console.log("comment me back out!") ||
      //   path.resolve("../teselagen-react-components/src/"),
      // "@teselagen/apollo-methods":
      //   console.log("comment me back out!") ||
      //   path.resolve("../teselagen-common/apollo-methods/src/"),
      
      //don't comment this out!
      react: path.resolve(__dirname, "node_modules/react")
    },
    uglify: false,
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
