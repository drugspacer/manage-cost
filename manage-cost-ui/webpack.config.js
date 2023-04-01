const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const createStyledComponentsTransformer =
  require("typescript-plugin-styled-components").default;

const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          getCustomTransformers: () => ({
            before: [styledComponentsTransformer],
          }),
        },
      },
    ],
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "public"),
    },
    proxy: {
      "/api/**": {
        target: "http://localhost:3000",
        router: () => "http://localhost:8080",
        logLevel: "debug", //optional//,
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: "public/*.css" }],
    }),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
