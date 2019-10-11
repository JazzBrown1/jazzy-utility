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
  if (!Array.isArray(arr)) {
    throw new TypeError('randomEl input must be of type Array');
  }

  if (arr.length === 0) {
    throw new Error('randomEl cannot accept an empty array');
  }

  return arr[randomInt(0, arr.length - 1)];
});

var extractRandomEls = (function (multiplier, arr) {
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
});

var randomEls = (function (multiplier, arr) {
  if (!Array.isArray(arr) || arr.length < 1) {
    throw new Error('First argument must be an array with at least one element in it');
  }

  return extractRandomEls(multiplier, arr.slice(0));
});

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
    var _this = this;

    var index = 0;
    var control = {};

    control.next = function (data2) {
      if (index < _this._actions.length) {
        _this._actions[index++](data2, control, index);
      } else if (index === _this._actions.length) {
        index++;
        if (finished) finished(data2);
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

var index = {
  forEachCallbacks: forEachCallbacks,
  doAll: doAll,
  deleteArrayEl: arrayDelete,
  Stash: Stash,
  randomEl: randomEl,
  randomEls: randomEls,
  randomInt: randomInt,
  Workflow: Workflow,
  extractRandomEls: extractRandomEls,
  // to be deprecated
  arrayDelete: arrayDelete
};

export default index;
export { Stash, Workflow, arrayDelete, arrayDelete as deleteArrayEl, doAll, extractRandomEls, forEachCallbacks, randomEl, randomEls, randomInt };
