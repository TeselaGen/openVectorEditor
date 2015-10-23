import assign from 'lodash/object/assign';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

var cursorStyle = {
    height: "98%",
    background: 'black',
    position: "absolute",
    top: "0",
    width: "2px",
    cursor: "ew-resize",
};

let HighlightLayer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        charWidth: React.PropTypes.number.isRequired,
        row: React.PropTypes.object.isRequired,
        sequenceLength: React.PropTypes.number.isRequired,
        caretPosition: React.PropTypes.number.isRequired,
        shouldBlink: React.PropTypes.bool.isRequired,
    },
    render: function() {
        var {
            charWidth,
            row,
            sequenceLength,
            caretPosition,
            shouldBlink
        } = this.props;
        if (row.start <= caretPosition && row.end + 1 >= caretPosition || (row.end === sequenceLength - 1 && row.end < caretPosition)) {
            //the second logical operator catches the special case where we're at the very end of the sequence..
            var newCursorStyle = assign({}, cursorStyle, {
                left: (caretPosition - row.start) * charWidth
            });
            var cursorEl = (<div className="cursor" style={newCursorStyle}/>);
            return (cursorEl);
            // onHover={self.onCursorHover}
        } else {
            return null;
        }
    }
});


module.exports = HighlightLayer;