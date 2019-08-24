/**
 * Foreach loop that allows callbacks
 * @param {array} array
 * @param {callback} callback
 * @param {callback} finished
 */
var asyncForEach = function asyncForEach(arr, callback, finished) {
  var index = 0;

  var next = function next() {
    if (index < arr.length) callback(arr[index], index++, next);else finished();
  };

  next();
};

var asyncDoAll = function asyncDoAll(arr, callback, finished) {
  if (arr.length === 0) {
    finished();
    return;
  }

  var counter = 0;

  var done = function done() {
    if (++counter === arr.length) finished();
  };

  arr.forEach(function (el, index) {
    callback(el, index, done);
  });
};

var arrayDelete = function arrayDelete(arr, item) {
  if (!arr.isArray()) return false;

  var _index = arr.findIndex(function (_item) {
    return item === _item;
  });

  if (_index !== -1) {
    arr.splice(_index, 1);
    return true;
  }

  return false;
};

/**
 * A Stash class
 */
var Stash = function Stash() {
  this._stash = {};
  this._id = 1;

  this.put = function put(val) {
    this._stash[this._id] = val;
    return this._id++;
  };

  this.take = function take(id) {
    var val = this._stash[id];
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
    var _this = this;

    Object.keys(this._stash).forEach(function (key) {
      callback(_this._stash[key], key);
    });
  };

  this.isEmpty = function isEmpty() {
    return Object.keys(this._stash).length === 0 && this._stash.constructor === Object;
  };

  this.replace = function replace(id, val) {
    this._stash[id] = val;
  };
};

var index = {
  asyncForEach: asyncForEach,
  asyncDoAll: asyncDoAll,
  arrayDelete: arrayDelete,
  Stash: Stash
};

export default index;
export { Stash, arrayDelete, asyncDoAll, asyncForEach };
