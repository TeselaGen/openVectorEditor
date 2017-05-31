import React, {PropTypes} from 'react';
import {Decorator as Cerebral} from 'cerebral-view-react';

class Sequence extends React.Component {

    render() {
        var {
            bpsPerRow,
            children,
            className,
            reverse,
            sequence,
            sequenceHeight,
            charWidth,
        } = this.props;

        // dynamic letter-spacing fixes rounding errors on window resize
        let viewBoxWidth = bpsPerRow * charWidth * 1.2 + 40; // 1.2 & 40 for padding
        let rowWidth = bpsPerRow * (charWidth-1) * 1.2;
        let width = (rowWidth * (bpsPerRow * (charWidth - 1))) / viewBoxWidth;
        var letterSpacing = ((width - 10) - 11.2*bpsPerRow) / (bpsPerRow - 1); // this 11.2 is default letterSpacing

        var style = {
            position: 'relative',
            fontFamily: 'monospace',
            padding: '10px 25px 10px 25px',
            overflow: 'visible',
            letterSpacing: letterSpacing + 'px',
            fontSize: '12pt',
            height: sequenceHeight + 'px'
        }

        var textColor = "#000"; // black
        if (reverse==="true") textColor = "#aaa"; // gray

        var svgText = [];
        for (var i=0; i<sequence.length; i++) {
            svgText.push(
                <text
                key={"bp" + i}
                ref="sequenceRow"
                fill={ textColor }
                y="5"
                x={(letterSpacing+11.2)*i} // this 11.2 is actual char width
                >
                { sequence[i] }
                </text>
            )
        };

        return (
            <div className='Sequence' id='sequenceText'>
                <svg
                    style={style}
                    ref="rowViewTextContainer"
                    className="rowViewTextContainer"
                    >
                    { svgText }
                </svg>
                { children }
            </div>
        )
    }
}

module.exports = Sequence;
