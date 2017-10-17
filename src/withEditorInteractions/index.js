import getSequenceWithinRange from "ve-range-utils/getSequenceWithinRange";
import { compose } from "redux";
import Keyboard from "./Keyboard";

import withEditorProps from "../withEditorProps";
import updateSelectionOrCaret from "../utils/selectionAndCaretUtils/updateSelectionOrCaret";
import AddOrEditFeatureDialog from "../helperComponents/AddOrEditFeatureDialog";
import normalizePositionByRangeLength from "ve-range-utils/normalizePositionByRangeLength";
import getRangeLength from "ve-range-utils/getRangeLength";
import React from "react";
import createSequenceInputPopup from "./createSequenceInputPopup";

import moveCaret from "../withEditorInteractions/moveCaret";
import handleCaretMoved from "../withEditorInteractions/handleCaretMoved";
import Combokeys from "combokeys";

// import draggableClassnames from "../constants/draggableClassnames";

function noop() {}
let draggingEnd = false;
let dragInProgress = false;
let caretPositionOnDragStart;
let selectionStartGrabbed;
let selectionEndGrabbed;

let defaultContainerWidth = 400;
let defaultCharWidth = 12;
let defaultMarginWidth = 50;

function getBpsPerRow({
  charWidth = defaultCharWidth,
  width = defaultContainerWidth,
  marginWidth = defaultMarginWidth
}) {
  return Math.floor((width - marginWidth) / charWidth);
}

