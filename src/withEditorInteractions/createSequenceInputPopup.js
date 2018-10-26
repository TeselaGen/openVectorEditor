import { render, unmountComponentAtNode, findDOMNode } from "react-dom";

import { getRangeLength } from "ve-range-utils";
// import Tether from "tether";
import Popper from "popper.js";

import { getInsertBetweenVals } from "ve-sequence-utils";
import React from "react";
import "./createSequenceInputPopupStyle.css";
import { Hotkey, Hotkeys, HotkeysTarget, Classes } from "@blueprintjs/core";

let div;

class SequenceInputNoHotkeys extends React.Component {
  state = {
    bpsToInsert: "",
    hasTempError: false
  };
  componentDidMount() {
    document.addEventListener(
      "mousedown",
      this.handleUnmountIfClickOustidePopup
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      "mousedown",
      this.handleUnmountIfClickOustidePopup
    );
  }
  handleUnmountIfClickOustidePopup = e => {
    const n = findDOMNode(this);
    if (!n) return;
    const node = n.parentNode;
    if (!node) return;
    if (node.contains(e.target)) {
      return;
    }
    this.handleUnmount();
  };
  handleUnmount = () => {
    setTimeout(() => {
      const n = findDOMNode(this);
      if (!n) return;
      const node = n.parentNode;
      if (!node) return;
      unmountComponentAtNode(node);
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
      acceptedChars = "atgcnkd",
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
      <div className={"sequenceInputBubble"}>
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
          className={Classes.INPUT}
          value={bpsToInsert}
          autoFocus
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
          Press <span style={{ fontWeight: "bolder" }}>ESC</span> to{" "}
          <a onClick={this.handleUnmount}>cancel</a>
        </div>
      </div>
    );
  }
}

const SequenceInput = HotkeysTarget(SequenceInputNoHotkeys);

export default function createSequenceInputPopup(props) {
  const { useEventPositioning } = props;
  const innerEl = <SequenceInput {...props} />;

  let caretEl;

  if (useEventPositioning) {
    //we have to make a fake event here so that popper.js will position on the page correctly
    const event = useEventPositioning;

    const top = event.clientY;
    const right = event.clientX;
    const bottom = event.clientY;
    const left = event.clientX;
    caretEl = {
      getBoundingClientRect: () => ({
        top,
        right,
        bottom,
        left
      }),
      clientWidth: 0,
      clientHeight: 0
    };
  }

  if (!caretEl || !caretEl === 0 || !isElementInViewport(caretEl)) {
    const activeEl = getActiveElement();
    if (activeEl) {
      caretEl = activeEl.querySelector(".veCaret");
    }
  }
  if (!caretEl || !caretEl === 0 || !isElementInViewport(caretEl)) {
    caretEl = getActiveElement();
  }
  if (!caretEl || !caretEl === 0 || !isElementInViewport(caretEl)) {
    caretEl = document.querySelector(".veCaret");
  }
  if (document.body.classList.contains("sequenceDragging")) {
    window.toastr.warning("Can't insert new sequence while dragging");
    return;
  } //don't allow

  // function closeInput() {
  //   sequenceInputBubble.remove();
  // }
  div = document.createElement("div");
  div.style.zIndex = "4000";
  div.id = "sequenceInputBubble";
  document.body.appendChild(div);

  render(innerEl, div);

  // // let body = $(document.body);
  // // let caretEl = body.find(".veRowViewCaret");
  // if (!caretEl || !caretEl === 0) {
  //   //todo: eventually we should probably jump to the row view caret if it isn't visible
  //   // caretEl = body.find(".veCaretSVG");
  //   caretEl = document.querySelector(".veCircularView .veCaretSVG");
  // }
  if (!caretEl) {
    return console.error(
      "there must be a caret element present in order to display the insertSequence popup"
    );
  }

  new Popper(caretEl, div, {
    placement: "bottom",
    modifiers: {
      offset: { offset: "94" }
    }
  });

  // new Tether({
  //   element: div,
  //   target: caretEl,
  //   attachment: "top left",
  //   targetAttachment: "bottom left",
  //   offset: "-15px 22px",
  //   constraints: [
  //     {
  //       to: "scrollParent",
  //       // pin: true,
  //       attachment: "together"
  //     }
  //   ]
  // });
}

const getActiveElement = function(document) {
  document = document || window.document;

  // Check if the active element is in the main web or iframe
  if (
    document.body === document.activeElement ||
    document.activeElement.tagName == "IFRAME"
  ) {
    // Get iframes
    let iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
      // Recall
      let focused = getActiveElement(iframes[i].contentWindow.document);
      if (focused !== false) {
        return focused; // The focused
      }
    }
  } else return document.activeElement;

  return false;
};

function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight ||
        document.documentElement.clientHeight) /*or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /*or $(window).width() */
  );
}
