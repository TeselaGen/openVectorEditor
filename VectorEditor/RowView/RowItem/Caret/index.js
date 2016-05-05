let React = require('react');
let PureRenderMixin = require('react-addons-pure-render-mixin');
import './style.scss';

let SelectionLayer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        charWidth: React.PropTypes.number.isRequired,
        row: React.PropTypes.object.isRequired,
        sequenceLength: React.PropTypes.number.isRequired,
        caretPosition: React.PropTypes.number.isRequired,
    },
    render: function() {
        var {
            charWidth,
            row,
            sequenceLength,
            caretPosition,
            className=''
        } = this.props;
        if (row.start <= caretPosition && row.end + 1 >= caretPosition || (row.end === sequenceLength - 1 && row.end < caretPosition)) {
            //the second logical operator catches the special case where we're at the very end of the sequence..
            var cursorEl = (<div className={"veRowViewCaret " + className} style={{left: (caretPosition - row.start) * charWidth}}/>);
            return (cursorEl);
        } else {
            return null;
        }
    }
});


module.exports = SelectionLayer;