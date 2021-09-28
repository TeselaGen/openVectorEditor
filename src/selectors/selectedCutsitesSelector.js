import { createSelector } from "reselect";
import selectedAnnotationsSelector from "./selectedAnnotationsSelector";

export default createSelector(
  selectedAnnotationsSelector,
  function (selectedAnnotations) {
    const { idStack, idMap } = selectedAnnotations;
    const cutsiteIdMap = {};
    const cutsiteIdStack = idStack.filter(function (id) {
      if (idMap[id].annotationType === "cutsite") {
        cutsiteIdMap[id] = idMap[id];
        return true;
      }
      return false;
    });
    return {
      idStack: cutsiteIdStack,
      idMap: cutsiteIdMap
    };
  }
);
