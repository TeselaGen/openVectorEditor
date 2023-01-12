import polarToSpecialCartesian from "../utils/polarToSpecialCartesian";
import relaxLabelAngles from "./relaxLabelAngles";
import withHover from "../../helperComponents/withHover";
import "./style.css";
import React from "react";
import { cloneDeep, clamp } from "lodash";

const fontWidthToFontSize = 1.75;

const getTextLength = (text) => {
  let len = (text || "Unlabeled").length;
  // eslint-disable-next-line no-control-regex
  const nonEnInputReg = /[^\x00-\xff]+/g;
  const nonEnStrings = (text || "Unlabeled").match(nonEnInputReg) || [];
  nonEnStrings.forEach((str) => (len += str.length * 0.5));
  return len;
};

function Labels({
  labels = [],
  extraSideSpace,
  smartCircViewLabelRender,
  radius: outerRadius,
  editorName,
  noRedux,
  rotationRadians,
  textScalingFactor,
  labelLineIntensity,
  labelSize = 8,
  fontHeightMultiplier = 2.4,
  circularViewWidthVsHeightRatio, //width of the circular view
  condenseOverflowingXLabels = true //set to true to make labels tha
}) {
  if (!labels.length) {
    return {
      component: null,
      height: 15
    };
  }
  const originalOuterRadius = outerRadius;
  outerRadius += smartCircViewLabelRender ? 10 : 25;
  const radius = outerRadius;
  const outerPointRadius = outerRadius - 20;
  //we don't want the labels to grow too large on large screen devices,
  //so we start to decrease the fontWidth if the textScalingFactor is less than 1
  const fontWidth = labelSize * (textScalingFactor < 1 ? textScalingFactor : 1);

  const fontHeight = fontWidth * clamp(fontHeightMultiplier, 1.5, 3.5);

  const labelPoints = labels
    .map(function (label) {
      const {
        annotationCenterAngle: _annotationCenterAngle,
        annotationCenterRadius
      } = label;
      const annotationCenterAngle =
        _annotationCenterAngle + (rotationRadians || 0);
      return {
        ...label,
        width: getTextLength(label.text) * fontWidth,
        //three points define the label:
        innerPoint: {
          ...polarToSpecialCartesian(
            annotationCenterRadius,
            annotationCenterAngle
          ),
          radius: annotationCenterRadius,
          angle: annotationCenterAngle
        },
        truncatedInnerPoint: {
          ...polarToSpecialCartesian(
            outerPointRadius - 15,
            annotationCenterAngle
          ),
          radius: outerPointRadius - 15,
          angle: annotationCenterAngle
        },
        outerPoint: {
          ...polarToSpecialCartesian(outerPointRadius, annotationCenterAngle),
          radius: outerPointRadius,
          angle: annotationCenterAngle
        },
        ...polarToSpecialCartesian(radius, annotationCenterAngle),
        radius: radius + 10,
        angle: annotationCenterAngle
      };
    })
    .map(function (label) {
      label.labelAndSublabels = [label];
      label.labelIds = { [label.id]: true };
      return label;
    });

  let maxRadius = 1;
  const groupedLabels = relaxLabelAngles(labelPoints, fontHeight, outerRadius)
    .filter((l) => !!l)
    .map((originalLabel) => {
      if (smartCircViewLabelRender) {
        const newR = Math.sqrt(
          Math.pow(
            Math.abs(originalLabel.x) +
              Math.max(0, originalLabel.text.length * 11 - extraSideSpace / 2),
            2
          ) + Math.pow(Math.abs(originalLabel.y), 2)
        );

        if (newR > maxRadius) maxRadius = newR;
      }
      //we need to search the labelGroup to see if any of the sub labels are highPriorityLabels
      //if they are, they should take precedence as the main group identifier
      if (originalLabel.highPriorityLabel) {
        //if the originalLabel is a highPriorityLabel, just return it
        return originalLabel;
      }

      const _highPrioritySublabel = originalLabel.labelAndSublabels.find(
        (l) => l.highPriorityLabel
      );
      if (_highPrioritySublabel) {
        const highPrioritySublabel = cloneDeep(_highPrioritySublabel);
        //there is a high priority sub label, so we need to return it
        // but first we need to give it the sub-labels

        [
          "angle",
          "annotationCenterAngle",
          "annotationCenterRadius",
          "innerPoint",
          "labelAndSublabels",
          "labelIds",
          "outerPoint",
          "radius",
          "truncatedInnerPoint",
          "x",
          "y"
        ].forEach((k) => {
          highPrioritySublabel[k] = originalLabel[k];
        });

        delete originalLabel.labelAndSublabels;
        return highPrioritySublabel;
      }
      return originalLabel;
    });

  // let groupedLabels = relaxLabelAngles(
  //   labelPoints,
  //   fontHeight,
  //   outerRadius
  // ).map(label => {
  //   //in order to memoize the relaxLabelAngles function, we don't pass the full label above because it has function handlers that cause the deep equal to fail
  //   const originalLabel = {
  //     ...labels[label.id],
  //     ...label
  //   };
  //   return {
  //     ...originalLabel,
  //     labelAndSublabels: [originalLabel].concat(originalLabel.labelAndSublabels)
  //   };
  // });
  window.isLabelGroupOpen = false;
  return {
    component: (
      <g
        key="veLabels"
        className="veLabels ve-monospace-font"
        transform={`rotate(-${(rotationRadians * 180) / Math.PI})`}
      >
        <DrawGroupedLabels
          {...{
            editorName,
            noRedux,
            groupedLabels,
            circularViewWidthVsHeightRatio,
            fontWidth,
            fontHeight,
            condenseOverflowingXLabels,
            outerRadius,
            labelLineIntensity
          }}
        />
      </g>
    ),
    //we use the <use> tag to position the hovered label group at the top of the stack
    //point events: none is to fix a click bug..
    //http://stackoverflow.com/questions/24078524/svg-click-events-not-firing-bubbling-when-using-use-element
    height: smartCircViewLabelRender
      ? Math.min(105, maxRadius - originalOuterRadius)
      : 120
  };
}
export default Labels;

