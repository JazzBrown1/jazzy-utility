/**
 * Foreach loop that allows callbacks
 * @param {array} array
 * @param {callback} callback
 * @param {callback} finished
 */

const asyncForEach = (arr, callback, finished) => {
  let index = 0;
  const next = () => {
    if (index < arr.length) callback(arr[index], index++, next);
    else finished();
  };
  next();
};

export default asyncForEach;
