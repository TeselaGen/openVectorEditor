import { debounce, isEqual, startCase } from "lodash";
import draggableClassnames from "../constants/draggableClassnames";
import prepareRowData from "../utils/prepareRowData";
import React from "react";
import Draggable from "react-draggable";
import RowItem from "../RowItem";
import withEditorInteractions from "../withEditorInteractions";
import { withEditorPropsNoRedux } from "../withEditorProps";
import "./style.css";
import {
  getClientX,
  getEmptyText,
  getParedDownWarning,
  pareDownAnnotations
} from "../utils/editorUtils";
import useAnnotationLimits from "../utils/useAnnotationLimits";
import { SequenceName } from "./SequenceName";
import classNames from "classnames";
import { massageTickSpacing } from "../utils/massageTickSpacing";
import PinchHelper from "../helperComponents/PinchHelper/PinchHelper";

import { updateLabelsForInViewFeatures } from "../utils/updateLabelsForInViewFeatures";
import { VeTopRightContainer } from "../CircularView/VeTopRightContainer";
import { ZoomLinearView } from "./ZoomLinearView";

const defaultMarginWidth = 10;

function noop() {}

class _LinearView extends React.Component {
  state = {};
  bindOutsideChangeHelper = {};
  getNearestCursorPositionToMouseEvent(rowData, event, callback) {
    //loop through all the rendered rows to see if the click event lands in one of them
    let nearestCaretPos = 0;
    let rowDomNode = this.linearView;
    rowDomNode = rowDomNode.querySelector(".veRowItem");
    const boundingRowRect = rowDomNode.getBoundingClientRect();
    const maxEnd = this.getMaxLength();
    if (getClientX(event) - boundingRowRect.left < 0) {
      nearestCaretPos = 0;
    } else {
      const clickXPositionRelativeToRowContainer =
        getClientX(event) - boundingRowRect.left;
      const numberOfBPsInFromRowStart = Math.floor(
        (clickXPositionRelativeToRowContainer + this.charWidth / 2) /
          this.charWidth
      );
      nearestCaretPos = numberOfBPsInFromRowStart + 0;
      if (nearestCaretPos > maxEnd + 1) {
        nearestCaretPos = maxEnd + 1;
      }
    }
    if (this.props.sequenceData && this.props.sequenceData.isProtein) {
      nearestCaretPos = Math.round(nearestCaretPos / 3) * 3;
    }
    if (this.props.sequenceLength === 0) nearestCaretPos = 0;
    const callbackVals = {
      doNotWrapOrigin: !(
        this.props.sequenceData && this.props.sequenceData.circular
      ),
      event,
      shiftHeld: event.shiftKey,
      nearestCaretPos,
      caretGrabbed: event.target.className === "cursor",
      selectionStartGrabbed: event.target.classList.contains(
        draggableClassnames.selectionStart
      ),
      selectionEndGrabbed: event.target.classList.contains(
        draggableClassnames.selectionEnd
      )
    };
    callback(callbackVals);
  }
  getMaxLength = () => {
    const { sequenceData = { sequence: "" }, alignmentData } = this.props;
    const data = alignmentData || sequenceData;
    return data.noSequence ? data.size : data.sequence.length;
  };

  getRowData = () => {
    const {
      limits,
      sequenceData = { sequence: "" },
      maxAnnotationsToDisplay
    } = this.props;
    if (!isEqual(sequenceData, this.oldSeqData)) {
      this.paredDownMessages = [];
      const paredDownSeqData = ["parts", "features", "cutsites"].reduce(
        (acc, type) => {
          const nameUpper = startCase(type);
          const maxToShow =
            (maxAnnotationsToDisplay
              ? maxAnnotationsToDisplay[type]
              : limits[type]) || 50;
          const [annotations, paredDown] = pareDownAnnotations(
            sequenceData["filtered" + nameUpper] || sequenceData[type] || {},
            maxToShow
          );

          if (paredDown) {
            this.paredDownMessages.push(
              getParedDownWarning({
                nameUpper,
                isAdjustable: !maxAnnotationsToDisplay,
                maxToShow
              })
            );
          }
          acc[type] = annotations;
          return acc;
        },
        {}
      );
      this.rowData = prepareRowData(
        {
          ...sequenceData,
          ...paredDownSeqData
        },
        sequenceData.sequence ? sequenceData.sequence.length : 0
      );
      this.oldSeqData = sequenceData;
    }
    return this.rowData;
  };
  updateLabelsForInViewFeaturesDebounced = debounce(() => {
    updateLabelsForInViewFeatures();
  }, 20);

