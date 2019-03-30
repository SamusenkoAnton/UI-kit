const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env']
            }
        },
      },
      {
        test: /\.pug$/,
        use: [
          "html-loader",
          "pug-html-loader"
        ]
      },
      {
          test: /\.png$/,
          use: [
              "file-loader?name=./image/[name].[ext]"
          ]
      },
      {
          test: /\.(woff|ttf|svg)$/,
          use: [
              "file-loader?name=./fonts/[name].[ext]"
          ]
      },
      {
        test: /\.scss$/,
        use: [
            MiniCssExtractPlugin.loader,
            // "style-loader", // style nodes from js strings
            "css-loader",
            "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.pug",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
      new webpack.ProvidePlugin({
          '$': 'jquery',
          jquery: 'jquery',
          jQuery: 'jquery',
          'window.jquery': 'jquery',
          'window.jQuery': 'jquery',
          'window.$': 'jquery'
      })
  ]
};
