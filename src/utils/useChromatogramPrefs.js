import { createLocalStorageStateHook } from "use-local-storage-state";
import React from "react";
import { MenuItem } from "@blueprintjs/core";

const useShowChromQualScores = createLocalStorageStateHook(
  "showChromQualScores",
  true
);
const ShowChromQualScoresMenu = ({ noOuter } = {}) =>
  function ShowChromQualScoresMenu(props) {
    const [showChromQualScores, setShowChromQualScores] =
      useShowChromQualScores();
    const inner = (
      <MenuItem
        {...props}
        text="Show Quality Scores"
        shouldDismissPopover={false}
        onClick={() => {
          setShowChromQualScores(!showChromQualScores);
        }}
        icon={showChromQualScores ? "small-tick" : "blank"}
      ></MenuItem>
    );
    if (noOuter) {
      return inner;
    }
    return (
      <MenuItem {...props} text="Chromatogram" shouldDismissPopover={false}>
        {inner}
      </MenuItem>
    );
  };
const chromatogramMenu = (opts) => ({
  text: "Chromatogram (Quality Scores)",
  cmd: "showChromQualScoresMenu",
  component: ShowChromQualScoresMenu(opts),
  shouldDismissPopover: false
});
export { chromatogramMenu, useShowChromQualScores };
