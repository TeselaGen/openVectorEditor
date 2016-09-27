let React = require('react');
import './style.scss';

export default class Caret extends React.Component{
    
    render() {
        var {
            charWidth,
            row,
            sequenceLength,
            caretPosition,
            className=''
        } = this.props;

        if (row.start <= caretPosition && row.end + 1 >= caretPosition 
                || (row.end === sequenceLength - 1 && row.end < caretPosition)) {
                //the second logical operator catches the special case where we're at the very end of the sequence..
                var cursorEl = (
                    <div className={"veRowViewCaret " + className} 
                        style={{left: (caretPosition - row.start) * charWidth}}
                        />
                );
                return (cursorEl);
        } else {
                return null;
        }
    }
}

module.exports = Caret;