function VectorInteractionHOC(Component, options) {
  console.log("options:", options);
  return class VectorInteractionWrapper extends React.Component {
    componentDidMount() {
      let {
        sequenceDataInserted = noop,
        backspacePressed = noop,
        selectAll = noop,
        selectInverse = noop,
        readOnly
      } = {
        ...this.props
      };

      // combokeys.stop();
      // combokeys.watch(this.node)

      this.combokeys = new Combokeys(this.node);
      // bindGlobalPlugin(this.combokeys);

      // bind a bunch of this.combokeys shortcuts we're interested in catching
      // we're using the "combokeys" library which extends mousetrap (available thru npm: https://www.npmjs.com/package/br-mousetrap)
      // documentation: https://craig.is/killing/mice
      // this.combokeys.bind(
      //     "meta+c",
      //   (event)=> {
      //     // type in bases
      //     console.log('event:',event)
      //     onCopy(event)
      //   }
      // )

      !readOnly &&
        this.combokeys.bind(
          [
            "a",
            "b",
            "c",
            "d",
            "g",
            "h",
            "k",
            "m",
            "n",
            "r",
            "s",
            "t",
            "v",
            "w",
            "y"
          ],
          function(event) {
            // type in bases
            sequenceDataInserted({
              newSequenceData: { sequence: String.fromCharCode(event.charCode) }
            });
          }
        );

      let moveCaretBindings = [
        { keyCombo: ["left", "shift+left"], type: "moveCaretLeftOne" },
        { keyCombo: ["right", "shift+right"], type: "moveCaretRightOne" },
        { keyCombo: ["up", "shift+up"], type: "moveCaretUpARow" },
        { keyCombo: ["down", "shift+down"], type: "moveCaretDownARow" },
        {
          keyCombo: ["alt+right", "alt+shift+right"],
          type: "moveCaretToEndOfRow"
        },
        {
          keyCombo: ["alt+left", "alt+shift+left"],
          type: "moveCaretToStartOfRow"
        },
        {
          keyCombo: ["alt+up", "alt+shift+up"],
          type: "moveCaretToStartOfSequence"
        },
        {
          keyCombo: ["alt+down", "alt+shift+down"],
          type: "moveCaretToEndOfSequence"
        }
      ];

      moveCaretBindings.forEach(({ keyCombo, type }) => {
        this.combokeys.bind(keyCombo, event => {
          let shiftHeld = event.shiftKey;
          let bpsPerRow = getBpsPerRow(this.props);
          let {
            selectionLayer,
            caretPosition,
            sequenceLength,
            circular,
            caretPositionUpdate,
            selectionLayerUpdate
          } = this.props;
          let moveBy = moveCaret({
            sequenceLength,
            bpsPerRow,
            caretPosition,
            selectionLayer,
            shiftHeld,
            type
          });
          handleCaretMoved({
            moveBy,
            circular,
            sequenceLength,
            bpsPerRow,
            caretPosition,
            selectionLayer,
            shiftHeld,
            type,
            caretPositionUpdate,
            selectionLayerUpdate
          });
          event.stopPropagation();
        });
      });

      this.combokeys.bind("backspace", event => {
        // Handle shortcut
        backspacePressed();
        event.stopPropagation();
        event.preventDefault();
      });
      this.combokeys.bind("command+a", event => {
        // Handle shortcut
        selectAll();
        event.stopPropagation();
      });
      this.combokeys.bind("command+ctrl+i", event => {
        // Handle shortcut
        selectInverse();
        event.stopPropagation();
      });
    }
    handlePaste(/* event */) {
      //tnr: commenting paste handling out for the time being
      // var {
      //     handlePaste=noop,
      // } = this.props
      // event.clipboardData.items[0].getAsString(function(clipboardString) {
      //     handlePaste({sequenceString:clipboardString});
      // });
    }

    render() {
      let {
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" },
        onCopy = noop,
        readOnly
      } = this.props;
      //do this in two steps to determine propsToPass
      let {
        children,
        disableEditorClickAndDrag = false,
        ...propsToPass
      } = this.props;
      let selectedBps = getSequenceWithinRange(
        selectionLayer,
        sequenceData.sequence
      );

      function onDnaInsert() {
        !readOnly &&
          createSequenceInputPopup({
            isReplace: selectionLayer.start > -1,
            selectionLayer,
            sequenceLength,
            caretPosition,
            replacementLayerUpdate: () => {}
          });
      }

      const selectionLayerUpdate = newSelection => {
        if (!newSelection) return;
        const { start, end } = newSelection;
        if (selectionLayer.start === start && selectionLayer.end === end) {
          return;
        }
        //we only call selectionLayerUpdate if we're actually changing something
        this.props.selectionLayerUpdate({
          start,
          end
        });
      };
      const caretPositionUpdate = position => {
        if (caretPosition === position) {
          return;
        }
        //we only call caretPositionUpdate if we're actually changing something
        this.props.caretPositionUpdate(position);
      };

      let sequenceLength = sequenceData.sequence.length;

      if (!disableEditorClickAndDrag) {
        propsToPass = {
          ...propsToPass,
          editorDragged: function({ nearestCaretPos }) {
            if (!dragInProgress) {
              //we're starting the drag, so update the caret position!
              if (!selectionStartGrabbed && !selectionEndGrabbed) {
                //we're not dragging the caret or selection handles
                caretPositionUpdate(nearestCaretPos);
              }
              dragInProgress = true;
              return;
            }
            if (selectionStartGrabbed) {
              handleSelectionStartGrabbed({
                caretPosition,
                selectionLayer,
                selectionLayerUpdate,
                nearestCaretPos,
                sequenceLength
              });
            } else if (selectionEndGrabbed) {
              handleSelectionEndGrabbed({
                caretPosition,
                selectionLayer,
                selectionLayerUpdate,
                nearestCaretPos,
                sequenceLength
              });
            } else {
              // else if (caretGrabbed) {
              //     handleCaretDrag({
              //         caretPosition,
              //         selectionLayer,
              //         selectionLayerUpdate,
              //         nearestCaretPos,
              //         sequenceLength
              //     })
              // }
              //dragging somewhere within the sequence
              //pass the caret position of the drag start
              handleCaretDrag({
                caretPosition: caretPositionOnDragStart,
                selectionLayer,
                selectionLayerUpdate,
                nearestCaretPos,
                sequenceLength
              });
            }
          },
          editorDragStarted: function(opts) {
            caretPositionOnDragStart = opts.nearestCaretPos; //bump the drag counter
            selectionStartGrabbed = opts.selectionStartGrabbed;
            selectionEndGrabbed = opts.selectionEndGrabbed;
          },
          editorClicked: function({ nearestCaretPos, shiftHeld }) {
            if (!dragInProgress) {
              //we're not dragging the caret or selection handles
              updateSelectionOrCaret({
                shiftHeld,
                sequenceLength,
                newRangeOrCaret: nearestCaretPos,
                caretPosition,
                selectionLayer,
                selectionLayerUpdate,
                caretPositionUpdate
              });
            }
          },
          editorDragStopped: function() {
            setTimeout(function() {
              dragInProgress = false;
            });
          }
        };
      }
      return (
        <div
          tabIndex={-1} //this helps with focusing using Keyboard's parentElement.focus()
          ref={c => (this.node = c)}
          className={"veVectorInteractionWrapper"}
        >
          <Keyboard
            value={selectedBps}
            onDnaInsert={onDnaInsert}
            onCopy={e => {
              onCopy(e, sequenceData, this.props);
            }}
            onPaste={this.handlePaste.bind(this)}
          />
          <AddOrEditFeatureDialog
            dialogName="AddOrEditFeatureDialog"
            noTarget
          />{" "}
          {/* we pass this dialog here */}
          <Component veWrapperProvidedProps={propsToPass} />
        </div>
      );
    }
  };
}

