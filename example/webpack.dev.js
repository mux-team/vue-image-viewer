const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const isDebug = process.env.NODE_ENV === 'development';
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlwebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");

let htmlwebpackPluginArr = [];

for (let mod of ['index']) {
    htmlwebpackPluginArr.push(new HtmlwebpackPlugin({
        chunks: [mod],
        alwaysWriteToDisk: true,
        filename: `entry/${mod}.html`,
        inject: true,
        hash: false,
        template: path.resolve(__dirname, `./entry/${mod}.html`),
        minify: {
            removeComments: true,
            collapseWhitespace: true
        }
    }));
}

module.exports = {
	mode: isDebug ? 'development' : 'production',
	entry: {
		'd-dd': './example/src/index.js'
	},
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "/",
		filename: '[name].js',
		publicPath: '/',
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
			path.resolve(__dirname, '../src'),
			'node_modules'
		]
	},
	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				include: path.join(__dirname, "src"),
				loader: "babel-loader",
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
			"process.env": {
				NODE_ENV: JSON.stringify("development")
			}
        }),
        ...htmlwebpackPluginArr,
        new webpack.NamedModulesPlugin(),
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
        setup(app) {
        },
        staticOptions: {
            setHeaders(res, path) {
                if (/^\/oauth\//ig.test(path)) {
                    res.set('Content-Type', 'text/html;charset=utf-8');
                }
            }
        }
    }
};