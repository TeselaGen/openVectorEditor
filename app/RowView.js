import React, {PropTypes} from 'react';
var Draggable = require('react-draggable');
var RowItem = require('./RowItem.js');
var InfiniteScroller = require('react-variable-height-infinite-scroller');

var RowView = React.createClass({
    propTypes: {
        averageRowHeight: PropTypes.number.isRequired,
        rowViewDimensions: PropTypes.object.isRequired,
        totalRows: PropTypes.number.isRequired,
        rowData: PropTypes.array.isRequired,
        charWidth: PropTypes.number.isRequired,
        selectionLayer: PropTypes.object.isRequired,
        charHeight: PropTypes.number.isRequired,
        annotationHeight: PropTypes.number.isRequired,
        tickSpacing: PropTypes.number.isRequired,
        spaceBetweenAnnotations: PropTypes.number.isRequired,
        showFeatures: PropTypes.bool.isRequired,
        showTranslations: PropTypes.bool.isRequired,
        showParts: PropTypes.bool.isRequired,
        showOrfs: PropTypes.bool.isRequired,
        showAxis: PropTypes.bool.isRequired,
        showCutsites: PropTypes.bool.isRequired,
        showReverseSequence: PropTypes.bool.isRequired,
        caretPosition: PropTypes.number.isRequired,
        sequenceLength: PropTypes.number.isRequired,
        bpsPerRow: PropTypes.number.isRequired,
        handleEditorDrag: PropTypes.func.isRequired,
        handleEditorDragStart: PropTypes.func.isRequired,
        handleEditorDragStop: PropTypes.func.isRequired,
        handleEditorClick: PropTypes.func.isRequired,
        setSelectionLayer: PropTypes.func.isRequired,
    },
    getNearestCursorPositionToMouseEvent: function(event, callback) {
        callback(0);
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
                    callback(row.start); //return the first bp in the row
                } else {
                    var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left;
                    var numberOfBPsInFromRowStart = Math.floor((clickXPositionRelativeToRowContainer + this.props.charWidth / 2) / this.props.charWidth);
                    var nearestBP = numberOfBPsInFromRowStart + row.start;
                    if (nearestBP > row.end + 1) {
                        nearestBP = row.end + 1;
                    }
                    // console.log('nearestBP', nearestBP);
                    callback(nearestBP);
                }
                break; //break the for loop early because we found the row the click event landed in
            }
        }
        if (rowNotFound) {
            console.warn('was not able to find the correct row');
            //return the last bp index in the rendered rows
            var lastOfRenderedRowsNumber = this.refs.InfiniteScroller.state.visibleRows[this.refs.InfiniteScroller.state.visibleRows.length - 1];
            var lastOfRenderedRows = this.props.rowData[lastOfRenderedRowsNumber];
            callback(lastOfRenderedRows.end);
        }
    },

    render: function() {
        var {
            preloadRowStart, 
            averageRowHeight, 
            rowViewDimensions, 
            totalRows, 
            rowData, 
            rowToJumpTo, 
            charWidth, 
            selectionLayer, 
            charHeight,
            annotationHeight,
            tickSpacing,
            spaceBetweenAnnotations,
            showFeatures,
            showTranslations,
            showParts,
            showOrfs,
            showAxis,
            showCutsites,
            showReverseSequence,
            caretPosition,
            sequenceLength,
            bpsPerRow,
            setSelectionLayer,
            handleEditorDrag,
            handleEditorDragStart,
            handleEditorDragStop,
            handleEditorClick,
        } = this.props;
        var self = this;
        function renderRows(rowNumber) {
            if (rowData[rowNumber]) {
                return (<RowItem
                    {this.props}
                    key={rowNumber}
                    row={rowData[rowNumber]} 
                    />);
            } else {
                return null
            }
        }

        var rowViewStyle = {
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
            onDrag={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, handleEditorDrag)}   
            }
            onStart={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, handleEditorDragStart)}   
            }
            onStop={handleEditorDragStop}
            >
              <div
                ref="rowView"
                className="rowView"
                style={rowViewStyle}
                onClick={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, handleEditorClick)}   
                }
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