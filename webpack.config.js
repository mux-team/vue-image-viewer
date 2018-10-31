const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        'vue-image-viewer': './src/index.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name].js',
        publicPath: '/',
        library: 'VueImageViewer',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
        vue$: 'vue/dist/vue.min.js'
        }
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.styl$/,
                loader: [
                    'css-loader',
                    'stylus-loader?paths=node_modules&resolve url&include css'
                ]
            },
            {
                test: /\.js$/,
                exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\//,
                loader: 'babel-loader'
            },
            {
                test: /\.(png|jpg|gif|ttf|svg|woff|eot)$/,
                loader: 'url-loader',
                query: {
                    limit: 30000,
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: JSON.stringify("production")
            }
        })
    ]
};

if (process.env.NODE_ENV === 'production') {

  module.exports.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        },
        comments: false
    }));
} else {
  // development configurations
  module.exports.plugins.push(new HtmlWebpackPlugin({
    filename: 'index.html',
    template: './example/index.html',
    inject: false
  }));
}