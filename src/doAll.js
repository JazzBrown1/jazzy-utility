const doAll = (arr, callback, finished) => {
  if (!Array.isArray(arr)) throw new TypeError();
  if (arr.length === 0) {
    if (finished) finished();
    return;
  }
  let counter = 0;
  const done = () => {
    if (++counter === arr.length && finished) finished();
  };
  arr.forEach((el, index) => {
    callback(el, index, done);
  });
};

export default doAll;
