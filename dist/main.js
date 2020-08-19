'use strict';
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

var deleteArrayEl = function deleteArrayEl(arr, item) {
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

var idCounter = 0;
/**
 * A Stash class
 */

var Stash = function Stash() {
  this._stash = {};

  this.generateId = function () {
    return "id_".concat(idCounter++);
  };

  this.put = function put(val) {
    var id = this.generateId();
    this._stash[id] = val;
    return id;
  };

  this.take = function take(id) {
    var val = this._stash[id];
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

var randomInt = function randomInt(min, max) {
  var _min = Math.ceil(min);

  var _max = Math.floor(max);

  return Math.floor(Math.random() * (_max + 1 - _min)) + _min;
};

var randomEl = function randomEl(arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('randomEl input must be of type Array');
  }

  if (arr.length === 0) {
    throw new Error('randomEl cannot accept an empty array');
  }

  return arr[randomInt(0, arr.length - 1)];
};

var extractRandomEls = function extractRandomEls(multiplier, arr) {
  if (!Array.isArray(arr) || arr.length < 1) {
    throw new Error('First argument must be an array with at least one element in it');
  }

  if (typeof multiplier !== 'number' || multiplier > 1) {
    throw new Error('Multiplier must be a number between 0 and 1');
  }

  var result = [];
  var groupAmount = Math.ceil(arr.length * multiplier);

  for (var i = 0; i < groupAmount; i++) {
    var index = randomInt(0, arr.length - 1);
    var el = arr.splice(index, 1)[0];
    result.push(el);
  }

  return result;
};

var randomEls = function randomEls(multiplier, arr) {
  if (!Array.isArray(arr) || arr.length < 1) {
    throw new Error('First argument must be an array with at least one element in it');
  }

  return extractRandomEls(multiplier, arr.slice(0));
};

var nestedPlWrap = function nestedPlWrap(p) {
  return function (d, c) {
    p.run(d, c.next);
  };
};

var unblockWrap = function unblockWrap(f) {
  return function (d, c) {
    setTimeout(function () {
      f(d, c);
    }, 0);
  };
};

var skipErrorWrap = function skipErrorWrap(f) {
  return function (d, c) {
    try {
      f(d, c);
    } catch (err) {
      c.next(d);
    }
  };
};
/*
const synchronousWrap = (f) => (d, c) => {
  c.next(f(d));
};
*/


var parseType = function parseType(task) {
  if (typeof task === 'function') {
    return {
      action: task,
      details: {
        action: task
      }
    };
  }

  if (task && typeof task.action === 'function') {
    return {
      action: task.action,
      details: task
    };
  }

  if (task && task.action && typeof task.action.run === 'function') {
    return {
      action: nestedPlWrap(task.action),
      details: task
    };
  }

  if (task && typeof task.run === 'function') {
    return {
      action: nestedPlWrap(task),
      details: {
        action: task
      }
    };
  }

  throw SyntaxError('Task in incorrect syntax', task);
};

var parseOptions = function parseOptions(task) {
  if (task.details.options) {
    var action = task.action;
    if (task.details.options.unblock) action = unblockWrap(action);
    if (task.details.options.skipError) action = skipErrorWrap(action);
    return action;
  }

  return task.action;
};

var parseTask = function parseTask(task) {
  var _task = parseType(task);

  _task.action = parseOptions(_task);
  return _task;
};

var parseTasks = function parseTasks(tasks) {
  var actions = [];
  var details = [];
  tasks.forEach(function (task) {
    var _parseTask = parseTask(task),
        action = _parseTask.action,
        _details = _parseTask._details;

    actions.push(action);
    details.push(_details);
  });
  return {
    details: details,
    actions: actions
  };
};

function Workflow(tasks) {
  {
    var _ref = tasks ? parseTasks(tasks) : {
      details: [],
      actions: []
    },
        details = _ref.details,
        actions = _ref.actions;

    this._details = details;
    this._actions = actions;
  }

  this.run = function run(data, finished) {
    var _this2 = this;

    var index = 0;
    var control = {};

    control.next = function (data2) {
      if (index < _this2._actions.length) {
        _this2._actions[index++](data2, control, index);
      } else if (index === _this2._actions.length) {
        index++;
        if (finished) finished(data2);
      }
    };

    control.exit = function (data2) {
      if (index < _this2._actions.length) {
        index = _this2._actions.length;
        control.next(data2);
      }
    };

    control.abort = function () {
      index = _this2._actions.length + 1;
    };

    control.next(data);
  };

  this._insertAtIndex = function _insertAtIndex(index, task) {
    var _parseTask2 = parseTask(task),
        details = _parseTask2.details,
        action = _parseTask2.action;

    this._details.splice(index, 0, details);

    this._actions.splice(index, 0, action);
  };

  this.add = function add(task) {
    var _parseTask3 = parseTask(task),
        details = _parseTask3.details,
        action = _parseTask3.action;

    this._actions.push(action);

    this._details.push(details);

    return this._actions.length;
  };

  this.insertBefore = function insertBefore(findFunc, task) {
    var _index = this._details.findIndex(findFunc);

    if (_index !== -1) this._insertAtIndex(_index, task);
    return _index;
  };

  this.insertAfter = function insertAfter(findFunc, task) {
    var _index = this._details.findIndex(findFunc);

    if (_index !== -1) {
      this._insertAtIndex(_index + 1, task);

      return _index + 1;
    }

    return -1;
  };

  this.findAndDelete = function findAndDelete(findFunc) {
    var _index = this._details.findIndex(findFunc);

    if (_index !== -1) {
      this._actions.splice(_index, 1);

      this._details.splice(_index, 1);
    }

    return _index;
  };
}

function Store() {
  var _this3 = this;

  this._values = {};
  this._listeners = {};
  this._reducers = {};

  this.get = function (key) {
    return _this3._values[key];
  };

  this.set = function (key, value) {
    var oldState = _this3._values[key];
    _this3._values[key] = value;
    if (_this3._listeners[key]) _this3._listeners[key].forEach(function (cb) {
      return cb(value, oldState, key);
    });
    return value;
  };

  this.setReducer = function (key, reducer) {
    _this3._reducers[key] = function (action) {
      var oldState = _this3._values[key];
      var result = reducer(oldState, action);
      _this3._values[key] = result;
      if (_this3._listeners[key] && oldState !== result) _this3._listeners[key].forEach(function (cb) {
        return cb(result, oldState, key);
      });
      return result;
    };
  };

  this.reduce = function (key, action) {
    return _this3._reducers[key] ? _this3._reducers[key](action) : false;
  };

  this.listen = function (key, listener) {
    if (_this3._listeners[key]) _this3._listeners[key].push(listener);else _this3._listeners[key] = [listener];
    return {
      remove: function remove() {
        var arr = _this3._listeners[key];
        return Boolean(deleteArrayEl(arr, listener) + 1);
      }
    };
  };
}

var store = new Store(); // eslint-disable-next-line consistent-return

var doAllAsync = function doAllAsync(arr, callback) {
  return new Promise(function (resolve, reject) {
    if (!Array.isArray(arr)) return reject(new TypeError());
    if (arr.length === 0) return resolve();
    var counter = 0;
    arr.forEach(function (el, index) {
      callback(el, index).then(function () {
        if (++counter === arr.length) resolve();
      })["catch"](function (err) {
        return reject(err);
      });
    });
  });
};

var drill = function drill(arr, obj) {
  return arr.reduce(function (acc, cur) {
    if (!acc) return undefined;
    return acc[cur];
  }, obj);
};
/**
 * Foreach loop that allows callbacks
 * @param {array} array
 * @param {callback} callback
 */


var forEachAsync = function forEachAsync(arr, callback) {
  return new Promise(function (resolve, reject) {
    if (!Array.isArray(arr)) reject(new TypeError());
    var index = 0;

    var next = function next() {
      if (index < arr.length) callback(arr[index], index++).then(next)["catch"](reject);else resolve();
    };

    next();
  });
};

var all = {
  forEachCallbacks: forEachCallbacks,
  doAllAsync: doAllAsync,
  doAll: doAll,
  Stash: Stash,
  drill: drill,
  randomArrayElement: randomEl,
  randomArrayElements: randomEls,
  randomInt: randomInt,
  extractRandomArrayElements: extractRandomEls,
  deleteArrayElement: deleteArrayEl,
  forEachAsync: forEachAsync,
  // experimental
  store: store,
  Workflow: Workflow,
  // to be deprecated for more explanatory names
  randomEl: randomEl,
  randomEls: randomEls,
  extractRandomEls: extractRandomEls,
  arrayDelete: deleteArrayEl,
  deleteArrayEl: deleteArrayEl
};
module.exports = all;
