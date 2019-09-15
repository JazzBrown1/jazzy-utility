/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var jazzyUtility = require('../dist/main');

var {
  asyncDoAll, asyncForEach, arrayDelete, Stash
} = jazzyUtility;

describe('#asyncDoAll()', function () {
  it('Should make a new array in reverse of old array', function (done) {
    const newArray = [];
    const oldArray = [1, 2, 3];
    const someCallbackFunc = (el, callback) => {
      setTimeout(() => {
        newArray.push(el);
        callback();
      }, 20 - el * 5); // Earlier elements in array have a longer timeout making the array reverse
    };
    asyncDoAll(oldArray, (el, index, _done) => {
      someCallbackFunc(el, () => {
        _done();
      });
    }, function () {
      done(assert.deepEqual(newArray, [3, 2, 1]));
    });
  });
  it('Should go straight to done for empty array', function (done) {
    asyncDoAll([], (el, index, _done) => {
      _done();
    }, done);
  });
});

describe('#asyncForEach()', function () {
  it('Should make a new array in same order of old array', function (done) {
    const newArray = [];
    const oldArray = [1, 2, 3];
    const someCallbackFunc = (el, callback) => {
      newArray.push(el);
      callback();
    };
    asyncForEach(oldArray, (el, i, next) => {
      someCallbackFunc(el, () => {
        next();
      });
    }, function () {
      done(assert.deepEqual(oldArray, newArray));
    });
  });
  it('Should go straight to done for empty array', function (done) {
    asyncForEach([], (e, i, next) => {
      next();
    }, done);
  });
});

describe('#arrayDelete()', function () {
  it('Should delete value from array', function () {
    var myArray = [1, 2, 3];
    arrayDelete(myArray, 1);
    assert.deepEqual(myArray, [2, 3]);
  });
  it('Should return -1 if el does not exist', function () {
    var myArray = [1, 2, 3];
    assert.equal(arrayDelete(myArray, 4), -1);
  });
  it('Should return false if an array is not passed', function () {
    assert.equal(arrayDelete('not array', 4), false);
  });
});

describe('#Stash()', function () {
  var myStash = new Stash();
  var myId = myStash.put('My Message');
  var myId2 = myStash.put('My Message 2');
  it('Should return the correct message from the id', function () {
    assert.equal(myStash.see(myId), 'My Message');
  });
  it('Should give the correct size of the stash', function () {
    assert.equal(myStash.size(), 2);
  });
  it('Should return undefined from unknown ID', function () {
    myStash.take(myId);
    myStash.take(myId2);
    assert.equal(myStash.take(1111), undefined);
  });
  it('Should return true when stash is empty', function () {
    assert.equal(myStash.isEmpty(), true);
  });
  it('Should iterate through the elements of the stash', function () {
    myId = myStash.put('My 2nd Message');
    myStash.replace(myId, 'My 3rd Message');
    myStash.iterate(function (el, id) {
      assert.equal(el, 'My 3rd Message');
      assert.equal(id, myId);
    });
  });
  it('Should return 0 after stash is cleared', function () {
    myStash.clear();
    assert.equal(myStash.size(), 0);
  });
});
