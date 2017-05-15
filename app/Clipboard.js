import React, { PropTypes } from 'react';
import { Decorator as Cerebral } from 'cerebral-view-react';

@Cerebral({
    clipboardData: ['clipboardData'],
})

export default class Clipboard extends React.Component {

    constructor() {
        super(arguments);
    }

    componentDidMount() {
        function paste(event) {
            var string = event.clipboardData.getData('text/plain');
            if (event.target.nodeName === "BODY") {
                // paste the whole JSON object
                event.preventDefault();
                this.props.signals.pasteSequenceString({ selection: string });
            }
            // otherwise, paste event gets handled automatically with only the plain text
        }
        document.addEventListener('paste', paste.bind(this), true);
    }

    componentWillReceiveProps(newProps) {
        // this copy function handles the computer's external clipboard. in-app copying is handled by actions/copySelection
        function copy(event) {
            event.clipboardData.setData('application/json', JSON.stringify(newProps.clipboardData));
            event.clipboardData.setData('text/plain', newProps.clipboardData.sequence);
            event.preventDefault();
            document.removeEventListener('copy', copy, true);
            document.removeEventListener('cut', copy, true);
        }
        if (this.props.clipboardData !== newProps.clipboardData && newProps.clipboardData.sequence) {
            document.addEventListener('copy', copy, true);
            document.addEventListener('cut', copy, true);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('paste', paste, true);
        document.removeEventListener('copy', copy, true);
        document.removeEventListener('cut', copy, true);
    }

    render() {
        return (<div></div>);
    }
}
