/* eslint-disable @typescript-eslint/no-var-requires */
const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const cssnano = require('cssnano');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge({
    module: {
        rules: [
            {
                test: /\.(le|c)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: { plugins: () => [require('autoprefixer')()] }
                    },
                    'less-loader',
                    path.resolve(__dirname, '../webpackConfig/loader.ts')
                ]
            },
            {
                test: /\.(jpe?g|png|gif|ico|woff|ttf|eot|svg|woff2)$/,
                include: /firstScreen/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 50000,
                        fallback: {
                            loader: 'file-loader',
                            options: { name: 'icons/[name].[hash:5].[ext]' }
                        }
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|ico|woff|ttf|eot|svg|woff2)$/,
                exclude: /firstScreen/,
                use: [
                    {
                        loader: 'file-loader',
                        options: { name: 'icons/[name].[hash:5].[ext]' }
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [new TerserPlugin({ sourceMap: true })]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style/[name].[contenthash:4].css', // This option determines the name of each output bundle. The bundle is written to the directory specified by the output.path option.
            chunkFilename: 'style/[name].[contenthash:4].css', // This option determines the name of non-entry chunk files.
            ignoreOrder: false
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessor: cssnano,
            cssProcessorOptions: {
                discardComments: {
                    removeAll: true
                },
                // Run cssnano in safe mode to avoid
                // potentially unsafe transformations.
                safe: true
            },
            canPrint: false
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
        // new BundleAnalyzerPlugin({
        //     analyzerHost: 'localhost',
        //     analyzerPort: 8999
        // }),
        // new webpack.optimize.AggressiveSplittingPlugin({
        //     minSize: 10000,
        //     maxSize: 30000,
        // }),
    ]
    // performance: {
    //     hints: "warning", // "error" or false are valid too
    //     maxEntrypointSize: 50000, // in bytes, default 250k
    //     maxAssetSize: 450000, // in bytes
    // },
});
