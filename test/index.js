/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var {
  doAll,
  forEachCallbacks,
  arrayDelete,
  Stash,
  randomEl,
  randomInt
} = require('../dist/main');
require('./workflow');

describe('randomInt()', function () {
  it('return a number in the range', function (done) {
    var from = 1;
    var to = 5;
    var result = randomInt(from, to);
    done(assert.equal(result >= from && result <= to, true));
  });
});

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

describe('doAll()', function () {
  it('iterate and complete in async order', function (done) {
    const newArray = [];
    const oldArray = [1, 2, 3];
    const someCallbackFunc = (el, callback) => {
      setTimeout(() => {
        newArray.push(el);
        callback();
      }, 20 - el * 5); // Earlier elements in array have a longer timeout making the array reverse
    };
    doAll(
      oldArray,
      (el, index, _done) => {
        someCallbackFunc(el, () => {
          _done();
        });
      },
      function () {
        done(assert.deepEqual(newArray, [3, 2, 1]));
      }
    );
  });
  it('go straight to done for empty array', function (done) {
    doAll(
      [],
      (el, index, _done) => {
        _done();
      },
      done
    );
  });
  it('throw error when an array is not passed', function (done) {
    try {
      doAll('lll', () => {}, () => {});
    } catch (err) {
      done();
    }
  });
  it('not throw error when no finished func passed', function (done) {
    doAll([1, 2], () => {});
    done();
  });
  it('not throw error when no finished func passed and array empty', function (done) {
    doAll([], () => {});
    done();
  });
});

describe('forEachCallbacks()', function () {
  it('iterate and complete in order of array', function (done) {
    const newArray = [];
    const oldArray = [1, 2, 3];
    const someCallbackFunc = (el, callback) => {
      newArray.push(el);
      callback();
    };
    forEachCallbacks(
      oldArray,
      (el, i, next) => {
        someCallbackFunc(el, () => {
          next();
        });
      },
      function () {
        done(assert.deepEqual(oldArray, newArray));
      }
    );
  });
  it('throw error when an array is not passed', function (done) {
    try {
      forEachCallbacks('lll', () => {}, () => {});
    } catch (err) {
      done();
    }
  });
  it('go straight to done for empty array', function (done) {
    forEachCallbacks([], (e, i, next) => next(), done);
  });
  it('not throw error when no finished func passed', function (done) {
    forEachCallbacks([1, 2], (e, i, next) => next());
    done();
  });
});

describe('arrayDelete()', function () {
  it('delete value from array', function () {
    var myArray = [1, 2, 3];
    arrayDelete(myArray, 1);
    assert.deepEqual(myArray, [2, 3]);
  });
  it('return -1 if el does not exist', function () {
    var myArray = [1, 2, 3];
    assert.equal(arrayDelete(myArray, 4), -1);
  });
  it('return false if an array is not passed', function () {
    assert.equal(arrayDelete('not array', 4), false);
  });
});

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
