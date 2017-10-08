import draggableClassnames from "../constants/draggableClassnames";
// import some from "lodash/some";
import prepareRowData from "../utils/prepareRowData";
import React from "react";
import Draggable from "react-draggable";
import RowItem from "../RowItem";
import "./style.css";

let defaultMarginWidth = 10;
// import Combokeys from "combokeys";
// var combokeys;

function noop() {}

export default class LinearView extends React.Component {
  getNearestCursorPositionToMouseEvent(rowData, event, callback) {
    let rowNotFound = true;
    //loop through all the rendered rows to see if the click event lands in one of them
    let nearestCaretPos = 0;
    let rowDomNode = this.linearView;
    let boundingRowRect = rowDomNode.getBoundingClientRect();
    if (
      event.clientY > boundingRowRect.top &&
      event.clientY < boundingRowRect.top + boundingRowRect.height
    ) {
      //then the click is falls within this row
      rowNotFound = false;
      let row = rowData[0];
      if (event.clientX - boundingRowRect.left < 0) {
        nearestCaretPos = row.start;
      } else {
        let clickXPositionRelativeToRowContainer =
          event.clientX - boundingRowRect.left;
        let numberOfBPsInFromRowStart = Math.floor(
          (clickXPositionRelativeToRowContainer + this.charWidth / 2) /
            this.charWidth
        );
        nearestCaretPos = numberOfBPsInFromRowStart + row.start;
        if (nearestCaretPos > row.end + 1) {
          nearestCaretPos = row.end + 1;
        }
      }
    }

    if (rowNotFound) {
      // var { top, bottom } = rowDomNode.getBoundingClientRect();
      // var numbers = [top, bottom];
      // var target = event.clientY;
      // var topOrBottom = numbers
      //   .map(function(value, index) {
      //     return [Math.abs(value - target), index];
      //   })
      //   .sort()
      //   .map(function(value) {
      //     return numbers[value[1]];
      //   })[0];

      nearestCaretPos = 0;
    }
    const callbackVals = {
      shiftHeld: event.shiftKey,
      nearestCaretPos,
      caretGrabbed: event.target.className === "cursor",
      selectionStartGrabbed: event.target.classList.contains(
        draggableClassnames.selectionStart
      ),
      selectionEndGrabbed: event.target.classList.contains(
        draggableClassnames.selectionEnd
      )
    };
    callback(callbackVals);
  }

  // componentDidMount() {
  //     var {
  //         sequenceDataInserted=noop,
  //         backspacePressed=noop,
  //         selectAll=noop,
  //         selectInverse=noop,
  //     } = {...this.props.veWrapperProvidedProps, ...this.props};

  //     // combokeys = new Combokeys(document.documentElement);
  //     // if (!this.linearView) {
  //     //     console.warn('thomas yargh1!@#!@#!@#')
  //     // }
  //     combokeys = new Combokeys(this.linearView);
  //     // bindGlobalPlugin(combokeys);
  //     var self = this

  //     //bind a bunch of keyboard shortcuts we're interested in catching
  //     //we're using the "mousetrap" library (available thru npm: https://www.npmjs.com/package/br-mousetrap)
  //     //documentation: https://craig.is/killing/mice
  //     combokeys.bind(['a', 'b', 'c', 'd', 'g', 'h', 'k', 'm', 'n', 'r', 's', 't', 'v', 'w', 'y'], function(event) { // type in bases
  //         sequenceDataInserted({newSequenceData: {sequence: String.fromCharCode(event.charCode)}});
  //     });

  //     var moveCaretBindings = [
  //         { keyCombo: ['left','shift+left'] ,type: 'moveCaretLeftOne'},
  //         { keyCombo: ['right','shift+right'] ,type: 'moveCaretRightOne'},
  //         { keyCombo: ['up','shift+up']  ,type: 'moveCaretUpARow'},
  //         { keyCombo: ['down','shift+down'] ,type: 'moveCaretDownARow'},
  //         { keyCombo: ['mod+right','mod+shift+right'] ,type: 'moveCaretToEndOfRow'},
  //         { keyCombo: ['mod+left','mod+shift+left'] ,type: 'moveCaretToStartOfRow'},
  //         { keyCombo: ['mod+up','mod+shift+up'] ,type: 'moveCaretToStartOfSequence'},
  //         { keyCombo: ['mod+down','mod+shift+down'] ,type: 'moveCaretToEndOfSequence'},
  //     ]

