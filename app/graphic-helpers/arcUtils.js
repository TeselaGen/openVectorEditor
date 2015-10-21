/**
 * @class Teselagen.utils.GraphicUtils
 * @singleton
 * Class which aids in the drawing of pieces of the pie.
 * @author Nick Elsbree
 * @author Zinovii Dmytriv (original author)
 */
var graphicUtils = {
    SQUIGGLY_END_STRENGTH: 3,
    ARC_THRESHOLD: 5, // Minimum arc length of a feature to be drawn as a
                      // full pie piece as opposed to a triangle.

    /**
     * Draws an arc using an SVG path.
     * @param {Object} center The center of the arc. An object with attrs x and y.
     * @param {Int} radius The radius of the arc.
     * @param {Int} thickness The thickness of the arc to draw.
     * @param {Int} startAngle The start angle of the arc in radians. Angles
     * are calculated relative to the vertical axis, and the positive direction
     * is clockwise.
     * @param {Int} endAngle The end angle of the arc in radians. Angles
     * are calculated relative to the vertical axis, and the positive direction
     * is clockwise.
     * @param {Boolean} reverse Whether to draw from start to end or vice versa.
     * @param {Boolean} returnString Whether to return a string or a sprite.
     * @param {Boolean} sweep The SVG arc-sweep flag. See SVG docs for details.
     * @param {Boolean} largeArc The SVG large-arc flag. See SVG docs for details.
     * @return {String} The path string of the arc. Returned if returnString true.
     * @return {Ext.draw.Sprite} A sprite of the arc. Returned if returnString false.
     */
    drawArc: function(center, radius, startAngle, endAngle, reverse,
                      returnString, sweep, largeArc) {

        sweep = sweep || false;
        largeArc = largeArc || false;
        reverse = reverse || false;
        returnString = returnString || false;

        // Set SVG arc flags. See SVG path documentation for more information
        // on the sweep flag and large arc flag.
        var sweepFlag;
        if(sweep) {
            sweepFlag = 1;
        } else {
            sweepFlag = 0;
        }

        var largeFlag;
        if(largeArc) {
            largeFlag = 1;
        } else {
            largeFlag = 0;
        }

        var alpha;
        if(endAngle < startAngle) {
            alpha = 2 * Math.PI - startAngle + endAngle;
        } else {
            alpha = endAngle - startAngle;
        }

        var startPoint = {};
        var endPoint = {};

        var sprite;
        var path;

        // Swap angles if the arc will be drawn in reverse.
        var tempAngle;
        if(reverse) {
            tempAngle = startAngle;
            startAngle = endAngle;
            endAngle = tempAngle;
        }

        startPoint.x = center.x + radius * Math.sin(startAngle);
        startPoint.y = center.y - radius * Math.cos(startAngle);

        endPoint.x = center.x + radius * Math.sin(endAngle);
        endPoint.y = center.y - radius * Math.cos(endAngle);

        path = "M" + startPoint.x + " " + startPoint.y +
               "A" + radius + " " + radius + " 0 " + largeFlag + " " +
               sweepFlag + " " + endPoint.x + " " + endPoint.y + " ";

        return path;
    },

    drawRect: function(xPos, yPos, width, height) {
        var sprite;
        var path;
        var returnString = returnString || false;

        path = "M" + xPos + " " + yPos +
               "L" + (xPos+width) + " " + yPos +
               "L" + (xPos+width) + " " + (yPos+height) +
               "L" + xPos + " " + (yPos+height) +
               "L" + xPos + " " + yPos + " ";

        return path;
    },

    //methods to draw features which will span the origin
    drawStartSpanningRect: function(xPos, yPos, width, height) {
        var sprite;
        var path;
        var returnString = returnString || false;

        path = "M" + xPos + " " + yPos +
               "L" + (xPos+width) + " " + yPos +
               "L" + (xPos+width) + " " + (yPos+height) +
               "L" + xPos + " " + (yPos+height) +
               "C" + (xPos+this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " + (xPos-this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " "  + xPos + " " + yPos + " ";

        return path;
    },
    drawEndSpanningRect: function(xPos, yPos, width, height) {
        var sprite;
        var path;
        var returnString = returnString || false;

        path = "M" + xPos + " " + yPos +
               "L" + (xPos+width) + " " + yPos +
               "C" + (xPos+width + this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " +(xPos+width - this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " + (xPos+width) + " " + (yPos+height) +
               "L" + xPos + " " + (yPos+height) +
               "L" + xPos + " " + yPos + " ";

        return path;
    },

    drawFeaturePositiveArrow: function(xPos, yPos, width, height) {
        var sprite;
        var path;

        if (width>4) {
            path =  "M" + xPos + " " + yPos +
                    "L" + (xPos+(width-4)) + " " + yPos +
                    "L" + (xPos+width) + " " + (yPos+((height)/2)) +
                    "L" + (xPos+(width-4)) + " " + (yPos+height) +
                    "L" + xPos + " " + (yPos+height) +
                    "L" + xPos + " " + yPos + " ";
        } else {
            path = "M" + xPos + " " + yPos +
                   "L" + (xPos+width) + " " + (yPos + ((height)/2)) +
                   "L" + xPos + " " + (yPos+height) +
                   "L" + xPos + " " + yPos + " ";
        }

        return path;
    },

    drawFeatureNegativeArrow: function(xPos, yPos, width, height, cubicbezier) {
        var sprite;
        var path;
        var returnSTring = returnSTring || false;

        if (width>4) {
            path =  "M" + xPos + " " +  (yPos+((height)/2)) +
            "L" + (xPos+4) + " " + yPos +
            "L" + (xPos+(width)) + " " + yPos +
            "L" + (xPos+(width)) + " " + (yPos+height) +
            "L" + (xPos+4) + " " + (yPos+height) +
            "L" + xPos + " " + (yPos+((height)/2)) + " ";
        } else {
            path =  "M" + xPos + " " +  (yPos+((height)/2)) +
            "L" + (xPos+width) + " " + yPos +
            "L" + (xPos+width) + " " + (yPos+height) +
            "L" + xPos + " " + (yPos+((height)/2)) + " ";
        }

        return path;
    },

    drawStartSpanningFeaturePositiveArrow: function(xPos, yPos, width, height) {
        var sprite;
        var path;
        if (width>4) {
            path =  "M" + xPos + " " + yPos +
                    "L" + (xPos+(width-4)) + " " + yPos +
                    "L" + (xPos+width) + " " + (yPos+((height)/2)) +
                    "L" + (xPos+(width-4)) + " " + (yPos+height) +
                    "L" + xPos + " " + (yPos+height) +
                    "C" + (xPos+this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " + (xPos-this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " "  + xPos + " " + yPos + " ";
        } else {
            path = "M" + xPos + " " + yPos +
                   "L" + (xPos+width) + " " + (yPos + ((height)/2)) +
                   "L" + xPos + " " + (yPos+height) +
                   "C" + (xPos+this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " + (xPos-this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " "  + xPos + " " + yPos + " ";
        }

        return path;
    },

    drawEndSpanningFeatureNegativeArrow: function(xPos, yPos, width, height) {
        var sprite;
        var path;
        var returnSTring = returnSTring || false;

        if (width>4) {
            path =  "M" + xPos + " " +  (yPos+((height)/2)) +
            "L" + (xPos+4) + " " + yPos +
            "L" + (xPos+(width)) + " " + yPos +
            "C" + (xPos+width + this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " +(xPos+width - this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " + (xPos+width) + " " + (yPos+height) +
            "L" + (xPos+4) + " " + (yPos+height) +
            "L" + xPos + " " + (yPos+((height)/2)) + " ";
        } else {
            path =  "M" + xPos + " " +  (yPos+((height)/2)) +
                    "L" + (xPos+width) + " " + yPos +
                    "C" + (xPos+width + this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " +(xPos+width - this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " + (xPos+width) + " " + (yPos+height) +
                    "L" + xPos + " " + (yPos+((height)/2)) + " ";
        }

        return path;
    },

    drawPartPositiveArrow: function(xPos, yPos, width, height) {
        var sprite;
        var path;

        if (width>4) {
            path =  "M" + xPos + " " + yPos +
                    "L" + (xPos+(width-4)) + " " + yPos +
                    "L" + (xPos+width) + " " + (yPos+((height)/2)) +
                    "L" + (xPos+(width-4)) + " " + (yPos+height) +
                    "L" + xPos + " " + (yPos+height) +
                    "L" + xPos + " " + yPos + " ";
        } else {
            path = "M" + xPos + " " + yPos +
                   "L" + (xPos+width) + " " + (yPos + ((height)/2)) +
                   "L" + xPos + " " + (yPos+height) +
                   "L" + xPos + " " + yPos + " ";
        }

        return path;
    },

    drawPartNegativeArrow: function(xPos, yPos, width, height, cubicbezier) {
        var sprite;
        var path;
        var returnSTring = returnSTring || false;

        if (width>4) {
            path =  "M" + xPos + " " +  (yPos+((height)/2)) +
            "L" + (xPos+4) + " " + yPos +
            "L" + (xPos+(width)) + " " + yPos +
            "L" + (xPos+(width)) + " " + (yPos+height) +
            "L" + (xPos+4) + " " + (yPos+height) +
            "L" + xPos + " " + (yPos+((height)/2)) + " ";
        } else {
            path =  "M" + xPos + " " +  (yPos+((height)/2)) +
            "L" + (xPos+width) + " " + yPos +
            "L" + (xPos+width) + " " + (yPos+height) +
            "L" + xPos + " " + (yPos+((height)/2)) + " ";
        }

        return path;
    },

    drawStartSpanningPartPositiveArrow: function(xPos, yPos, width, height) {
        var sprite;
        var path;
        if (width>4) {
            path =  "M" + xPos + " " + yPos +
                    "L" + (xPos+(width-4)) + " " + yPos +
                    "L" + (xPos+width) + " " + (yPos+((height)/2)) +
                    "L" + (xPos+(width-4)) + " " + (yPos+height) +
                    "L" + xPos + " " + (yPos+height) +
                    "C" + (xPos+this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " + (xPos-this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " "  + xPos + " " + yPos + " ";
        } else {
            path = "M" + xPos + " " + yPos +
                   "L" + (xPos+width) + " " + (yPos + ((height)/2)) +
                   "L" + xPos + " " + (yPos+height) +
                   "C" + (xPos+this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " + (xPos-this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " "  + xPos + " " + yPos + " ";
        }

        return path;
    },

    drawEndSpanningPartNegativeArrow: function(xPos, yPos, width, height) {
        var sprite;
        var path;
        var returnSTring = returnSTring || false;

        if (width>4) {
            path =  "M" + xPos + " " +  (yPos+((height)/2)) +
            "L" + (xPos+4) + " " + yPos +
            "L" + (xPos+(width)) + " " + yPos +
            "C" + (xPos+width + this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " +(xPos+width - this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " + (xPos+width) + " " + (yPos+height) +
            "L" + (xPos+4) + " " + (yPos+height) +
            "L" + xPos + " " + (yPos+((height)/2)) + " ";
        } else {
            path =  "M" + xPos + " " +  (yPos+((height)/2)) +
                    "L" + (xPos+width) + " " + yPos +
                    "C" + (xPos+width + this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " +(xPos+width - this.SQUIGGLY_END_STRENGTH) + " " + (yPos+height/2) + " " + (xPos+width) + " " + (yPos+height) +
                    "L" + xPos + " " + (yPos+((height)/2)) + " ";
        }

        return path;
    },

    /**
     * Function which draws a portion of the pie with no directionality. Used in
     * FeatureRenderer to draw locations of a feature which do not contain either
     * the end or start of the feature.
     * @param {Teselagen.bio.util.Point} center The center of the pie. An object
     * with attrs x and y.
     * @param {Int} radius The radius of the pie.
     * @param {Int} thickness The thickness of the pie piece to draw.
     * @param {Int} startAngle The start angle of the pie piece in radians. Angles
     * are calculated relative to the vertical axis, and the positive direction
     * is clockwise.
     * @param {Int} endAngle The end angle of the pie piece in radians. Angles
     * are calculated relative to the vertical axis, and the positive direction
     * is clockwise.
     * @param {String Th of the pie piece. Can be a string such as
     * "black" or "red", or a string of a hex value, like "#ffffff".
     * @return {Ext.draw.Sprite} A sprite of the pie piece.
     */
    drawPiePiece: function(center, radius, thickness, startAngle, endAngle) {
        var outerRadius = radius + thickness / 2;
        var innerRadius = radius - thickness / 2;

        var outerCorner = {};
        var innerCorner = {};

        var path;

        outerCorner.x = center.x + outerRadius * Math.sin(startAngle);
        outerCorner.y = center.y - outerRadius * Math.cos(startAngle);

        innerCorner.x = center.x + innerRadius * Math.sin(endAngle);
        innerCorner.y = center.y - innerRadius * Math.cos(endAngle);

        var sweep = true;
        if(endAngle < startAngle) {
            sweep = false;
        }

        // Determine whether we must set the large-arc-flag in SVG to 1.
        var largeFlag = false;
        if(Math.abs(endAngle - startAngle) > Math.PI) {
            largeFlag = true;
        }

        path = "M" + outerCorner.x + " " + outerCorner.y + " " +
               this.drawArc(center, outerRadius, startAngle, endAngle, false,
                            true, sweep, largeFlag) +
               "L" + innerCorner.x + " " + innerCorner.y + " " +
               this.drawArc(center, innerRadius, startAngle, endAngle, true,
                            true, !sweep, largeFlag) +
               "L" + outerCorner.x + " " + outerCorner.y;

        return path;
    },

    /**
     * Function which draws a portion of the pie which has an arrow pointing in
     * one direction, determined by the "direction" argument.
     * @param {Teselagen.bio.util.Point} center The center of the pie. An object
     * with attrs x and y.
     * @param {Int} radius The radius of the pie.
     * @param {Int} thickness The thickness of the pie piece to draw.
     * @param {Int} startAngle The start angle of the pie piece in radians. Angles
     * are calculated relative to the vertical axis, and the positive direction
     * is clockwise.
     * @param {Int} endAngle The end angle of the pie piece in radians. Angles
     * are calculated relative to the vertical axis, and the positive direction
     * is clockwise.
     * @param {Int} direction The direction the arrow will point. 1 means the
     * clockwise end will have an arrow, 2 means the point will be at the
     * counterclockwise end.
     * @param {String Th of the pie piece. Can be a string such as
     * "black" or "red", or a string of a hex value, like "#ffffff".
     * @return {Ext.draw.Sprite} A sprite of the pie piece.
     */
    drawDirectedPiePiece: function (center, radius, thickness, startAngle, endAngle, direction) {
        var outerRadius = radius + thickness / 2;
        var innerRadius = radius - thickness / 2;
        var arcLength;

        var outerCorner = {};
        var innerCorner = {};

        // The tip of the arrow.
        var middlePoint = {};

        var path;
        if(direction > 0) {
            if(startAngle > endAngle) {
                arcLength = radius * (2 * Math.PI - startAngle + endAngle);
            } else {
                arcLength = radius * (endAngle - startAngle);
            }

            // Draw triangle if arc is smaller than the threshold.
            if(arcLength > this.ARC_THRESHOLD) {
                // The angle between the tip of the arrow and its base.
                var alpha = this.ARC_THRESHOLD / radius;

                var sweep = true;
                if(endAngle < startAngle) {
                    sweep = false;
                }

                // Determine whether we must set the large-arc-flag in SVG to 1.
                var largeFlag = false;
                if(Math.abs(endAngle - startAngle) > Math.PI) {
                    largeFlag = true;
                }

                if(startAngle > endAngle) {
                    sweep = !sweep;
                    largeFlag = !largeFlag;
                }

                if(direction == 1) {
                    middlePoint.x = center.x + radius * Math.sin(endAngle);
                    middlePoint.y = center.y - radius * Math.cos(endAngle);

                    endAngle -= alpha;

                    outerCorner.x = center.x + outerRadius * Math.sin(startAngle);
                    outerCorner.y = center.y - outerRadius * Math.cos(startAngle);

                    innerCorner.x = center.x + innerRadius * Math.sin(endAngle);
                    innerCorner.y = center.y - innerRadius * Math.cos(endAngle);

                    path = this.drawArc(center, outerRadius, startAngle,
                                 endAngle, false, true, sweep, largeFlag) +
                           "L" + middlePoint.x + " " + middlePoint.y + " " +
                           "L" + innerCorner.x + " " + innerCorner.y + " " +
                           this.drawArc(center, innerRadius, startAngle,
                                 endAngle, true, true, !sweep, largeFlag) +
                           "L" + outerCorner.x + " " + outerCorner.y;
                } else if(direction == 2) {
                    middlePoint.x = center.x + radius * Math.sin(startAngle);
                    middlePoint.y = center.y - radius * Math.cos(startAngle);

                    startAngle += alpha;

                    outerCorner.x = center.x + outerRadius * Math.sin(startAngle);
                    outerCorner.y = center.y - outerRadius * Math.cos(startAngle);

                    innerCorner.x = center.x + innerRadius * Math.sin(endAngle);
                    innerCorner.y = center.y - innerRadius * Math.cos(endAngle);

                    path = "M" + outerCorner.x + " " + outerCorner.y +
                           this.drawArc(center, outerRadius, startAngle,
                                endAngle, false, true, sweep, largeFlag) +
                           "L" + innerCorner.x + " " + innerCorner.y +
                           this.drawArc(center, innerRadius, startAngle,
                                endAngle, true, true, !sweep, largeFlag) +
                           "L" + middlePoint.x + " " + middlePoint.y +
                           "L" + outerCorner.x + " " + outerCorner.y;
                }
            } else {
                if(direction == 1) {
                    middlePoint.x = center.x + radius * Math.sin(endAngle);
                    middlePoint.y = center.y - radius * Math.cos(endAngle);

                    outerCorner.x = center.x + outerRadius * Math.sin(startAngle);
                    outerCorner.y = center.y - outerRadius * Math.cos(startAngle);
                    innerCorner.x = center.x + innerRadius * Math.sin(startAngle);
                    innerCorner.y = center.y - innerRadius * Math.cos(startAngle);

                    path = "M" + outerCorner.x + " " + outerCorner.y +
                           "L" + middlePoint.x + " " + middlePoint.y +
                           "L" + innerCorner.x + " " + innerCorner.y + "Z";
                } else if(direction == 2) {
                    middlePoint.x = center.x + radius * Math.sin(startAngle);
                    middlePoint.y = center.y - radius * Math.cos(startAngle);

                    outerCorner.x = center.x + outerRadius * Math.sin(endAngle);
                    outerCorner.y = center.y - outerRadius * Math.cos(endAngle);
                    innerCorner.x = center.x + innerRadius * Math.sin(endAngle);
                    innerCorner.y = center.y - innerRadius * Math.cos(endAngle);

                    path = "M" + outerCorner.x + " " + outerCorner.y +
                           "L" + innerCorner.x + " " + innerCorner.y +
                           "L" + middlePoint.x + " " + middlePoint.y + "Z";
                }
            }
        } else {
            outerCorner.x = center.x + outerRadius * Math.sin(startAngle);
            outerCorner.y = center.y - outerRadius * Math.cos(startAngle);

            innerCorner.x = center.x + innerRadius * Math.sin(endAngle);
            innerCorner.y = center.y - innerRadius * Math.cos(endAngle);

            path = "M" + outerCorner.x + " " + outerCorner.y +
                   this.drawArc(center, outerRadius, startAngle, endAngle,
                                false, true) +
                   "L" + innerCorner.x + " " + innerCorner.y +
                   this.drawArc(center, innerRadius, startAngle, endAngle,
                                false, true) +
                   "L" + outerCorner.x + " " + outerCorner.y;
        }

        return path;
    },

    /**
     * Given the parameters defining a circle, returns a point object on that
     * circle at a given angle.
     * @param {Teselagen.bio.util.Point} center A point object defining the
     * center of the object, with integer attributes x and y.
     * @param {Int} angle The angle at which to generate the point.
     * @param {Int} radius The radius of the circle.
     * @return {Object} The coordinates of the point on the given circle at the
     * given angle. Has attributes x and y.
     */
    pointOnCircle: function(center, angle, radius) {
        if(angle > 2 * Math.PI) {
            angle = angle % (2 * Math.PI);
        }

        var point = {};

        if(angle < Math.PI / 2) {
            point.x = center.x + Math.sin(angle) * radius;
            point.y = center.y - Math.cos(angle) * radius;
        } else if((angle >= Math.PI / 2) && (angle < Math.PI)) {
            point.x = center.x + Math.sin(Math.PI - angle) * radius;
            point.y = center.y + Math.cos(Math.PI - angle) * radius;
        } else if((angle >= Math.PI) && (angle < 3 * Math.PI / 2)) {
            point.x = center.x - Math.sin(angle - Math.PI) * radius;
            point.y = center.y + Math.cos(angle - Math.PI) * radius;
        } else if((angle >= 3 * Math.PI / 2) && (angle <= 2 * Math.PI)) {
            point.x = center.x - Math.sin(2 * Math.PI - angle) * radius;
            point.y = center.y - Math.cos(2 * Math.PI - angle) * radius;
        }

        return point;
    },

    pointOnRect: function(reference, railwidth, location, gap) {

        var point = {};

        point.x = reference.x + ((railwidth/location)*railwidth);
        point.y = reference.y + gap;

        return point;
    }
};
module.exports = graphicUtils;
