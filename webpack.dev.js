import config from "./webpack.common.js";
import { merge } from "webpack-merge";

const merged = merge(config, {
  mode: "development",
  devtool: "inline-source-map",
});

export default merged;
