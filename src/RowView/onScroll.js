import { debounce } from "lodash";

export function onScroll() {
  window.__veScrolling = true;
  setTimeout(endScroll);
}
const endScroll = debounce(() => {
  window.__veScrolling = false;
}, 100);
