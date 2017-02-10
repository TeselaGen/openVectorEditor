var React = require('react');
import { Decorator as Cerebral } from 'cerebral-view-react';

@Cerebral({
    bpsPerRow: ['bpsPerRow'],
    charWidth: ['charWidth'],
})

export default class AnnotationPositioner extends React.Component{
    render() {
        var {
            left, // left shoves the x position over
            bpsPerRow,
            charWidth,
            height,
            width
        } = this.props;

        var xShift = left * (charWidth-1); // account for character spacing and move feature right
        var rowWidth = bpsPerRow * charWidth * 1.2 + 40; // 40 accounts for padding, 1.2 accounts for spacing

        return (
            <svg
                transform={this.props.transform || null}
                className={this.props.className + ' veRowViewAnnotationPosition'}
                style = {{ padding: "0 20px" }}
                viewBox={ xShift + " 0 " + rowWidth + " " + height}
                >
                {this.props.children}
            </svg>
        );
    }
}
