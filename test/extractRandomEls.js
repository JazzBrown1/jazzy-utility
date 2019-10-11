/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { extractRandomEls } = require('../dist/main');

describe('extractRandomEls()', function () {
  it('gives the right amount of random elements from an array', function (done) {
    var myArr = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19
    ];
    var myExtract = extractRandomEls(0.1, myArr);
    done(assert.equal(2, myExtract.length) && assert.equal(18, myArr.length));
  });

  it('throws error if non array is passed', function (done) {
    try {
      extractRandomEls(0.5, 'notArray');
    } catch {
      done();
    }
  });
  it('throws error if empty array is passed', function (done) {
    try {
      extractRandomEls(0.5, []);
    } catch {
      done();
    }
  });
  it('throws error if non number is passed', function (done) {
    try {
      extractRandomEls('notNumber', [1, 2, 3]);
    } catch {
      done();
    }
  });
  it('throws error if too large number is passed', function (done) {
    try {
      extractRandomEls(2, [1, 2, 3]);
    } catch {
      done();
    }
  });
});
