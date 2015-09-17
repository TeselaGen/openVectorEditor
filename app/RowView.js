var React = require('react');
var Draggable = require('react-draggable');
var RowItem = require('./RowItem.js');
var InfiniteScroller = require('react-variable-height-infinite-scroller');
var setCaretPosition = require('./actions/setCaretPosition');
var setSelectionLayer = require('./actions/setSelectionLayer');

var RowView = React.createClass({
    getNearestCursorPositionToMouseEvent: function(event) {
        var rowNotFound = true;
        var visibleRowsContainer = this.refs.InfiniteScroller.getVisibleRowsContainerDomNode();
        //loop through all the rendered rows to see if the click event lands in one of them
        for (var relativeRowNumber = 0; relativeRowNumber < visibleRowsContainer.childNodes.length; relativeRowNumber++) {
            var rowDomNode = visibleRowsContainer.childNodes[relativeRowNumber];
            var boundingRowRect = rowDomNode.getBoundingClientRect();
            // console.log('boundingRowRect.top', JSON.stringify(boundingRowRect.top,null,4));
            // console.log('boundingRowRect.height', JSON.stringify(boundingRowRect.height,null,4));
            if (event.clientY > boundingRowRect.top && event.clientY < boundingRowRect.top + boundingRowRect.height) {
                //then the click is falls within this row
                // console.log('HGGGG');
                rowNotFound = false;
                var rowNumber = this.refs.InfiniteScroller.state.visibleRows[relativeRowNumber];
                var row = this.props.rowData[rowNumber];
                if (event.clientX - boundingRowRect.left < 0) {
                    console.warn('this should never be 0...');
                    return row.start; //return the first bp in the row
                } else {
                    var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left;
                    var numberOfBPsInFromRowStart = Math.floor((clickXPositionRelativeToRowContainer + this.props.charWidth / 2) / this.props.charWidth);
                    var nearestBP = numberOfBPsInFromRowStart + row.start;
                    if (nearestBP > row.end + 1) {
                        nearestBP = row.end + 1;
                    }
                    // console.log('nearestBP', nearestBP);
                    return nearestBP;
                }
                break; //break the for loop early because we found the row the click event landed in
            }
        }
        if (rowNotFound) {
            console.warn('was not able to find the correct row');
            //return the last bp index in the rendered rows
            var lastOfRenderedRowsNumber = this.refs.InfiniteScroller.state.visibleRows[this.refs.InfiniteScroller.state.visibleRows.length - 1];
            var lastOfRenderedRows = this.props.rowData[lastOfRenderedRowsNumber];
            return lastOfRenderedRows.end;
        }
    },

    onEditorClick: function(event) {
        //if cursor position is different than the original position, reset the position and clear the selection
        // console.log('onclick!!');
        var bp = this.getNearestCursorPositionToMouseEvent(event);
        if (this.editorBeingDragged) {
            //do nothing because the click was triggered by a drag event
        } else {
            setCaretPosition(bp);
            setSelectionLayer(false);
        }

    },

    handleEditorDrag: function(event, ui) {
        //note this method relies on variables that are set in the handleEditorDragStart method!
        this.editorBeingDragged = true;
        var caretPositionOfDrag = this.getNearestCursorPositionToMouseEvent(event);
        var start;
        var end;
        if (caretPositionOfDrag === this.fixedCaretPositionOnEditorDragStart) {
            setCaretPosition(caretPositionOfDrag);
            setSelectionLayer(false);
        } else {
            var newSelectionLayer;
            if (this.fixedCaretPositionOnEditorDragStartType === 'start') {
                newSelectionLayer = {
                    start: this.fixedCaretPositionOnEditorDragStart,
                    end: caretPositionOfDrag - 1,
                    cursorAtEnd: true,
                };
            } else if (this.fixedCaretPositionOnEditorDragStartType === 'end') {
                newSelectionLayer = {
                    start: caretPositionOfDrag,
                    end: this.fixedCaretPositionOnEditorDragStart - 1,
                    cursorAtEnd: false,
                };
            } else {
                if (caretPositionOfDrag > this.fixedCaretPositionOnEditorDragStart) {
                    newSelectionLayer = {
                        start: this.fixedCaretPositionOnEditorDragStart,
                        end: caretPositionOfDrag - 1,
                        cursorAtEnd: true,
                    };
                } else {
                    newSelectionLayer = {
                        start: caretPositionOfDrag,
                        end: this.fixedCaretPositionOnEditorDragStart - 1,
                        cursorAtEnd: false,
                    };
                }
            }
            setSelectionLayer(newSelectionLayer);
        }
    },

    handleEditorDragStart: function(event, ui) {
        var caretPosition = this.getNearestCursorPositionToMouseEvent(event);
        if (event.target.className === "cursor" && this.props.selectionLayer.selected) {
            // this.circularSelectionOnEditorDragStart = (this.props.selectionLayer.start > this.props.selectionLayer.end);
            if (this.props.selectionLayer.start === caretPosition) {
                this.fixedCaretPositionOnEditorDragStart = this.props.selectionLayer.end + 1;
                this.fixedCaretPositionOnEditorDragStartType = 'end';

                //plus one because the cursor position will be 1 more than the selectionLayer.end
                //imagine selection from
                //0 1 2  <--possible cursor positions
                // A T G
                //if A is selected, selection.start = 0, selection.end = 0
                //so the caretPosition for the end of the selection is 1!
                //which is selection.end+1
            } else {
                this.fixedCaretPositionOnEditorDragStart = this.props.selectionLayer.start;
                this.fixedCaretPositionOnEditorDragStartType = 'start';
            }
        } else {
            // this.circularSelectionOnEditorDragStart = false;
            this.fixedCaretPositionOnEditorDragStart = caretPosition;
            this.fixedCaretPositionOnEditorDragStartType = 'caret';
        }
    },

    handleEditorDragStop: function(event, ui) {
        var self = this;
        if (this.editorBeingDragged) { //check to make sure dragging actually occurred
            setTimeout(function(argument) {
                //we use setTimeout to put the call to change editorBeingDragged to false
                //on the bottom of the event stack, thus the click event that is fired because of the drag
                //will be able to check if editorBeingDragged and not trigger if it is
                self.editorBeingDragged = false;
            }, 0);
        } else {
            self.editorBeingDragged = false;
        }
    },

    render: function() {
        // console.log('render!');
        // 
        var {
            preloadRowStart, 
            averageRowHeight, 
            rowViewDimensions, 
            totalRows, rowData, 
            rowToJumpTo, 
            charWidth, 
            selectionLayer, 
            CHAR_HEIGHT,
            ANNOTATION_HEIGHT,
            tickSpacing,
            SPACE_BETWEEN_ANNOTATIONS,
            showFeatures,
            showTranslations,
            showParts,
            showOrfs,
            showAxis,
            showCutsites,
            showReverseSequence,
            mouse,
            caretPosition,
            sequenceLength,
            bpsPerRow
        } = this.props;
        var self = this;
        function renderRows(rowNumber) {
            if (rowData[rowNumber]) {
                return (<RowItem
                    charWidth={charWidth}
                      CHAR_HEIGHT={CHAR_HEIGHT}
                      ANNOTATION_HEIGHT={ANNOTATION_HEIGHT}
                      tickSpacing={tickSpacing}
                      SPACE_BETWEEN_ANNOTATIONS={SPACE_BETWEEN_ANNOTATIONS}
                      showFeatures={showFeatures}
                      showTranslations={showTranslations}
                      showParts={showParts}
                      showOrfs={showOrfs}
                      showAxis={showAxis}
                      showCutsites={showCutsites}
                      showReverseSequence={showReverseSequence}
                      selectionLayer={selectionLayer}
                      mouse={mouse}
                      caretPosition={caretPosition}
                      sequenceLength={sequenceLength}
                      bpsPerRow={bpsPerRow}
                  key={rowNumber}
                  row={rowData[rowNumber]} />);
            } else {
                return null
            }
        }

        var rowHeight = this.currentAverageRowHeight ? this.currentAverageRowHeight : averageRowHeight;
        this.topSpacerHeight = this.rowStart * rowHeight;
        this.bottomSpacerHeight = (totalRows - 1 - this.preloadRowEnd) * rowHeight;

        var infiniteContainerStyle = {
            height: rowViewDimensions.height,
            width: rowViewDimensions.width,
            //   overflowY: "scroll",
            // float: "left",
            // paddingRight: "20px"
            //   padding: 10
        };
        // console.log('rowData: ' + JSON.stringify(rowData,null,4));
        return (
            <Draggable
            bounds={{top: 0, left: 0, right: 0, bottom: 0}}
            onDrag={this.handleEditorDrag}
            onStart={this.handleEditorDragStart}
            onStop={this.handleEditorDragStop}
            >
              <div
                ref="allRowsContainer"
                className="allRowsContainer"
                style={infiniteContainerStyle}
                onClick={this.onEditorClick}
                >
                <InfiniteScroller
                    ref={'InfiniteScroller'}
                    averageElementHeight={100}
                    containerHeight={rowViewDimensions.height}
                    renderRow={renderRows}
                    totalNumberOfRows={rowData.length}
                    preloadRowStart={40}
                    rowToJumpTo={rowToJumpTo}
                    /> 
              </div>
            </Draggable>
        );
    }
});



module.exports = RowView;