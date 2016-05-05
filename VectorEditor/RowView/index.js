import prepareRowData from 've-sequence-utils/prepareRowData'
import React, {PropTypes} from 'react';
var Draggable = require('react-draggable');
var RowItem = require('./RowItem/index.js');
var InfiniteScroller = require('react-variable-height-infinite-scroller');
import style from './style.scss';

function noop(argument) {
    //console.log('noop!');
}

class RowView extends React.Component {
    getNearestCursorPositionToMouseEvent(event, callback) {
        var rowNotFound = true;
        var visibleRowsContainer = this.refs.InfiniteScroller.getVisibleRowsContainerDomNode();
        //loop through all the rendered rows to see if the click event lands in one of them
        var nearestBP = 0;
        for (var relativeRowNumber = 0; relativeRowNumber < visibleRowsContainer.childNodes.length; relativeRowNumber++) {
            var rowDomNode = visibleRowsContainer.childNodes[relativeRowNumber];
            var boundingRowRect = rowDomNode.getBoundingClientRect();
            // //console.log('boundingRowRect.top', JSON.stringify(boundingRowRect.top,null,4));
            // //console.log('boundingRowRect.height', JSON.stringify(boundingRowRect.height,null,4));
            if (event.clientY > boundingRowRect.top && event.clientY < boundingRowRect.top + boundingRowRect.height) {
                //then the click is falls within this row
                // //console.log('HGGGG');
                rowNotFound = false;
                var rowNumber = this.refs.InfiniteScroller.state.visibleRows[relativeRowNumber];
                var row = this.props.rowData[rowNumber];
                if (event.clientX - boundingRowRect.left < 0) {
                    nearestBP = row.start;
                } else {
                    var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left;
                    var numberOfBPsInFromRowStart = Math.floor((clickXPositionRelativeToRowContainer + this.props.charWidth / 2) / this.props.charWidth);
                    nearestBP = numberOfBPsInFromRowStart + row.start;
                    if (nearestBP > row.end + 1) {
                        nearestBP = row.end + 1;
                    }
                }
                break; //break the for loop early because we found the row the click event landed in
            }
        }
        if (rowNotFound) {
            console.warn('was not able to find the correct row');
            //return the last bp index in the rendered rows
            var lastOfRenderedRowsNumber = this.refs.InfiniteScroller.state.visibleRows[this.refs.InfiniteScroller.state.visibleRows.length - 1];
            var lastOfRenderedRows = this.props.rowData[lastOfRenderedRowsNumber];
            nearestBP = lastOfRenderedRows.end
        }
        callback({
            shiftHeld: event.shiftKey,
            nearestBP,
            caretGrabbed: event.target.className === "cursor"
        });
    }

    resize() {
        // if (this.refs.rowView) {
        //     this.props.signals.resizeRowView({
        //         rootWidth: this.refs.rowView.clientWidth,
        //         rootHeight: this.refs.rowView.clientHeight
        //     });
        // }
    }

    componentDidMount() {
        // this.resize();
        // window.addEventListener('resize', this.resize.bind(this));
    }

    render() {
        var {
            //currently found in props
            rowViewDimensions = {height: 500, width: 200},
            sequenceData = {}, 
            rowToJumpTo = {
              row: 0
            }, 
            bpsPerRow=30,
            editorDragged = noop,
            editorDragStarted = noop,
            editorClicked = noop,
            editorDragStopped = noop,
            ...rest,
        } = this.props;
        console.log('recalcing rowdata')
        var rowData = prepareRowData(sequenceData, bpsPerRow)
        function renderRows(rowNumber) {
            if (rowData[rowNumber]) {
                return (<RowItem {
                        ...rest
                    }
                    row={rowData[rowNumber]} 
                    />);
            } else {
                return null
            }
        }

        return (
            <Draggable
            bounds={{top: 0, left: 0, right: 0, bottom: 0}}
            onDrag={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, editorDragged)}   
            }
            onStart={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, editorDragStarted)}   
            }
            onStop={editorDragStopped}
            >
              <div
                ref="rowView"
                className="veRowView"
                onClick={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, editorClicked)}   
                }
                >
                <InfiniteScroller
                    ref={'InfiniteScroller'}
                    averageElementHeight={100}
                    containerHeight={rowViewDimensions.height}
                    renderRow={renderRows}
                    totalNumberOfRows={rowData.length}
                    rowToJumpTo={rowToJumpTo}
                    /> 
              </div>
            </Draggable>
        );
    }
}

module.exports = RowView;
