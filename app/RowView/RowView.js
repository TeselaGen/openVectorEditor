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

    componentWillReceiveProps(newProps) {
        if (newProps.rowToJumpTo === "0" || parseInt(newProps.rowToJumpTo)) {
            if (newProps.rowToJumpTo !== this.props.rowToJumpTo) {
                var row = parseInt(newProps.rowToJumpTo);
                this.InfiniteScroller.scrollTo(row);
            }
            if (newProps.showSidebar !== this.props.showSidebar) {
                this.props.signals.adjustWidth();
            }
        }
    }

    getNearestCursorPositionToMouseEvent(event, callback) {
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

        var boundingRowRect = event.target.getBoundingClientRect();
        var sequenceText = document.getElementById("sequenceText");
        if (sequenceText && sequenceText.firstChild) {
            var textWidth = sequenceText.firstChild.firstChild.getBoundingClientRect().width + 10; // 10 for left & right padding around text box
        } else {
            var textWidth = 20;
        }

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

        callback({
            shiftHeld: event.shiftKey,
            nearestBP,
            caretGrabbed: event.target.className === "cursor"
        });
    }

    render() {
        var {
            annotationHeight,
            annotationVisibility,
            bpsPerRow,
            caretPosition,
            cutsites,
            cutsitesByName,
            orfs,
            rowData,
            rowToJumpTo,
            rowViewDimensions,
            selectionLayer,
            sequenceData,
            sequenceLength,
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

        var renderItem = (index,key) => {
            if (rowData[index]) {
                return (
                    <div key={key}>
                        <div className={'veRowItemSpacer'} />
                        <RowItem row={rowData[index]}/>
                    </div>
                );
            } else {
                return null
            }
        }

        if (showRow) {
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
            );
        }

        return (
            <div style={{display: "none"}}></div>
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
