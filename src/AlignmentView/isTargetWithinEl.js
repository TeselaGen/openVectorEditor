// function Ident({ children }) {
//   return children;
// }
export function isTargetWithinEl(event, selector) {
  return event.target.closest(selector);
}
