/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { doAll } = require('../dist/main');

describe('doAll()', function () {
  it('iterate and complete in async order', function (done) {
    const newArray = [];
    const oldArray = [1, 2, 3];
    const someCallbackFunc = (el, callback) => {
      setTimeout(() => {
        newArray.push(el);
        callback();
      }, 20 - el * 5); // Earlier elements in array have a longer timeout making the array reverse
    };
    doAll(
      oldArray,
      (el, index, _done) => {
        someCallbackFunc(el, () => {
          _done();
        });
      },
      function () {
        done(assert.deepEqual(newArray, [3, 2, 1]));
      }
    );
  });
  it('go straight to done for empty array', function (done) {
    doAll(
      [],
      (el, index, _done) => {
        _done();
      },
      done
    );
  });
  it('throw error when an array is not passed', function (done) {
    try {
      doAll('lll', () => {}, () => {});
    } catch (err) {
      done();
    }
  });
  it('not throw error when no finished func passed', function (done) {
    doAll([1, 2], () => {});
    done();
  });
  it('not throw error when no finished func passed and array empty', function (done) {
    doAll([], () => {});
    done();
  });
});
