import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';

export default class Clipboard extends React.Component {

    componentWillMount() {
        this.state = {
            clipboardData: null,
        };
    }

    componentWillReceiveProps(newProps) {
        if (this.props.clipboardData !== newProps.clipboardData) {
            this.setState({ clipboardData: newProps.clipboardData});
        }
    }

    componentDidUpdate(newState) {
        if (this.state.clipboardData !== newState.clipboardData) {
            var clipboard = document.getElementById("clipboard");
            clipboard.select();
            try {
                document.execCommand('copy');
            } catch (err) {
                console.log('unable to copy');
            }
        }
    }

    // i can't use this onChange method, but it'll yell if it's taken out
    onChange() {
        return; // do nothing
    }

    render() {

        if (!this.state.clipboardData) {
            return (<div></div>);
        }

        var value = this.state.clipboardData.sequence;
        var style = {
            position: 'fixed',
            opacity: 0,
            left: 0,
            padding: 0,
            top: 0,
            margin: 0,
            zIndex: 100,
        };

        return (
            <textarea
                id="clipboard"
                value={value}
                onChange={this.onChange}
                style={style}>
            </textarea>
        );
    }
}
