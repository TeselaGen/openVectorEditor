import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import Draggable from 'react-draggable'
import styles from './Highlight.scss';
import getXStartAndWidthOfRowAnnotation from '../../shared-utils/getXStartAndWidthOfRowAnnotation';
var assign = require('lodash/object/assign');

@Cerebral({
    bpsPerRow: ['bpsPerRow'],
    caretPosition: ['caretPosition'],
    charWidth: ['charWidth'],
    selectionLayer: ['selectionLayer'],
    sequenceLength: ['sequenceLength'],
})
export default class Highlight extends React.Component {

    _dimensions(start, end) {
        var {
            charWidth,
            bpsPerRow,
            sequenceLength
        } = this.props;
        var rowStart = this.props.rowStart;
        var rowEnd  = this.props.rowEnd;
        var dimensions = [];

        if (start > end) {
            var left = this._dimensions(0, end);
            var right = this._dimensions(start, sequenceLength - 1);
            dimensions.push(...left, ...right);
        } else if (start <= rowEnd && end >= rowStart) {
            var localStart = (start > rowStart) ? start - rowStart : 0;
            var localEnd = (end < rowEnd) ? end - rowStart : rowEnd - rowStart;

            let result = getXStartAndWidthOfRowAnnotation({start: localStart, end: localEnd}, bpsPerRow, charWidth);
            var xShift = -result.xStart*(charWidth-1); //move selection right
            var width = result.width;
            var rowWidth = bpsPerRow * charWidth * 1.2 + 40; // 40 accounts for padding, 1.2 accounts for spacing

            dimensions.push({
                x: xShift,
                width: width,
                rowWidth: rowWidth
            });
        }
        return dimensions;
    }

    render() {
        var {
            start,
            end,
            color="blue",
            signals,
            selectionLayer
        } = this.props;

        var dimensions = this._dimensions(start, end);
        var overlays = [];
        var dummyKey = 0; // please stop yelling at me react
        dimensions.forEach((d) => {
            var {x, width, rowWidth} = d;

            overlays.push(
                <svg
                    key={dummyKey}
                    transform={this.props.transform || null}
                    className={styles.overlay}
                    preserveAspectRatio={'none'}
                    viewBox={ x + " 0 " + rowWidth + " 1"}
                    >
                    <rect fill={color} x={0} y={0} width={width} height={1}
                        style={{ opacity:'0.7', zIndex:'50' }}
                        />
                </svg>
            );
            dummyKey += 1;
        });

        if (overlays.length === 0) {
            return null;
        }

        return (
            <div>
                {overlays}
            </div>
        );
    }

}
