import { forEach, isEmpty, isEqual } from "lodash";
export function getPersistedVisibility({ defaultVals, persistKey }) {
  return [
    function getDefaultState(a, b, globalState) {
      let toSpread;
      let toRet = [defaultVals];
      try {
        toSpread = localStorage.getItem(
          `${persistKey}${globalState?.sequenceData?.id}`
        );
        if (toSpread) {
          toSpread = JSON.parse(toSpread);
          toRet = [
            {
              ...defaultVals,
              ...toSpread
            },
            true
          ];
        }
      } catch (error) {
        console.error(`error getting default vis`, error);
        toRet = [defaultVals];
      }
      return toRet;
    },
    function afterEachHandler(newVis, globalState) {
      if (globalState?.sequenceData?.id) {
        const diff = {};
        forEach(newVis, (val, key) => {
          if (!isEqual(val, defaultVals[key])) {
            diff[key] = val;
          }
        });
        if (isEmpty(diff)) {
          localStorage.removeItem(
            `${persistKey}${globalState?.sequenceData?.id}`
          );
        } else {
          localStorage.setItem(
            `${persistKey}${globalState?.sequenceData?.id}`,
            JSON.stringify(diff)
          );
        }
      }
    }
  ];
}
