var webpack = require('webpack');
var path = require('path');
module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client?reload=true',
        "./example/example.js"
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
            include: [path.join(__dirname, 'example'),path.join(__dirname, 'app') ],
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
