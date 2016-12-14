import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import styles from './Highlight.scss';
import getXStartAndWidthOfRowAnnotation from '../../shared-utils/getXStartAndWidthOfRowAnnotation';

@Cerebral({
    charWidth: ['charWidth'],
    bpsPerRow: ['bpsPerRow'],
    sequenceLength: ['sequenceLength']
})
export default class Highlight extends React.Component {

    _dimensions(start, end) {
        var {
            rowStart,
            rowEnd,
            charWidth,
            bpsPerRow,
            sequenceLength
        } = this.props;

        var dimensions = [];

        if (start <= rowEnd && end >= rowStart) {
            var localStart = (start > rowStart) ? start - rowStart : 0;
            var localEnd = (end < rowEnd) ? end - rowStart : rowEnd - rowStart;
            let result = getXStartAndWidthOfRowAnnotation({start: localStart, end: localEnd}, bpsPerRow, charWidth);

            var xShift = result.xStart * -1.2; // account for character spacing and move selection right
            var rowWidth = bpsPerRow * charWidth * 1.2 + 40; // 40 accounts for padding, 1.2 accounts for spacing

            var widthInBps = localEnd - localStart + 1;
            var width = widthInBps * (charWidth * 1.2) - 20;

            dimensions.push({
                x: xShift,
                width: width,
                rowWidth: rowWidth
            });
        } else if (start > end) {
            var left = this._dimensions(0, end);
            var right = this._dimensions(start, sequenceLength);
            dimensions.push(...left, ...right);
        }

        return dimensions;
    }

    render() {
        var {
            start,
            end
        } = this.props;

        var dimensions = this._dimensions(start, end);
        var overlays = [];

        dimensions.forEach((d) => {
            var {x, width, rowWidth} = d;

            overlays.push(
                <svg
                    transform={this.props.transform || null}
                    className={styles.overlay}
                    preserveAspectRatio={'none'}
                    viewBox={ x + " 0 " + rowWidth + " 1"}
                    >
                    <rect x={0} y={0} width={width} height={1}/>
                </svg>
            );
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
