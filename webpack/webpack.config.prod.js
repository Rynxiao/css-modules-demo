const path = require('path')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')
const projectPath = path.resolve(__dirname, '../')

module.exports = {
	mode: 'production',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, '../build'),
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
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../build/styles'
            }
          },
          { 
          	loader: "css-loader",
          	options: {
          		modules: true,
          		camelCase: true,
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
    }),
    new HtmlWebpackPlugin({
      title: 'CSS Modules Demo',
      filename: 'index.html',
      template: path.resolve(projectPath, 'index.html'),
      inject: false
    })
  ],
}