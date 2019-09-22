const noop = () => {};

const parseTask = (task) => typeof task.action !== 'function';
const parseTasks = (tasks) => {
  const errors = [];
  tasks.forEach((task, i) => {
    if (parseTask(task)) errors.push(i);
  });
  return errors.length === 0 ? false : errors;
};

export default function Workflow(tasks) {
  if (tasks && parseTasks(tasks)) {
    throw SyntaxError('Task in incorrect syntax', parseTasks(tasks));
  }
  this._tasks = tasks || [];
  this._actions = tasks ? tasks.map((e) => e.action) : [];

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
    this._tasks.splice(index, 0, task);
    this._actions.splice(index, 0, task.action);
  };

  this.add = function add(task) {
    if (parseTask(task)) throw SyntaxError('Task in incorrect format');
    this._tasks.push(task);
    this._actions.push(task.action);
  };

  this.insertBefore = function insertBefore(findFunc, task) {
    if (parseTask(task)) throw SyntaxError('Task in incorrect format');
    const _index = this._tasks.findIndex(findFunc);
    if (_index !== -1) this._insertAtIndex(_index, task);
    return _index;
  };

  this.insertAfter = function insertAfter(findFunc, task) {
    if (parseTask(task)) throw SyntaxError('Task in incorrect format');
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
