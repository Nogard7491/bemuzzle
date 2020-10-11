'use strict';

const fs = require('fs');
const path = require('path');

const BrowserSyncWebpackPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
    name: packageName,
    version: packageVersion,
    keywords: packageKeywords,
    description: packageDescription,
} = require('./package.json');

/** @type {MiniCssExtractPlugin} Plugin for extracts CSS into separate files */
const miniCssExtractPlugin = new MiniCssExtractPlugin({
    filename: 'css/[name].css',
    chunkFilename: 'css/[id].css'
});

/** @type {[]} Plugins for working with HTML */
const htmlWebpackPlugins = fs.readdirSync(path.resolve(__dirname, 'src/pages')).map(item => {
    return new HtmlWebpackPlugin({
        template: `pages/${item}`,
        filename: `${item}`,
    });
});

/** @type {BrowserSyncPlugin} Plugin for live reload */
const browserSyncPlugin = new BrowserSyncWebpackPlugin(
    {
        host: 'localhost',
        port: 3000,
        server: {
            baseDir: ['dist'],
        },
        files: [
            './dist/**/*',
        ],
    },
    {
        reload: true,
    },
);

module.exports = {
    context: __dirname + '/src',
    entry: {
        index: [
            './index.js',
            './index.scss',
        ],
        excluded: [
            './excluded.js',
            './excluded.scss',
        ],
    },
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].js',
    },
    plugins: [
        browserSyncPlugin,
        miniCssExtractPlugin,
        ...htmlWebpackPlugins,
    ],
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                    'postcss-loader',
                ],
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'file-loader?name=fonts/[name].[ext]',
            },
        ],
    },
};