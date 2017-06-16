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
    cutsiteLabelSelectionLayer: ['cutsiteLabelSelectionLayer'],
    cutsites: ['cutsites'],
    orfs: ['orfData'],
    rowData: ['rowData'],
    rowToJumpTo: ['rowToJumpTo'],
    rowViewDimensions: ['rowViewDimensions'],
    searchLayers: ['searchLayers'],
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
    showCutsites: ['showCutsites'],
    showReverseSequence: ['showReverseSequence'],
    showRow: ['showRow'],
    showSequence: ['showSequence'],
    showSidebar: ['showSidebar'],
    spaceBetweenAnnotations: ['spaceBetweenAnnotations']
})

export default class RowView extends React.Component {

    componentDidMount() {
        var draggable = document.getElementById("draggable");
        let signals = this.props.signals;
        signals.adjustWidth({width: draggable.clientWidth});
        window.onresize = function() {
            signals.adjustWidth();
        }.bind(this)
    }

    calculateLetterSpacing() {
        let bpsPerRow = this.props.bpsPerRow;
        let charWidth = this.props.charWidth;
        let viewBoxWidth = bpsPerRow * charWidth * 1.2 + 40; // 1.2 & 40 for padding
        let rowWidth = bpsPerRow * (charWidth-1) * 1.2;
        let width = (rowWidth * (bpsPerRow * (charWidth - 1))) / viewBoxWidth;
        var letterSpacing = ((width - 10) - 11.2*bpsPerRow) / (bpsPerRow - 1); // this 11.2 is default letterSpacing
        return letterSpacing;
    }

    componentWillReceiveProps(newProps) {
        if (newProps.rowToJumpTo === "0" || parseInt(newProps.rowToJumpTo)) {
            var row = parseInt(newProps.rowToJumpTo);
            if (this.InfiniteScroller) {
                this.InfiniteScroller.scrollTo(row);
                this.props.signals.jumpToRow({ rowToJumpTo: null });
            }
            if (newProps.showSidebar !== this.props.showSidebar) {
                this.props.signals.adjustWidth();
            }
            if (newProps.selectionLayer !== this.props.selectionLayer) {
                this.props.signals.adjustWidth();
            }
        }
    }

    getSearchOverlays() {
        var searchRows = {};
        if (this.props.searchLayers.length > 0) {
            var searchLayers = this.props.searchLayers;
            var bpsPerRow = this.props.bpsPerRow;

            searchLayers.forEach(function(result) {
                var rowStart = Math.floor((result.start-1)/(bpsPerRow));
                rowStart = rowStart < 0 ? 0 : rowStart;
                var rowEnd = Math.floor((result.end)/(bpsPerRow));

                if (rowEnd === rowStart && result.start <= result.end) {
                    searchRows = this.putIntoSearchHash(searchRows, rowStart, result);
                } else if (result.start > result.end) {
                    searchRows = this.putIntoSearchHash(searchRows, rowStart, { start: result.start, end: bpsPerRow*(rowStart+1), selected: false });
                    searchRows = this.putIntoSearchHash(searchRows, rowEnd, { start: rowEnd*bpsPerRow, end: result.end, selected: false });
                    for (let i=rowStart+1; i<this.props.rowData.length; i++) {
                        searchRows = this.putIntoSearchHash(searchRows, i, {start:i*bpsPerRow, end:bpsPerRow*(i+1), selected:false});
                    }
                    for (let i=0; i<rowEnd; i++) {
                        searchRows = this.putIntoSearchHash(searchRows, i, {start:i*bpsPerRow, end:bpsPerRow*(i+1), selected:false});
                    }
                } else {
                    searchRows = this.putIntoSearchHash(searchRows, rowStart, { start: result.start, end: bpsPerRow*(rowStart+1), selected: false });
                    searchRows = this.putIntoSearchHash(searchRows, rowEnd, { start: rowEnd*bpsPerRow, end: result.end, selected: false });
                    for (let i=rowStart+1; i<rowEnd; i++) {
                        searchRows = this.putIntoSearchHash(searchRows, i, {start:i*bpsPerRow, end:bpsPerRow*(i+1), selected:false});
                    }
                }
            }.bind(this));
        }
        return searchRows;
    }

    putIntoSearchHash(searchRows, row, result) {
        if (searchRows[row]) {
            searchRows[row].push(result);
        } else {
            searchRows[row] = [result];
        }
        return searchRows;
    }

    getNearestCursorPositionToMouseEvent(event, callback) {
        if (event.target.nodeName.toLowerCase() === "path" ||
            event.target.nodeName.toLowerCase() === "circle" ||
            event.target.className === "cutsiteLabel") {
            return;
        }
        var bpsPerRow = this.props.bpsPerRow;
        var charWidth = this.props.charWidth;
        var nearestBP = 0;

        var target = event.target;
        while (target.className !== 'app-RowView-RowItem-RowItem---rowItem---2HAWf') {
            target = target.parentElement;
            if (!target) {
                return;
            }
        }

        var rowNumber = parseInt(target.id);
        var row = this.props.rowData[rowNumber];
        var boundingRowRect = target.getBoundingClientRect();
        var letterSpacing = this.calculateLetterSpacing();
        var textWidth = ((letterSpacing + 11.2) * bpsPerRow); // 10 for left & right padding around text box

        var clickXPositionRelativeToRowContainer = event.clientX - boundingRowRect.left - 25; // 25 for left-padding
        if (clickXPositionRelativeToRowContainer < 0) {
            nearestBP = row.start;
        } else {
            var numberOfBPsInFromRowStart = Math.round(bpsPerRow * clickXPositionRelativeToRowContainer/textWidth);
            nearestBP = numberOfBPsInFromRowStart + row.start;
            if (nearestBP > row.end + 1) {
                nearestBP = row.end + 1;
            }
        }

        var caretGrabbed = false;
        if (event.target.className.animVal && event.target.className.animVal.split(" ")[0] === "cursor") {
            caretGrabbed = true;
        }

        callback({
            shiftHeld: event.shiftKey,
            nearestBP,
            caretGrabbed: event.target.className === "cursor" || caretGrabbed
        });
    }

