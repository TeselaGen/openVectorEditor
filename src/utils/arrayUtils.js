export function insertItem(array, item, index) {
  return [...array.slice(0, index), item, ...array.slice(index)];
}

export function removeItem(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function getLowerCaseObj(obj = {}) {
  let key,
    keys = Object.keys(obj);
  let n = keys.length;
  const newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = obj[key];
  }
  return newobj;
}
