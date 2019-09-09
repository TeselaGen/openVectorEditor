import polarToSpecialCartesian from "../utils/polarToSpecialCartesian";
import relaxLabelAngles from "./relaxLabelAngles";
import withHover from "../../helperComponents/withHover";
import "./style.css";
import React from "react";

const defaultFontWidth = 8;
const fontWidthToFontSize = 1.75;

function Labels({
  labels = {},
  radius: outerRadius,
  editorName,
  textScalingFactor,
  circularViewWidthVsHeightRatio, //width of the circular view
  condenseOverflowingXLabels = true //set to true to make labels tha
}) {
  if (!Object.keys(labels).length) return null;
  outerRadius += 25;
  let radius = outerRadius;
  let outerPointRadius = outerRadius - 20;
  //we don't want the labels to grow too large on large screen devices,
  //so we start to decrease the fontWidth if the textScalingFactor is less than 1
  let fontWidth =
    defaultFontWidth * (textScalingFactor < 1 ? textScalingFactor : 1);

  let fontHeight = fontWidth * 2.4;
  let labelPoints = Object.keys(labels)
    .map(function(key) {
      let label = labels[key];
      let { annotationCenterAngle, annotationCenterRadius } = label;
      return {
        ...label,
        width: (label.text || "Unlabeled").length * fontWidth,
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
    .map(function(label) {
      label.labelAndSublabels = [label];
      label.labelIds = { [label.id]: true };
      return label;
    });
  let groupedLabels = relaxLabelAngles(
    labelPoints,
    fontHeight,
    outerRadius
  ).filter(l => !!l);
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
      <g key="veLabels" className="veLabels ve-monospace-font">
        <DrawGroupedLabels
          {...{
            editorName,
            groupedLabels,
            circularViewWidthVsHeightRatio,
            fontWidth,
            fontHeight,
            condenseOverflowingXLabels,
            outerRadius
          }}
        />
      </g>
    ),
    //we use the <use> tag to position the hovered label group at the top of the stack
    //point events: none is to fix a click bug..
    //http://stackoverflow.com/questions/24078524/svg-click-events-not-firing-bubbling-when-using-use-element

    height: 120
  };
}
export default Labels;

const DrawLabelGroup = withHover(function({
  hovered,
  className,
  label,
  labelAndSublabels,
  fontWidth,
  fontHeight,
  outerRadius,
  onMouseLeave,
  onMouseOver,
  editorName,
  circularViewWidthVsHeightRatio,
  condenseOverflowingXLabels,
  hoveredId,
  // labelIds,
  multipleLabels
  // isIdHashmap,
}) {
  let { text = "Unlabeled" } = label;
  let groupLabelXStart;
  //Add the number of unshown labels
  if (label.labelAndSublabels && label.labelAndSublabels.length > 1) {
    // if (label.x > 0) {
    text = "+" + (label.labelAndSublabels.length - 1) + "," + text;
    // } else {
    //   text += ', +' + (label.labelAndSublabels.length - 1)
    // }
  }

  let labelLength = text.length * fontWidth;
  let maxLabelLength = labelAndSublabels.reduce(function(
    currentLength,
    { text = "Unlabeled" }
  ) {
    if (text.length > currentLength) {
      return text.length;
    }
    return currentLength;
  },
  0);

  let maxLabelWidth = maxLabelLength * fontWidth;
  let labelOnLeft = label.angle > Math.PI;
  let labelXStart = label.x - (labelOnLeft ? labelLength : 0);
  if (condenseOverflowingXLabels) {
    let distancePastBoundary =
      Math.abs(label.x + (labelOnLeft ? -labelLength : labelLength)) -
      (outerRadius + 90) * Math.max(1, circularViewWidthVsHeightRatio);
    // Math.max(outerRadius (circularViewWidthVsHeightRatio / 2 + 80));
    if (distancePastBoundary > 0) {
      let numberOfCharsToChop = Math.ceil(distancePastBoundary / fontWidth) + 2;
      //   if (numberOfCharsToChop > text.length) numberOfCharsToChop = text.length
      //label overflows the boundaries!
      text = text.slice(0, -numberOfCharsToChop) + "..";
      groupLabelXStart =
        labelXStart +
        (labelOnLeft ? distancePastBoundary : -distancePastBoundary);
      labelXStart += labelOnLeft ? distancePastBoundary : 0;
    }
  }
  let dy = fontHeight;
  let textYStart = label.y + dy / 2;

  //if label xStart or label xEnd don't fit within the canvas, we need to shorten the label..

  let content;
  const labelClass =
    " veLabelText veCircularViewLabelText clickable " + label.color;

  if ((multipleLabels || groupLabelXStart !== undefined) && hovered) {
    //HOVERED: DRAW MULTIPLE LABELS IN A RECTANGLE
    window.isLabelGroupOpen = true;
    let hoveredLabel;
    if (groupLabelXStart !== undefined) {
      labelXStart = groupLabelXStart;
    }
    labelAndSublabels.some(function(label) {
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

    let labelGroupHeight = labelAndSublabels.length * dy;
    let labelGroupBottom = label.y + labelGroupHeight;
    // var numberOfLabelsToFitAbove = 0
    if (labelGroupBottom > outerRadius + 20) {
      // var diff = labelGroupBottom - (outerRadius+10)
      //calculate new label y start if necessary (the group is too long)
      labelYStart -= (label.labelAndSublabels.length - 1) * dy;
      if (labelYStart < -outerRadius) {
        //we need to make another row of labels!
      }
    }

    let line = LabelLine(
      [
        hoveredLabel.innerPoint,
        // hoveredLabel.labelAndSublabels &&
        // hoveredLabel.labelAndSublabels.length > 0
        //   ? hoveredLabel.outerPoint
        //   : {},
        label
      ],
      { style: { opacity: 1 } }
    );
    content = [
      line,

      <PutMyParentOnTop key="gGroup">
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
            style={{ fontSize: fontWidth * fontWidthToFontSize }}
          >
            {labelAndSublabels.map(function(label, index) {
              return (
                <DrawGroupInnerLabel
                  isSubLabel
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
        textLength={text.length * fontWidth}
        lengthAdjust="spacing"
        className={
          labelClass + label.className + (hovered ? " veAnnotationHovered" : "")
        }
        y={textYStart}
        style={{
          fontSize: fontWidth * fontWidthToFontSize,
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
        hovered ? { style: { opacity: 1 } } : {}
      )
    ];
  }
  return (
    <g
      {...{ onMouseLeave, onMouseOver }}
      {...{
        onClick: label.onClick,
        onContextMenu: label.onContextMenu || noop
      }}
    >
      {content}
    </g>
  );
});

function LabelLine(pointArray, options) {
  let points = "";
  pointArray.forEach(function({ x, y }) {
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
          // style: {
          //   opacity: 0.2
          // },
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
        textLength={label.text.length * fontWidth}
        lengthAdjust="spacing"
        onClick={label.onClick}
        onContextMenu={label.onContextMenu}
        dy={index === 0 ? dy / 2 : dy}
        style={{ fill: label.color ? label.color : "black" }}
        {...{ onMouseOver }}
        className={className}
      >
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
  fontHeight,
  condenseOverflowingXLabels,
  outerRadius,
  editorName
}) {
  return groupedLabels.map(function(label) {
    let { labelAndSublabels, labelIds } = label;
    let multipleLabels = labelAndSublabels.length > 1;
    return (
      <DrawLabelGroup
        key={label.id}
        id={labelIds}
        {...{
          label,
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
          outerRadius
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
    //we use this component to re-order the svg groupedLabels because z-index won't work in svgs
    try {
      const el = document.querySelector(".topLevelLabelGroup");
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
