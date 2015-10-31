export function polarToCartesian(center, radius, angleInDegrees) {
    // var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: center.x + (radius * Math.cos(angleInRadians)),
        y: center.y + (radius * Math.sin(angleInRadians))
    };
}

export default function describeArc(x, y, radius, startAngle, endAngle, counterclockwise) {

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
    ].join(" ");

    return d;
}

//draws a directed piece of the pie with an arrowhead, starts at 0 angle, only draws in one direction (use transforms to move it around the ) 
drawDirectedPiePiece: function(center, radius, annotationHeight, widthInBps, sequenceLength) {
        var arrowheadStrength = 10
        var arrowheadLength = 10
        var arrowheadAngleInRadians = arrowheadLength * Math.PI
        var orfLineHeight = annotationHeight/arrowheadStrength;
        
        var arrowheadOuterRadius = radius + orfLineHeight / 2;
        var arrowheadInnerRadius = radius - orfLineHeight / 2;
        var outerRadius = radius + orfLineHeight / 2;
        var innerRadius = radius - orfLineHeight / 2;
        
        //angle for entire annotation
        var angleInRadians = (widthInBps/sequenceLength)*Math.PI;
        
        var arcLength = radius * (2 * Math.PI + angleInRadians);
        var arrowheadPoint = polarToCartesian(center, radius, 0);

        if (angleInRadians < arrowheadAngleInRadians) {
            //set arrowhead length to the angle in radians length
            arrowheadAngleInRadians = angleInRadians;
        } 
        var arrowheadBottom = polarToCartesian(center, radius, 0)

        else {
            //draw just part of arrowhead, no tail
        }

        var arrowheadBottom = polarToCartesian(center.x,center.y, radius, angleInRadians)

        

        // The tip of the arrow.
        var middlePoint = {};

        var path;
        
            // The angle between the tip of the arrow and its base.
            var alpha = this.ARC_THRESHOLD / radius;

            var sweep = true;

            // Determine whether we must set the large-arc-flag in SVG to 1.
            var largeFlag = false;
            if (Math.abs(endAngle - 0) > Math.PI) {
                largeFlag = true;
            }

            if (0 > endAngle) {
                sweep = !sweep;
                largeFlag = !largeFlag;
            }

            middlePoint.x = radius * Math.sin(endAngle);
            middlePoint.y = - radius * Math.cos(endAngle);

            endAngle -= alpha;

            outerCorner.x = outerRadius * Math.sin(0);
            outerCorner.y = - outerRadius * Math.cos(0);

            innerCorner.x = innerRadius * Math.sin(endAngle);
            innerCorner.y = - innerRadius * Math.cos(endAngle);

            path = this.drawArc2(center, outerRadius, 0,
                    endAngle, false, true, sweep, largeFlag) +
                "L" + middlePoint.x + " " + middlePoint.y + " " +
                "L" + innerCorner.x + " " + innerCorner.y + " " +
                this.drawArc2(center, innerRadius, 0,
                    endAngle, true, true, !sweep, largeFlag) +
                "L" + outerCorner.x + " " + outerCorner.y;
        } 

        return path;
    },