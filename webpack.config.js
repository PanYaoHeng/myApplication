/* eslint-disable */
const path = require('path');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const developmentConfig = require('./webpackConfig/webpack.dev');
const productionConfig = require('./webpackConfig/webpack.prod');

module.exports = function(env, argv) {
    const { mode } = argv;
    const commonConfig = {
        mode,
        entry: './src/index.tsx',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'js/[name].[chunkhash:4].js',
            chunkFilename: 'js/[name].[chunkhash:4].js',
            publicPath: '/'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.svg'],
            alias: {
                '@icons': path.resolve(__dirname, 'src/icons/')
            }
        },
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    loader: ['babel-loader']
                }
            ]
        },
        optimization: {
            splitChunks: {
                chunks: 'initial'
            },
            runtimeChunk: {
                name: 'manifest' // 运行环境代码，标明了改如何加载模块，所以一旦有模块变动，这部分内容也是会变动的。所以不能和vendor部分一起打包，避免用户每次都重新请求一个大文件。
            }
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/index.html',
                favicon: './favicon.png'
            })
        ]
    };
    if (mode === 'development') {
        return merge(commonConfig, developmentConfig);
    } else if (mode === 'production') {
        return merge(commonConfig, productionConfig);
    }
};
