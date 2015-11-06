var webpack = require("webpack");
module.exports = {
    entry: "./app/App.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
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
            // include: path.join(__dirname, 'app'),
            loader: ['babel-loader'],
            query: {
                stage: 1
            }
        }]
    },
    plugins: [
        //tnr: this plugin sets the NODE_ENV variable to production which deactivates both react proptypes and api-check!
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ],
    resolve: {
        // you can now require('file') instead of require('file.coffee')
        extensions: ['', '.js', '.json', '.coffee']
    }
};
