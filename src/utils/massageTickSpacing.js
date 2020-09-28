import { some } from "lodash";

export function massageTickSpacing(spacing) {
  let toRet = spacing;
  if (spacing < 15) {
    return 10;
  }
  some(
    [20, 50, 100, 500, 1000, 2000, 5000, 10000, 50000, 100000, 1000000],
    (val) => {
      if (spacing < val) {
        toRet = val;
        return true;
      }
    }
  );

  return toRet;
}
