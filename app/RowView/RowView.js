import some from 'lodash/collection/some'
// import moveCaret from '../VectorInteractionWrapper/moveCaret'
// import handleCaretMoved from '../VectorInteractionWrapper/handleCaretMoved'
// import prepareRowData from './prepareRowData'
import React from 'react';
import Draggable from 'react-draggable'
import { Decorator as Cerebral } from 'cerebral-view-react';
// import RowItem from './RowItem'
// import ReactList from 'react-list';
// import './style.scss';

var defaultContainerWidth = 400
var defaultCharWidth = 12
var defaultMarginWidth = 10
// var Combokeys = require("combokeys");
// var combokeys;

function noop() {
}

@Cerebral({
    annotationHeight: ['annotationHeight'],
    caretPosition: ['caretPosition'],     
    charWidth: ['charWidth'], 
    circularAndLinearTickSpacing: ['circularAndLinearTickSpacing'],    
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],         
    cutsites: ['cutsites'],
    orfs: ['orfData'],
    selectionLayer: ['selectionLayer'],
    sequenceData: ['sequenceData'],
    sequenceLength: ['sequenceLength'],
    sequenceName: ['sequenceData', 'name'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCaret: ['showCaret'],
    showSequence: ['showSequence'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations']     
})

export default class RowView extends React.Component {
    getNearestCursorPositionToMouseEvent(rowData, event, callback) {
        var charWidth = defaultCharWidth;
        var rowNotFound = true;
        var visibleRowsContainer = this.InfiniteScroller.items;
        //loop through all the rendered rows to see if the click event lands in one of them
        var nearestBP = 0;
        some(visibleRowsContainer.childNodes, function (rowDomNode) {
          var boundingRowRect = rowDomNode.getBoundingClientRect();
          if (event.clientY > boundingRowRect.top && event.clientY < boundingRowRect.top + boundingRowRect.height) {
              //then the click is falls within this row
              rowNotFound = false;
              var row = rowData[Number(rowDomNode.getAttribute('data-row-number'))];
              if (event.clientX - boundingRowRect.left < 0) {
                  nearestBP = row.start;
              } else {
                  var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left;
                  var numberOfBPsInFromRowStart = Math.floor((clickXPositionRelativeToRowContainer + charWidth / 2) / charWidth);
                  nearestBP = numberOfBPsInFromRowStart + row.start;
                  if (nearestBP > row.end + 1) {
                      nearestBP = row.end + 1;
                  }
              }
              return true //break the loop early because we found the row the click event landed in
          }
        })
        if (rowNotFound) {
            var {top, bottom} = visibleRowsContainer.getBoundingClientRect()
            var numbers = [top,bottom]
            var target = event.clientY
            var topOrBottom = numbers.map(function(value, index) {
              return [Math.abs(value - target), index];
            }).sort().map(function(value) {
              return numbers[value[1]];
            })[0];
            var rowDomNode
            if (topOrBottom === top) {
              rowDomNode = visibleRowsContainer.childNodes[0]
            } else {
              rowDomNode = visibleRowsContainer.childNodes[visibleRowsContainer.childNodes.length-1]
            }
            if (rowDomNode) {
              var row = rowData[Number(rowDomNode.getAttribute('data-row-number'))];
              //return the last bp index in the rendered rows
              nearestBP = row.end
            } else {
              nearestBP = 0
            }
        }
        callback({
            shiftHeld: event.shiftKey,
            nearestBP,
            caretGrabbed
        });
    }

    render() {
        var {
            sequenceData,
            sequenceLength,
            selectionLayer,
            sequenceName,
            cutsites,
            orfs,
            showAxis,
            showCaret,
            showCutsites,
            showFeatures,
            showOrfs,
            annotationHeight,
            spaceBetweenAnnotations,
            annotationVisibility,
            caretPosition,
            width=defaultContainerWidth,
            marginWidth=defaultMarginWidth,
            height=400,
            signals,
            bpsPerRow,
            rowData
        } = this.props;

        var renderItem = (index,key) =>{
            if (rowData[index]) {
                return (
                    <div data-row-number={index} key={key}>
                        <div className={'veRowItemSpacer'}/>
                        <RowItem {
                            ...{
                            ...rest,
                            sequenceLength: sequenceData.sequence.length,
                            width: width - marginWidth,
                            bpsPerRow,
                            }
                            }
                            row={rowData[index]}
                            />
                    </div>
                );
            } else {
                return null
            }
        }

        return (
            <Draggable
                bounds={{top: 0, left: 0, right: 0, bottom: 0}}
                onDrag={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorDragged)}
                }
                onStart={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, sequenceLength, signals.editorDragStarted)}
                }
                onStop={signals.editorDragStopped}
                >
                <div
                    ref={(ref) => this.rowViewComp = ref}
                    className="veRowView"
                    style={{
                        overflowY: "auto",
                        overflowX: "visible",
                        height,
                        marginLeft: marginWidth/2,
                    }}
                    onClick={(event) => {
                        this.getNearestCursorPositionToMouseEvent(rowData, event, editorClicked)}
                    }
                    >

                </div>
            </Draggable>
        );
    }
}

function getBpsPerRow({
    charWidth=defaultCharWidth,
    width=defaultContainerWidth,
    marginWidth=defaultMarginWidth
}) {
    return Math.floor((width-marginWidth)/charWidth)
}

function itemSizeEstimator(index, cache) {
  if (cache[index+1]) {
    return cache[index+1]
  }
  if (cache[index-1]) {
    return cache[index-1]
  }
  return 100
}
