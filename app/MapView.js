import React, {PropTypes} from 'react';
var Draggable = require('react-draggable');
var RowItem = require('./RowItem.js');


var RowView = React.createClass({
    propTypes: {
        mapViewDimensions: PropTypes.object.isRequired,
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
    },
    getNearestCursorPositionToMouseEvent: function(event, callback) {
        callback(0);
        var rowNotFound = true;
        var rowDomNode = this.refs.mapView.getDOMNode();
        var boundingRowRect = rowDomNode.getBoundingClientRect();
        var nearestBP = 0;
        // console.log('boundingRowRect.top', JSON.stringify(boundingRowRect.top,null,4));
        // console.log('boundingRowRect.height', JSON.stringify(boundingRowRect.height,null,4));
        if (event.clientY > boundingRowRect.top && event.clientY < boundingRowRect.top + boundingRowRect.height) {
            rowNotFound = false;
            if (event.clientX - boundingRowRect.left < 0) {
                console.warn('this should never be 0...');
            } else {
                var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left;
                var numberOfBPsInFromRowStart = Math.floor((clickXPositionRelativeToRowContainer + this.props.charWidth / 2) / this.props.charWidth);
                nearestBP = numberOfBPsInFromRowStart;
                if (nearestBP > this.props.sequenceLength + 1) {
                    nearestBP = this.props.sequenceLength + 1;
                }
            }
        }
        if (rowNotFound) {
            console.warn('was not able to find the correct row');
            //return the last bp index in the rendered rows
            var lastOfRenderedRowsNumber = this.refs.InfiniteScroller.state.visibleRows[this.refs.InfiniteScroller.state.visibleRows.length - 1];
            var lastOfRenderedRows = this.props.rowData[lastOfRenderedRowsNumber];
            nearestBP = lastOfRenderedRows.end;
        }
        callback({
            shiftHeld: event.shiftKey,
            nearestBP,
            caretGrabbed: false //tnr: come back and fix this
        })
    },

    

    render: function() {
        // console.log('render!');
        // 
        var {
            mapViewDimensions, 
            rowData, 
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
            mouse,
            caretPosition,
            sequenceLength,
            bpsPerRow,
            signals
        } = this.props;
        var self = this;
        // function renderRows(rowNumber) {
        //     if (rowData[rowNumber]) {
        //         return ();
        //     } else {
        //         return null
        //     }
        // }

        var mapViewStyle = {
            height: mapViewDimensions.height,
            width: mapViewDimensions.width,
            transform: "rotate(7deg)"
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
                this.getNearestCursorPositionToMouseEvent(event, signals.editorDragged)}   
            }
            onStart={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, signals.editorDragStarted)}   
            }
            onStop={signals.editorDragStopped}
            >
              <div
                ref="mapView"
                className="mapView"
                style={mapViewStyle}
                onClick={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, signals.editorClicked)}   
                }
                >
                <RowItem
                    charWidth={charWidth}
                      charHeight={charHeight}
                      annotationHeight={annotationHeight}
                      tickSpacing={tickSpacing}
                      spaceBetweenAnnotations={spaceBetweenAnnotations}
                      showFeatures={showFeatures}
                      showTranslations={showTranslations}
                      showParts={showParts}
                      showOrfs={showOrfs}
                      showAxis={showAxis}
                      showCutsites={showCutsites}
                      showReverseSequence={showReverseSequence}
                      selectionLayer={selectionLayer}
                      caretPosition={caretPosition}
                      sequenceLength={sequenceLength}
                      bpsPerRow={bpsPerRow}
                      signals={signals}
                    row={rowData[0]} />
              </div>
            </Draggable>
        );
    }
});



module.exports = RowView;