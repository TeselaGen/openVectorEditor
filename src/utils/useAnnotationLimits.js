import { createLocalStorageStateHook } from "use-local-storage-state";
import React from "react";
import { MenuItem } from "@blueprintjs/core";

const useAnnotationLimits = createLocalStorageStateHook("annotationLimits", {
  features: 50,
  parts: 50,
  cutsites: 100
});
export default useAnnotationLimits;

export function LimitAnnotations({ type, ...rest }) {
  const [limits = {}, setLimits] = useAnnotationLimits();
  return (
    <MenuItem icon="blank" shouldDismissPopover={false} {...rest}>
      {[50, 100, 200, 400].map((n) => (
        <MenuItem
          shouldDismissPopover={false}
          icon={
            (
              !limits[type]
                ? n === 50 //if this hasn't been set yet, default it here
                : limits[type] === n
            )
              ? "small-tick"
              : "blank"
          }
          key={n}
          text={n}
          onClick={() => setLimits({ ...limits, [type]: n })}
        ></MenuItem>
      ))}
    </MenuItem>
  );
}
