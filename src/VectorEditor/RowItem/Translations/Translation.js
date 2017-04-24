
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
        translationClicked: React.PropTypes.func.isRequired,
    },

    render: function() {
        var {
            annotationRange,
            height,
            charWidth,
            translationClicked,
            translationRightClicked,
            translationDoubleClicked,
            sequenceLength
        } = this.props;
        var {annotation} = annotationRange;
        //we have an amino acid representation of our entire annotation, but it is an array
        //starting at 0, even if the annotation starts at some arbitrary point in the sequence
        var {aminoAcids = []} = annotation
        //so we "zero" our subRange by the annotation start
        var subrangeStartRelativeToAnnotationStart = zeroSubrangeByContainerRange(annotationRange, annotation, sequenceLength);
        //which allows us to then get the amino acids for the subRange
        var aminoAcidsForSubrange = getSequenceWithinRange(subrangeStartRelativeToAnnotationStart, aminoAcids);
        //we then loop over all the amino acids in the sub range and draw them onto the row
        var translationSVG = aminoAcidsForSubrange.map(function(aminoAcidSliver, index) {
          // var relativeAAPositionInTranslation = annotationRange.start % bpsPerRow + index;
            var relativeAAPositionInTranslation = index;
            //get the codonIndices relative to
            return (
              <AASliver
                onClick={function (event) {
                  translationClicked({annotation, codonRange: aminoAcidSliver.codonRange, event})
                }}
                onContextMenu={function (event) {
                  translationRightClicked({annotation, codonRange: aminoAcidSliver.codonRange, event})
                }}
                onDoubleClick = {
                  function (event) {
                    translationDoubleClicked({annotation,event})
                  }
                }
                key={annotation.id + aminoAcidSliver.sequenceIndex}
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
            className={'translationLayer'}
            // onClick={this.props.translationClicked}
            >
            {translationSVG}
            </g>
        );
    }
});



module.exports = Translation;
