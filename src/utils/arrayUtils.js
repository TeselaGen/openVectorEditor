export function insertItem(array, item, index) {
  return [...array.slice(0, index), item, ...array.slice(index)];
}

export function removeItem(array, i) {
  return array.filter((_, j) => j !== Number(i));
}

export function getLowerCaseObj(obj = {}) {
  let key;
  const keys = Object.keys(obj);
  let n = keys.length;
  const newobj = {};
  while (n--) {
    key = keys[n];
    newobj[key.toLowerCase()] = obj[key];
  }
  return newobj;
}
