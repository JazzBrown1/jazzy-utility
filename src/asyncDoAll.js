const asyncDoAll = (arr, callback, finished) => {
  if (arr.length === 0) {
    finished();
    return;
  }
  let counter = 0;
  const done = () => {
    if (++counter === arr.length) finished();
  };
  arr.forEach((el, index) => {
    callback(el, index, done);
  });
};

export default asyncDoAll;
