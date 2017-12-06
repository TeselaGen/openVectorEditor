import { jsonToGenbank, jsonToFasta } from "bio-parsers";
import FileSaver from "file-saver";
import React from "react";
import { Icon, IconClasses, Button } from "@blueprintjs/core";

export default {
  updateKeys: ["toggleDropdown"],
  itemProps: ({ toggleDropdown }) => {
    return {
      Icon: <Icon iconName={IconClasses.IMPORT} />,
      onIconClick: toggleDropdown,
      Dropdown,
      noDropdownIcon: true,
      tooltip: "Download"
    };
  }
};

function Dropdown({ sequenceData }) {
  return (
    <div>
      <Button
        style={{ marginRight: 10 }}
        onClick={() => {
          let blob = new Blob([jsonToGenbank(sequenceData)], {
            type: "text/plain"
          });
          FileSaver.saveAs(
            blob,
            `${sequenceData.name ? sequenceData.name : "Untitled_Sequence"}.gb`
          );
        }}
      >
        {" "}
        Download Genbank{" "}
      </Button>
      <Button
        onClick={() => {
          let blob = new Blob([jsonToFasta(sequenceData)], {
            type: "text/plain"
          });
          FileSaver.saveAs(
            blob,
            `${
              sequenceData.name ? sequenceData.name : "Untitled_Sequence"
            }.fasta`
          );
        }}
      >
        {" "}
        Download Fasta{" "}
      </Button>
    </div>
  );
}
