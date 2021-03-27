import { pickBy } from "lodash";
import { createSelector } from "reselect";
import { getLowerCaseObj } from "../utils/arrayUtils";
import { getCustomEnzymes } from "../utils/editorUtils";

export default createSelector(
  () => window.localStorage.getItem("customEnzymes"),
  (state, additionalEnzymes) => additionalEnzymes,
  (customEnzymesString, additionalEnzymes) => {
    return getLowerCaseObj(
      pickBy(
        {
          ...additionalEnzymes,
          ...getCustomEnzymes(customEnzymesString)
        },
        (val, key) => {
          if (!val) {
            console.error(
              "43ti3523: Error: Missing enzyme data for key: ",
              key,
              "Ignoring this enzyme"
            );
            return false;
          }

          // eslint-disable-next-line no-unused-vars
          for (const prop of [
            "forwardRegex",
            "reverseRegex",
            "topSnipOffset",
            "bottomSnipOffset",
            "site"
          ]) {
            if (val[prop] === undefined || val[prop] === null) {
              console.error(
                `23483g93h Error: Missing property ${prop} for enzyme ${key}. Ignoring this enzyme`
              );
              return false;
            }
          }
          return true;
        }
      )
    );
  }
);
