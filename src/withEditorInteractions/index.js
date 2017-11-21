import basicContext from "basiccontext";
import "basiccontext/dist/basicContext.min.css";
import "basiccontext/dist/themes/default.min.css";
import {
  getReverseComplementSequenceString,
  getSequenceDataBetweenRange
} from "ve-sequence-utils";
import { getSequenceWithinRange } from "ve-range-utils";
import Clipboard from "clipboard";
import { compose } from "redux";
import {
  insertSequenceDataAtPositionOrRange,
  deleteSequenceDataAtRange
} from "ve-sequence-utils";
import Keyboard from "./Keyboard";

import withEditorProps from "../withEditorProps";
import updateSelectionOrCaret from "../utils/selectionAndCaretUtils/updateSelectionOrCaret";
import {
  normalizePositionByRangeLength
  // convertRangeTo1Based
} from "ve-range-utils";
import { getRangeLength } from "ve-range-utils";
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

//withEditorInteractions is meant to give "interaction" props like "onDrag, onCopy, onKeydown" to the circular/row/linear views
function VectorInteractionHOC(Component /* options */) {
  return class VectorInteractionWrapper extends React.Component {
    componentWillUnmount() {
      this.combokeys && this.combokeys.detach();
    }
    componentDidMount() {
      let {
        // sequenceDataInserted = noop,
        selectAll = noop,
        selectInverse = noop
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
        this.handleDnaDelete(event);
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
      if (readOnly) {
        window.toastr.warning("Sorry the sequence is Read-Only");
      } else {
        createSequenceInputPopup({
          isReplace,
          selectionLayer,
          sequenceLength,
          caretPosition,
          handleInsert: seqDataToInsert => {
            updateSequenceData(
              insertSequenceDataAtPositionOrRange(
                seqDataToInsert,
                sequenceData,
                caretPosition > -1 ? caretPosition : selectionLayer
              )
            );
            window.toastr.success("Sequence Updated Successfully");
          }
        });
      }
    }
    handleDnaDelete() {
      let {
        caretPosition = -1,
        selectionLayer = { start: -1, end: -1 },
        sequenceData = { sequence: "" },
        readOnly,
        updateSequenceData
        // handleInsert
      } = this.props;
      const sequenceLength = sequenceData.sequence.length;
      if (readOnly) {
        return window.toastr.warning("Sorry the sequence is Read-Only");
      }
      if (sequenceLength > 0) {
        let rangeToDelete = selectionLayer;
        if (caretPosition > 0) {
          rangeToDelete = {
            start: normalizePositionByRangeLength(
              caretPosition - 1,
              sequenceLength
            ),
            end: normalizePositionByRangeLength(
              caretPosition - 1,
              sequenceLength
            )
          };
        }
        const newSeqData = deleteSequenceDataAtRange(
          sequenceData,
          rangeToDelete
        );
        updateSequenceData(newSeqData);
        window.toastr.success("Sequence Deleted Successfully");
      }
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

    cutsiteClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const { annotationSelect, annotationDeselectAll } = this.props;
      this.updateSelectionOrCaret(event.shiftKey, annotation.topSnipPosition);
      annotationDeselectAll(undefined);
      annotationSelect(annotation);
    };

    generateSelectionMenuOptions = annotation => {
      const {
        // editorName,
        sequenceData,
        selectionLayer,
        readOnly,
        // dispatch,
        upsertTranslation,
        showAddOrEditFeatureDialog
      } = this.props;
      const { sequence } = sequenceData;
      const selectedSeq = getSequenceWithinRange(selectionLayer, sequence);
      const handleDaCopy = e => {
        this.handleCopy(e);
        document.body.removeEventListener("copy", handleDaCopy);
      };
      const makeTextCopyable = stringToCopy => {
        let clipboard = new Clipboard(".basicContext", {
          text: function() {
            document.body.addEventListener("copy", handleDaCopy);
            return stringToCopy;
          }
        });
        clipboard.on("success", (/* e */) => {
          clipboard.destroy();
        });
        clipboard.on("error", () => {
          clipboard.destroy();
          console.error("Error copying selection.");
        });
      };
      let items = [
        {
          title: "Copy",
          fn: function() {
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
                  showAddOrEditFeatureDialog();
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
        }
      ];
      return items;
    };
    normalizeAction = ({ event, ...rest }, handler) => {
      event.preventDefault();
      event.stopPropagation();
      return handler({ event, ...rest }, this.props);
    };
    normalizeRightClickAction = (...args) => {
      const items = this.normalizeAction(...args);
      basicContext.show(items, args[0].event);
    };

    selectionLayerRightClicked = ({ event, annotation }) => {
      event.preventDefault();
      event.stopPropagation();
      const items = this.generateSelectionMenuOptions(annotation);
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
      const {
        readOnly,
        upsertTranslation,
        showAddOrEditFeatureDialog
      } = this.props;
      let items = [
        ...(readOnly
          ? []
          : [
              {
                title: "Edit Feature",
                fn: function() {
                  showAddOrEditFeatureDialog(annotation);
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
      const {
        showAddOrEditPrimerDialog,
        readOnly,
        upsertTranslation
      } = this.props;
      let items = [
        ...(readOnly
          ? []
          : [
              {
                title: "Edit Primer",
                fn: function() {
                  showAddOrEditPrimerDialog(annotation);
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
        sequenceData = { sequence: "" },
        fitHeight
      } = this.props;

      //do this in two steps to determine propsToPass
      let {
        children,
        disableEditorClickAndDrag = false,
        ...propsToPass
      } = this.props;
      const { width, height } = this.props.dimensions;
      propsToPass.width = width;
      if (fitHeight) {
        propsToPass.height = height;
      }
      let selectedBps = getSequenceWithinRange(
        selectionLayer,
        sequenceData.sequence
      );
      if (!disableEditorClickAndDrag) {
        propsToPass = {
          ...propsToPass,
          selectionLayerRightClicked: this.selectionLayerRightClicked,
          featureRightClicked: this.featureRightClicked,
          orfClicked: this.annotationClicked,
          orfRightClicked: this.orfRightClicked,
          deletionLayerRightClicked: this.deletionLayerRightClicked,
          primerClicked: this.annotationClicked,
          primerRightClick: this.primerRightClick,
          translationClicked: this.annotationClicked,
          cutsiteClicked: this.cutsiteClicked,
          translationRightClicked: this.translationRightClicked,
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
