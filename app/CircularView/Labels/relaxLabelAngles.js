import clone from 'clone';
import polarToSpecialCartesian from '../utils/polarToSpecialCartesian';

var alpha = .035; //the larger the alpha, the fewer loops through relax necessary, but too large and things are spaced unevenly
var relaxCounter = 0;

// {{}} clean up this file

export default function relaxLabelAngles(labelPoints, spacing) {
  var mutableLabelPoints = clone(labelPoints)
  if (labelPoints.length > 100) {
    mutableLabelPoints = combineLabels(mutableLabelPoints)
  }
  mutableLabelPoints = mutableLabelPoints.sort(sortLabelsByAngle)
  function relax() {
      var again = false;
      relaxCounter++

      mutableLabelPoints.forEach(function (point1, index1) {
        // var xOverlaps = xRanges.search(point1.x, point1.x + point1.width)
        // var yOverlaps = yRanges.search(point1.y, point1.y + point1.height)
        // xOverlaps
        // xRanges.add(point1.x, point1.x + point1.width, undefined, point1)
        // yRanges.add(point1.y, point1.y + point1.height, undefined, point1)

          mutableLabelPoints.forEach(function (point2, index2) {
              // a & b are the same element and don't collide.
              if (index1 === index2) return;

              if (!doLabelsCollide(point1, point2, spacing)) {
                return //labels don't collide so return early
              }

              // If the labels collide, we'll push each
              // of the two labels up and down a little bit.
              again = true;
              //determine the adjustment direction based on the unchanging innerPoint angle!
              var sign = point1.innerPoint.angle > point2.innerPoint.angle ? 1 : -1;
              if (point1.innerPoint.angle === point2.innerPoint.angle) {
                //if the inner point angles are the same, use the changing outer point angle
                sign = point1.angle > point2.angle ? 1 : -1;
              }
              if (Math.abs(point1.innerPoint.angle - point2.innerPoint.angle) > Math.PI) {
                //we're comparing angles that span the origin so flip the sign
                sign = -sign
              }
              
              var adjust = sign * alpha;
              //adjust the angles
              point1.angle += adjust
              point2.angle -= adjust

              //update the x and y for the angles!
              updateXandYBasedOnNewAngle(point1)
              updateXandYBasedOnNewAngle(point2)
          });
      });
      // if(again && relaxCounter < 1) {
      if(again && relaxCounter < Math.floor(1000/(mutableLabelPoints.length || 1))) {
          //run relax again if necessary, up to a certain amount of times (fewer if there are more angles)
          relax()
      }
  }
  relax()
  //group colliding labels
  var stableLabels = []
  mutableLabelPoints.forEach(function(point1){
    var collision = false;
    stableLabels.some(function(point2){
      if (doLabelsCollide(point1, point2, spacing)) {
        collision = true
        point2.labels = point2.labels.concat(point1.labels || [point1])
        return true //stop the loop early
      }
    });
    if (!collision) {
      stableLabels.push({
        ...point1,
        labels: point1.labels || [point1]
      })
    }
  });
  // //console.log('stableLabels.length: ', stableLabels.length);
  stableLabels = stableLabels.sort(sortLabelsByHeight) //sort the labels by height in order to avoid overlapping labels 
  return stableLabels
}

function sortLabelsByHeight (a,b) {
    return  b.y - a.y;
}

function sortLabelsByAngle (a,b) {
    return  a.innerPoint.angle - b.innerPoint.angle;
}

function updateXandYBasedOnNewAngle(point) {
    var {x,y} = polarToSpecialCartesian(point.radius, point.angle);
    point.x = x;
    point.y = y;
}

function combineLabels(labels) {
    var numberOfBuckets=100;
    var buckets = {};

    Object.keys(labels).forEach(function(key){
        var label = labels[key];
        var bucket = Math.floor(label.annotationCenterAngle / 6.29 * numberOfBuckets);

        if (!buckets[bucket]) {
            buckets[bucket] = {
                ...label,
                labels: []
            }
        }
        buckets[bucket].labels.push(label);
    });

    var combinedLabels = Object.keys(buckets).map(function(key){
        return buckets[key];
    });

    return combinedLabels;
}

function doLabelsCollide(point1, point2, spacing) {
    // Now let's calculate the distance between
    // these elements.
    var deltaY = point1.y - point2.y;
    var deltaX = point1.x - point2.x;

    // a & b are on opposite sides of the chart and
    // don't collide
    if ((point1.x > 0 && point2.x <= 0) || (point1.x < 0 && point2.x >= 0)) {
        return false
    }
    // Our spacing is greater than our specified spacing,
    // so they don't collide.
    // debugger;
    if (Math.abs(deltaY) > spacing) return false;
    // if (Math.abs(deltaX) > spacing) return false;
    if (deltaX > 0) {
        if (deltaX > point1.width) {
            // //console.log('deltaX: ' + JSON.stringify(deltaX,null,4));
            // //console.log('point1.width: ' + JSON.stringify(point1.width,null,4));
            // //console.log('point1.x: ' + JSON.stringify(point1.x,null,4));
            // //console.log('point2.x: ' + JSON.stringify(point2.x,null,4));
            return false;
        }
    } else {
        if (-deltaX > point2.width) {
            return false;
        }
    }
    return true;
}