import React from 'react';
import getXStartAndWidthOfRowAnnotation from './getXStartAndWidthOfRowAnnotation';
import PureRenderMixin from'react-addons-pure-render-mixin';

let CutsiteLabelContainer = React.createClass({
    mixins: [PureRenderMixin],
    propTypes: {
        annotationRanges: React.PropTypes.array.isRequired,
        charWidth: React.PropTypes.number.isRequired,
        bpsPerRow: React.PropTypes.number.isRequired,
        annotationHeight: React.PropTypes.number.isRequired,
        spaceBetweenAnnotations: React.PropTypes.number.isRequired,
        signals: React.PropTypes.object.isRequired,
    },
    render: function() {
        return null; //tnr: commenting this out because interval state is being buggy
    }
});
module.exports = CutsiteLabelContainer;
