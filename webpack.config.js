var path = require('path');
var webpack = require('webpack');

var definePlugin = {
	'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
};

module.exports = {
	entry: './src/index.js',
	devtool: 'source-map',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js',
		library: 'GithubStar',
		libraryTarget: 'umd'
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				include: path.join(__dirname, 'src')
			}
		]
	},
	plugins: [new webpack.DefinePlugin(definePlugin)]
};
