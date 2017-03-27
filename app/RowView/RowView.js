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
    rowToJumpTo: ['rowToJumpTo'],
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
        if (parseInt(newProps.rowToJumpTo) && newProps.selectionLayer.id !== -1 && this.InfiniteScroller) {
            var range = this.InfiniteScroller.getVisibleRange();
            if (newProps.rowToJumpTo < range[0] || newProps.rowToJumpTo >= range[1]) {
                this.InfiniteScroller.scrollTo(newProps.rowToJumpTo);
            }
        }
        if (newProps.showSidebar !== this.props.showSidebar) {
            this.props.signals.adjustWidth();
        }
    }

    // shouldComponentUpdate() {
    //     // this.InfiniteScroller.scrollTo(0);
    //     return true;
    // }

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
            showRow,
            annotationHeight,
            spaceBetweenAnnotations,
            annotationVisibility,
            caretPosition,
            rowToJumpTo,
            rowViewDimensions,
            signals,
            bpsPerRow,
            rowData
        } = this.props;

        var renderItem = (index,key) =>{
            if (rowData[index]) {
                return (
                    <div key={key}>
                        <div className={'veRowItemSpacer'} />
                        <RowItem row={rowData[index]} />
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

// function itemSizeEstimator(index, cache) {
//     var row = this.props.rowData[index];
//     var height = 28; // div padding
//     height += 51 // sequence height: 50.67
//     height += 20 // row.start indicator
//     height += this.props.showFeatures ? row.features.length * 24 : 0; // feature height: 24 per feature
//     height += this.props.showOrfs ? row.orfs.length * 20 : 0; // orf height: 20 per orf
//     // need to add cutsites
//     return height
// }
function itemSizeEstimator(index, cache) {
    if (cache[index+1]) {
        return cache[index+1]
    }
    if (cache[index-1]) {
        return cache[index-1]
    }
    return 100
}
