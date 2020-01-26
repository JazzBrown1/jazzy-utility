/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { store } = require('../dist/main');

describe('store', function () {
  it('allows assigning and reading of values', function (done) {
    store.myVal = 'yes';
    done(assert(store.myVal, 'yes'));
  });
});
