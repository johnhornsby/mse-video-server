var path = require("path");
var webpack = require("webpack");



module.exports = {

	entry: [
		"webpack-dev-server/client?http://localhost:4000",
		'./public/app/index.js'
	],

	output: {
		path: path.join(__dirname, 'public/dist/'),
		filename: 'client.js',
		publicPath: "public/dist/js/"
	},

	module: {
	  loaders: [
	    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
	  ]
	},

  	devServer: {
		// noInfo: true
	},
}
