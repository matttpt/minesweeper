import { babel } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

export default {
  input: "src/index.js",
  output: {
    file: "build/minesweeper.js",
    format: "iife"
  },
  plugins: [
    commonjs(),
    resolve({
      extensions: [".js", ".jsx"]
    }),
    replace({
      preventAssignment: true,
      values: {
        "process.env.NODE_ENV": JSON.stringify("production")
      }
    }),
    babel({
      babelHelpers: "bundled",
      include: "src/**.jsx"
    }),
    terser(),
  ]
};
