let idCounter = 0;

/**
 * A Stash class
 */

const Stash = function Stash() {
  this._stash = {};
  this.generateId = () => `id_${idCounter++}`;
  this.put = function put(val) {
    const id = this.generateId();
    this._stash[id] = val;
    return id;
  };
  this.take = function take(id) {
    const val = this._stash[id];
    if (this._stash[id]) delete this._stash[id];
    return val;
  };
  this.see = function see(id) {
    return this._stash[id];
  };
  this.clear = function clear() {
    this._stash = {};
  };
  this.iterate = function iterate(callback) {
    Object.keys(this._stash).forEach((key) => {
      callback(this._stash[key], key);
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

export default Stash;
