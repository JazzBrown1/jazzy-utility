/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
/* eslint-disable no-var */
/* eslint-disable no-undef */

var assert = require("assert");
var { Workflow } = require("../dist/main");

describe("Workflow", function() {
  describe("#run()", function() {
    it("runs workflow in order of task array when init", function(done) {
      var myTask = number => (data, control) => {
        data.log.push(number);
        control.next(data);
      };

      var myWorkflow = new Workflow([
        { action: myTask(1), id: "a" },
        { action: myTask(2), id: "b" },
        { action: myTask(3), id: "c" }
      ]);

      const myLog = [];

      myWorkflow.run({ number: 1, log: myLog }); // run without callback for coverage
      myWorkflow.run({ number: 1, log: myLog }, data => {
        done(assert.deepEqual(data.log, [1, 2, 3, 1, 2, 3]));
      });
    });
    it("can nest workflows as tasks", function(done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myNestedWorkflow = new Workflow([myTask, myTask]);

      var myWorkflow = new Workflow([
        { action: myTask },
        myTask,
        { action: myNestedWorkflow },
        myNestedWorkflow
      ]);
      myWorkflow.run({ number: 1 }, d => {
        done(assert.deepEqual(log, [1, 2, 3, 4, 5, 6]));
      });
    });
    it("runs workflow in order of task array when init", function(done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow([
        { action: myTask, id: "a" },
        { action: myTask, id: "b" },
        { action: myTask, id: "c" }
      ]);

      myWorkflow.run({ number: 1 }); // run without callback for coverage
      myWorkflow.run({ number: 1 }, d => {
        done(assert.deepEqual(log, [1, 2, 3, 1, 2, 3]));
      });
    });
    it("exits workflow and goes to finish function when control.exit() is called", function(done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow([
        { action: myTask, id: "a" },
        { action: (d, c) => c.exit(), id: "b" },
        { action: myTask, id: "c" }
      ]);

      myWorkflow.run({ number: 1 }, () => {
        done(assert.deepEqual(log, [1]));
      });
    });
    it("protects against finish being invoked twice", function(done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow([
        { action: myTask, id: "a" },
        {
          action: (d, c) => {
            c.exit();
            c.exit();
            c.next();
          },
          id: "b"
        },
        { action: myTask, id: "c" }
      ]);

      myWorkflow.run({ number: 1 }, () => {
        done(assert.deepEqual(log, [1]));
      });
    });
    it("exits workflow and does not call finish func when control.abort() is called", function(done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow([
        { action: myTask, id: "a" },
        {
          action: (d, c) => {
            c.abort();
            done();
          },
          id: "b"
        },
        { action: myTask, id: "c" }
      ]);

      myWorkflow.run({ number: 1 }, () => {
        done(assert.deepEqual(log, [1]));
      });
    });
    it("throws error when task is not in correct syntax", function(done) {
      try {
        const myVar = new Workflow([{ action: "foo", id: "a" }]);
      } catch (err) {
        done();
      }
    });
    it("puts tasks to back of event queue when unblocked option is chosen", function(done) {
      var myTask1 = (data, control) => {
        data.log.push(1);
        control.next(data);
      };

      var myTask2 = (data, control) => {
        data.log.push(2);
        control.next(data);
      };

      var myWorkflow = new Workflow([
        { action: myTask1, id: "a" },
        { action: myTask2, id: "b", options: { unblock: true } }
      ]);

      const myLog = [];

      myWorkflow.run({ number: 1, log: myLog }, () => {}); // run without callback for coverage

      myWorkflow.run({ number: 2, log: myLog }, data => {
        done(assert.deepEqual(data.log, [1, 1, 2, 2]));
      }); // run without callback for coverage
    });
    it("skips errors if skip error option is chosen", function(done) {
      var alwaysThrowsError = () => {
        throw new Error();
      };
      var neverThrowsError = (data, control) => {
        control.next(data);
      };
      var myWorkflow = new Workflow();
      myWorkflow.add({
        action: alwaysThrowsError,
        id: "a",
        options: {
          skipError: true
        }
      });
      myWorkflow.add({
        action: neverThrowsError,
        id: "a",
        options: {
          skipError: true
        }
      });
      myWorkflow.run({ number: 1 }, d => {
        done();
      });
    });
  });

  it("does not throw error if empty options obj is passed", function() {
    myWorkflow = new Workflow([{ action: (d, c) => c.next(), options: {} }]);
  });

  describe("#add()", function() {
    it("adds task at end of workflow", function(done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow();
      myWorkflow.add({ action: myTask, id: "a" });
      myWorkflow.add({ action: myTask, id: "b" });
      myWorkflow.add({ action: myTask, id: "c" });
      myWorkflow.run({ number: 1 }, d => {
        done(assert.deepEqual(log, [1, 2, 3]));
      });
    });
    it("throws error when task is not in correct syntax", function(done) {
      try {
        const myTask = (d, c) => {
          c.next();
        };
        const myWorkflow = new Workflow();
        myWorkflow.add({ action: myTask });
        myWorkflow.add({ foo: "foo" });
      } catch (err) {
        done();
      }
    });
  });
  describe("#insertAfter()", function() {
    it("return a number in the range", function(done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow();
      myWorkflow.add({ action: myTask, id: "a" });
      myWorkflow.add({ action: myTask, id: "b" });
      myWorkflow.insertAfter(e => e.id === "b", { action: myTask, id: "c" });
      myWorkflow.run({ number: 1 }, d => {
        done(assert.deepEqual(log, [1, 2, 3]));
      });
    });
    it("returns -1 if unable to find task", function() {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow();
      myWorkflow.add({ action: myTask, id: "a" });
      myWorkflow.add({ action: myTask, id: "b" });
      assert.equal(
        -1,
        myWorkflow.insertAfter(e => e.id === "g", { action: myTask, id: "c" })
      );
    });
    it("throws error when task is not in correct syntax", function(done) {
      try {
        const myTask = (d, c) => {
          c.next();
        };
        const myWorkflow = new Workflow();
        myWorkflow.add({ action: myTask, id: "a" });
        myWorkflow.insertAfter(task => task.id === "a", { foo: "foo" });
      } catch (err) {
        done();
      }
    });
  });
  describe("#insertBefore()", function() {
    it("return a number in the range", function(done) {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow();
      myWorkflow.add({ action: myTask, id: "a" });
      myWorkflow.add({ action: myTask, id: "c" });
      myWorkflow.insertBefore(e => e.id === "c", { action: myTask, id: "b" });
      myWorkflow.run({ number: 1 }, d => {
        done(assert.deepEqual(log, [1, 2, 3]));
      });
    });
    it("returns -1 if unable to find task", function() {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow();
      myWorkflow.add({ action: myTask, id: "a" });
      myWorkflow.add({ action: myTask, id: "b" });
      assert.equal(
        -1,
        myWorkflow.insertBefore(e => e.id === "g", {
          action: myTask,
          id: "c"
        })
      );
    });
    it("throws error when task is not in correct syntax", function(done) {
      try {
        const myTask = (d, c) => {
          c.next();
        };
        const myWorkflow = new Workflow();
        myWorkflow.add({ action: myTask, id: "a" });
        myWorkflow.insertBefore(task => task.id === "a", { foo: "foo" });
      } catch (err) {
        done();
      }
    });
  });
  describe("#findAndDelete()", function() {
    it("return a number in the range", function() {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow();
      myWorkflow.add({ action: myTask, id: "a" });
      myWorkflow.add({ action: myTask, id: "b" });
      myWorkflow.add({ action: myTask, id: "c" });
      assert.equal(2, myWorkflow.findAndDelete(e => e.id === "c"));
    });
    it("returns -1 if unable to find task", function() {
      var log = [];
      var myTask = (data, control) => {
        log.push(data.number++);
        control.next(data);
      };

      var myWorkflow = new Workflow();
      myWorkflow.add({ action: myTask, id: "a" });
      myWorkflow.add({ action: myTask, id: "b" });
      myWorkflow.add({ action: myTask, id: "c" });
      assert.equal(-1, myWorkflow.findAndDelete(e => e.id === "g"));
    });
  });
});
