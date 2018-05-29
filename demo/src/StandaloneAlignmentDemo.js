import React from "react";

import { Dialog, Button } from "@blueprintjs/core";
// import ab1ParsedGFPuv54 from "../../src/ToolBar/ab1ParsedGFPuv54.json";
// import ab1ParsedGFPuv58 from "../../src/ToolBar/ab1ParsedGFPuv58.json";
// import alignmentDataPairwise from "./exampleData/alignmentDataPairwise.json";
import alignmentDataPairwise from "./exampleData/jbeiPairwiseAlignmnent_23_2018.json";

// import exampleSequenceData from './exampleData/simpleSequenceData';

export default class StandaloneAlignmentDemo extends React.Component {
  state = {
    isDialogOpen: false
  };
  mountEditor = () => {
      window.createAlignmentView(this.node, {
        ...alignmentDataPairwise,
        id: "pairwiseRun1",
        linearViewOptions: () => {
          return {
            selectionLayerRightClicked: ({event}) => {
              window.tgCreateMenu([{
                text: "Selection Layer Right Clicked!"
              }], undefined, event)
            }
          }
        }
      });
  };
  componentDidMount() {
    this.mountEditor();
  }
  render() {
    const inner = (
      <div
        className={"standaloneDemoNode"}
        style={{
          width: "100%",
          height: "100%",
          background: "white",
          zIndex: 1050
        }}
        ref={node => {
          this.node = node;
        }}
      />
    );
    const { isDialogOpen } = this.state;
    return (
      <div>
        <Button
          onClick={() => {
            this.setState({ isDialogOpen: !isDialogOpen });
            this.mountEditor();
          }}
        >
          Open in a dialog
        </Button>
        {isDialogOpen ? (
          <Dialog
            style={{ width: 600 }}
            onClose={() => {
              this.setState({ isDialogOpen: false });
              this.mountEditor();
            }}
            backdropProps={{ style: { zIndex: 1050 } }}
            title="yooo"
            isOpen={isDialogOpen}
          >
            {inner}
          </Dialog>
        ) : (
          inner
        )}
      </div>
    );
  }
}

// function convertJbeiToTeselagen(seq) {
//   return seq;
// }
