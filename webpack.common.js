/* eslint-disable */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function getCommonCongif(isES6) {
    return {
        mode: 'production',
        entry: './src/index.tsx',
        output: {
            path: path.resolve(__dirname, isES6 ? 'dist/es6' : 'dist/es5'),
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
                    loader: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    isES6 ? {
                                              targets: {
                                                  chrome: 51,
                                                  firefox: 54,
                                                  opera: 38,
                                                  edge: 14,
                                                  safari: 10
                                              },
                                              modules: false
                                          } : {
                                              targets: 'defaults'
                                          }
                                ],
                                '@babel/preset-typescript',
                                '@babel/preset-react'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-object-rest-spread',
                                '@babel/plugin-syntax-dynamic-import'
                            ],
                            env: {
                                production: {
                                    plugins: ['transform-react-remove-prop-types']
                                }
                            }
                        }
                    }
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
}
