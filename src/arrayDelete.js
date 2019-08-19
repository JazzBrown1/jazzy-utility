const arrayDelete = (arr, item) => {
  if (!arr.isArray()) return false;
  const _index = arr.findIndex((_item) => item === _item);
  if (_index !== -1) {
    arr.splice(_index, 1);
    return true;
  }
  return false;
};

export default arrayDelete;
