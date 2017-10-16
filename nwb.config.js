module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: true
  },
  babel: {
    "presets": ["es2015","react","stage-0"]
 },
  webpack: {
    uglify: false,
    extra: {
      devtool: 'source-map'
    },
  }
}


    
// webpack: {
//     extra: {
//         devtool: 'inline-source-map'
//     }
// }