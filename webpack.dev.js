/* eslint-disable */
const {merge} = require('webpack-merge');
const path = require('path');
const getCommonConfig = require('./webpack.common');
module.exports = merge({
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: { plugins: () => [require('autoprefixer')()] }
                    },
                    'less-loader',
                    path.resolve(__dirname, 'webpackLoader/loader.ts')
                ]
            },
            {
                test: /\.(jpe?g|png|gif|ico|woff|ttf|eot|svg|woff2)$/,
                use: {
                    loader: 'file-loader',
                    options: { name: '[name].[hash:5].[ext]' }
                }
            }
        ]
    },
    devServer: {
        // stats: 'errors-only',
        // host, // default localhost
        // port, // default 8080
        open: false,
        overlay: true,
        historyApiFallback: true
    }
}, getCommonConfig(true));