function handleSelectionStartGrabbed({
  caretPosition,
  selectionLayer,
  selectionLayerUpdate,
  nearestCaretPos,
  sequenceLength
}) {
  if (selectionLayer.start < 0) {
    handleNoSelectionLayerYet({
      caretPosition,
      selectionLayer,
      selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength
    });
  } else {
    //there must be a selection layer
    //we need to move the selection layer
    selectionLayerUpdate({
      start: nearestCaretPos,
      end: selectionLayer.end
    });
  }
}
function handleSelectionEndGrabbed({
  caretPosition,
  selectionLayer,
  selectionLayerUpdate,
  nearestCaretPos,
  sequenceLength
}) {
  if (selectionLayer.start < 0) {
    handleNoSelectionLayerYet({
      caretPosition,
      selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength
    });
  } else {
    //there must be a selection layer
    //we need to move the selection layer
    let newEnd = normalizePositionByRangeLength(
      nearestCaretPos - 1,
      sequenceLength
    );
    selectionLayerUpdate({
      start: selectionLayer.start,
      end: newEnd
    });
  }
}
function handleNoSelectionLayerYet({
  caretPosition,
  selectionLayerUpdate,
  nearestCaretPos,
  sequenceLength
}) {
  //no selection layer yet, so we'll start one if necessary
  // 0 1 2 3 4 5 6 7 8 9
  //    c
  //        n
  //
  let dragEnd = {
    start: caretPosition,
    end: normalizePositionByRangeLength(
      nearestCaretPos - 1,
      sequenceLength,
      true
    )
  };
  let dragStart = {
    start: nearestCaretPos,
    end: normalizePositionByRangeLength(caretPosition - 1, sequenceLength, true)
  };
  if (caretPosition === nearestCaretPos) {
    return; // do nothing because nearestCaretPos === caretPosition
  } else if (
    getRangeLength(dragEnd, sequenceLength) <
    getRangeLength(dragStart, sequenceLength)
  ) {
    draggingEnd = true; //the caret becomes the "selection end"
    selectionLayerUpdate(dragEnd);
  } else {
    draggingEnd = false; //the caret becomes the "selection end"
    selectionLayerUpdate(dragStart);
  }
}
function handleCaretDrag({
  caretPosition,
  selectionLayer,
  selectionLayerUpdate,
  nearestCaretPos,
  sequenceLength
}) {
  if (selectionLayer.start > -1) {
    //there is a selection layer
    draggingEnd
      ? handleSelectionEndGrabbed({
          caretPosition,
          selectionLayer,
          selectionLayerUpdate,
          nearestCaretPos,
          sequenceLength
        })
      : handleSelectionStartGrabbed({
          caretPosition,
          selectionLayer,
          selectionLayerUpdate,
          nearestCaretPos,
          sequenceLength
        });
  } else if (caretPosition > -1) {
    handleNoSelectionLayerYet({
      caretPosition,
      selectionLayer,
      selectionLayerUpdate,
      nearestCaretPos,
      sequenceLength
    });
  } else {
    console.warn("we should never be here...");
  }
}

export default compose(withEditorProps, VectorInteractionHOC);
