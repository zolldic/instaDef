import config from "./webpack.common.js";
import { merge } from "webpack-merge";

const merged = merge(config, {
  mode: "production",
  devtool: "source-map",
});

export default merged;
