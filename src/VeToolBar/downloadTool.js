import jsonToGenbank from "bio-parsers/parsers/jsonToGenbank";
import FileSaver from "file-saver";
import React from "react";
import save_img from "./veToolbarIcons/save.png";

export default () => {
  return {
    Icon: DownloadTool,
    tooltip: "Download .gb file",
    id: "download"
  };
};

function DownloadTool({ sequenceData }) {
  return (
    <div
      onClick={function() {
        let blob = new Blob([jsonToGenbank(sequenceData)], {
          type: "text/plain"
        });
        FileSaver.saveAs(blob, "result_plasmid.gb");
        // downloadSequenceData(sequenceData || )
      }}
    >
      <img src={save_img} alt="Download .gb file" />
    </div>
  );
}
