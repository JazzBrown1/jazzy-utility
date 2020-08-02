/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { drill } = require('../dist/main');

describe('drill()', function () {
  it('returns element of route in obj', function () {
    const obj = { test: { test2: { test3: 'test4' } } };
    const arr = ['test', 'test2', 'test3'];
    assert.equal(drill(arr, obj), 'test4');
  });
  it('returns undefined if a child is undefined', function () {
    const obj = { test: { test2: { test3: 'test4' } } };
    const arr = ['test', 'test2', 'error'];
    assert.equal(drill(arr, obj), undefined);
  });
});
