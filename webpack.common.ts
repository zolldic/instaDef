import path from "path";
import webpack from "webpack";
import copyWebpackPlugin from "copy-webpack-plugin";

const config: webpack.Configuration = {
  entry: {
    background: "./src/background.ts",
    // content: './src/content.ts',
    // index: './src/index.ts',
  },
  resolve: {
    extensions: [".ts"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_module/,
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new copyWebpackPlugin({
      patterns: [{ from: "static" }],
    }),
  ],
};

export default config;
