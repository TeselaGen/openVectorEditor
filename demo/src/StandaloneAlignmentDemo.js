import React from "react";

import { Dialog, Button } from "@blueprintjs/core";
import { times } from "lodash";
import { generateSequenceData } from "ve-sequence-utils";

const exampleAlignmentData = {
  alignmentTracks: times(10).map(() => {
    return {
      sequenceData: {
        ...generateSequenceData(10)
      },
      alignmentData: {
        ...generateSequenceData(10)
      }
    };
  })
};

export default class StandaloneAlignmentDemo extends React.Component {
  state = {
    isDialogOpen: false
  };
  mountEditor = () => {
    const alignment = window.createAlignmentView(this.node, {
      ...exampleAlignmentData,
      id: "pairwiseRun1",
      handleAlignmentRename: () => {
        console.info("alignment being renamed!");
      }, //this does nothing right now
      alignmentAnnotationVisibility: {
        features: true,
        parts: true
      },
      linearViewOptions: () => {
        return {
          selectionLayerRightClicked: ({ event }) => {
            window.tgCreateMenu(
              [
                {
                  text: "Selection Layer Right Clicked!"
                }
              ],
              undefined,
              event
            );
          }
        };
      }
    });

    setTimeout(() => {
      console.info("alignment.getState():", alignment.getState());
    }, 10000);
  };
  componentDidMount() {
    this.mountEditor();
  }
  render() {
    const inner = (
      <div
        className="standaloneDemoNode"
        style={{
          width: "100%",
          height: "100%",
          zIndex: 1050
        }}
        ref={(node) => {
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
