module.exports = {
  // 기존 설정
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/, // node_modules는 무시
        use: ["source-map-loader"],
        enforce: "pre",
      },
    ],
  },
  ignoreWarnings: [/Failed to parse source map/], // 소스맵 경고 무시
  // webpack.config.js
  resolve: {
    alias: {
      react: path.resolve("./node_modules/react"),
    },
  },
};
