import React, {PropTypes} from 'react';

var Sequence = React.createClass({

    componentDidMount: function() {
        var {
            bpsPerRow,
            charWidth,
            children,
            className,
            reverse,
            sequence
        } = this.props;

        // check if we have a partial final row
        var rowWidth = this.refs.rowViewTextContainer.viewBox.baseVal.width;
        if(sequence.length < bpsPerRow) {
            rowWidth = sequence.length * charWidth * 1.2;
        }
        if(rowWidth && rowWidth > 0)
        this.refs.rowViewTextContainer.children[0].setAttribute("textLength", rowWidth);
        this.setState({ rowWidth: rowWidth });
    },

    render: function() {
        var {
            bpsPerRow,
            charWidth,
            children,
            className,
            reverse,
            sequence
        } = this.props;

        if (charWidth < 10) {
            return null;
        }
        var style = {
            position: 'relative',
            fontFamily: 'monospace',
            padding: '0 20px'
        }
        var rowWidth = bpsPerRow * charWidth * 1.2;
        var textColor = "#000"; // black
        if(reverse==="true") textColor = "#aaa"; // gray

        return (
            <div style={style} className='Sequence'>
                <svg ref="rowViewTextContainer" className="rowViewTextContainer"
                    viewBox={ "0 " + charWidth*-0.85 + " " + rowWidth + " " + charWidth } // in future the radio should be bpsPerRow*charWidth x charHeight
                    >
                    <text ref="sequenceRow" letterSpacing={ '9px' } fill={ textColor }>
                        { sequence }
                    </text>
                </svg>
                { children }
            </div>
        )
    }
});

module.exports = Sequence;
