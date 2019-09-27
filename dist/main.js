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

var noop = function noop() {};

var makeNestedFlow = function makeNestedFlow(flow) {
  return function (data, control) {
    flow.run(data, control.next);
  };
};

var parseTask = function parseTask(task) {
  if (typeof task === 'function') {
    return task;
  }

  if (task && typeof task.action === 'function') {
    return task.action;
  }

  if (task && task.action && typeof task.action.run === 'function') {
    return makeNestedFlow(task.action);
  }

  if (task && typeof task.run === 'function') {
    return makeNestedFlow(task);
  }

  throw SyntaxError('Task in incorrect syntax', task);
};

var parseTasks = function parseTasks(tasks) {
  var actions = [];
  tasks.forEach(function (task) {
    actions.push(parseTask(task));
  });
  return actions;
};

function Workflow(tasks) {
  this._tasks = tasks || [];
  this._actions = tasks ? parseTasks(tasks) : [];

  this.run = function run(data, _finished) {
    var _this = this;

    var finished = _finished || noop;
    var index = 0;
    var control = {};

    control.next = function (data2) {
      if (index < _this._actions.length) {
        _this._actions[index++](data2, control, index);
      } else if (index === _this._actions.length) {
        index++;
        finished(data2);
      }
    };

    control.exit = function (data2) {
      if (index < _this._actions.length) {
        index = _this._actions.length;
        control.next(data2);
      }
    };

    control.abort = function () {
      index = _this._actions.length + 1;
    };

    control.next(data);
  };

  this._insertAtIndex = function _insertAtIndex(index, task) {
    var action = parseTask(task);

    this._tasks.splice(index, 0, task);

    this._actions.splice(index, 0, action);
  };

  this.add = function add(task) {
    var action = parseTask(task);

    this._actions.push(action);

    this._tasks.push(task);
  };

  this.insertBefore = function insertBefore(findFunc, task) {
    var _index = this._tasks.findIndex(findFunc);

    if (_index !== -1) this._insertAtIndex(_index, task);
    return _index;
  };

  this.insertAfter = function insertAfter(findFunc, task) {
    var _index = this._tasks.findIndex(findFunc);

    if (_index !== -1) {
      this._insertAtIndex(_index + 1, task);

      return _index + 1;
    }

    return -1;
  };

  this.findAndDelete = function findAndDelete(findFunc) {
    var _index = this._tasks.findIndex(findFunc);

    if (_index !== -1) {
      this._actions.splice(_index, 1);

      this._tasks.splice(_index, 1);
    }

    return _index;
  };
}

module.exports = {
  forEachCallbacks: forEachCallbacks,
  doAll: doAll,
  arrayDelete: arrayDelete,
  Stash: Stash,
  randomEl: randomEl,
  randomInt: randomInt,
  Workflow: Workflow
};
