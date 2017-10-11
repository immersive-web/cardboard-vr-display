import fs from 'fs';
import path from 'path';
import json from 'rollup-plugin-json';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import cleanup from 'rollup-plugin-cleanup';

const banner = fs.readFileSync(path.join(__dirname, 'licenses.txt'));

export default {
  input: 'src/cardboard-vr-display.js',
  output: {
    file: './dist/cardboard-vr-display.js',
    format: 'umd',
    name: 'CardboardVRDisplay',
  },
  banner: banner,
  plugins: [
    json(),
    resolve(),
    commonjs(),
    cleanup(),
  ]
};
