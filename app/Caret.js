var assign = require('lodash/object/assign');
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');
var cursorStyle = {
    background: 'black',
    cursor: "ew-resize",    
    height: "98%",
    position: "absolute",
    top: "0",
    width: "2px",
};

let HighlightLayer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        caretPosition: React.PropTypes.number.isRequired,        
        charWidth: React.PropTypes.number.isRequired,
        row: React.PropTypes.object.isRequired,
        sequenceLength: React.PropTypes.number.isRequired,
        shouldBlink: React.PropTypes.bool.isRequired,
    },
    render: function() {
        var {
            caretPosition,            
            charWidth,
            row,
            sequenceLength,
            shouldBlink
        } = this.props;
        if (row.start <= caretPosition && row.end + 1 >= caretPosition 
            || (row.end === sequenceLength - 1 && row.end < caretPosition)) {
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