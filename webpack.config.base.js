import path from 'path';
var autoprefixer = require('autoprefixer');
var precss = require('precss');


export default {
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }, 
    {
      test: /\.js$/,
      loaders: ['babel'],
      include: [path.join(__dirname, 'src'), path.join(__dirname, 'VectorEditor')]
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.css$/,
      loader: "style-loader!css-loader!postcss-loader"
    }, {
      test: /\.scss$/,
      loader: "style-loader!css-loader!postcss-loader!sass-loader"
    },
    {
      test: /\.less$/,
      loader: "style!css!postcss!less"
    }, {
      test: /\.(otf|eot|woff|woff2|ttf|svg|png|jpg)$/,
      loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
    }]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  postcss: function() {
    return [autoprefixer, precss];
  },
  resolve: {
    root: [
      path.resolve('./localModules')
    ],
    extensions: ['', '.js', '.jsx', '.json', '.css', '.scss', 'less'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [

  ],
  externals: [
    // put your node 3rd party libraries which can't be built with webpack here
    // (mysql, mongodb, and so on..)
  ]
};
