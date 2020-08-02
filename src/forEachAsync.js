/**
 * Foreach loop that allows callbacks
 * @param {array} array
 * @param {callback} callback
 */

const forEachAsync = (arr, callback) => new Promise((resolve, reject) => {
  if (!Array.isArray(arr)) reject(new TypeError());
  let index = 0;
  const next = () => {
    if (index < arr.length) callback(arr[index], index++).then(next).catch(reject);
    else resolve();
  };
  next();
});

export default forEachAsync;
