import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';
import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies
var Draggable = require('react-draggable');
var RowItem = require('./RowItem.js');
var InfiniteScroller = require('react-variable-height-infinite-scroller');

import styles from './row-view.css';

@Cerebral({
    rowViewDimensions: ['rowViewDimensions'],
    rowData: ['rowData'],
    charWidth: ['charWidth'],
    selectionLayer: ['selectionLayer'],
    searchLayers: ['searchLayers'],
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],
    annotationHeight: ['annotationHeight'],
    tickSpacing: ['tickSpacing'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations'],
    showFeatures: ['showFeatures'],
    showTranslations: ['showTranslations'],
    showParts: ['showParts'],
    showOrfs: ['showOrfs'],
    showAxis: ['showAxis'],
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    caretPosition: ['caretPosition'],
    sequenceLength: ['sequenceLength'],
    bpsPerRow: ['bpsPerRow'],
    uppercase: ['uppercase']
})
@propTypes({
    rowViewDimensions: PropTypes.object.isRequired,
    rowData: PropTypes.array.isRequired,
    charWidth: PropTypes.number.isRequired,
    selectionLayer: PropTypes.object.isRequired,
    searchLayers: PropTypes.array.isRequired,
    cutsiteLabelSelectionLayer: PropTypes.object.isRequired,
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
    uppercase: PropTypes.bool.isRequired
})
class RowView extends React.Component {
    getNearestCursorPositionToMouseEvent(event, callback) {
        var rowNotFound = true;
        var visibleRowsContainer = this.refs.InfiniteScroller.getVisibleRowsContainerDomNode();
        //loop through all the rendered rows to see if the click event lands in one of them
        var nearestBP = 0;
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
        if (this.refs.rowView) {
            this.props.signals.resizeRowView({
                rootWidth: this.refs.rowView.clientWidth,
                rootHeight: this.refs.rowView.clientHeight
            });
        }
    }

    componentDidMount() {
        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
    }

    render() {
        var {
            rowViewDimensions,
            rowData, 
            rowToJumpTo, 
            charWidth,
            selectionLayer,
            searchLayers,
            cutsiteLabelSelectionLayer,
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
            uppercase,
            signals
        } = this.props;

        function renderRows(rowNumber) {
            if (rowData[rowNumber]) {
                return (<RowItem
                    charWidth={charWidth}
                    selectionLayer={selectionLayer}
                    searchLayers={searchLayers}
                    cutsiteLabelSelectionLayer={cutsiteLabelSelectionLayer}
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
                    caretPosition={caretPosition}
                    sequenceLength={sequenceLength}
                    bpsPerRow={bpsPerRow}
                    signals={signals}
                    key={rowNumber}
                    uppercase={uppercase}
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
                this.getNearestCursorPositionToMouseEvent(event, signals.editorDragged)}   
            }
            onStart={(event) => {
                this.getNearestCursorPositionToMouseEvent(event, signals.editorDragStarted)}   
            }
            onStop={signals.editorDragStopped}
            >
              <div
                ref="rowView"
                className={styles.rowView}
                onClick={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, signals.editorClicked)}   
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
