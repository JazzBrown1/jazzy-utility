const deleteArrayEl = (arr, item) => {
  if (!Array.isArray(arr)) return false;
  const _index = arr.findIndex((_item) => item === _item);
  if (_index !== -1) {
    arr.splice(_index, 1);
    return _index;
  }
  return -1;
};

export default deleteArrayEl;
