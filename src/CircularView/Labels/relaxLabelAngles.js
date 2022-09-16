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
  const maxLabelsPerQuadrant = Math.floor(maxradius / spacing) + 4;
  let labels = cloneDeep(_labelPoints);
  if (labels.length > maxLabelsPerQuadrant * 4) {
    //group overlapping labels together
    labels = combineLabels(labels, maxLabelsPerQuadrant * 4);
  }
  // labels = labels.sort(sortLabelsByAngle)

  // Sort labels into four quadrants of the screen.
  const totalLength = Math.PI * 2;

  let rightTopLabels = [];
  let rightBottomLabels = [];
  let leftTopLabels = [];
  let leftBottomLabels = [];

  let label;
  for (let i = 0; i < labels.length; i++) {
    label = labels[i];
    label.angle = normalizeAngle(label.angle);
    const labelCenter = label.angle;
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
    const extraSpaces = Math.max(maxLabelsPerQuadrant - labels.length, 0);
    let lastLabelYPosition = 0 - spacing / 2; // spacing to count label height
    let lastlabel;
    return labels
      .map(function (label, idx) {
        if (Math.abs(lastLabelYPosition) > maxradius + 80) {
          lastlabel.labelAndSublabels.push(label);
          lastlabel.labelIds[label.id] = true;
          return false;
        }
        lastlabel = label;
        if (label.y < lastLabelYPosition) {
          const naturalSlot = Math.floor(Math.abs(label.y / spacing));
          if (naturalSlot > extraSpaces) {
            if (idx < naturalSlot && extraSpaces > 0) {
              lastLabelYPosition = label.y;
            }
            label.y = lastLabelYPosition;
          }
          let x = Math.sqrt(Math.pow(maxradius, 2) - Math.pow(label.y, 2));
          if (!x) x = 0;
          label.x = label.x > 0 ? x : -x;
          lastLabelYPosition = label.y - spacing;
        } else {
          label.y = lastLabelYPosition;
          lastLabelYPosition = label.y - spacing;
        }
        return label;
      })
      .filter(function (l) {
        return !!l;
      });
  }

  // Scale Right Top Labels
  let labelsToReturn = [];
  rightTopLabels = rightTopLabels.sort(sortLabelsByAngleReverse);
  labelsToReturn = labelsToReturn.concat(
    repositionAndGroupLabels(rightTopLabels, true)
  );

  // Scale Right Bottom Labels
  rightBottomLabels = rightBottomLabels.sort(sortLabelsByAngle);
  labelsToReturn = labelsToReturn.concat(
    flipLabelYs(repositionAndGroupLabels(flipLabelYs(rightBottomLabels)))
  );

  // Scale Left Bottom Labels
  leftBottomLabels = leftBottomLabels.sort(sortLabelsByAngleReverse);
  labelsToReturn = labelsToReturn.concat(
    flipLabelYs(repositionAndGroupLabels(flipLabelYs(leftBottomLabels)))
  );

  // Scale Left Top Labels
  leftTopLabels = leftTopLabels.sort(sortLabelsByAngle);
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
  const buckets = {};
  Object.keys(labels).forEach(function (key) {
    const label = labels[key];

    const bucket = Math.floor(
      (label.annotationCenterAngle / 6.29) * numberOfBuckets
    );
    if (!buckets[bucket]) {
      buckets[bucket] = label;
    } else {
      buckets[bucket].labelAndSublabels.push(label);
      buckets[bucket].labelIds[label.id] = true;
    }
  });
  const combinedLabels = Object.keys(buckets).map(function (key) {
    return buckets[key];
  });
  return combinedLabels;
}
