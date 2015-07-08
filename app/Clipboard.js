var React = require("react");

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

    var element = this.getDOMNode();
    element.focus();
    element.select();
  },

  handleKeyUp: function(e) {
    var element = this.getDOMNode();
    element.blur();
  },

  render: function() {
    var value = this.props.value;
    var style = {
      position: 'fixed',
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      padding: 0,
      margin: 0,
      zIndex: 100,
      opacity: 0
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