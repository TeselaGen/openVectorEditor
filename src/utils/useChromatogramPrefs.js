import React from "react";
import { MenuItem } from "@blueprintjs/core";
import tgUseLocalStorageState from "tg-use-local-storage-state";

const useShowChromQualScores = () => {
  return tgUseLocalStorageState("showChromQualScores", { defaultValue: true });
};

const ShowChromQualScoresMenu = () =>
  function ShowChromQualScoresMenu(props) {
    const [showChromQualScores, setShowChromQualScores] =
      useShowChromQualScores();
    return (
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
  };
const chromatogramMenu = {
  text: "Chromatogram (Quality Scores)",
  cmd: "showChromQualScoresMenu",
  component: ShowChromQualScoresMenu(),
  shouldDismissPopover: false
};
export { chromatogramMenu, useShowChromQualScores };
