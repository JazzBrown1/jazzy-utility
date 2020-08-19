const drill = (arr, obj) => arr.reduce((acc, cur) => {
  if (!acc) return undefined;
  return acc[cur];
}, obj);

export default drill;
