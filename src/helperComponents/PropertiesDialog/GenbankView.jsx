import React from "react";
// import { Button } from "@blueprintjs/core";
import {
  jsonToGenbank,
  jsonToFasta,
  cleanUpTeselagenJsonForExport
} from "bio-parsers";
import { HTMLSelect } from "@blueprintjs/core";
import { connectToEditor } from "../../withEditorProps";
import { compose } from "recompose";

class GenbankView extends React.Component {
  state = {
    fileTypeToView: "genbank"
  };
  render() {
    const { sequenceData = {} } = this.props;
    let filestring;
    switch (this.state.fileTypeToView) {
      case "fasta":
        filestring = jsonToFasta(sequenceData);
        break;
      case "teselagen":
        filestring = JSON.stringify(
          cleanUpTeselagenJsonForExport(sequenceData),
          null,
          4
        );
        break;
      default:
        filestring = jsonToGenbank(sequenceData);
    }

    return (
      <>
        <HTMLSelect
          className="genbankFileView-type"
          fill={false}
          options={[
            { label: "Genbank", value: "genbank" },
            { label: "Fasta", value: "fasta" },
            { label: "Teselagen JSON", value: "teselagen" }
          ]}
          onChange={(e) => {
            this.setState({ fileTypeToView: e.target.value });
          }}
        />
        <textarea
          data-test="ve-genbank-text"
          readOnly
          onclick="this.select()"
          style={{
            whiteSpace: "pre",
            overflowWrap: "normal",
            overflowX: "scroll",
            fontSize: 11,
            fontFamily: "monospace",
            height: 350
          }}
          value={filestring}
        />
      </>
    );
  }
}

export default compose(
  connectToEditor(({ sequenceData = {} }) => {
    return {
      sequenceData
    };
  })
)(GenbankView);
