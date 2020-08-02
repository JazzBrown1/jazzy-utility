import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import cleanup from 'rollup-plugin-cleanup';


import { getBabelOutputPlugin } from '@rollup/plugin-babel';

export default [
  {
    input: 'src/index-cjs.js',
    plugins: [
      getBabelOutputPlugin({
        presets: ['@babel/env']
      })
    ],
    output: [
      {
        file: './dist/main.js',
        format: 'cjs',
        name: 'jazzy-utility',
        esModule: false,
      }
    ]
  },
  {
    input: 'src/index.js',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ],
    output: [
      {
        file: './dist/module.js',
        format: 'esm',
        name: 'jazzy-utility',
      }
    ]
  },
  {
    input: 'src/index-cjs.js',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      cleanup({
        comments: 'none'
      }),
      minify({
        // Options for babel-minify.
      })
    ],
    output: [
      {
        file: './dist/jazzy-utility-min.js',
        name: 'jazzy-utility',
        format: 'umd'
      }
    ]
  }
];
