var React = require('react');
import { Decorator as Cerebral } from 'cerebral-view-react';

@Cerebral({
    bpsPerRow: ['bpsPerRow'],    
    charWidth: ['charWidth'], 
})

export default class AnnotationPositioner extends React.Component{
    render() {
        var {
            bpsPerRow,
            charWidth
        } = this.props;

        var rowWidth = bpsPerRow * charWidth * 1.2 + 40; // account for padding

        return (
            <svg 
                transform={this.props.transform || null}
                className={this.props.className + ' veRowViewAnnotationPosition'} 
                style = {{ padding: "0 20px" }}
                viewBox={"0 0 " + rowWidth + " 25"}
                >
                {this.props.children}
            </svg>
        );
    }
}