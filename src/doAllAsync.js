// eslint-disable-next-line consistent-return
const doAllAsync = (arr, callback) => new Promise((resolve, reject) => {
  if (!Array.isArray(arr)) return reject(new TypeError());
  if (arr.length === 0) return resolve();
  let counter = 0;
  arr.forEach((el, index) => {
    callback(el, index)
      .then(() => { if (++counter === arr.length) resolve(); })
      .catch((err) => reject(err));
  });
});

export default doAllAsync;
