var React = require('react');
const zeroSubrangeByContainerRange = require('ve-range-utils/zeroSubrangeByContainerRange');
const getSequenceWithinRange = require('ve-range-utils/getSequenceWithinRange');
const getCodonRangeForAASliver = require('ve-sequence-utils/getCodonRangeForAASliver');
const AASliver = require('./AASliver');

var PureRenderMixin = require('react-addons-pure-render-mixin');

var Translation = React.createClass({
    mixins: [PureRenderMixin],
    
    propTypes: {
        widthInBps: React.PropTypes.number.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        rangeType: React.PropTypes.string.isRequired,
        color: React.PropTypes.string.isRequired,
        name: React.PropTypes.string.isRequired,
        forward: React.PropTypes.bool.isRequired,
        signals: React.PropTypes.object.isRequired,
    },

    render: function() {
        var {
            annotationRange, 
            height, 
            charWidth, 
            signals, 
            sequenceLength
        } = this.props;
        var annotation = annotationRange.annotation;
        //we have an amino acid representation of our entire annotation, but it is an array
        //starting at 0, even if the annotation starts at some arbitrary point in the sequence
        var AARepresentationOfTranslation = annotation.aminoAcids;
        //so we "zero" our subRange by the annotation start
        var subrangeStartRelativeToAnnotationStart = zeroSubrangeByContainerRange(annotationRange, annotation, sequenceLength);
        //which allows us to then get the amino acids for the subRange
        var aminoAcidsForSubrange = getSequenceWithinRange(subrangeStartRelativeToAnnotationStart, AARepresentationOfTranslation);
        //we then loop over all the amino acids in the sub range and draw them onto the row
        var translationSVG = aminoAcidsForSubrange.map(function(aminoAcidSliver, index) {
            var aminoAcidPositionInSequence = annotationRange.start + index;
          // var relativeAAPositionInTranslation = annotationRange.start % bpsPerRow + index;
            var relativeAAPositionInTranslation = index;

          //get the codonIndices relative to 
            var codonIndices = getCodonRangeForAASliver(aminoAcidPositionInSequence, aminoAcidSliver, AARepresentationOfTranslation, relativeAAPositionInTranslation);
            return (
              <AASliver 
                    onClick={function(e) {
                      // e.stopPropagation();
                        signals.setSelectionLayer({selectionLayer: codonIndices});
                    }}
                    onDoubleClick = {
                        function(e) {
                            e.stopPropagation();
                            signals.setSelectionLayer({selectionLayer: annotation});
                        }
                    }
                    key={annotation.id + aminoAcidPositionInSequence}
                    forward={annotation.forward}
                    width={charWidth}
                    height={height}
                    relativeAAPositionInTranslation={relativeAAPositionInTranslation}
                    letter={aminoAcidSliver.aminoAcid.value}
                    color={aminoAcidSliver.aminoAcid.color}
                positionInCodon={aminoAcidSliver.positionInCodon}>
              </AASliver>
          );
        });
        return (
            <g
            onClick={this.props.onClick}
            >
            {translationSVG}    
            </g>
        );
    }
});



module.exports = Translation;
