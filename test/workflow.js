/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require('assert');
var { Workflow } = require('../dist/main');

describe('Workflow', function () {
  describe('#run()', function () {
    it('runs workflow in order of task array when init', function (done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow([
        { action: myTask, id: 'a' },
        { action: myTask, id: 'b' },
        { action: myTask, id: 'c' }
      ]);

      myFlow.run({ number: 1 }); // run without callback for coverage
      myFlow.run({ number: 1 }, (d) => {
        done(assert.deepEqual(log, [1, 2, 3, 1, 2, 3]));
      });
    });
    it('exits workflow and goes to finish function when control.exit() is called', function (done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow([
        { action: myTask, id: 'a' },
        { action: (d, c) => c.exit(), id: 'b' },
        { action: myTask, id: 'c' }
      ]);

      myFlow.run({ number: 1 }, () => {
        done(assert.deepEqual(log, [1]));
      });
    });
    it('protects against finish being invoked twice', function (done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow([
        { action: myTask, id: 'a' },
        {
          action: (d, c) => {
            c.exit();
            c.exit();
            c.next();
          },
          id: 'b'
        },
        { action: myTask, id: 'c' }
      ]);

      myFlow.run({ number: 1 }, () => {
        done(assert.deepEqual(log, [1]));
      });
    });
    it('exits workflow and does not call finish func when control.abort() is called', function (done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow([
        { action: myTask, id: 'a' },
        {
          action: (d, c) => {
            c.abort();
            done();
          },
          id: 'b'
        },
        { action: myTask, id: 'c' }
      ]);

      myFlow.run({ number: 1 }, () => {
        done(assert.deepEqual(log, [1]));
      });
    });
    it('throws error when task is not in correct syntax', function (done) {
      try {
        const myVar = new Workflow([{ action: 'foo', id: 'a' }]);
      } catch (err) {
        done();
      }
    });
  });
  describe('#add()', function () {
    it('adds task at end of workflow', function (done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow();
      myFlow.add({ action: myTask, id: 'a' });
      myFlow.add({ action: myTask, id: 'b' });
      myFlow.add({ action: myTask, id: 'c' });
      myFlow.run({ number: 1 }, (d) => {
        done(assert.deepEqual(log, [1, 2, 3]));
      });
    });
    it('throws error when task is not in correct syntax', function (done) {
      try {
        const myTask = (d, c) => {
          c.next();
        };
        const myFlow = new Workflow();
        myFlow.add({ action: myTask });
        myFlow.add({ foo: 'foo' });
      } catch (err) {
        done();
      }
    });
  });
  describe('#insertAfter()', function () {
    it('return a number in the range', function (done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow();
      myFlow.add({ action: myTask, id: 'a' });
      myFlow.add({ action: myTask, id: 'b' });
      myFlow.insertAfter((e) => e.id === 'b', { action: myTask, id: 'c' });
      myFlow.run({ number: 1 }, (d) => {
        done(assert.deepEqual(log, [1, 2, 3]));
      });
    });
    it('returns -1 if unable to find task', function () {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow();
      myFlow.add({ action: myTask, id: 'a' });
      myFlow.add({ action: myTask, id: 'b' });
      assert.equal(
        -1,
        myFlow.insertAfter((e) => e.id === 'g', { action: myTask, id: 'c' })
      );
    });
    it('throws error when task is not in correct syntax', function (done) {
      try {
        const myTask = (d, c) => {
          c.next();
        };
        const myFlow = new Workflow();
        myFlow.add({ action: myTask, id: 'a' });
        myFlow.insertAfter((task) => task.id === 'a', { foo: 'foo' });
      } catch (err) {
        done();
      }
    });
  });
  describe('#insertBefore()', function () {
    it('return a number in the range', function (done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow();
      myFlow.add({ action: myTask, id: 'a' });
      myFlow.add({ action: myTask, id: 'c' });
      myFlow.insertBefore((e) => e.id === 'c', { action: myTask, id: 'b' });
      myFlow.run({ number: 1 }, (d) => {
        done(assert.deepEqual(log, [1, 2, 3]));
      });
    });
    it('returns -1 if unable to find task', function () {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow();
      myFlow.add({ action: myTask, id: 'a' });
      myFlow.add({ action: myTask, id: 'b' });
      assert.equal(
        -1,
        myFlow.insertBefore((e) => e.id === 'g', { action: myTask, id: 'c' })
      );
    });
    it('throws error when task is not in correct syntax', function (done) {
      try {
        const myTask = (d, c) => {
          c.next();
        };
        const myFlow = new Workflow();
        myFlow.add({ action: myTask, id: 'a' });
        myFlow.insertBefore((task) => task.id === 'a', { foo: 'foo' });
      } catch (err) {
        done();
      }
    });
  });
  describe('#findAndDelete()', function () {
    it('return a number in the range', function () {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow();
      myFlow.add({ action: myTask, id: 'a' });
      myFlow.add({ action: myTask, id: 'b' });
      myFlow.add({ action: myTask, id: 'c' });
      assert.equal(2, myFlow.findAndDelete((e) => e.id === 'c'));
    });
    it('returns -1 if unable to find task', function () {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myFlow = new Workflow();
      myFlow.add({ action: myTask, id: 'a' });
      myFlow.add({ action: myTask, id: 'b' });
      myFlow.add({ action: myTask, id: 'c' });
      assert.equal(-1, myFlow.findAndDelete((e) => e.id === 'g'));
    });
  });
});
