import some from 'lodash/collection/some'
import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable'
import styles from './RowView.scss';
import { Decorator as Cerebral } from 'cerebral-view-react';
import ReactList from 'react-list';
import RowItem from './RowItem/RowItem.js'
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import prepareRowData from 've-sequence-utils/prepareRowData';
import normalizePositionByRangeLength from 've-range-utils/normalizePositionByRangeLength';
import getXStartAndWidthOfRowAnnotation from '../shared-utils/getXStartAndWidthOfRowAnnotation';

@Cerebral({
    annotationHeight: ['annotationHeight'],
    bpsPerRow: ['bpsPerRow'],
    charWidth: ['charWidth'],
    caretPosition: ['caretPosition'],
    circularAndLinearTickSpacing: ['circularAndLinearTickSpacing'],
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],
    cutsites: ['cutsites'],
    orfs: ['orfData'],
    rowData: ['rowData'],
    rowViewDimensions: ['rowViewDimensions'],
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

    componentDidMount() {
        this.state = {
            rowWidth: rowView.clientWidth
        }

        var draggable = document.getElementById("draggable");
        let signals = this.props.signals;
        let charWidth = this.props.charWidth;
        signals.adjustWidth({width: draggable.clientWidth});
        window.onresize = function() {
            signals.adjustWidth();
            this.setState({rowWidth: rowView.clientWidth});
        }.bind(this)
    }


    getNearestCursorPositionToMouseEvent(event, callback) {
        var rowNotFound = true;
        var bpsPerRow = this.props.bpsPerRow;
        var charWidth = this.props.charWidth;

        var visibleRowsContainer = ReactDOM.findDOMNode(this.InfiniteScroller);
        //loop through all the rendered rows to see if the click event lands in one of them
        var nearestBP = 0;
        for (var relativeRowNumber = 0; relativeRowNumber < visibleRowsContainer.childNodes.length; relativeRowNumber++) {
            var rowDomNode = visibleRowsContainer.childNodes[relativeRowNumber];
            var boundingRowRect = rowDomNode.getBoundingClientRect();
            if (event.clientY > boundingRowRect.top && event.clientY < boundingRowRect.top + boundingRowRect.height) {
                //then the click is within this row
                rowNotFound = false;
                var rowNumber = parseInt(rowDomNode.getAttribute('data-row-number'));
                var row = this.props.rowData[rowNumber];

                var sequenceText = document.getElementById("sequenceText");
                // get width of the actual text
                var textWidth = sequenceText.firstChild.firstChild.getBoundingClientRect().width + 10; // 10 for left & right padding around text box
                var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left - 25; // 25 for left-padding

                if (clickXPositionRelativeToRowContainer < 0) {
                    nearestBP = row.start;
                } else {
                    var numberOfBPsInFromRowStart = Math.round(bpsPerRow * clickXPositionRelativeToRowContainer / textWidth);
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

    render() {
        var {
            sequenceData,
            sequenceLength,
            selectionLayer,
            sequenceName,
            cutsites,
            cutsitesByName,
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
            rowViewDimensions,
            signals,
            bpsPerRow,
            rowData
        } = this.props;

        var renderItem = (index,key) =>{
            if (rowData[index]) {
                return (
                    <div data-row-number={index} key={key}>
                        <div className={'veRowItemSpacer'} />
                        <RowItem row={rowData[index]} />
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
                    this.getNearestCursorPositionToMouseEvent(event, signals.editorDragged)}
                }
                onStart={(event) => {
                    this.getNearestCursorPositionToMouseEvent(event, signals.editorDragStarted)}
                }
                onStop={signals.editorDragStopped}
                >
                <div id="draggable"
                    onClick={(event) => {
                        this.getNearestCursorPositionToMouseEvent(event, signals.editorClicked);
                    }}
                    ref="rowView"
                    className={styles.RowView + " veRowView"}
                    >
                    <div ref={'fontMeasure'} className={styles.fontMeasure}>m</div>
                    <ReactList
                        ref={c => {
                            this.InfiniteScroller= c
                        }}
                        itemRenderer={renderItem}
                        length={rowData.length}
                        itemSizeEstimator={itemSizeEstimator}
                        type='simple'
                        />
                </div>
            </Draggable>
        );
    }
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
