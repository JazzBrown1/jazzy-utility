/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { randomInt } = require('../dist/main');

describe('randomInt()', function () {
  it('return a number in the range', function (done) {
    var from = 1;
    var to = 5;
    var result = randomInt(from, to);
    done(assert.equal(result >= from && result <= to, true));
  });
});
