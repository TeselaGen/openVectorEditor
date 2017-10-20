import basicContext from "basiccontext";
import "basiccontext/dist/basicContext.min.css";
import "basiccontext/dist/themes/default.min.css";
import {
  getReverseComplementSequenceString,
  getSequenceDataBetweenRange
} from "ve-sequence-utils";
import getSequenceWithinRange from "ve-range-utils/getSequenceWithinRange";
import Clipboard from "clipboard";
import { compose } from "redux";
import { insertSequenceDataAtPositionOrRange } from "ve-sequence-utils";
import Keyboard from "./Keyboard";

import withEditorProps from "../withEditorProps";
import updateSelectionOrCaret from "../utils/selectionAndCaretUtils/updateSelectionOrCaret";
import AddOrEditFeatureDialog from "../helperComponents/AddOrEditFeatureDialog";
import AddOrEditPrimerDialog from "../helperComponents/AddOrEditPrimerDialog";
import {
  normalizePositionByRangeLength,
  convertRangeTo1Based
} from "ve-range-utils";
import getRangeLength from "ve-range-utils/getRangeLength";
import React from "react";
import createSequenceInputPopup from "./createSequenceInputPopup";

import moveCaret from "./moveCaret";
import handleCaretMoved from "./handleCaretMoved";
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
    componentWillUnmount() {
      this.combokeys && this.combokeys.detach();
    }
    componentDidMount() {
      let {
        // sequenceDataInserted = noop,
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

      !readOnly &&
        this.combokeys.bind(
          [
            "a",
            "b",
            "c",
            "d",
            "e",
            "f",
            "g",
            "h",
            "i",
            "j",
            "k",
            "l",
            "m",
            "n",
            "o",
            "p",
            "q",
            "r",
            "s",
            "t",
            "u",
            "v",
            "w",
            "x",
            "y",
            "z"
          ],
          event => {
            this.handleDnaInsert(event);
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
    updateSelectionOrCaret = (shiftHeld, newRangeOrCaret) => {
      const {
        selectionLayer,
        caretPosition,
        sequenceData = { sequence: "" }
      } = this.props;
      const sequenceLength = sequenceData.sequence.length;
      updateSelectionOrCaret({
        shiftHeld,
        sequenceLength,
        newRangeOrCaret,
        caretPosition,
        selectionLayer,
        selectionLayerUpdate: this.selectionLayerUpdate,
        caretPositionUpdate: this.caretPositionUpdate
      });
    };

    handlePaste = e => {
      this.handleDnaInsert(e);
    };

    handleCopy = e => {
      window.toastr.success("Selection Copied");
      const { onCopy = () => {}, sequenceData, selectionLayer } = this.props;
      onCopy(
        e,
        getSequenceDataBetweenRange(sequenceData, selectionLayer),
        this.props
      );
    };

    handleDnaInsert() {
      let {
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" },
        readOnly,
        updateSequenceData
        // handleInsert
      } = this.props;
      const sequenceLength = sequenceData.sequence.length;
      const isReplace = selectionLayer.start > -1;
      !readOnly &&
        createSequenceInputPopup({
          isReplace,
          selectionLayer,
          sequenceLength,

          caretPosition,
          handleInsert: seqDataToInsert => {
            console.log("seqDataToInsert:", seqDataToInsert);
            console.log(
              "insertSequenceDataAtPositionOrRange(seqDataToInsert, sequenceData, caretPosition > -1 ? caretPosition : selectionLayer):",
              insertSequenceDataAtPositionOrRange(
                seqDataToInsert,
                sequenceData,
                caretPosition > -1 ? caretPosition : selectionLayer
              )
            );
            updateSequenceData(
              insertSequenceDataAtPositionOrRange(
                seqDataToInsert,
                sequenceData,
                caretPosition > -1 ? caretPosition : selectionLayer
              )
            );
          }
        });
    }
    caretPositionUpdate = position => {
      let { caretPosition = -1 } = this.props;
      if (caretPosition === position) {
        return;
      }
      //we only call caretPositionUpdate if we're actually changing something
      this.props.caretPositionUpdate(position);
    };
    selectionLayerUpdate = newSelection => {
      let { selectionLayer = { start: -1, end: -1 } } = this.props;
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

    annotationClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const { annotationSelect, annotationDeselectAll } = this.props;
      this.updateSelectionOrCaret(event.shiftKey, annotation);
      annotationDeselectAll(undefined);
      annotationSelect(annotation);
    };
    selectionLayerRightClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const {
        editorName,
        sequenceData,
        selectionLayer,
        readOnly,
        dispatch,
        upsertTranslation
      } = this.props;
      const { sequence } = sequenceData;
      const selectedSeq = getSequenceWithinRange(selectionLayer, sequence);
      const handleDaCopy = e => {
        this.handleCopy(e);
        document.body.removeEventListener("copy", handleDaCopy);
      };
      const makeTextCopyable = stringToCopy => {
        let text = "";
        let clipboard = new Clipboard(".basicContext", {
          text: function() {
            document.body.addEventListener("copy", handleDaCopy);
            text = stringToCopy;
            return stringToCopy;
          }
        });
        clipboard.on(
          "success",
          (/* e */) => {
            clipboard.destroy();
            if (text.length === 0) {
              console.log("No Sequence To Copy");
            } else {
              console.log("Selection Copied!");
            }
          }
        );
        clipboard.on("error", () => {
          clipboard.destroy();
          console.error("Error copying selection.");
        });
      };
      let items = [
        {
          title: "Copy",
          fn: function() {
            console.log("selectedSeq:", selectedSeq);
            makeTextCopyable(selectedSeq);
          }
        },
        {
          title: "Copy Reverse Complement",
          fn: function() {
            makeTextCopyable(getReverseComplementSequenceString(selectedSeq));
          }
        },
        ...(readOnly
          ? []
          : [
              {
                title: "Create Feature",
                fn: function() {
                  dispatch({
                    type: "TG_SHOW_MODAL",
                    name: "AddOrEditFeatureDialog", //you'll need to pass a unique dialogName prop to the compoennt
                    props: {
                      editorName,
                      dialogProps: {
                        title: "Add Feature"
                      }
                    }
                  });
                }
              }
            ]),
        {
          title: "View Translation",
          // icon: "ion-plus-round",
          fn: function() {
            upsertTranslation({
              start: annotation.start,
              end: annotation.end,
              forward: true
            });
          }
        },
        {
          title: "View Translation",
          // icon: "ion-plus-round",
          fn: function() {
            upsertTranslation({
              start: annotation.start,
              end: annotation.end,
              forward: false
            });
          }
        }
        // ...extraItems

        // { title: 'Reset Login', icon: 'ion-person', fn: clicked },
        // { title: 'Help', icon: 'ion-help-buoy', fn: clicked },
        // { },
        // { title: 'Disabled', icon: 'ion-minus-circled', fn: clicked, disabled: true },
        // { title: 'Invisible', icon: 'ion-eye-disabled', fn: clicked, visible: false },
        // { title: 'Logout', icon: 'ion-log-out', fn: clicked }
      ];

      basicContext.show(items, event);
    };

    deletionLayerRightClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const { editorName, dispatch } = this.props;
      let items = [
        {
          title: "Remove Deletion",
          // icon: "ion-plus-round",
          fn: function() {
            dispatch({
              type: "DELETION_LAYER_DELETE",
              meta: { editorName },
              payload: { ...annotation }
            });
          }
        }
      ];

      basicContext.show(items, event);
    };
    featureRightClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const { editorName, readOnly, dispatch, upsertTranslation } = this.props;
      let items = [
        ...(readOnly
          ? []
          : [
              {
                title: "Edit Feature",
                fn: function() {
                  dispatch({
                    type: "TG_SHOW_MODAL",
                    name: "AddOrEditFeatureDialog", //you'll need to pass a unique dialogName prop to the compoennt
                    props: {
                      editorName,
                      dialogProps: {
                        title: "Edit Feature"
                      },
                      initialValues: {
                        ...convertRangeTo1Based(annotation)
                      }
                    }
                  });
                }
              }
            ]),
        {
          title: "View Translation",
          // icon: "ion-plus-round",
          fn: function() {
            upsertTranslation({
              start: annotation.start,
              end: annotation.end,
              forward: annotation.forward
            });
          }
        }
      ];

      basicContext.show(items, event);
    };
    primerRightClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const { editorName, readOnly, dispatch, upsertTranslation } = this.props;
      let items = [
        ...(readOnly
          ? []
          : [
              {
                title: "Edit Primer",
                fn: function() {
                  dispatch({
                    type: "TG_SHOW_MODAL",
                    name: "AddOrEditFeatureDialog", //you'll need to pass a unique dialogName prop to the compoennt
                    props: {
                      editorName,
                      dialogProps: {
                        title: "Edit Primer"
                      },
                      initialValues: {
                        ...convertRangeTo1Based(annotation)
                      }
                    }
                  });
                }
              }
            ]),
        {
          title: "View Translation",
          // icon: "ion-plus-round",
          fn: function() {
            upsertTranslation({
              start: annotation.start,
              end: annotation.end,
              forward: annotation.forward
            });
          }
        }
      ];

      basicContext.show(items, event);
    };
    orfRightClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const { upsertTranslation } = this.props;
      let items = [
        {
          title: "View Translation",
          // icon: "ion-plus-round",
          fn: function() {
            upsertTranslation({
              start: annotation.start,
              end: annotation.end,
              forward: annotation.forward
            });
          }
        }
      ];

      basicContext.show(items, event);
    };
    translationRightClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const { readOnly, deleteTranslation } = this.props;
      let items = [
        ...(readOnly
          ? []
          : [
              {
                title: "Delete Translation",
                fn: function() {
                  deleteTranslation(annotation);
                }
              }
            ])
      ];

      basicContext.show(items, event);
    };

    editorDragged = ({ nearestCaretPos }) => {
      let {
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" }
      } = this.props;
      let sequenceLength = sequenceData.sequence.length;

      if (!dragInProgress) {
        //we're starting the drag, so update the caret position!
        if (!selectionStartGrabbed && !selectionEndGrabbed) {
          //we're not dragging the caret or selection handles
          this.caretPositionUpdate(nearestCaretPos);
        }
        dragInProgress = true;
        return;
      }
      if (selectionStartGrabbed) {
        handleSelectionStartGrabbed({
          caretPosition,
          selectionLayer,
          selectionLayerUpdate: this.selectionLayerUpdate,
          nearestCaretPos,
          sequenceLength
        });
      } else if (selectionEndGrabbed) {
        handleSelectionEndGrabbed({
          caretPosition,
          selectionLayer,
          selectionLayerUpdate: this.selectionLayerUpdate,
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
          selectionLayerUpdate: this.selectionLayerUpdate,
          nearestCaretPos,
          sequenceLength
        });
      }
    };

    editorClicked = ({ nearestCaretPos, shiftHeld }) => {
      if (!dragInProgress) {
        //we're not dragging the caret or selection handles
        this.updateSelectionOrCaret(shiftHeld, nearestCaretPos);
      }
    };

    editorDragStarted = opts => {
      caretPositionOnDragStart = opts.nearestCaretPos; //bump the drag counter
      selectionStartGrabbed = opts.selectionStartGrabbed;
      selectionEndGrabbed = opts.selectionEndGrabbed;
    };
    editorDragStopped = () => {
      setTimeout(function() {
        dragInProgress = false;
      });
    };

    render() {
      const {
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" }
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
      if (!disableEditorClickAndDrag) {
        propsToPass = {
          ...propsToPass,
          primerRightClick: this.primerRightClick,
          selectionLayerRightClicked: this.selectionLayerRightClicked,
          featureRightClicked: this.featureRightClicked,
          orfRightClicked: this.orfRightClicked,
          translationRightClicked: this.translationRightClicked,
          deletionLayerRightClicked: this.deletionLayerRightClicked,
          primerClicked: this.annotationClicked,
          orfClicked: this.annotationClicked,
          translationClicked: this.annotationClicked,
          translationDoubleClicked: this.annotationClicked,
          deletionLayerClicked: this.annotationClicked,
          replacementLayerClicked: this.annotationClicked,
          featureClicked: this.annotationClicked,
          editorDragged: this.editorDragged,
          editorDragStarted: this.editorDragStarted,
          editorClicked: this.editorClicked,
          editorDragStopped: this.editorDragStopped
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
            onCopy={this.handleCopy}
            onPaste={this.handlePaste}
          />
          <AddOrEditFeatureDialog
            dialogName="AddOrEditFeatureDialog"
            noTarget
          />{" "}
          <AddOrEditPrimerDialog
            dialogName="AddOrEditPrimerDialog"
            noTarget
          />{" "}
          {/* we pass this dialog here */}
          <Component {...propsToPass} />
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
