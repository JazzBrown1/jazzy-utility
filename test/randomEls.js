/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { randomEls } = require('../dist/main');

describe('randomEls()', function () {
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
    var myExtract = randomEls(0.1, myArr);
    done(assert.equal(2, myExtract.length) && assert.equal(20, myArr.length));
  });

  it('throws error if non array is passed', function (done) {
    try {
      randomEls(0.5, 'notArray');
    } catch (e) {
      done();
    }
  });
  it('throws error if empty array is passed', function (done) {
    try {
      randomEls(0.5, []);
    } catch (e) {
      done();
    }
  });
  it('throws error if non number is passed', function (done) {
    try {
      randomEls('notNumber', [1, 2, 3]);
    } catch (e) {
      done();
    }
  });
  it('throws error if too large number is passed', function (done) {
    try {
      randomEls(2, [1, 2, 3]);
    } catch (e) {
      done();
    }
  });
});
