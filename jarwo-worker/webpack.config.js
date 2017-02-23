const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const DotenvPlugin = require('webpack-dotenv-plugin');

module.exports = {
    entry: {
        messenger: './messenger.js',
        responder: './responder.js',
    },
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, './.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    externals: [
        nodeExternals(),
    ],
    resolve: {
        extensions: ['', '.js', '.jsx'],
    },
    devtool: 'source-map',
    plugins: [
        new DotenvPlugin({
            sample: './.env.example',
            path: './.env',
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
            },
        ],
    },
};
