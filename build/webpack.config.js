/**
 * @file webpack 配置文件
 * @author lixiaoqing
 * @date 2018-10-10
 */

const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const isDebug = process.env.NODE_ENV === 'development';
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    mode: isDebug ? 'development' : 'production',
    entry: {
        'mux-vue-image-viewer': './src/index'
    },
    output: {
        path: path.join(__dirname, '../dist'),
        publicPath: '/',
        filename: '[name].js',
        library: 'MuxVueImageViewer',
        libraryTarget: 'umd'
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.vue'],
        // 如果不是相对路径，则先将 src 当做根目录，找不到时再将 node_modules 当做跟目录
        modules: [
            path.resolve(__dirname, './src'),
            'node_modules'
        ]
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                uglifyOptions: {
                    warnings: false
                }
            })
        ]
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                include: path.join(__dirname, 'src'),
                loader: 'babel-loader',
            },
            {
                test: /\.styl/,
                use: [
                    'style-loader',
                    'css-loader',
                    'stylus-loader'
                ]
            },
            {
                test: /favicon\.ico$/,
                loader: 'file-loader',
                query: {
                    limit: 1,
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.(jpg|png|gif|webp)$/,
                loader: ['url-loader?limit=1024&name=img/[name].[hash:8].[ext]']
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2)$/,
                loader: ['file-loader?name=font/[name].[hash:8].[ext]']
            }
        ]
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(true),
        new VueLoaderPlugin()
    ]
};
