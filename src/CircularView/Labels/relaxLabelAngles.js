import { cloneDeep } from "lodash";

export default relaxLabelAngles;

function normalizeAngle(angle) {
  if (angle > Math.PI * 2) {
    return angle - Math.PI * 2;
  } else if (angle < 0) {
    return angle + Math.PI * 2;
  } else {
    return angle;
  }
}

//this pure function allows the labels to spread out around the circle
//and groups overlapping labels together if necessary
function relaxLabelAngles(_labelPoints, spacing, maxradius) {
  // console.info("relaxLabelAngles", _labelPoints, spacing, maxradius);

  let maxLabelsPerQuadrant = Math.floor(maxradius / spacing) + 4;
  let labels = cloneDeep(_labelPoints);
  if (labels.length > maxLabelsPerQuadrant * 4) {
    //group overlapping labels together
    labels = combineLabels(labels, maxLabelsPerQuadrant * 4);
  }
  // labels = labels.sort(sortLabelsByAngle)

  // Sort labels into four quadrants of the screen.
  let totalLength = Math.PI * 2;

  let rightTopLabels = [];
  let rightBottomLabels = [];
  let leftTopLabels = [];
  let leftBottomLabels = [];

  let label;
  for (let i = 0; i < labels.length; i++) {
    label = labels[i];
    label.angle = normalizeAngle(label.angle);
    let labelCenter = label.angle;
    if (labelCenter <= totalLength / 4) {
      rightTopLabels.push(label);
    } else if (
      labelCenter > totalLength / 4 &&
      labelCenter <= totalLength / 2
    ) {
      rightBottomLabels.push(label);
    } else if (
      labelCenter > totalLength / 2 &&
      labelCenter <= (3 * totalLength) / 4
    ) {
      leftBottomLabels.push(label);
    } else {
      leftTopLabels.push(label);
    }
  }

  function repositionAndGroupLabels(labels /* logtrue */) {
    let extraSpaces = Math.max(maxLabelsPerQuadrant - labels.length, 0);
    let lastLabelYPosition = 0 - spacing / 2; // spacing to count label height
    let lastlabel;
    console.info(
      "labels",
      lastLabelYPosition,
      labels,
      maxLabelsPerQuadrant,
      extraSpaces,
      spacing
    );
    const retVal = labels
      .map(function (label /* index */, idx) {
        if (Math.abs(lastLabelYPosition) > maxradius + 80) {
          console.info(
            "FIRST************************",
            extraSpaces,
            label.y,
            lastLabelYPosition,
            spacing,
            label.text
          );
          lastlabel.labelAndSublabels.push(label);
          lastlabel.labelIds[label.id] = true;
          return false;
        }
        lastlabel = label;
        if (label.y < lastLabelYPosition) {
          let naturalSlot = Math.floor(Math.abs(label.y / spacing));
          console.info(
            idx,
            maxLabelsPerQuadrant - idx,
            "NATURAL",
            naturalSlot,
            extraSpaces,
            label.y,
            lastLabelYPosition,
            spacing,
            label.text
          );
          if (naturalSlot > extraSpaces) {
            if (maxLabelsPerQuadrant - idx >= naturalSlot) {
              lastLabelYPosition = label.y;
            }
            label.y = lastLabelYPosition;
          }
          let x = Math.sqrt(Math.pow(maxradius, 2) - Math.pow(label.y, 2));
          if (!x) x = 0;
          label.x = label.x > 0 ? x : -x;
          lastLabelYPosition = label.y - spacing;
        } else {
          console.info(
            "NOT<<<<<<",
            Math.floor(Math.abs(label.y / spacing)),
            extraSpaces,
            label.y,
            lastLabelYPosition,
            spacing,
            label.text
          );
          label.y = lastLabelYPosition;
          lastLabelYPosition = label.y - spacing;
        }
        return label;
      })
      .filter(function (l) {
        return !!l;
      });
    // console.info("RETVAL", retVal)
    return retVal;
  }

  // Scale Right Top Labels
  let labelsToReturn = [];
  rightTopLabels = rightTopLabels.sort(sortLabelsByAngleReverse);
  console.info("RIGHT TOP");
  labelsToReturn = labelsToReturn.concat(
    repositionAndGroupLabels(rightTopLabels, true)
  );

  // Scale Right Bottom Labels
  rightBottomLabels = rightBottomLabels.sort(sortLabelsByAngle);
  console.info("RIGHT BOTTOM");
  labelsToReturn = labelsToReturn.concat(
    flipLabelYs(repositionAndGroupLabels(flipLabelYs(rightBottomLabels)))
  );

  // Scale Left Bottom Labels
  leftBottomLabels = leftBottomLabels.sort(sortLabelsByAngleReverse);
  console.info("LEFT BOTTOM");
  labelsToReturn = labelsToReturn.concat(
    flipLabelYs(repositionAndGroupLabels(flipLabelYs(leftBottomLabels)))
  );

  // Scale Left Top Labels
  leftTopLabels = leftTopLabels.sort(sortLabelsByAngle);
  console.info("LEFT TOP");
  labelsToReturn = labelsToReturn.concat(
    repositionAndGroupLabels(leftTopLabels)
  );

  return labelsToReturn;

  function flipLabelYs(labels) {
    return labels.map(function (label) {
      label.y = -label.y;
      return label;
    });
  }
}

// function sortLabelsByHeight(a, b) {
//   return b.innerPoint.y - a.innerPoint.y
// }

function sortLabelsByAngle(a, b) {
  return a.angle - b.angle;
}
function sortLabelsByAngleReverse(b, a) {
  return a.angle - b.angle;
}

//function that groups labels that fall within the same angle together
function combineLabels(labels, numberOfBuckets) {
  let buckets = {};
  Object.keys(labels).forEach(function (key) {
    let label = labels[key];

    let bucket = Math.floor(
      (label.annotationCenterAngle / 6.29) * numberOfBuckets
    );
    if (!buckets[bucket]) {
      buckets[bucket] = label;
    } else {
      buckets[bucket].labelAndSublabels.push(label);
      buckets[bucket].labelIds[label.id] = true;
    }
  });
  let combinedLabels = Object.keys(buckets).map(function (key) {
    return buckets[key];
  });
  console.info("combinedLabels>>>>>", combinedLabels);
  return combinedLabels;
}
