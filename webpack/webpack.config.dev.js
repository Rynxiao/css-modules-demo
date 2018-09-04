const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const projectPath = path.resolve(__dirname, '../')

module.exports = {
	mode: 'development',
	entry: path.resolve(projectPath, 'src/index.js'),
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name]-bundle-[hash:8].js'
	},
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.resolve(projectPath, 'src'),
        exclude: path.resolve(projectPath, 'src/styles'),
     	},
      {
        test: /\.css$/,
        use: [
        	{ loader: "style-loader" },
          {
          	loader: "css-loader",
          	options: {
              // modules: true,
          		// camelCase: true,
          		// localIdentName: '[path][name]__[local]--[hash:base64:5]'
          	}
          }
        ]
      },
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'CSS Modules Demo',
      filename: 'index.html',
      template: path.resolve(projectPath, 'index.html'),
      inject: false
    })
  ],
  devServer: {
    port: 8080,
    contentBase: path.resolve(projectPath, 'build'),
    hot: true
  },
}