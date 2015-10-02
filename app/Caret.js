var Blink = require('react-blink');
var assign = require('lodash/object/assign');
let React = require('react');
let PureRenderMixin = require('react/addons').addons.PureRenderMixin;

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
        debugger;
        if (row.start <= caretPosition && row.end + 1 >= caretPosition || (row.end === sequenceLength - 1 && row.end < caretPosition)) {
            //the second logical operator catches the special case where we're at the very end of the sequence..
            var newCursorStyle = assign({}, cursorStyle, {
                left: (caretPosition - row.start) * charWidth
            });
            var cursorEl = <div className="cursor" style={newCursorStyle}/>;
            if (shouldBlink) {
                return (<Blink duration={600}>{cursorEl}</Blink>);
            } else {
                return (cursorEl);
            }
            // onHover={self.onCursorHover}
        } else {
            return null;
        }
    }
});


module.exports = HighlightLayer;