const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const webpackMode = process.env.NODE_ENV || "development";

module.exports = {
  mode: webpackMode,
  entry: {
    main: "./src/main.js", // 엔트릐 파일
  },
  output: {
    path: path.resolve("./dist"), // 빌드시 해당 이름으로 생성된다.
    filename: "[name].min.js",
  },
  // es5로 빌드 해야 할 경우 주석 제거
  // 단, 이거 설정하면 webpack-dev-server 3번대 버전에서 live reloading 동작 안함
  // target: ['web', 'es5'],
  devServer: {
    liveReload: true, // 자동 새로고침
  },
  optimization: {
    // 빌드시 소스코드 압축
    minimizer:
      webpackMode === "production"
        ? [
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: true, // 콘솔 로그 자동으로 삭제
                },
              },
            }),
          ]
        : [],
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
    new CleanWebpackPlugin(),
    // CopyWebpackPlugin: 그대로 복사할 파일들을 설정하는 플러그인
    // 아래 patterns에 설정한 파일/폴더는 빌드 시 dist 폴더에 자동으로 생성됩니다.
    // patterns에 설정한 경로에 해당 파일이 없으면 에러가 발생합니다.
    // 사용하는 파일이나 폴더 이름이 다르다면 변경해주세요.
    // 그대로 사용할 파일들이 없다면 CopyWebpackPlugin을 통째로 주석 처리 해주세요.
    new CopyWebpackPlugin({
      patterns: [
        { from: "./src/main.css", to: "./main.css" },
        { from: "./src/images", to: "./images" },
      ],
    }),
  ],
};
