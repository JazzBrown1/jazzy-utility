/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { forEachCallbacks } = require('../dist/main');

describe('forEachCallbacks()', function () {
  it('iterate and complete in order of array', function (done) {
    const newArray = [];
    const oldArray = [1, 2, 3];
    const someCallbackFunc = (el, callback) => {
      newArray.push(el);
      callback();
    };
    forEachCallbacks(
      oldArray,
      (el, i, next) => {
        someCallbackFunc(el, () => {
          next();
        });
      },
      function () {
        done(assert.deepEqual(oldArray, newArray));
      }
    );
  });
  it('throw error when an array is not passed', function (done) {
    try {
      forEachCallbacks('lll', () => {}, () => {});
    } catch (err) {
      done();
    }
  });
  it('go straight to done for empty array', function (done) {
    forEachCallbacks([], (e, i, next) => next(), done);
  });
  it('not throw error when no finished func passed', function (done) {
    forEachCallbacks([1, 2], (e, i, next) => next());
    done();
  });
});