  //     moveCaretBindings.forEach(function ({keyCombo, type}) {
  //         combokeys.bind(keyCombo, function (event) {
  //             var shiftHeld = event.shiftKey;
  //             var bpsPerRow = getBpsPerRow(self.props)
  //             var {selectionLayer, caretPosition, sequenceLength, circular, caretPositionUpdate, selectionLayerUpdate} = self.props
  //             var moveBy = moveCaret({sequenceLength, bpsPerRow, caretPosition, selectionLayer, shiftHeld, type})
  //             handleCaretMoved({
  //                 moveBy,
  //                 circular,
  //                 sequenceLength,
  //                 bpsPerRow,
  //                 caretPosition,
  //                 selectionLayer,
  //                 shiftHeld,
  //                 type,
  //                 caretPositionUpdate,
  //                 selectionLayerUpdate,
  //             })
  //             event.stopPropagation();
  //         })
  //     })

  //     combokeys.bind('backspace', function(event) { // Handle shortcut
  //         backspacePressed();
  //         event.stopPropagation();
  //         event.preventDefault();
  //     });
  //     combokeys.bind('command+a', function(event) { // Handle shortcut
  //         selectAll();
  //         event.stopPropagation();
  //     });
  //     combokeys.bind('command+ctrl+i', function(event) { // Handle shortcut
  //         selectInverse();
  //         event.stopPropagation();
  //     });
  // }

  render() {
    let propsToUse = { ...this.props.veWrapperProvidedProps, ...this.props };
    let {
      //currently found in props
      sequenceData = {},
      // bpToJumpTo=0,
      hideName = false,
      editorDragged = noop,
      editorDragStarted = noop,
      editorClicked = noop,
      editorDragStopped = noop,
      width = 400,
      marginWidth = defaultMarginWidth,
      height,
      ...rest
    } = propsToUse;
    let innerWidth = width - marginWidth;
    this.charWidth = innerWidth / sequenceData.sequence.length;
    // var containerWidthMinusMargin = width - marginWidth
    let bpsPerRow = sequenceData.sequence.length;
    let sequenceLength = sequenceData.sequence.length;
    let sequenceName = hideName ? "" : sequenceData.name || "";
    let rowData = prepareRowData(sequenceData, bpsPerRow);
    return (
      <Draggable
        bounds={{ top: 0, left: 0, right: 0, bottom: 0 }}
        onDrag={event => {
          this.getNearestCursorPositionToMouseEvent(
            rowData,
            event,
            editorDragged
          );
        }}
        onStart={event => {
          this.getNearestCursorPositionToMouseEvent(
            rowData,
            event,
            editorDragStarted
          );
        }}
        onStop={editorDragStopped}
      >
        <div
          ref={ref => (this.linearView = ref)}
          className="veLinearView"
          style={{
            height,
            width,
            marginLeft: marginWidth / 2
            // marginRight: marginWidth/2
          }}
          onClick={event => {
            this.getNearestCursorPositionToMouseEvent(
              rowData,
              event,
              editorClicked
            );
          }}
        >
          <SequenceName {...{ sequenceName, sequenceLength }} />
          <RowItem
            {...{
              ...rest,
              sequenceLength: sequenceData.sequence.length,
              width: innerWidth,
              bpsPerRow,
              tickSpacing: Math.floor(bpsPerRow / 10),
              annotationVisibility: {
                ...rest.annotationVisibility,
                caret: false,
                yellowAxis: true,
                translations: false
              }
            }}
            row={rowData[0]}
          />
        </div>
      </Draggable>
    );
  }
}

function SequenceName({ sequenceName, sequenceLength }) {
  return (
    <div
      key="circViewSvgCenterText"
      //className={"veCircularViewMiddleOfVectorText"}
      style={{ textAlign: "center" }}
    >
      <span>
        {sequenceName}{" "}
      </span>
      <br />
      <span>
        {sequenceLength + " bps"}
      </span>
    </div>
  );
}
