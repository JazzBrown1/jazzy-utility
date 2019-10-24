/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { deleteArrayEl } = require('../dist/main');

describe('deleteArrayEl()', function () {
  it('delete value from array', function () {
    var myArray = [1, 2, 3];
    deleteArrayEl(myArray, 1);
    assert.deepEqual(myArray, [2, 3]);
  });
  it('return -1 if el does not exist', function () {
    var myArray = [1, 2, 3];
    assert.equal(deleteArrayEl(myArray, 4), -1);
  });
  it('return false if an array is not passed', function () {
    assert.equal(deleteArrayEl('not array', 4), false);
  });
});
