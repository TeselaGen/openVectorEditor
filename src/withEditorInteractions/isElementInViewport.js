export function isElWithinAnotherEl(el, container) {
  if (el.left > container.right) return false;
  if (el.right < container.left) return false;
  return true;
}
const buffer = 13;
export function isElWithinAnotherElWithDiff(el, container) {
  const elWidth = el.right - el.left;
  const containerWidth = container.right - container.left;
  const space = containerWidth - elWidth;
  if (el.right > container.right) {
    let diff = container.right - el.right - space / 2;
    if (el.left + diff < container.left + buffer) {
      //too far to the left -- aka diff too negative
      diff += container.left + buffer - el.left - diff;
    }
    return [false, diff];
  }

  if (el.left < container.left) {
    let diff = container.left - el.left + space / 2;
    if (el.right + diff + buffer > container.right) {
      //too far to the right -- aka diff too big
      diff -= el.right + diff + buffer - container.right;
    }
    return [false, diff];
  }
  return [true];
}
