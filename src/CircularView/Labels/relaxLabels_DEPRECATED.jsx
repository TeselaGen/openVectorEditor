/* eslint-disable */
// import intervalTree2 from "node-interval-tree";
// var xRanges = new intervalTree2(0)
// var yRanges = new intervalTree2(0)
// iTree.search(start, end)
// featureITree.add(startAngle, expandedEndAngle, undefined, {...annotationCopy})

let alpha = 1.5; //the larger the alpha, the fewer loops through relax necessary, but too large and things are spaced unevenly
let spacing = 12;
let relaxCounter = 0;
export default function relaxLabels(labelPoints) {
  let mutableLabelPoints = labelPoints.map(function(point) {
    return {
      ...point
    };
  });
  function spreadPointsOutOnCircle(labels) {}
  function relax() {
    let again = false;
    relaxCounter++;
    mutableLabelPoints.forEach(function(point1, index1) {
      // var xOverlaps = xRanges.search(point1.x, point1.x + point1.width)
      // var yOverlaps = yRanges.search(point1.y, point1.y + point1.height)
      // xOverlaps
      // xRanges.add(point1.x, point1.x + point1.width, undefined, point1)
      // yRanges.add(point1.y, point1.y + point1.height, undefined, point1)

      mutableLabelPoints.forEach(function(point2, index2) {
        // a & b are the same element and don't collide.
        if (index1 === index2) return;

        // a & b are on opposite sides of the chart and
        // don't collide
        if (
          (point1.x > 0 && point2.x <= 0) ||
          (point1.x < 0 && point2.x >= 0)
        ) {
          return;
        }
        // Now let's calculate the distance between
        // these elements.
        let deltaY = point1.y - point2.y;

        // Our spacing is greater than our specified spacing,
        // so they don't collide.
        if (Math.abs(deltaY) > spacing) return;

        // If the labels collide, we'll push each
        // of the two labels up and down a little bit.
        let weight1 = point1.y > 0 ? 0.5 : -0.5;
        let weight2 = point2.y > 0 ? 0.5 : -0.5;
        again = true;
        let sign = deltaY > 0 ? 1 : -1;
        let adjust = sign * alpha;
        point1.y += adjust + weight1;
        point2.y -= adjust + weight2;

        // point1.x += -weight1
        // point2.x -= -weight2
      });
    });
    // Adjust our line leaders here
    // so that they follow the labels.
    if (again && relaxCounter < 1) {
      relax();
    }
  }
  relax();

  //group colliding labels
  let stableLabels = [];
  mutableLabelPoints.forEach(function(point1) {
    let collision = false;
    stableLabels.some(function(point2) {
      // a & b are on opposite sides of the chart and
      // don't collide
      if ((point1.x > 0 && point2.x <= 0) || (point1.x < 0 && point2.x >= 0)) {
        return;
      }
      // Now let's calculate the distance between
      // these elements.
      let deltaY = point1.y - point2.y;

      // Our spacing is greater than our specified spacing,
      // so they don't collide.
      if (Math.abs(deltaY) > spacing) return;
      // If the labels collide, we'll push each
      collision = true;
      point2.labels.push(point1);
      return true; //stop the loop early
    });
    if (!collision) {
      stableLabels.push({
        ...point1,
        labels: [point1]
      });
    }
  });
  stableLabels = stableLabels.sort(sortLabels);
  return stableLabels;
}

function sortLabels(a, b) {
  return b.y - a.y;
}
