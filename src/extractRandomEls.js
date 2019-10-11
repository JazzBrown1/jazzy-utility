import randomInt from './randomInt';

export default (multiplier, arr) => {
  if (!Array.isArray(arr) || arr.length < 1) {
    throw new Error(
      'First argument must be an array with at least one element in it'
    );
  }
  if (typeof multiplier !== 'number' || multiplier > 1) {
    throw new Error('Multiplier must be a number between 0 and 1');
  }
  const result = [];
  const groupAmount = Math.ceil(arr.length * multiplier);
  for (let i = 0; i < groupAmount; i++) {
    const index = randomInt(0, arr.length - 1);
    const el = arr.splice(index, 1)[0];
    result.push(el);
  }
  return result;
};
