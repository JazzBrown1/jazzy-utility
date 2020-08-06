/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { forEachAsync } = require('../dist/main');

describe('forEachAsync()', function () {
  it('iterate and complete in order of array', function (done) {
    const newArray = [];
    const oldArray = [1, 2, 3];
    forEachAsync(oldArray, (el) => new Promise((resolve) => {
      newArray.push(el);
      resolve();
    })).then(function () {
      done(assert.deepEqual(oldArray, newArray));
    }).catch(done);
  });
  it('throw error when an array is not passed', function (done) {
    forEachAsync('lll', () => {})
      .catch((err) => {
        done();
      });
  });
});
