const removeDuplicatesObjectsWithIds = (arr) => {
  const keys = {};
  const newArray = [];
  // eslint-disable-next-line no-return-assign
  arr.forEach((el) => (!keys[el.id]) && (keys[el.id] = true) && newArray.push(el));
  return newArray;
};

const removeDuplicatesObjectsWithIds2 = (arr) => {
  const keys = {};
  return arr.filter((el) => {
    if (!keys[el.id]) {
      (keys[el.id] = true);
      return true;
    }
    return false;
  });
};

const removeDuplicatesObjectsWithIds3 = (arr) => {
  const keys = {};
  const newArray = [];
  arr.forEach((el) => {
    if (!keys[el.id]) {
      keys[el.id] = true;
      newArray.push(el);
    }
  });
  return newArray;
};

const removeDuplicatesObjectsWithIds4 = (arr) => {
  const keys = {};
  // eslint-disable-next-line no-return-assign
  arr.forEach((el) => {
    if (!keys[el.id]) {
      (keys[el.id] = el);
    }
  });
  return Object.keys(keys).map((key) => keys[key]);
};

const runTest = (func) => {
  const start1 = new Date();
  for (let i = 0; i < 250000; i++) {
    func([{ id: 2 }, { id: 1 }, { id: 1 }, { id: 4 }, { id: 7 }, { id: 8 }, { id: 8 }, { id: 1 }, { id: 1 }]);
  }
  const finish1 = new Date();
  const difference1 = new Date();
  difference1.setTime(finish1.getTime() - start1.getTime());
  return difference1.getSeconds() * 1000 + difference1.getMilliseconds();
};

const results = {
  Func1: [],
  Func2: [],
  Func3: [],
  Func4: [],
};

for (let i = 0; i < 50; i++) {
  results.Func1.push(runTest(removeDuplicatesObjectsWithIds));
  results.Func2.push(runTest(removeDuplicatesObjectsWithIds2));
  results.Func3.push(runTest(removeDuplicatesObjectsWithIds3));
  results.Func4.push(runTest(removeDuplicatesObjectsWithIds4));
}

const avg = (resultsArray) => resultsArray.reduce((a, b) => a + b, 0) / resultsArray.length;
console.log('1', avg(results.Func1));
console.log('2', avg(results.Func2));
console.log('3', avg(results.Func3));
console.log('4', avg(results.Func4));