const DrawLabelGroup = withHover(function ({
  hovered,
  className,
  label,
  labelAndSublabels,
  fontWidth,
  noRedux,
  fontHeight,
  outerRadius,
  onMouseLeave,
  onMouseOver,
  editorName,
  circularViewWidthVsHeightRatio,
  condenseOverflowingXLabels,
  hoveredId,
  labelLineIntensity,
  // labelIds,
  multipleLabels
  // isIdHashmap,
}) {
  let { text = "Unlabeled" } = label;

  const textLength = getTextLength(text);
  let groupLabelXStart;
  //Add the number of unshown labels
  if (label.labelAndSublabels && label.labelAndSublabels.length > 1) {
    // if (label.x > 0) {
    text = "+" + (label.labelAndSublabels.length - 1) + "," + text;
    // } else {
    //   text += ', +' + (label.labelAndSublabels.length - 1)
    // }
  }

  const labelLength = textLength * fontWidth;
  const maxLabelLength = labelAndSublabels.reduce(function (
    currentLength,
    { text = "Unlabeled" }
  ) {
    const _textLength = getTextLength(text);
    if (_textLength > currentLength) {
      return _textLength;
    }
    return currentLength;
  },
  0);

  const maxLabelWidth = maxLabelLength * fontWidth;
  const labelOnLeft = label.angle > Math.PI;
  let labelXStart = label.x - (labelOnLeft ? labelLength : 0);
  if (condenseOverflowingXLabels) {
    const distancePastBoundary =
      Math.abs(label.x + (labelOnLeft ? -labelLength : labelLength)) -
      (outerRadius + 90) * Math.max(1, circularViewWidthVsHeightRatio);
    // Math.max(outerRadius (circularViewWidthVsHeightRatio / 2 + 80));
    if (distancePastBoundary > 0) {
      const numberOfCharsToChop =
        Math.ceil(distancePastBoundary / fontWidth) + 2;
      //   if (numberOfCharsToChop > text.length) numberOfCharsToChop = text.length
      //label overflows the boundaries!
      text = text.slice(0, -numberOfCharsToChop) + "..";
      groupLabelXStart =
        labelXStart +
        (labelOnLeft ? distancePastBoundary : -distancePastBoundary);
      labelXStart += labelOnLeft ? distancePastBoundary : 0;
    }
  }
  const dy = fontHeight;
  const textYStart = label.y + dy / 2;

  //if label xStart or label xEnd don't fit within the canvas, we need to shorten the label..

  let content;
  const labelClass = ` veLabelText veCircularViewLabelText clickable ${label.color} `;

  if ((multipleLabels || groupLabelXStart !== undefined) && hovered) {
    //HOVERED: DRAW MULTIPLE LABELS IN A RECTANGLE
    window.isLabelGroupOpen = true;
    let hoveredLabel;
    if (groupLabelXStart !== undefined) {
      labelXStart = groupLabelXStart;
    }
    labelAndSublabels.some(function (label) {
      if (label.id === hoveredId) {
        hoveredLabel = label;
        return true;
      }
      return false;
    });
    if (!hoveredLabel) {
      hoveredLabel = label;
    }
    let labelYStart = label.y;

    const labelGroupHeight = labelAndSublabels.length * dy;
    const labelGroupBottom = label.y + labelGroupHeight;
    // var numberOfLabelsToFitAbove = 0
    if (labelGroupBottom > outerRadius + 20) {
      // var diff = labelGroupBottom - (outerRadius+10)
      //calculate new label y start if necessary (the group is too long)
      labelYStart -= (label.labelAndSublabels.length - 1) * dy;
      if (labelYStart < -outerRadius) {
        //we need to make another row of labels!
      }
    }

    const line = LabelLine(
      [
        hoveredLabel.innerPoint,
        // hoveredLabel.labelAndSublabels &&
        // hoveredLabel.labelAndSublabels.length > 0
        //   ? hoveredLabel.outerPoint
        //   : {},
        label
      ],
      { style: { opacity: 1 }, strokeWidth: 2 }
    );
    content = [
      line,

      <PutMyParentOnTop editorName={editorName} key="gGroup">
        <g className={className + " topLevelLabelGroup"}>
          <rect
            onMouseOver={cancelFn}
            // zIndex={10}
            x={labelXStart - 4}
            y={labelYStart - dy / 2}
            width={maxLabelWidth + 24}
            height={labelGroupHeight + 4}
            fill="white"
            stroke="black"
          />

          <text
            /* zIndex={11} */ x={labelXStart}
            y={labelYStart}
            style={{
              fontSize: fontWidth * fontWidthToFontSize,
              fontStyle: label.fontStyle
            }}
          >
            {labelAndSublabels.map(function (label, index) {
              return (
                <DrawGroupInnerLabel
                  isSubLabel
                  noRedux={noRedux}
                  editorName={editorName}
                  logHover
                  key={"labelItem" + index}
                  className={
                    (label.className || "") +
                    labelClass +
                    " veDrawGroupInnerLabel"
                  }
                  id={label.id}
                  {...{ labelXStart, label, fontWidth, index, dy }}
                />
              );
            })}
          </text>
        </g>
      </PutMyParentOnTop>
    ];
  } else {
    //DRAW A SINGLE LABEL
    content = [
      <title key="labeltitle">{label.title || label.text}</title>,
      <text
        key="text"
        x={labelXStart}
        textLength={getTextLength(text) * fontWidth}
        lengthAdjust="spacing"
        className={
          labelClass + label.className + (hovered ? " veAnnotationHovered" : "")
        }
        y={textYStart}
        style={{
          fontSize: fontWidth * fontWidthToFontSize,
          fontStyle: label.fontStyle,
          fill: label.color || "black"
          // stroke: label.color ? label.color : "black"
        }}
      >
        {text}
      </text>,
      LabelLine(
        [
          label.innerPoint,
          // hovered || label.annotationType === "part" //because parts live on the outside of the sequence, we don't need to show the truncated point, we can just point to them directly
          //   ? label.innerPoint
          //   : label.truncatedInnerPoint,
          label.outerPoint,
          label
        ],
        hovered
          ? { style: { opacity: 1 }, strokeWidth: 2 }
          : { style: { opacity: labelLineIntensity } }
      )
    ];
  }
  return (
    <g
      {...{ onMouseLeave, onMouseOver }}
      {...{
        onClick: label.onClick,
        onDoubleClick: label.onDoubleClick || noop,
        onContextMenu: label.onContextMenu || noop
      }}
    >
      {content}
    </g>
  );
});

