import React from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';
import styles from './Highlight.scss';
import getXStartAndWidthOfRowAnnotation from '../../shared-utils/getXStartAndWidthOfRowAnnotation';

@Cerebral({
    charWidth: ['charWidth'],
    bpsPerRow: ['bpsPerRow']
})
export default class Highlight extends React.Component {

    render() {
        var {
            start,
            end,
            rowStart,
            rowEnd,
            charWidth,
            bpsPerRow
        } = this.props;

        var overlay = null;

        if (start <= rowEnd && end >= rowStart) {
            var localStart = (start > rowStart) ? start - rowStart : 0;
            var localEnd = (end < rowEnd) ? end - rowStart : rowEnd - rowStart;
            let result = getXStartAndWidthOfRowAnnotation({start: localStart, end: localEnd}, bpsPerRow, charWidth);

            var xShift = result.xStart * -1.2; // account for character spacing and move selection right
            var rowWidth = bpsPerRow * charWidth * 1.2 + 40; // 40 accounts for padding, 1.2 accounts for spacing

            var widthInBps = localEnd - localStart + 1;
            var width = widthInBps * (charWidth * 1.2) - 20;

            overlay = (
                <svg
                    transform={this.props.transform || null}
                    className={styles.highlight}
                    preserveAspectRatio={'none'}
                    viewBox={ xShift + " 0 " + rowWidth + " 1"}
                    >
                    <rect x={0} y={0} width={width} height={1}/>
                </svg>
            );
        }

        return overlay;
    }

}
