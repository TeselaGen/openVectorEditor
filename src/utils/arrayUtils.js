export function insertItem(array, item, index) {
  return [...array.slice(0, index), item, ...array.slice(index)];
}

export function removeItem(array, index) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}
