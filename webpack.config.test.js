var webpack = require('webpack');
var path = require('path');
module.exports = {
    devtool: 'eval',
    module: {
        loaders: [{
            test: /\.json$/,
            loader: "json-loader"
        }, {
            test: /\.css$/,
            loader: "style!css?modules"
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            include: path.join(__dirname, 'app'),
            loader: ['babel'],
            query: {
                stage: 1
            }
        }]
    },
    plugins: [
        //tnr: this plugin sets the NODE_ENV variable to "testing". This currently does nothing different than
        //"development" except for turning off HMR (hot module replacement) in the .babelrc
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('testing')
            }
        })
    ],
};
