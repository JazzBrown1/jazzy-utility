import extractRandomEls from './extractRandomEls';

export default (multiplier, arr) => {
  if (!Array.isArray(arr) || arr.length < 1) {
    throw new Error(
      'First argument must be an array with at least one element in it'
    );
  }
  return extractRandomEls(multiplier, arr.slice(0));
};
