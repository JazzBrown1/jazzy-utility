const nestedPlWrap = (p) => (d, c) => {
  p.run(d, c.next);
};

const unblockWrap = (f) => (d, c) => {
  setTimeout(() => {
    f(d, c);
  }, 0);
};

const skipErrorWrap = (f) => (d, c) => {
  try {
    f(d, c);
  } catch (err) {
    c.next(d);
  }
};

/*
const synchronousWrap = (f) => (d, c) => {
  c.next(f(d));
};
*/

const parseType = (task) => {
  if (typeof task === 'function') {
    return { action: task, details: { action: task } };
  }
  if (task && typeof task.action === 'function') {
    return { action: task.action, details: task };
  }
  if (task && task.action && typeof task.action.run === 'function') {
    return { action: nestedPlWrap(task.action), details: task };
  }
  if (task && typeof task.run === 'function') {
    return { action: nestedPlWrap(task), details: { action: task } };
  }
  throw SyntaxError('Task in incorrect syntax', task);
};

const parseOptions = (task) => {
  if (task.details.options) {
    let { action } = task;
    if (task.details.options.unblock) action = unblockWrap(action);
    if (task.details.options.skipError) action = skipErrorWrap(action);
    return action;
  }
  return task.action;
};

const parseTask = (task) => {
  const _task = parseType(task);
  _task.action = parseOptions(_task);
  return _task;
};

const parseTasks = (tasks) => {
  const actions = [];
  const details = [];
  tasks.forEach((task) => {
    const { action, _details } = parseTask(task);
    actions.push(action);
    details.push(_details);
  });
  return { details, actions };
};

export default function Workflow(tasks) {
  {
    const { details, actions } = tasks
      ? parseTasks(tasks)
      : { details: [], actions: [] };
    this._details = details;
    this._actions = actions;
  }
  this.run = function run(data, finished) {
    let index = 0;
    const control = {};
    control.next = (data2) => {
      if (index < this._actions.length) {
        this._actions[index++](data2, control, index);
      } else if (index === this._actions.length) {
        index++;
        if (finished) finished(data2);
      }
    };
    control.exit = (data2) => {
      if (index < this._actions.length) {
        index = this._actions.length;
        control.next(data2);
      }
    };
    control.abort = () => {
      index = this._actions.length + 1;
    };
    control.next(data);
  };

  this._insertAtIndex = function _insertAtIndex(index, task) {
    const { details, action } = parseTask(task);
    this._details.splice(index, 0, details);
    this._actions.splice(index, 0, action);
  };

  this.add = function add(task) {
    const { details, action } = parseTask(task);
    this._actions.push(action);
    this._details.push(details);
    return this._actions.length;
  };

  this.insertBefore = function insertBefore(findFunc, task) {
    const _index = this._details.findIndex(findFunc);
    if (_index !== -1) this._insertAtIndex(_index, task);
    return _index;
  };

  this.insertAfter = function insertAfter(findFunc, task) {
    const _index = this._details.findIndex(findFunc);
    if (_index !== -1) {
      this._insertAtIndex(_index + 1, task);
      return _index + 1;
    }
    return -1;
  };

  this.findAndDelete = function findAndDelete(findFunc) {
    const _index = this._details.findIndex(findFunc);
    if (_index !== -1) {
      this._actions.splice(_index, 1);
      this._details.splice(_index, 1);
    }
    return _index;
  };
}
