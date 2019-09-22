const noop = () => {};
const makeNestedFlow = (flow) => (data, control) => {
  flow.run(data, control.next);
};

const parseTask = (task) => {
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
const parseTasks = (tasks) => {
  const actions = [];
  tasks.forEach((task) => {
    actions.push(parseTask(task));
  });
  return actions;
};

export default function Workflow(tasks) {
  this._tasks = tasks || [];
  this._actions = tasks ? parseTasks(tasks) : [];

  this.run = function run(data, _finished) {
    const finished = _finished || noop;
    let index = 0;
    const control = {};
    control.next = (data2) => {
      if (index < this._actions.length) {
        this._actions[index++](data2, control, index);
      } else if (index === this._actions.length) {
        index++;
        finished(data2);
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
    const action = parseTask(task);
    this._tasks.splice(index, 0, task);
    this._actions.splice(index, 0, action);
  };

  this.add = function add(task) {
    const action = parseTask(task);
    this._actions.push(action);
    this._tasks.push(task);
  };

  this.insertBefore = function insertBefore(findFunc, task) {
    const _index = this._tasks.findIndex(findFunc);
    if (_index !== -1) this._insertAtIndex(_index, task);
    return _index;
  };

  this.insertAfter = function insertAfter(findFunc, task) {
    const _index = this._tasks.findIndex(findFunc);
    if (_index !== -1) {
      this._insertAtIndex(_index + 1, task);
      return _index + 1;
    }
    return -1;
  };

  this.findAndDelete = function findAndDelete(findFunc) {
    const _index = this._tasks.findIndex(findFunc);
    if (_index !== -1) {
      this._actions.splice(_index, 1);
      this._tasks.splice(_index, 1);
    }
    return _index;
  };
}
