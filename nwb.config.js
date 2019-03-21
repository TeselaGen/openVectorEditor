const {aliases} = require("@teselagen/webpack-link");

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
    aliases,
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
