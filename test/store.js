/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { store } = require('../dist/main');

describe('store', function () {
  it('allows assigning and reading of values', function (done) {
    store.set('myVal', 'yes');
    done(assert(store.get('myVal'), 'yes'));
  });
  it('allows adding and removing listeners', function (done) {
    let counter = 0;
    const listener = store.listen('myVal2', () => { counter++; });
    store.set('myVal2', '1');
    listener.remove();
    store.set('myVal2', '2');
    done(assert(counter, 1));
  });
  it('allows adding and removing multiple listeners', function (done) {
    let counter = 0;
    const listener = store.listen('myVal2b', () => { counter++; });
    const listener2 = store.listen('myVal2b', () => { counter++; });
    store.set('myVal2b', '1');
    listener.remove();
    store.set('myVal2b', '2');
    listener2.remove();
    store.set('myVal2b', '3');
    done(assert.equal(counter, 3));
  });
  it('allows returns true when listener removed and false when does not exist', function () {
    const listener = store.listen('myVal2c', () => {});
    assert.equal(listener.remove(), true);
    assert.equal(listener.remove(), false);
  });
  it('allows adding and using reducers to update states', function () {
    const reducer = (state, action) => {
      if (action.type === 'x3') return action.number * 3;
      throw new Error('Unknown Type');
    };
    store.setReducer('myVal3', reducer);
    store.reduce('myVal3', { type: 'x3', number: 3 });
    assert.equal(store.get('myVal3'), 9);
  });
  it('allows listens for changes made by reducers', function (done) {
    const reducer = (state, action) => {
      if (action.type === 'x3') return action.number * 3;
      throw new Error('Unknown Type');
    };

    store.listen('myVal4', () => {
      done();
    });
    store.setReducer('myVal4', reducer);
    store.reduce('myVal4', { type: 'x3', number: 3 });
  });
  it('returns false if you call reduce when no reducer is set', function () {
    assert.equal(store.reduce('unsetState', {}), false);
  });
});
