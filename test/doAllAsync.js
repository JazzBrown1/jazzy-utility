/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { doAllAsync } = require('../dist/main');

describe('doAllAsync()', function () {
  it('iterate and complete in async order', function (done) {
    const newArray = [];
    const oldArray = [1, 2, 3];
    const someCallbackFunc = (el, callback) => {
      setTimeout(() => {
        newArray.push(el);
        callback();
      }, 20 - el * 5); // Earlier elements in array have a longer timeout making the array reverse
    };
    doAllAsync(oldArray, (el, index) => new Promise((resolve) => {
      someCallbackFunc(el, () => {
        resolve();
      });
    })).then(() => {
      done(assert.deepEqual(newArray, [3, 2, 1]));
    });
  });
  it('go straight to done for empty array', function (done) {
    doAllAsync(
      [],
      (el, index) => Promise.resolve(),
    ).then(() => done());
  });
  it('rejects when an array is not passed', function (done) {
    doAllAsync('lll', () => {})
      .catch((err) => {
        done();
      });
  });
  it('rejectsif async function rejects', function (done) {
    doAllAsync([1, 2, 3, 4, 5, 6], () => Promise.reject())
      .catch((err) => {
        done();
      });
  });
});
