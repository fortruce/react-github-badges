var path = require("path");
var webpack = require("webpack");

module.exports = {
	entry: "./demo/index.js",
	devtool: "source-map",
	output: {
		path: path.join(__dirname, "demo"),
		filename: "demo.js"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel",
				query: {
					presets: ["react", "es2015"],
					plugins: ["transform-object-rest-spread"]
				},
				include: path.join(__dirname, "demo")
			}
		]
	}
};
