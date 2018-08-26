var path = require('path')
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'bundle.js'
	},
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname + '/src',
        exclude: __dirname + '/src/styles'
     	},
      // {
      //   test: /\.css$/,
      //   use: [
      //   	{ loader: "style-loader" },
      //     {
      //     	loader: "css-loader",
      //     	options: {

      //     	}
      //     }
      //   ]
      // },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './build/styles'
            }
          },
          { 
          	loader: "css-loader",
          	options: {
          		modules: true,
          		camelCase: true,
          		sourceMap: true,
          		localIdentName: '[path][name]__[local]--[hash:base64:5]'
          	}
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
}