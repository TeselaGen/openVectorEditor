import { render, unmountComponentAtNode, findDOMNode } from "react-dom";

import { getRangeLength } from "ve-range-utils";
import Tether from "tether";

import { getInsertBetweenVals } from "ve-sequence-utils";
import React from "react";
import "./createSequenceInputPopupStyle.css";
import { Hotkey, Hotkeys, HotkeysTarget } from "@blueprintjs/core";

let div;

export default function createSequenceInputPopup(props) {
  // function closeInput() {
  //   sequenceInputBubble.remove();
  // }
  div = document.createElement("div");
  div.style.zIndex = "4000";
  div.id = "sequenceInputBubble";
  document.body.appendChild(div);

  render(<SequenceInput {...props} />, div);
  let caretEl = document.querySelector(".veRowViewCaret");

  // let body = $(document.body);
  // let caretEl = body.find(".veRowViewCaret");
  if (!caretEl === 0) {
    //todo: eventually we should probably jump to the row view caret if it isn't visible
    // caretEl = body.find(".veCaretSVG");
    caretEl = document.querySelector(".veCaretSVG");
  }
  if (!caretEl) {
    return console.error(
      "there must be a caret element present in order to display the insertSequence popup"
    );
  }

  new Tether({
    element: div,
    target: caretEl,
    attachment: "top left",
    targetAttachment: "bottom left",
    offset: "-15px 22px",
    constraints: [
      {
        to: "scrollParent",
        // pin: true,
        attachment: "together"
      }
    ]
  });
}
class SequenceInput extends React.Component {
  state = {
    bpsToInsert: "",
    hasTempError: false
  };
  handleUnmount = () => {
    setTimeout(() => {
      unmountComponentAtNode(findDOMNode(this).parentNode);
      document.getElementById("sequenceInputBubble").outerHTML = "";
    });
  };
  handleInsert() {
    const { handleInsert = () => {} } = this.props;
    const { bpsToInsert } = this.state;
    handleInsert({
      sequence: bpsToInsert
    });
  }
  renderHotkeys() {
    return (
      <Hotkeys>
        <Hotkey
          global={true}
          combo="esc"
          label="Escape"
          onKeyDown={this.handleUnmount}
        />
        <Hotkey combo="enter" label="Enter" onKeyDown={this.handleInsert} />
      </Hotkeys>
    );
  }
  render() {
    const {
      isReplace,
      selectionLayer,
      sequenceLength,
      caretPosition,
      acceptedChars = "atgc",
      maxInsertSize
    } = this.props;
    const { bpsToInsert, hasTempError } = this.state;

    let message;
    if (isReplace) {
      const betweenVals = getInsertBetweenVals(
        -1,
        selectionLayer,
        sequenceLength
      );
      message = (
        <span>
          Press <span style={{ fontWeight: "bolder" }}>ENTER</span> to replace{" "}
          {getRangeLength(selectionLayer, sequenceLength)} base pairs between{" "}
          {betweenVals[0]} and {betweenVals[1]}
        </span>
      );
    } else {
      message = (
        <span>
          Press <span style={{ fontWeight: "bolder" }}>ENTER</span> to insert{" "}
          {bpsToInsert.length} base pairs after base {caretPosition}
        </span>
      );
    }
    return (
      <div onBlur={this.handleUnmount} className={"sequenceInputBubble"}>
        <input
          autoCorrect={"off"}
          onKeyDown={e => {
            if (e.keyCode === 27) {
              this.handleUnmount();
            }
            if (e.keyCode === 13) {
              this.handleInsert();
              this.handleUnmount();
            }
          }}
          className={"pt-input"}
          value={bpsToInsert}
          ref={input => input && input.focus()}
          style={hasTempError ? { borderColor: "red" } : {}}
          onChange={e => {
            let sanitizedVal = "";
            e.target.value.split("").forEach(letter => {
              if (acceptedChars.includes(letter.toLowerCase())) {
                sanitizedVal += letter;
              }
            });
            if (e.target.value.length !== sanitizedVal.length) {
              this.setState({
                hasTempError: true
              });
              setTimeout(() => {
                this.setState({
                  hasTempError: false
                });
              }, 200);
            }
            if (maxInsertSize && sanitizedVal.lenth > maxInsertSize) {
              return window.toastr.error(
                "Sorry, your insert is greater than ",
                maxInsertSize
              );
            }
            e.target.value = sanitizedVal;

            this.setState({ bpsToInsert: sanitizedVal });
          }}
        />
        <div style={{ marginTop: 10 }}>{message}</div>
        <div style={{ marginTop: 10 }}>
          Press <span style={{ fontWeight: "bolder" }}>ESC</span> to cancel
        </div>
      </div>
    );
  }
}
HotkeysTarget(SequenceInput);
