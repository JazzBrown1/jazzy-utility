/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { randomEl } = require('../dist/main');

describe('randomEl()', function () {
  it('return a random element from the array', function (done) {
    var array = [1, 2, 3, 4, 5];
    var result = randomEl(array);
    done(assert.equal(array.includes(result), true));
  });
  it('throw an error when a non array type is passed as the array argument', function (done) {
    try {
      randomEl('foo');
    } catch (err) {
      done();
    }
  });
  it('throw an error when an empty array is passed', function (done) {
    try {
      randomEl([]);
    } catch (err) {
      done();
    }
  });
});
