/**
 * @file webpack 配置文件
 * @author lixiaoqing
 * @date 2018-10-10
 */

const path = require('path');
const webpack = require('webpack');
const isDebug = process.env.NODE_ENV === 'development';
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

let htmlwebpackPluginArr = [];

for (let mod of ['index']) {
    htmlwebpackPluginArr.push(new HtmlwebpackPlugin({
        chunks: [mod],
        alwaysWriteToDisk: true,
        filename: `entry/${mod}.html`,
        inject: true,
        hash: false,
        template: path.resolve(__dirname, `../example/entry/${mod}.html`),
        minify: {
            removeComments: true,
            collapseWhitespace: true
        }
    }));
}

module.exports = {
    mode: isDebug ? 'development' : 'production',
    entry: {
        index: path.resolve(__dirname, '../example/src/index.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: !isDebug ? '[name].js' : '[name].[chunkhash:8].js',
        // 构建后在 html 里的路径，一般也是用这个来指定上线后的cdn域名
        // http://webpack.github.io/docs/configuration.html#output-publicpath
        publicPath: '/dist/'
    },
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        },
        extensions: ['.js', '.vue'],
        // 如果不是相对路径，则先将 src 当做根目录，找不到时再将 node_modules 当做跟目录
        modules: [
            path.resolve(__dirname, '../src'),
            'node_modules'
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
                loader: 'babel-loader',
                exclude: /node_modules/
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
                NODE_ENV: JSON.stringify('development')
            }
        }),
        ...htmlwebpackPluginArr,
        new HtmlWebpackHarddiskPlugin(),
        new VueLoaderPlugin()
    ],
    devServer: {
        contentBase: path.resolve(__dirname, '../'),
        compress: true,
        host: '0.0.0.0',
        disableHostCheck: true,
        port: 8848,
        publicPath: '/dist/',
        setup(app) {},
        staticOptions: {
            setHeaders(res, path) {
                if (/^\/oauth\//ig.test(path)) {
                    res.set('Content-Type', 'text/html;charset=utf-8');
                }
            }
        }
    }
};
