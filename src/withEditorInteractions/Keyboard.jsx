import React from "react";

class Clipboard extends React.Component {
  // static propTypes = {
  //   value: PropTypes.string.isRequired
  // };

  static defaultProps = {
    className: "clipboard"
  };

  componentDidMount() {
    this.node.parentNode.addEventListener("keydown", this.handleKeyDown, false);
    this.node.parentNode.addEventListener("keyup", this.handleKeyUp, false);
  }

  componentWillUnmount() {
    this.node.parentNode.removeEventListener(
      "keydown",
      this.handleKeyDown,
      false
    );
    this.node.parentNode.removeEventListener("keyup", this.handleKeyUp, false);
  }

  handleKeyDown = (e) => {
    if (
      document.activeElement &&
      ["input", "select", "textarea"].indexOf(
        document.activeElement.tagName.toLowerCase()
      ) !== -1
    ) {
      return; //stop early if we're inside an input
    }
    const metaKeyIsDown = e.ctrlKey || e.metaKey;
    if (!metaKeyIsDown || !["x", "c", "v"].includes(e.key)) {
      this.origFocusedElement = null;
      return;
    }
    this.origFocusedElement = document.activeElement;
    this.node.select();
  };

  handleKeyUp = () => {
    if (this.origFocusedElement) {
      this.origFocusedElement.focus();
    }
  };

  render() {
    const value = this.props.value;
    const style = {
      position: "fixed",
      width: 1,
      height: 1,
      opacity: 0,
      left: 0,
      padding: 0,
      top: 0,
      margin: 0,
      zIndex: 100
    };
    return (
      <input
        ref={(c) => {
          if (c) {
            this.node = c;
          }
        }}
        style={style}
        type="text"
        value={value}
        onChange={noop}
        readOnly
        className="clipboard"
        onPaste={this.props.onPaste}
        onCopy={this.props.onCopy}
        onCut={this.props.onCut}
      />
    );
  }
}

export default Clipboard;
const noop = () => {};
