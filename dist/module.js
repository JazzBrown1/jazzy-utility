/**
 * Foreach loop that allows callbacks
 * @param {array} array
 * @param {callback} callback
 * @param {callback} finished
 */

const asyncForEach = (arr, callback, finished) => {
  let index = 0;
  const next = () => {
    if (index < arr.length) callback(arr[index], index++, next);
    else finished();
  };
  next();
};

const asyncDoAll = (arr, callback, finished) => {
  if (arr.length === 0) {
    finished();
    return;
  }
  let counter = 0;
  const done = () => {
    if (++counter === arr.length) finished();
  };
  arr.forEach((el, index) => {
    callback(el, index, done);
  });
};

const arrayDelete = (arr, item) => {
  if (!arr.isArray()) return false;
  const _index = arr.findIndex((_item) => item === _item);
  if (_index !== -1) {
    arr.splice(_index, 1);
    return true;
  }
  return false;
};

/**
 * A Stash class
 */

const Stash = function Stash() {
  this._stash = {};
  this._id = 1;
  this.put = function put(val) {
    this._stash[this._id] = val;
    return this._id++;
  };
  this.take = function take(id) {
    const val = this._stash[id];
    if (this._stash[id]) delete this._stash[id];
    if (Object.keys(this._stash).length === 0) this._id = 1;
    return val;
  };
  this.see = function see(id) {
    return this._stash[id];
  };
  this.clear = function clear() {
    this._stash = {};
    this._id = 1;
  };
  this.iterate = function iterate(callback) {
    Object.keys(this._stash).forEach((key) => {
      callback(this._stash[key], key);
    });
  };
  this.isEmpty = function isEmpty() {
    return Object.keys(this._stash).length === 0 && this._stash.constructor === Object;
  };
  this.replace = function replace(id, val) {
    this._stash[id] = val;
  };
};

export { Stash, arrayDelete, asyncDoAll, asyncForEach };
