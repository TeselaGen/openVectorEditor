import { render, unmountComponentAtNode, findDOMNode } from "react-dom";

import { getRangeLength } from "ve-range-utils";
// import Tether from "tether";
import Popper from "popper.js";

import {
  getInsertBetweenVals,
  convertDnaCaretPositionOrRangeToAA
} from "ve-sequence-utils";
import React from "react";
import { divideBy3 } from "../utils/proteinUtils";
import "./createSequenceInputPopupStyle.css";
import { Classes } from "@blueprintjs/core";
import { getNodeToRefocus } from "../utils/editorUtils";

let div;

class SequenceInputNoHotkeys extends React.Component {
  state = {
    charsToInsert: "",
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
  handleUnmountIfClickOustidePopup = (e) => {
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
      this.props.nodeToReFocus && this.props.nodeToReFocus.focus();
      document.getElementById("sequenceInputBubble").outerHTML = "";
    });
  };
  handleInsert() {
    const { handleInsert = () => {}, isProtein } = this.props;
    const { charsToInsert } = this.state;
    if (!charsToInsert.length) {
      return;
    }
    const seqToInsert = isProtein
      ? {
          proteinSequence: charsToInsert
        }
      : {
          sequence: charsToInsert
        };
    handleInsert(seqToInsert);
  }
  render() {
    const {
      isReplace,
      selectionLayer,
      sequenceLength,
      isProtein,
      replaceChars,
      caretPosition,
      acceptedChars,
      maxInsertSize
    } = this.props;
    const { charsToInsert, hasTempError } = this.state;

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
          {divideBy3(getRangeLength(selectionLayer, sequenceLength), isProtein)}{" "}
          {isProtein ? "AAs" : "base pairs"} between{" "}
          {isProtein
            ? convertDnaCaretPositionOrRangeToAA(betweenVals[0])
            : betweenVals[0]}{" "}
          and{" "}
          {isProtein
            ? convertDnaCaretPositionOrRangeToAA(betweenVals[1] + 2)
            : betweenVals[1]}
        </span>
      );
    } else {
      message = (
        <span>
          Press <span style={{ fontWeight: "bolder" }}>ENTER</span> to insert{" "}
          {charsToInsert.length} {isProtein ? "AAs" : "base pairs"} after{" "}
          {isProtein ? "AA" : "base"}{" "}
          {isProtein
            ? convertDnaCaretPositionOrRangeToAA(caretPosition)
            : caretPosition}
        </span>
      );
    }
    return (
      <div className="sequenceInputBubble">
        <input
          autoCorrect="off"
          onKeyDown={(e) => {
            if (e.keyCode === 27) {
              this.handleUnmount();
            }
            if (e.keyCode === 13) {
              this.handleInsert();
              this.handleUnmount();
            }
          }}
          className={Classes.INPUT}
          value={charsToInsert}
          autoFocus
          style={hasTempError ? { borderColor: "red" } : {}}
          onChange={(e) => {
            let sanitizedVal = "";
            e.target.value.split("").forEach((letter) => {
              const lowerLetter = letter.toLowerCase();
              if (replaceChars && replaceChars[lowerLetter]) {
                const isUpper = lowerLetter !== letter;
                sanitizedVal += isUpper
                  ? replaceChars[lowerLetter].toUpperCase()
                  : replaceChars[lowerLetter];
              } else if (acceptedChars.includes(lowerLetter)) {
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

            this.setState({ charsToInsert: sanitizedVal });
          }}
        />
        <div style={{ marginTop: 10 }}>{message}</div>
        <div style={{ marginTop: 10 }}>
          Press <span style={{ fontWeight: "bolder" }}>ESC</span> to{" "}
          <button className="link-button" onClick={this.handleUnmount}>
            cancel
          </button>
        </div>
      </div>
    );
  }
}

export default function createSequenceInputPopup(props) {
  const { useEventPositioning } = props;

  let caretEl;
  if (useEventPositioning) {
    //we have to make a fake event here so that popper.js will position on the page correctly
    const { e, nodeToReFocus } = useEventPositioning;
    // e.persist();
    const top = e.clientY;
    const right = e.clientX;
    const bottom = e.clientY;
    const left = e.clientX;
    caretEl = {
      nodeToRefocus: nodeToReFocus,
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
    //don't allow this
    return;
  }

  // function closeInput() {
  //   sequenceInputBubble.remove();
  // }
  div = document.createElement("div");
  div.style.zIndex = "400000";
  div.id = "sequenceInputBubble";
  document.body.appendChild(div);

  const innerEl = (
    <SequenceInputNoHotkeys
      nodeToReFocus={caretEl.nodeToRefocus || getNodeToRefocus(caretEl)}
      {...props}
    />
  );

  render(innerEl, div);

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
}

const getActiveElement = function (document) {
  document = document || window.document;

  // Check if the active element is in the main web or iframe
  if (
    document.body === document.activeElement ||
    /* eslint-disable eqeqeq*/

    document.activeElement.tagName == "IFRAME"
    /* eslint-enable eqeqeq*/
  ) {
    // Get iframes
    const iframes = document.getElementsByTagName("iframe");
    for (let i = 0; i < iframes.length; i++) {
      // Recall
      const focused = getActiveElement(iframes[i].contentWindow.document);
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
