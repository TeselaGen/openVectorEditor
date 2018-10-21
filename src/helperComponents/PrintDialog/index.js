import React from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

import { reduxForm } from "redux-form";

import { withDialog } from "teselagen-react-components";
import { compose } from "redux";
import { Button, Intent, Classes } from "@blueprintjs/core";
import classNames from "classnames";

import withEditorProps from "../../withEditorProps";

export class PrintDialog extends React.Component {
  render() {
    const {
      hideModal,
      sequenceData = { sequence: "" },
      handleSubmit,
      upsertFeature
    } = this.props;
    const sequenceLength = sequenceData.sequence.length;
    return (
      <div className={classNames(Classes.DIALOG_BODY, "tg-min-width-dialog")}>
        <Example />
      </div>
    );
  }
}

function required(val) {
  if (!val) return "Required";
}

export default compose(
  withDialog({ isOpen: true, title: "Print" }),
  withEditorProps,
  reduxForm({
    form: "PrintDialog"
  })
)(PrintDialog);

class ReactToPrint extends React.Component {
  static propTypes = {
    /** Copy styles over into print window. default: true */
    copyStyles: PropTypes.bool,
    /** Trigger action used to open browser print */
    trigger: PropTypes.func.isRequired,
    /** Content to be printed */
    content: PropTypes.func.isRequired,
    /** Callback function to trigger before print */
    onBeforePrint: PropTypes.func,
    /** Callback function to trigger after print */
    onAfterPrint: PropTypes.func,
    /** Override default print window styling */
    pageStyle: PropTypes.string,
    /** Optional class to pass to the print window body */
    bodyClass: PropTypes.string
  };

  static defaultProps = {
    copyStyles: true,
    closeAfterPrint: true,
    bodyClass: ""
  };

  triggerPrint(target) {
    const { onBeforePrint, onAfterPrint } = this.props;

    if (onBeforePrint) {
      onBeforePrint();
    }

    setTimeout(() => {
      target.contentWindow.focus();
      target.contentWindow.print();
      this.removeWindow(target);

      if (onAfterPrint) {
        onAfterPrint();
      }
    }, 500);
  }

  removeWindow(target) {
    setTimeout(() => {
      target.parentNode.removeChild(target);
    }, 500);
  }

  handlePrint = () => {
    console.log("printin");
    const {
      bodyClass,
      content,
      copyStyles,
      pageStyle,
      onAfterPrint
    } = this.props;

    const contentEl = content();

    if (contentEl === undefined) {
      console.error(
        "Refs are not available for stateless components. For 'react-to-print' to work only Class based components can be printed"
      );
      return false;
    }

    let printWindow = document.createElement("iframe");
    printWindow.style.position = "absolute";
    printWindow.style.top = "-1000px";
    printWindow.style.left = "-1000px";

    const contentNodes = findDOMNode(contentEl);
    const linkNodes = document.querySelectorAll('link[rel="stylesheet"]');

    this.linkTotal = linkNodes.length || 0;
    this.linkLoaded = 0;

    const markLoaded = type => {
      this.linkLoaded++;

      if (this.linkLoaded === this.linkTotal) {
        this.triggerPrint(printWindow);
      }
    };

    printWindow.onload = () => {
      /* IE11 support */
      if (
        window.navigator &&
        window.navigator.userAgent.indexOf("Trident/7.0") > -1
      ) {
        printWindow.onload = null;
      }
      console.log("onload");
      let domDoc =
        printWindow.contentDocument || printWindow.contentWindow.document;
      const srcCanvasEls = [...contentNodes.querySelectorAll("canvas")];

      domDoc.open();
      domDoc.write(contentNodes.outerHTML);
      domDoc.close();

      /* remove date/time from top */
      const defaultPageStyle =
        pageStyle === undefined
          ? "@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact; } }"
          : pageStyle;

      let styleEl = domDoc.createElement("style");
      styleEl.appendChild(domDoc.createTextNode(defaultPageStyle));
      domDoc.head.appendChild(styleEl);

      if (bodyClass.length) {
        domDoc.body.classList.add(bodyClass);
      }

      const canvasEls = domDoc.querySelectorAll("canvas");
      [...canvasEls].forEach((node, index) => {
        node.getContext("2d").drawImage(srcCanvasEls[index], 0, 0);
      });

      if (copyStyles !== false) {
        const headEls = document.querySelectorAll(
          'style, link[rel="stylesheet"]'
        );

        [...headEls].forEach((node, index) => {
          let newHeadEl = domDoc.createElement(node.tagName);
          let styleCSS = "";

          if (node.tagName === "STYLE") {
            if (node.sheet) {
              for (let i = 0; i < node.sheet.cssRules.length; i++) {
                styleCSS += node.sheet.cssRules[i].cssText + "\r\n";
              }

              newHeadEl.setAttribute("id", `react-to-print-${index}`);
              newHeadEl.appendChild(domDoc.createTextNode(styleCSS));
            }
          } else {
            let attributes = [...node.attributes];
            attributes.forEach(attr => {
              newHeadEl.setAttribute(attr.nodeName, attr.nodeValue);
            });

            newHeadEl.onload = markLoaded.bind(null, "link");
            newHeadEl.onerror = markLoaded.bind(null, "link");
          }

          domDoc.head.appendChild(newHeadEl);
        });
      }

      if (this.linkTotal === 0 || copyStyles === false) {
        this.triggerPrint(printWindow);
      }
    };

    document.body.appendChild(printWindow);
  };

  render() {
    return React.cloneElement(this.props.trigger(), {
      ref: el => (this.triggerRef = el),
      onClick: this.handlePrint
    });
  }
}

class ComponentToPrint extends React.Component {
  componentDidMount() {
    let ctx = this.canvasEl.getContext("2d");
    ctx.beginPath();
    ctx.arc(95, 50, 40, 0, 2 * Math.PI);
    ctx.stroke();
  }

  render() {
    return (
      <div className={"relativeCSS"}>
        <div className={"flash"} />
        {/* <img src="example/test_image.png" border="0" /> */}
        <table className="testclass">
          <thead>
            <tr>
              <th style={{ color: "#FF0000" }}>Column One</th>
              <th className="testth">Column Two</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>2</td>
            </tr>
            <tr>
              <td>3</td>
              <td>4</td>
            </tr>
            <tr>
              <td>5</td>
              {/* <td><img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png" width="50" /></td> */}
            </tr>
            <tr>
              <td>svg</td>
              <td>
                <svg width="100" height="100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="green"
                    strokeWidth="4"
                    fill="yellow"
                  />
                </svg>
              </td>
            </tr>
            <tr>
              <td>canvas</td>
              <td>
                <canvas
                  id="myCanvas"
                  ref={el => (this.canvasEl = el)}
                  width="200"
                  height="100"
                >
                  Your browser does not support the HTML5 canvas tag.
                </canvas>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

class Example extends React.Component {
  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => <Button>Print this out!</Button>}
          content={() => this.componentRef}
          onBeforePrint={() => {
            console.log("before print!");
          }}
          onAfterPrint={() => {
            console.log("after print!");
          }}
        />
        <ComponentToPrint ref={el => (this.componentRef = el)} />
      </div>
    );
  }
}
