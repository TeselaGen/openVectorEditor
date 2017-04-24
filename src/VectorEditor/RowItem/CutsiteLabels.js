let React = require('react');
let getXStartAndWidthOfRowAnnotation = require('./getXStartAndWidthOfRowAnnotation');
let PureRenderMixin = require('react-addons-pure-render-mixin');
import intervalTree2 from 'interval-tree2';
import getYOffset from '../CircularView/getYOffset'
import forEach from 'lodash/forEach'

let CutsiteLabels = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        annotationRanges: React.PropTypes.array.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        bpsPerRow: React.PropTypes.number.isRequired,
        annotationHeight: React.PropTypes.number.isRequired,
        spaceBetweenAnnotations: React.PropTypes.number.isRequired,
        cutsiteClicked: React.PropTypes.func.isRequired,
    },
    render: function() {
       var {
           annotationRanges={},
           bpsPerRow,
           charWidth,
           annotationHeight,
           spaceBetweenAnnotations,
           cutsiteClicked,
           textWidth=12,
           HoverHelper
       } = this.props;
       if (annotationRanges.length === 0) {
           return null;
       }
       let maxAnnotationYOffset = 0;
       let annotationsSVG = [];
       var rowCenter = bpsPerRow * textWidth / 2;
       var iTree = new intervalTree2(rowCenter)
       forEach(annotationRanges,function(annotationRange, index) {
           let annotation = annotationRange.annotation;
           if (!annotation) {
               annotation = annotationRange
           }
           var annotationLength = annotation.restrictionEnzyme.name.length * textWidth
           let {xStart} = getXStartAndWidthOfRowAnnotation(annotationRange, bpsPerRow, charWidth);
           var xEnd = xStart + annotationLength;
           var rowLength = bpsPerRow * charWidth
           if (xEnd > rowLength) {
            xStart = xStart - (xEnd - rowLength)
            xEnd = rowLength
           }
           var yOffset = getYOffset(iTree, xStart, xEnd)
           iTree.add(xStart, xEnd, undefined, {...annotationRange, yOffset})
           
           if (yOffset > maxAnnotationYOffset) {
               maxAnnotationYOffset = yOffset;
           }
           let height = (yOffset) * (annotationHeight + spaceBetweenAnnotations);
           annotationsSVG.push(
             <HoverHelper
               id={annotation.id}
               key={'cutsiteLabel' + index}
               passJustOnMouseOverAndClassname
               >
               <div 
                className={''}
                onClick={function (event) {
                   cutsiteClicked({event, annotation, });
                   event.stopPropagation();
                 }}
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
             </HoverHelper>
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
module.exports = CutsiteLabels;
