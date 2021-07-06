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
    // ...(process.env.WITH_COVERAGE && {
    //   plugins: ["istanbul"]
    // })
  },
  webpack: {
    aliases: {},
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
