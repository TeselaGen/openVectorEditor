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
      <div className="genbankFileView">
        <HTMLSelect
          fill={false}
          options={[
            { label: "Genbank", value: "genbank" },
            { label: "Fasta", value: "fasta" },
            { label: "Teselagen JSON", value: "teselagen" }
          ]}
          onChange={e => {
            this.setState({ fileTypeToView: e.target.value });
          }}
        />
        <textarea
          data-test="ve-genbank-text"
          readOnly
          // wrap="soft"
          style={{
            whiteSpace: "pre",
            overflowWrap: "normal",
            overflowX: "scroll",
            fontSize: 11,
            fontFamily: "monospace",
            width: 540,
            height: 350
          }}
          value={filestring}
        />
      </div>
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
