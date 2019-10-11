import randomInt from './randomInt';

export default (arr) => {
  if (!Array.isArray(arr)) {
    throw new TypeError('randomEl input must be of type Array');
  }
  if (arr.length === 0) {
    throw new Error('randomEl cannot accept an empty array');
  }
  return arr[randomInt(0, arr.length - 1)];
};
