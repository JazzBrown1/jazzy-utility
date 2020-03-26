import deleteArrayEl from './deleteArrayEl';

function Store() {
  this._values = {};
  this._listeners = {};
  this._reducers = {};

  this.get = (key) => this._values[key];

  this.set = (key, value) => {
    const oldState = this._values[key];
    this._values[key] = value;
    if (this._listeners[key]) this._listeners[key].forEach((cb) => cb(value, oldState, key));
    return value;
  };

  this.setReducer = (key, reducer) => {
    this._reducers[key] = (action) => {
      const oldState = this._values[key];
      const result = reducer(oldState, action);
      this._values[key] = result;
      if (this._listeners[key] && oldState !== result) this._listeners[key].forEach((cb) => cb(result, oldState, key));
      return result;
    };
  };

  this.reduce = (key, action) => (this._reducers[key] ? this._reducers[key](action) : false);

  this.listen = (key, listener) => {
    if (this._listeners[key]) this._listeners[key].push(listener);
    else this._listeners[key] = [listener];
    return {
      remove: () => {
        const arr = this._listeners[key];
        return Boolean(deleteArrayEl(arr, listener) + 1);
      }
    };
  };
}

const store = new Store();

export { store, Store };
