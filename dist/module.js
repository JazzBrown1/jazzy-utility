/**
 * Foreach loop that allows callbacks
 * @param {array} array
 * @param {callback} callback
 * @param {callback} finished
 */
var forEachCallbacks = function forEachCallbacks(arr, callback, finished) {
  if (!Array.isArray(arr)) throw new TypeError();
  var index = 0;

  var next = function next() {
    if (index < arr.length) callback(arr[index], index++, next);else if (finished) finished();
  };

  next();
};

var doAll = function doAll(arr, callback, finished) {
  if (!Array.isArray(arr)) throw new TypeError();

  if (arr.length === 0) {
    if (finished) finished();
    return;
  }

  var counter = 0;

  var done = function done() {
    if (++counter === arr.length && finished) finished();
  };

  arr.forEach(function (el, index) {
    callback(el, index, done);
  });
};

var arrayDelete = function arrayDelete(arr, item) {
  if (!Array.isArray(arr)) return false;

  var _index = arr.findIndex(function (_item) {
    return item === _item;
  });

  if (_index !== -1) {
    arr.splice(_index, 1);
    return _index;
  }

  return -1;
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
    return Object.keys(this._stash).length === 0;
  };

  this.replace = function replace(id, val) {
    this._stash[id] = val;
  };

  this.size = function size() {
    return Object.keys(this._stash).length;
  };
};

var randomInt = (function (min, max) {
  var _min = Math.ceil(min);

  var _max = Math.floor(max);

  return Math.floor(Math.random() * (_max - _min)) + _min;
});

var randomEl = (function (arr) {
  if (!Array.isArray(arr)) throw new TypeError("randomEl input must be of type Array");
  if (arr.length === 0) throw new Error("randomEl cannot accept an empty array");
  return arr[randomInt(0, arr.length - 1)];
});

var index = {
  forEachCallbacks: forEachCallbacks,
  doAll: doAll,
  arrayDelete: arrayDelete,
  Stash: Stash,
  randomEl: randomEl,
  randomInt: randomInt
};

export default index;
export { Stash, arrayDelete, doAll, forEachCallbacks, randomEl, randomInt };
