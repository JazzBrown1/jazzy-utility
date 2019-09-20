/**
 * Foreach loop that allows callbacks
 * @param {array} array
 * @param {callback} callback
 * @param {callback} finished
 */

const forEachCallbacks = (arr, callback, finished) => {
  if (!Array.isArray(arr)) throw new TypeError();
  let index = 0;
  const next = () => {
    if (index < arr.length) callback(arr[index], index++, next);
    else if (finished) finished();
  };
  next();
};

export default forEachCallbacks;