    render() {
        var {
            annotationHeight,
            annotationVisibility,
            bpsPerRow,
            caretPosition,
            charWidth,
            cutsites,
            cutsitesByName,
            orfs,
            rowData,
            rowToJumpTo,
            rowViewDimensions,
            searchLayers,
            sequenceData,
            sequenceLength,
            selectionLayer,
            sequenceName,
            showAxis,
            showCaret,
            showCutsites,
            showFeatures,
            showOrfs,
            showRow,
            signals,
            spaceBetweenAnnotations
        } = this.props;

        var searchRows = this.getSearchOverlays();

        var letterSpacing = this.calculateLetterSpacing();
        var textWidth = ((letterSpacing + 11.2) * bpsPerRow);

        var xShiftStart = (textWidth * (selectionLayer.start%bpsPerRow) / bpsPerRow) + 18;
        var xShiftEnd = (textWidth * ((selectionLayer.end+1)%bpsPerRow) / bpsPerRow) + 18;

        if ((selectionLayer.end + 1) % bpsPerRow === 0) {
            xShiftEnd = (textWidth * (selectionLayer.end%bpsPerRow) / bpsPerRow) + 18;
            xShiftEnd += textWidth/bpsPerRow;
        }

        // if there's no selection layer, just have a single line where cursor is
        if (selectionLayer.start === -1) {
            xShiftStart = (textWidth * (caretPosition%bpsPerRow) / bpsPerRow) + 18;
            xShiftEnd = xShiftStart;
        }

        var selectionLeftEdge = (
            <svg className={styles.overlay} style={{left: xShiftStart}}
                preserveAspectRatio={'none'}
                viewBox={"0 0 1 1"}
                >
                <Draggable
                    onDrag={(event) => {
                        this.getNearestCursorPositionToMouseEvent(event, signals.editorDragged)
                    }}
                    onStart={(event) => {
                        this.getNearestCursorPositionToMouseEvent(event, signals.editorDragStarted)
                    }}
                    onStop={signals.editorDragStopped}
                    >
                    <rect fill={"blue"} className={"cursor"}
                        x={0} y={0} width={2} height={1}
                        />
                </Draggable>
            </svg>
        );


        var selectionRightEdge = (
            <svg className={styles.overlay} style={{left: xShiftEnd}}
                preserveAspectRatio={'none'}
                viewBox={"0 0 1 1"}
                >
                <Draggable
                    onDrag={(event) => {
                        this.getNearestCursorPositionToMouseEvent(event, signals.editorDragged)
                    }}
                    onStart={(event) => {
                        this.getNearestCursorPositionToMouseEvent(event, signals.editorDragStarted)
                    }}
                    onStop={signals.editorDragStopped}
                    >
                    <rect fill={"blue"} className={"cursor"}
                        x={0} y={0} width={2} height={1}
                        />
                </Draggable>
            </svg>
        );

        var selectionStart;
        var selectionEnd;
        var selectionStartRow = Math.floor(selectionLayer.start / bpsPerRow);
        var selectionEndRow = Math.floor(selectionLayer.end / bpsPerRow);

        // if no selection layer
        if (selectionLayer.start === -1) {
            selectionStartRow = Math.floor(caretPosition / bpsPerRow);
            selectionEndRow = Math.floor(caretPosition / bpsPerRow);
        }

        var renderItem = (index,key) => {
            if (rowData[index]) {
                if (!searchRows[index]) {
                    searchRows[index] = [];
                }
                selectionStart = selectionStartRow === index ? selectionLeftEdge : <div></div>
                selectionEnd = selectionEndRow === index ? selectionRightEdge : <div></div>
                return (
                    <div key={key}>
                        <div className={'veRowItemSpacer'}
                            />
                        <RowItem
                            selectionStart={selectionStart}
                            row={rowData[index]}
                            searchRows={searchRows[index]}
                            getNearestCursorPosition={this.getNearestCursorPositionToMouseEvent.bind(this)}
                            selectionEnd={selectionEnd}
                            />
                    </div>
                );
            } else {
                return null
            }
        }

        if (showRow) {
            return (
                <div>
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
                            style={{display: "block"}}
                            onClick={(event) => {
                                this.getNearestCursorPositionToMouseEvent(event, signals.editorClicked);
                            }}
                            ref="rowView"
                            className={styles.RowView + " veRowView"}
                            >
                            <div ref={'fontMeasure'} className={styles.fontMeasure}>m</div>
                            <ReactList
                                ref={c => {
                                    this.InfiniteScroller = c
                                }}
                                itemRenderer={renderItem}
                                length={rowData.length}
                                itemSizeEstimator={itemSizeEstimator.bind(this)}
                                type='variable'
                                />
                        </div>
                    </Draggable>
                </div>
            );
        }

        return (
            <div style={{display: "none"}} id="draggable"></div>
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
