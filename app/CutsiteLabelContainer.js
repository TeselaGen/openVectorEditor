let React = require('react');
let setSelectionLayer = require('./actions/setSelectionLayer');
let getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
let PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var IntervalTree = require('interval-tree');

let CutsiteContainer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        annotationRanges: React.PropTypes.array.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        bpsPerRow: React.PropTypes.number.isRequired,
        annotationHeight: React.PropTypes.number.isRequired,
        spaceBetweenAnnotations: React.PropTypes.number.isRequired
    },
    render: function() {
        let annotationRanges = this.props.annotationRanges;
        let bpsPerRow = this.props.bpsPerRow;
        let charWidth = this.props.charWidth;
        let annotationHeight = this.props.annotationHeight;
        let spaceBetweenAnnotations = this.props.spaceBetweenAnnotations;

        if (annotationRanges.length === 0) {
            return null;
        }
        let maxAnnotationYOffset = 0;
        let annotationsSVG = [];
        var annotationLevels = {};
        // console.log('annotationRanges: ' + JSON.stringify(annotationRanges,null,4));
        console.log('annotationRanges:');
        annotationRanges.forEach(function(annotationRange, index) {
            let annotation = annotationRange.annotation;
            var textWidth = 15; //tnr: update this so it isn't just a guess
            var annotationLength = annotation.restrictionEnzyme.name.length * textWidth
            let {xStart} = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
            var xEnd = xStart + annotationLength;
            console.log('xStart,xEnd: ' + xStart,xEnd);
            var rowCenter = bpsPerRow * textWidth / 2;
            var fits = false;
            
            var level = 0;
            while (!fits) {
                console.log('level', level);
                if (!annotationLevels[level]) {
                    console.log('adding new level');
                    annotationLevels[level] = new IntervalTree(rowCenter);
                    annotationLevels[level].add([xStart, xEnd, 'index'])
                    fits = true;
                } else {
                    var results = annotationLevels[level].search(xStart,xStart + annotationLength);
                    if (!results.length) {
                        annotationLevels[level].add([xStart, xEnd, 'index'])
                        fits = true;
                    } else {
                        level++;
                    }
                }
            }

            if (level > maxAnnotationYOffset) {
                maxAnnotationYOffset = level;
            }
            let height = (level) * (annotationHeight + spaceBetweenAnnotations);
            annotationsSVG.push(
                <div left={xStart}
                    onClick={function (event) {
                              setSelectionLayer(this);
                              event.stopPropagation();
                            }.bind(annotation)}
                    onMouseOver={function (event) {
                      setSelectionLayer(this);
                      event.stopPropagation();
                    }.bind(annotation)}
                    onMouseOut={function (event) {
                      setSelectionLayer(false);
                      event.stopPropagation();
                    }.bind(annotation)}
                    style={
                        {
                            // left: xStart,
                            position: 'absolute',
                            top: height,
                            // display: 'inline-block',
                            // position: (relative) ? 'relative' : 'absolute',
                            // // float: 'left',
                            'left': xStart,
                            'zIndex': 10
                            // left: '100 % ',
                        }
                    }
                >
                    {annotation.restrictionEnzyme.name}
                </div>
                
            );
        });
        let containerHeight = (maxAnnotationYOffset + 1) * (annotationHeight + spaceBetweenAnnotations);
        return (
            <div
                width="100%"
                style={{position: 'relative', height: containerHeight, display: 'block'}}
                className='cutsiteContainer'
                >
                {annotationsSVG}
            </div>
        );
    }
});
module.exports = CutsiteContainer;