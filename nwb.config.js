module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: false
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