import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import cleanup from 'rollup-plugin-cleanup';


export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: './dist/main.js',
        format: 'umd',
        name: 'sss-utility',
      }
    ]
  },
  {
    input: 'src/index.js',
    output: [
      {
        file: './dist/module.js',
        format: 'esm',
        name: 'sss-utility',
      }
    ]
  },
  {
    input: 'src/index.js',
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
        file: './dist/browser.js',
        name: 'sss-utility',
        format: 'umd'
      }
    ]
  }
];