  render() {
    const {
      //currently found in props
      sequenceData = { sequence: "" },
      alignmentData,
      hideName = false,
      editorDragged = noop,
      editorDragStarted = noop,
      editorClicked = noop,
      editorDragStopped = noop,
      width = 400,
      className,
      tickSpacing,
      scrollData,
      caretPosition,
      backgroundRightClicked = noop,
      RowItemProps = {},
      marginWidth = defaultMarginWidth,
      height,
      withZoomLinearView = false,
      editorName,
      smallSlider,
      paddingBottom,
      linearViewCharWidth,
      annotationVisibilityOverrides,
      isProtein,
      noWarnings,
      ...rest
    } = this.props;

    const bpsPerRow = this.getMaxLength();
    let innerWidth = Math.max(width - marginWidth, 0);
    if (isNaN(innerWidth)) {
      innerWidth = 0;
    }
    const initialCharWidth = Math.min(innerWidth / bpsPerRow, 20);
    this.charWidth =
      this.state.charWidthInLinearView ||
      linearViewCharWidth ||
      initialCharWidth;
    const isLinViewZoomed = this.charWidth !== initialCharWidth;
    const sequenceName = hideName ? "" : sequenceData.name || "";
    const rowData = this.getRowData();
    const linearZoomEnabled =
      bpsPerRow >= 50 && bpsPerRow < 30000 && withZoomLinearView;
    const minCharWidth = initialCharWidth;
    const PinchHelperToUse = linearZoomEnabled ? PinchHelper : React.Fragment;
    const pinchHandler = {
      onPinch: ({ delta: [d] }) => {
        if (d === 0) return;
        this.bindOutsideChangeHelper.triggerChange(({ value, changeValue }) => {
          // changeValue(d);
          if (d > 0) {
            if (value > 8) {
              changeValue(value + 0.4);
            } else {
              changeValue(value + 0.2);
            }
          } else if (d < 0) {
            if (value > 8) {
              changeValue(value - 0.4);
            } else {
              changeValue(value - 0.2);
            }
          }
        });
        updateLabelsForInViewFeatures();
      }
    };
    return (
      <Draggable
        enableUserSelectHack={false} //needed to prevent the input bubble from losing focus post user drag
        bounds={{ top: 0, left: 0, right: 0, bottom: 0 }}
        onDrag={(event) => {
          this.getNearestCursorPositionToMouseEvent(
            rowData,
            event,
            editorDragged
          );
        }}
        onStart={(event) => {
          this.getNearestCursorPositionToMouseEvent(
            rowData,
            event,
            editorDragStarted
          );
        }}
        onStop={editorDragStopped}
      >
        <div
          ref={(ref) => (this.linearView = ref)}
          className={classNames("veLinearView", className, {
            isLinViewZoomed
          })}
          style={{
            width,
            ...(height && { height }),
            paddingLeft: marginWidth / 2,
            ...(paddingBottom && { paddingBottom })
          }}
          onContextMenu={(event) => {
            this.getNearestCursorPositionToMouseEvent(
              rowData,
              event,
              backgroundRightClicked
            );
          }}
          onClick={(event) => {
            this.getNearestCursorPositionToMouseEvent(
              rowData,
              event,
              editorClicked
            );
          }}
        >
          {linearZoomEnabled && ( //so this for conditonal rendering
            <ZoomLinearView
              charWidth={this.charWidth}
              bindOutsideChangeHelper={this.bindOutsideChangeHelper}
              minCharWidth={minCharWidth}
              smallSlider={smallSlider}
              editorName={editorName}
              setCharWidth={(v) => {
                this.setState({
                  charWidthInLinearView: v === initialCharWidth ? undefined : v
                });
              }}
              afterOnChange={() => {
                updateLabelsForInViewFeatures();
              }}
            ></ZoomLinearView>
          )}
          {!hideName && (
            <SequenceName
              {...{
                isProtein,
                sequenceName,
                sequenceLength: sequenceData.sequence
                  ? sequenceData.sequence.length
                  : 0
              }}
            />
          )}
          {!noWarnings && (
            <VeTopRightContainer>{this.paredDownMessages}</VeTopRightContainer>
          )}

          <PinchHelperToUse {...(linearZoomEnabled && pinchHandler)}>
            <RowItem
              {...{
                ...rest,
                editorName,
                onScroll: () => {
                  updateLabelsForInViewFeatures();
                },
                rowContainerStyle: isLinViewZoomed
                  ? { paddingBottom: 15 }
                  : undefined,
                charWidth: this.charWidth,
                scrollData,
                caretPosition,
                isProtein: sequenceData.isProtein,
                alignmentData,
                sequenceLength: this.getMaxLength(),
                width: innerWidth,
                bpsPerRow,
                fullSequence: sequenceData.sequence,
                emptyText: getEmptyText({ sequenceData, caretPosition }),
                tickSpacing:
                  tickSpacing ||
                  (isLinViewZoomed
                    ? massageTickSpacing(Math.ceil(120 / this.charWidth))
                    : Math.floor(
                        this.getMaxLength() / (sequenceData.isProtein ? 9 : 10)
                      )),
                annotationVisibility: {
                  ...rest.annotationVisibility,
                  ...((!isLinViewZoomed || this.charWidth < 5) && {
                    translations: false,
                    primaryProteinSequence: false,
                    reverseSequence: false,
                    sequence: false,
                    cutsitesInSequence: false
                  }),
                  ...annotationVisibilityOverrides
                },
                ...RowItemProps
              }}
              row={rowData[0]}
              isLinearView
            />
          </PinchHelperToUse>
        </div>
      </Draggable>
    );
  }
}

const WithAnnotationLimitsHoc = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [limits = {}] = useAnnotationLimits();
  return <Component limits={limits} {...props}></Component>;
};
export const LinearView = WithAnnotationLimitsHoc(_LinearView);

export const NonReduxEnhancedLinearView = withEditorPropsNoRedux(LinearView);

export default withEditorInteractions(LinearView);

export const scrollToCaret = () => {
  const el = window.document.querySelector(".veLinearView .veRowViewCaret");
  if (!el) return;
  el.scrollIntoView({ inline: "center", block: "nearest" });
};
