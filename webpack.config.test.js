var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
    devtool: 'eval',
    postcss: function () {
        return [autoprefixer];
    },
    module: {
        loaders: [{
            test: /\.json$/,
            loader: "json-loader"
        }, {
            test: /\.css$/,
            loader: "style!css?modules&importLoader=1&localIdentName=[path][name]---[local]---[hash:base64:5]!postcss"
        }, {
            test: /\.scss$/,
            loader: "style!css?modules&importLoaders=1&localIdentName=[path][name]---[local]---[hash:base64:5]!postcss!sass"
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            include: [path.join(__dirname, 'example'),path.join(__dirname, 'app') ],
            loader: ['babel'],
            query: {
                stage: 1
            }
        }]
    },
    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js', '.json', '.coffee', '.css', '.scss']
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
