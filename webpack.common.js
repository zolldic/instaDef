// const path = require("path");
// const CopyWebpackPlugin = require("copy-webpack-plugin");

import path from "path";
import CopyWebpackPlugin from "copy-webpack-plugin";
import { fileURLToPath } from "url";
import Dotenv from "dotenv-webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  entry: {
    background: "./background/background.js",
    content: "./content/content.js",
  },
  resolve: {
    extensions: [".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // Clean the output directory before emit.
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "static" }],
    }),
    new Dotenv(),
  ],
};

export default config;
