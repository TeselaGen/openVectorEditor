import clone from 'clone';
import lruMemoize from 'lru-memoize';

export default lruMemoize(5, undefined, true)(relaxLabelAngles)

function normalizeAngle(angle) {
  if (angle > Math.PI * 2) {
    return angle - (Math.PI * 2)
  } else if (angle < 0) {
    return angle + (Math.PI * 2)
  } else {
    return angle
  }
}

//this pure function allows the labels to spread out around the circle 
//and groups overlapping labels together if necessary
function relaxLabelAngles(_labelPoints, spacing, maxradius) {
  spacing = 18
  var maxLabelsPerQuadrant = Math.floor(maxradius/spacing) + 4
  var labels = clone(_labelPoints)
  if (labels.length > maxLabelsPerQuadrant*4) {
    //group overlapping labels together
    labels = combineLabels(labels, maxLabelsPerQuadrant*4)
  }
  // labels = labels.sort(sortLabelsByAngle)
  
  // Sort labels into four quadrants of the screen.
  var totalLength = Math.PI * 2

  var rightTopLabels = [];
  var rightBottomLabels = [];
  var leftTopLabels = [];
  var leftBottomLabels = [];

  var label;
  for (var i = 0; i < labels.length; i++) {
      label = labels[i];
      label.angle = normalizeAngle(label.angle)
      var labelCenter = label.angle;
      if (labelCenter < totalLength / 4) {
          rightTopLabels.push(label);

      }
      else if ((labelCenter >= totalLength / 4) &&
          (labelCenter < totalLength / 2)) {
          rightBottomLabels.push(label);
      }
      else if ((labelCenter >= totalLength / 2) &&
          (labelCenter < 3 * totalLength / 4)) {
          leftBottomLabels.push(label);
      }
      else {
          leftTopLabels.push(label);
      }
  }

  function repositionAndGroupLabels(labels, logtrue) {
    var extraSpaces = Math.max(maxLabelsPerQuadrant - labels.length, 0)
    var lastLabelYPosition = 0 - spacing/2 // spacing to count label height
    var lastlabel
    return labels.map(function (label, index) {
      if (Math.abs(lastLabelYPosition) > maxradius + 40) {
        lastlabel.labelAndSublabels.push(label)
        return
      }
      lastlabel = label
      if (label.y < lastLabelYPosition) {
        var naturalSlot = Math.floor(Math.abs(label.y/spacing))
        if (naturalSlot > extraSpaces) {
          label.y = lastLabelYPosition
        } else {
          label.y = label.y
        }
        var x = Math.sqrt(Math.pow(maxradius,2) - Math.pow(label.y,2))
        if (!x) x = 0
        label.x = label.x > 0 ? x : -x
        lastLabelYPosition = label.y - spacing;
      } else {
          label.y = lastLabelYPosition;
          lastLabelYPosition = label.y - spacing;
      }
      return label
    }).filter(function (l) {
      return !!l
    })

  }

  // Scale Right Top Labels
  var labelsToReturn = []
  rightTopLabels = rightTopLabels.sort(sortLabelsByAngleReverse)
  labelsToReturn = labelsToReturn.concat(repositionAndGroupLabels(rightTopLabels, true))

  // Scale Right Bottom Labels
  rightBottomLabels = rightBottomLabels.sort(sortLabelsByAngle)
  labelsToReturn = labelsToReturn.concat(flipLabelYs(repositionAndGroupLabels(flipLabelYs(rightBottomLabels))))

  // Scale Left Bottom Labels
  leftBottomLabels = leftBottomLabels.sort(sortLabelsByAngleReverse)
  labelsToReturn = labelsToReturn.concat(flipLabelYs(repositionAndGroupLabels(flipLabelYs(leftBottomLabels))))

  // Scale Left Top Labels
  leftTopLabels = leftTopLabels.sort(sortLabelsByAngle)
  labelsToReturn = labelsToReturn.concat(repositionAndGroupLabels(leftTopLabels))

  return labelsToReturn

  function flipLabelYs(labels) {
    return labels.map(function (label) {
      label.y = -label.y
      return label
    })
  }
}


// function sortLabelsByHeight(a, b) {
//   return b.innerPoint.y - a.innerPoint.y
// }

function sortLabelsByAngle(a, b) {
  return a.highPriority || a.angle - b.angle
}
function sortLabelsByAngleReverse(b, a) {
  return a.highPriority || a.angle - b.angle
}



//function that groups labels that fall within the same angle together
function combineLabels(labels, numberOfBuckets) {
  var buckets = {}
  var highPriorityLabels = []
  Object.keys(labels).forEach(function(key) {
    var label = labels[key]
    if (label.highPriority) {
      highPriorityLabels.push(label)
      return 
    }
    var bucket = Math.floor(label.annotationCenterAngle / 6.29 * numberOfBuckets)
    if (!buckets[bucket]) {
      buckets[bucket] = label
    } else {
      buckets[bucket].labelAndSublabels.push(label)
    }
  });
  var combinedLabels = Object.keys(buckets).map(function(key) {
    return buckets[key]
  }).concat(highPriorityLabels)
  return combinedLabels
}
