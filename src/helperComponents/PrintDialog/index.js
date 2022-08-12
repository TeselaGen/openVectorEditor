import React from "react";
import { findDOMNode } from "react-dom";
import PropTypes from "prop-types";

import { reduxForm } from "redux-form";

import { wrapDialog } from "teselagen-react-components";
import { compose } from "redux";
import { Button, Classes, ButtonGroup } from "@blueprintjs/core";
import classNames from "classnames";

import withEditorProps from "../../withEditorProps";
import CircularView from "../../CircularView";
import LinearView from "../../LinearView";
import "./style.css";

class PrintDialog extends React.Component {
  state = {
    circular: null
  };
  render() {
    const {
      hideModal,
      hideLinearCircularToggle,
      hidePrintButton,
      addPaddingBottom,
      sequenceData,
      // handleSubmit,
      editorName
      // circular,
      // upsertFeature
    } = this.props;
    // const sequenceLength = sequenceData.sequence.length;
    let isCirc = sequenceData.circular;

    if (this.state.circular !== null) {
      isCirc = this.state.circular;
    }
    return (
      <div
        style={addPaddingBottom ? { paddingBottom: 20 } : {}}
        className={classNames(Classes.DIALOG_BODY, "tg-min-width-dialog")}
      >
        {!hideLinearCircularToggle && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ButtonGroup>
              <Button
                onClick={() => {
                  this.setState({ circular: true });
                }}
                active={isCirc}
              >
                Circular
              </Button>
              <Button
                onClick={() => {
                  this.setState({ circular: false });
                }}
                active={!isCirc}
              >
                Linear
              </Button>
            </ButtonGroup>
          </div>
        )}
        <br />
        <ComponentToPrint
          fullscreen={this.state && this.state.fullscreen}
          circular={isCirc}
          editorName={editorName || "StandaloneEditor"}
          ref={(el) => (this.componentRef = el)}
        />
        <br />
        {!hidePrintButton && (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <ReactToPrint
              trigger={() => <Button intent="primary">Print</Button>}
              content={() => this.componentRef}
              onBeforePrint={() => {
                this.setState({ fullscreen: true });
              }}
              bodyClass="ve-print"
              // printPreview
              pageStyle={`@page { size: auto;  margin: 0mm; } @media print { 
              body { 
                 -webkit-print-color-adjust: exact; page-break-after: always; 
              } }`}
              ignoreLinks //needed because some css is linked to but is not loading..
              onAfterPrint={() => {
                this.setState({ fullscreen: false });
                hideModal();
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default compose(
  wrapDialog({
    title: "Print"
  }),
  withEditorProps,
  reduxForm({
    form: "PrintDialog"
  })
)(PrintDialog);

class ReactToPrint extends React.Component {
  static propTypes = {
    /** Preview the print without actually triggering the print dialog */
    printPreview: PropTypes.bool,
    /** Copy styles over into print window. default: true */
    copyStyles: PropTypes.bool,
    /** Ignore link styles. Necessary because sometime links don't load.., default: false */
    ignoreLinks: PropTypes.bool,
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

  triggerPrint(target, noRemove) {
    const { onBeforePrint, onAfterPrint } = this.props;

    if (onBeforePrint) {
      onBeforePrint();
    }

    setTimeout(() => {
      target.contentWindow.focus();
      target.contentWindow.print();
      !noRemove && this.removeWindow(target);

      if (onAfterPrint) {
        onAfterPrint();
      }
    }, 500);
  }

  removeWindow(targets) {
    targets &&
      setTimeout(() => {
        (Array.isArray(targets) ? targets : [targets]).forEach((target) => {
          target.parentNode.removeChild(target);
        });
      }, 500);
  }

  startPrint = () => {
    const {
      bodyClass,
      content,
      copyStyles,
      ignoreLinks,
      pageStyle,
      // bodyStyle = {},
      printPreview
    } = this.props;

    const contentEl = content();

    if (contentEl === undefined) {
      console.error(
        "Refs are not available for stateless components. For 'react-to-print' to work only Class based components can be printed"
      );
      return false;
    }
    let printWindow = document.createElement("iframe");

    if (printPreview) {
      let printOutline = document.createElement("div");
      let closeButton = document.createElement("button");
      let printButton = document.createElement("button");
      const elsToRemoveFromDomEventually = [
        printWindow,
        printOutline,
        closeButton,
        printButton
      ];

      printOutline.style.position = "absolute";
      printOutline.style.top = "0px";
      printOutline.style.left = "0px";
      printOutline.style.width = "1210px";
      printOutline.style.height = "1056px";
      printOutline.style.background = "grey";
      printOutline.style.zIndex = 100000300;
      document.body.appendChild(printOutline);
      printButton.style.position = "absolute";
      printButton.style.top = "0px";
      printButton.style.left = "0px";
      printButton.style.width = "100px";
      printButton.style.background = "lightblue";
      printButton.innerText = "print";
      printButton.onclick = () => {
        this.triggerPrint(printWindow, true);
      };
      printButton.style.zIndex = 100000500;
      document.body.appendChild(printButton);

      closeButton.style.position = "absolute";
      closeButton.style.top = "0px";
      closeButton.style.left = "250px";
      closeButton.style.width = "100px";
      closeButton.style.background = "lightblue";
      closeButton.innerText = "close";
      closeButton.onclick = () => {
        this.removeWindow(elsToRemoveFromDomEventually);
      };
      closeButton.style.zIndex = 100000500;
      document.body.appendChild(closeButton);
    }

    // printWindow.style.height = height
    // printWindow.style.width = width

    // todo: find the max height/width of the print window and fit it to that!

    // if (printPreview)  defaultPageStyle += " "

    const contentNodes = findDOMNode(contentEl);
    const linkNodes = document.querySelectorAll('link[rel="stylesheet"]');

    this.linkTotal = linkNodes.length || 0;
    this.linkLoaded = 0;

    const markLoaded = () => {
      this.linkLoaded++;
      if (this.linkLoaded === this.linkTotal) {
        if (printPreview) {
          return;
        }
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
      let domDoc =
        printWindow.contentDocument || printWindow.contentWindow.document;
      const srcCanvasEls = [...contentNodes.querySelectorAll("canvas")];

      domDoc.open();
      domDoc.write(contentNodes.outerHTML);
      domDoc.close();

      printWindow.style.position = "absolute";
      // printWindow.style.width = "100%";
      // printWindow.style.height = "100%";
      printWindow.style.top = "-1000px";
      printWindow.style.left = "-1000px";
      printWindow.style.width = domDoc.body.scrollWidth + "px";

      printWindow.style.height = domDoc.body.scrollHeight + "px";

      if (printPreview) {
        printWindow.style.top = "0px";
        printWindow.style.left = "0px";
        printWindow.style.width = "1210px";
        printWindow.style.height = "1056px";

        printWindow.style.background = "white";

        printWindow.style.zIndex = 100000400;
      }

      /* remove date/time from top */
      const defaultPageStyle =
        pageStyle === undefined
          ? `@page { size: auto;  margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }`
          : pageStyle;

      let styleEl = domDoc.createElement("style");
      styleEl.appendChild(domDoc.createTextNode(defaultPageStyle));
      domDoc.head.appendChild(styleEl);

      // domDoc.body.style.transform = ""
      if (bodyClass.length) {
        domDoc.body.classList.add(bodyClass);
      }

      try {
        const canvasEls = domDoc.querySelectorAll("canvas");
        [...canvasEls].forEach((node, index) => {
          if (node.getContext) {
            node.getContext("2d").drawImage(srcCanvasEls[index], 0, 0);
          }
        });
      } catch (e) {
        console.warn(
          "An error occurred trying to get the canvas elements for printing:"
        );
        console.warn(`gg2g20011 error:`, e);
      }

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
            let attributes = [...(node.attributes || [])];
            attributes.forEach((attr) => {
              newHeadEl.setAttribute(attr.nodeName, attr.nodeValue);
            });

            newHeadEl.readystatechange = markLoaded.bind(null, "link");
            newHeadEl.onload = markLoaded.bind(null, "link");
            newHeadEl.onerror = markLoaded.bind(null, "link");
          }

          domDoc.head.appendChild(newHeadEl);
        });
      }
      if (this.linkTotal === 0 || copyStyles === false || ignoreLinks) {
        if (printPreview) {
          return;
        }
        this.triggerPrint(printWindow);
      }
    };

    document.body.appendChild(printWindow);
  };

  render() {
    return React.cloneElement(this.props.trigger(), {
      ref: (el) => (this.triggerRef = el),
      onClick: this.startPrint
    });
  }
}

class ComponentToPrint extends React.Component {
  // componentDidMount() {
  //   let ctx = this.canvasEl.getContext("2d");
  //   ctx.beginPath();
  //   ctx.arc(95, 50, 40, 0, 2 * Math.PI);
  //   ctx.stroke();
  // }

  render() {
    const { editorName, circular } = this.props;

    // let w = window,
    //     d = document,
    //     e = d.documentElement,
    //     g = d.getElementsByTagName("body")[0],
    //     width = w.innerWidth || e.clientWidth || g.clientWidth,
    //     height = w.innerHeight || e.clientHeight || g.clientHeight;

    // const width =  670;
    // const height = 900;
    return circular ? (
      <CircularView noWarnings noInteractions editorName={editorName} />
    ) : (
      <LinearView noWarnings noInteractions editorName={editorName} />
    );
  }
}
