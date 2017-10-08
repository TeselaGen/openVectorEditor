// import download from 'in-browser-download'
import DropDown from "react-icons/lib/md/arrow-drop-down";
import InfoCircle from "react-icons/lib/fa/info-circle";
// import Popover from "react-popover2";
// import {Popover} from '@blueprintjs/core';
import Popover from "react-popover";
import jsonToGenbank from "bio-parsers/parsers/jsonToGenbank";
import React from "react";
import withEditorProps from '../withEditorProps';

// import get from 'lodash/get'
import "./style.css";
import CutsiteFilter from "../CutsiteFilter";
import FileSaver from "file-saver";
import Radio from "../Radio";
import save_img from "./veToolbarIcons/save.png";
// import print_img from './veToolbarIcons/print.png';
import show_cut_sites_img from "./veToolbarIcons/show_cut_sites.png";
import show_features_img from "./veToolbarIcons/show_features.png";
import show_primers_img from "./veToolbarIcons/show_primers.png";
import show_orfs_img from "./veToolbarIcons/show_orfs.png";
import fullscreen_img from "./veToolbarIcons/fullscreen.png";
// import toggle_views_img from './veToolbarIcons/toggle_views.svg';

export class VeToolBar extends React.Component {
  state = {
    openItem: -1
  };

  handleOpen = popover => {
    let self = this;
    return function() {
      if (self.state.openItem === popover) {
        return self.setState({ openItem: -1 });
      }
      self.setState({ openItem: popover });
    };
  };

  handleClose = () => {
    this.setState({ openItem: "" });
  };

  static defaultProps = {
    onChangeHook: () => {},
    sequenceData: {
      sequence: ""
    },
    annotationVisibilityToggle: () => {},
    annotationVisibilityShow: () => {},
    annotationVisibilityHide: () => {},
    annotationVisibility: {},
    annotationLabelVisibilityToggle: () => {},
    labelVisibility: {},
    AdditionalTools: [],
    minimumOrfSizeUpdate: () => {},
    minimumOrfSize: 300,
    panelsShown: {},
    panelsShownUpdate: () => {},
    sequenceLength: 0,
    excludeObj: {}
  };

