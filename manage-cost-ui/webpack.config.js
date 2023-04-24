const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const createStyledComponentsTransformer =
  require("typescript-plugin-styled-components").default;

const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              getCustomTransformers: () => ({
                before: [styledComponentsTransformer],
              }),
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.png/,
        type: "asset/resource",
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
    /*    before: (app) => {
      app.get("/static/locales/:lng/:ns.json", (req, res) => {
        const { lng, ns } = req.params;
        const localeFilePath = path.join(
          __dirname,
          `/static/locales/${lng}/${ns}.json`
        );
        res.sendFile(localeFilePath);
      });
    },*/
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        "public/*.css",
        "public/**/*.json",
        "public/*.ico",
        "public/*.txt",
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
