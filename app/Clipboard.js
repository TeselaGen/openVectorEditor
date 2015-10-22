var React = require("react");
import ReactDOM from 'react-dom';

var Clipboard = React.createClass({

    propTypes: {
        value: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
        return {
            className: "clipboard"
        };
    },

    componentDidMount: function() {
        document.addEventListener("keydown", this.handleKeyDown, false);
        document.addEventListener("keyup", this.handleKeyUp, false);
    },

    componentWillUnmount: function() {
        document.removeEventListener("keydown", this.handleKeyDown, false);
        document.removeEventListener("keyup", this.handleKeyUp, false);
    },
  
    handleKeyDown: function(e) {
        var metaKeyIsDown = (e.ctrlKey || e.metaKey);
        var textIsSelected = window.getSelection().toString();

        if (!metaKeyIsDown || textIsSelected) {
            return;
        }

        var element = ReactDOM.findDOMNode(this);
        element.focus();
        element.select();
    },

    handleKeyUp: function(e) {
        var element = ReactDOM.findDOMNode(this);
        element.blur();
    },

    render: function() {
        var value = this.props.value;
        console.log('value: ' + JSON.stringify(value,null,4));
        var style = {
            position: 'fixed',
      // width: 0, //tnr: commented these out because they seem to be messing thing up if used...
      // height: 0,
            opacity: 0,
            left: 0,
            padding: 0,
            top: 0,
            margin: 0,
            zIndex: 100,
        };
        return <input 
      style={style}
      type="text" 
      readOnly={true} 
      value={value} 
      onPaste={this.props.onPaste}
      onCopy={this.props.onCopy}/>;
    }
});

module.exports = Clipboard;