function LabelLine(pointArray, options) {
  let points = "";
  pointArray.forEach(function ({ x, y }) {
    if (!x && x !== 0) return;
    points += `${x},${y} `;
  });
  return (
    <React.Fragment key="labelLine">
      {/* <polyline
        {...{
          key: "polyline-short",
          points,
          stroke: "black",
          fill: "none",
          strokeWidth: 1,
          // style: {
          //   opacity: 0.2
          // },
          className: "veLabelLine",
          ...options
        }}
      /> */}
      <polyline
        {...{
          key: "polyline-long",
          points,
          stroke: "black",
          fill: "none",
          strokeWidth: 1,
          className: "veLabelLine",
          ...options
        }}
      />
    </React.Fragment>
  );
}

const DrawGroupInnerLabel = withHover(
  ({ className, labelXStart, label, fontWidth, onMouseOver, index, dy }) => {
    return (
      <tspan
        x={labelXStart}
        textLength={getTextLength(label.text) * fontWidth}
        lengthAdjust="spacing"
        onClick={label.onClick}
        onDoubleClick={(e) => {
          e.stopPropagation();
          label.onDoubleClick && label.onDoubleClick(e);
        }}
        onContextMenu={label.onContextMenu}
        dy={index === 0 ? dy / 2 : dy}
        style={{
          fill: label.color ? label.color : "black",
          fontStyle: label.fontStyle
        }}
        {...{ onMouseOver }}
        className={className}
      >
        <title>{label.title}</title>
        {label.text}
      </tspan>
    );
  }
);

