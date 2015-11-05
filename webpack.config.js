var webpack = require('webpack');
var path = require('path');
module.exports = {
    devtool: 'eval',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        "./app/main.js"
    ],
    output: {
        path: __dirname,
        filename: "bundle.js",
        publicPath: '/static/'
    },
    module: {
        loaders: [{
            test: /\.json$/,
            loader: "json-loader"
        },{
            test: /\.css$/,
            loader: "style!css?modules&localIdentName=[path][name]---[local]---[hash:base64:5]"
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            // include: path.join(__dirname, 'app'),
            loader: ['babel'],
            query: {
                stage: 1
            }
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js', '.json', '.coffee']
    }
};