  render() {
    let self = this;
    let {
      sequenceData,
      annotationVisibilityToggle,
      annotationLabelVisibilityToggle,
      annotationVisibilityShow,
      annotationVisibilityHide,
      annotationVisibility,
      annotationLabelVisibility,
      AdditionalTools = [],
      minimumOrfSizeUpdate,
      minimumOrfSize,
      panelsShown,
      panelsShownUpdate,
      sequenceLength,
      showDigestTool,
      excludeObj = {}
    } = this.props;

    let items = [
      {
        component: (
          <div
            onClick={function() {
              let blob = new Blob([jsonToGenbank(sequenceData)], {
                type: "text/plain"
              });
              FileSaver.saveAs(blob, "result_plasmid.gb");
              // downloadSequenceData(sequenceData || )
            }}
          >
            <img src={save_img} alt="Download .gb file" />
          </div>
        ),
        tooltip: "Download .gb file",
        id: "download"
      },
      // {
      //   component: <div
      //     onClick={function () {
      //       // var myPrintContent = document.getElementById('printdiv');
      //       // var myPrintWindow = window.open(windowUrl, windowName, 'left=300,top=100,width=400,height=400');
      //       // myPrintWindow.document.write(myPrintContent.innerHTML);
      //       // myPrintWindow.document.getElementById('hidden_div').style.display='block'
      //       // myPrintWindow.document.close();
      //       // myPrintWindow.focus();
      //       // myPrintWindow.print();
      //       // myPrintWindow.close();
      //       // return false;
      //       print()
      //       // var content = document.getElementById("divcontents");
      //       // document.appendChild(con)
      //       // var pri = document.getElementById("ifmcontentstoprint").contentWindow;
      //       // pri.document.open();
      //       // pri.document.write(content.innerHTML);
      //       // pri.document.close();
      //       // pri.focus();
      //       // pri.print();
      //       // downloadSequenceData(sequenceData || )
      //     }}
      //     >
      //     <img src={print_img} alt="Print Vector"/>
      //   </div>,
      //   tooltip: 'Print Vector',
      //   id: 'print'
      // },
      {
        component: (
          <div
            onClick={function() {
              annotationVisibilityToggle("cutsites");
            }}
          >
            <img src={show_cut_sites_img} alt="Show cut sites" />
          </div>
        ),
        toggled: annotationVisibility.cutsites,
        tooltip: "Show cut sites",
        tooltipToggled: "Hide cut sites",
        dropdown: (
          <div className={"veToolbarCutsiteFilterHolder"}>
            <span>Filter Cut sites:</span>
            <CutsiteFilter
              onChangeHook={function() {
                self.handleClose();
                annotationVisibilityShow("cutsites");
              }}
              {...this.props}
            />
            {showDigestTool && <DigestTool></DigestTool>}
          </div>
        ),
        dropdowntooltip: "Cut site options",
        id: "cutsites"
      },
      {
        component: (
          <div
            onClick={function() {
              annotationVisibilityToggle("features");
            }}
          >
            <img src={show_features_img} alt="Show features" />
          </div>
        ),
        toggled: annotationVisibility.features,
        tooltip: "Show features",
        tooltipToggled: "Hide features",
        dropdown: (
          <div>
            <input
              onChange={function() {
                annotationLabelVisibilityToggle("features");
                /* labelVisibilityToggle("features"); */
              }}
              checked={annotationLabelVisibility.features}
              id="showFeatureLabels"
              type="checkbox"
            />
            <span>
              {"  "} Show feature labels
            </span>
          </div>
        ),
        dropdowntooltip: "Feature options",
        id: "features"
      },
      {
        component: (
          <div
            onClick={function() {
              annotationVisibilityToggle("primers");
            }}
          >
            <img src={show_primers_img} alt="Show oligos" />
          </div>
        ),
        toggled: annotationVisibility.primers,
        tooltip: "Show oligos",
        tooltipToggled: "Hide oligos",
        id: "primers"
      },
      {
        component: (
          <div
            onClick={function() {
              if (annotationVisibility.orfs) {
                annotationVisibilityHide("orfs");
                annotationVisibilityHide("orfTranslations");
              } else {
                annotationVisibilityShow("orfs");
                annotationVisibilityShow("orfTranslations");
              }
            }}
          >
            <img src={show_orfs_img} alt="Show Open Reading Frames" />
          </div>
        ),
        toggled: annotationVisibility.orfs,
        tooltip: "Show Open Reading Frames",
        tooltipToggled: "Hide Open Reading Frames",
        dropdown: (
          <div className={"veToolbarOrfOptionsHolder"}>
            <div style={{ display: "flex" }}>
              Minimum ORF Size:
              <input
                type="number"
                className="minOrfSizeInput"
                onChange={function(event) {
                  let minimumOrfSize = parseInt(event.target.value, 10);
                  if (!(minimumOrfSize > -1)) return;
                  if (minimumOrfSize > sequenceLength) return;
                  minimumOrfSizeUpdate(minimumOrfSize);
                }}
                value={minimumOrfSize}
              />
            </div>
            <div className="taSpacer" />
            <input
              onChange={function() {
                annotationVisibilityToggle("orfTranslations");
              }}
              checked={annotationVisibility.orfTranslations}
              id="showOrfTranslations"
              type="checkbox"
            />
            <span className={"showOrfTranslateSpan"}>
              Show ORF translations{" "}
            </span>
            <div className="taSpacer" />
            <InfoCircle />
            <span className={"translateInfoSpan"}>
              To translate an arbitrary area, right click a selection.
            </span>
          </div>
        ),
        dropdowntooltip: "Open Reading Frame options",
        id: "orfs"
      },
      {
        dropdown: (
          <div className={"veToolbarViewOptionsHolder"}>
            <div>Show View:</div>
            <Radio
              onChange={() => {
                panelsShownUpdate({
                  circular: true,
                  sequence: false
                });
              }}
              checked={panelsShown.circular && !panelsShown.sequence}
              label="Circular"
            />
            <Radio
              onChange={() => {
                panelsShownUpdate({
                  circular: false,
                  sequence: true
                });
              }}
              checked={panelsShown.sequence && !panelsShown.circular}
              label="Sequence"
            />
            <Radio
              onChange={() => {
                panelsShownUpdate({
                  circular: true,
                  sequence: true
                });
              }}
              checked={panelsShown.sequence && panelsShown.circular}
              label="Both"
            />
          </div>
        ),
        dropdownicon: <img src={fullscreen_img} alt="Toggle Views" />,
        dropdowntooltip: "Toggle Views",
        id: "toggleViews"
      },
      ...AdditionalTools
    ];

    items = items.filter(function(item) {
      if (excludeObj[item.id]) {
        return false;
      } else {
        return true;
      }
    });
    let content = items.map(function(
      {
        component,
        tooltip = "",
        tooltipToggled,
        dropdowntooltip = "",
        dropdown,
        dropdownicon,
        toggled = false,
        id
      },
      index
    ) {
      let tooltipToDisplay = tooltip;
      if (toggled && tooltipToggled) {
        tooltipToDisplay = tooltipToggled;
      }
      return (
        <div key={index} className={"veToolbarItemOuter"}>
          {component &&
            <div
              aria-label={tooltipToDisplay}
              className={" hint--bottom-left veToolbarItem"}
            >
              {index !== 0 && <div className={"veToolbarSpacer"} />}
              <div
                className={
                  "veToolbarIcon " + (toggled ? " veToolbarItemToggled" : "")
                }
              >
                {component}
              </div>
            </div>}
          {dropdown &&
            <Popover
              preferPlace="below"
              onOuterAction={self.handleClose}
              isOpen={index === self.state.openItem}
              body={dropdown}
            >
              <div
                key={index + "dropdownOnClick"}
                aria-label={dropdowntooltip}
                onClick={self.handleOpen(index)}
                className={
                  " hint--bottom-left " +
                  (dropdownicon ? "" : " veToolbarDropdown")
                }
              >
                {dropdownicon
                  ? <div className={"veToolbarIcon"}>
                      <div>
                        {dropdownicon}
                      </div>
                    </div>
                  : <DropDown />}
              </div>
            </Popover>}
        </div>
      );
    });

    return (
      <div className={"veToolbar"}>
        {content}
      </div>
    );
  }
}

export default withEditorProps(VeToolBar)