function noop() {}

const DrawGroupedLabels = function DrawGroupedLabelsInner({
  groupedLabels,
  circularViewWidthVsHeightRatio,
  fontWidth,
  noRedux,
  fontHeight,
  condenseOverflowingXLabels,
  outerRadius,
  editorName,
  labelLineIntensity
}) {
  return groupedLabels.map(function (label, i) {
    const { labelAndSublabels, labelIds } = label;
    const multipleLabels = labelAndSublabels.length > 1;
    return (
      <DrawLabelGroup
        key={i}
        id={labelIds}
        {...{
          label,
          noRedux,
          passHoveredId: true, //needed to get the hoveredId
          isLabelGroup: true,
          className: "DrawLabelGroup",
          multipleLabels,
          labelAndSublabels,
          labelIds,
          circularViewWidthVsHeightRatio,
          fontWidth,
          editorName,
          fontHeight,
          condenseOverflowingXLabels,
          outerRadius,
          labelLineIntensity
        }}
      />
    );
  });
};
function cancelFn(e) {
  e.stopPropagation();
}

class PutMyParentOnTop extends React.Component {
  componentDidMount() {
    const { editorName } = this.props;
    //we use this component to re-order the svg groupedLabels because z-index won't work in svgs
    try {
      const el = document.querySelector(
        `.veEditor.${editorName} .topLevelLabelGroup`
      );
      const parent = el.parentElement.parentElement;
      const i = Array.prototype.indexOf.call(parent.children, el.parentElement);
      parent.insertBefore(parent.children[i], null); //insert at the end of the list..
    } catch (error) {
      console.warn(
        "OVE-975239 - hit an error trying to re-order labels:",
        error
      );
    }
  }
  render() {
    return this.props.children;
  }
}
