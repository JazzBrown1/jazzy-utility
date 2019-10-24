/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { Stash } = require('../dist/main');

describe('Stash', function () {
  var myStash = new Stash();
  var myId = myStash.put('My Message');
  var myId2 = myStash.put('My Message 2');
  it('return the correct message from the id', function () {
    assert.equal(myStash.see(myId), 'My Message');
  });
  it('give the correct size of the stash', function () {
    assert.equal(myStash.size(), 2);
  });
  it('return undefined from unknown ID', function () {
    myStash.take(myId);
    myStash.take(myId2);
    assert.equal(myStash.take(1111), undefined);
  });
  it('return true when stash is empty', function () {
    assert.equal(myStash.isEmpty(), true);
  });
  it('iterate through the elements of the stash', function () {
    myId = myStash.put('My 2nd Message');
    myStash.replace(myId, 'My 3rd Message');
    myStash.iterate(function (el, id) {
      assert.equal(el, 'My 3rd Message');
      assert.equal(id, myId);
    });
  });
  it('return 0 after stash is cleared', function () {
    myStash.clear();
    assert.equal(myStash.size(), 0);
  });
});
