const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/index.ts",
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".ts", ".js"],
    },
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    devServer: {
      static: {
        directory: path.resolve(__dirname, "dist"),
      },
      compress: true,
      port: 9000,
      hot: true,
      open: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html",
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        "process.env.mode": JSON.stringify(process.env.NODE_ENV),
      }),
    ],
    devtool: isProduction ? "source-map" : "inline-source-map", // Different devtool for production
  };
};
