var webpack = require('webpack');
var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        "./example/example.js"
    ],
    output: {
        path: __dirname,
        filename: "bundle.js",
        publicPath: '/static/'
    },
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
            loader: "style!css?modules&importLoaders=1&localIdentName=[path][name]---[local]---[hash:base64:5]!postcss!sass?sourceMap"
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
    node: {
        __dirname: true,
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({ "global.GENTLY": false })
    ],
    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js', '.json', '.coffee', '.css', '.scss']
    }
};
